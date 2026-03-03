import { useRef, useEffect, useCallback, useState } from 'react';

interface PullToRefreshOptions {
  /** Distance in pixels the user must drag before a refresh triggers. */
  threshold?: number;
  /** Called when the user pulls past the threshold. Should return a promise. */
  onRefresh: () => Promise<void> | void;
  /** Whether pull-to-refresh is enabled. */
  enabled?: boolean;
}

interface PullToRefreshState {
  /** Current pull distance in pixels (0 when idle). */
  pullDistance: number;
  /** Whether a refresh triggered by the pull is currently running. */
  refreshing: boolean;
}

/**
 * Registers touch listeners on the given ref element to implement
 * pull-to-refresh.  Returns the current pull distance and refreshing
 * state so the caller can render a visual indicator.
 */
export function usePullToRefresh<T extends HTMLElement>(
  ref: React.RefObject<T | null>,
  options: PullToRefreshOptions,
): PullToRefreshState {
  const { threshold = 80, onRefresh, enabled = true } = options;

  const [pullDistance, setPullDistance] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const startY = useRef(0);
  const pulling = useRef(false);

  const handleTouchStart = useCallback(
    (e: TouchEvent) => {
      if (!enabled || refreshing) return;
      // Only trigger when scrolled to the very top
      const el = ref.current;
      if (!el || el.scrollTop > 0) return;
      startY.current = e.touches[0].clientY;
      pulling.current = true;
    },
    [enabled, refreshing, ref],
  );

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!pulling.current) return;
      const delta = e.touches[0].clientY - startY.current;
      if (delta > 0) {
        // Apply diminishing returns beyond threshold so it feels elastic
        const capped = delta > threshold ? threshold + (delta - threshold) * 0.3 : delta;
        setPullDistance(capped);
      } else {
        setPullDistance(0);
      }
    },
    [threshold],
  );

  const handleTouchEnd = useCallback(async () => {
    if (!pulling.current) return;
    pulling.current = false;

    if (pullDistance >= threshold) {
      setRefreshing(true);
      setPullDistance(0);
      try {
        await onRefresh();
      } finally {
        setRefreshing(false);
      }
    } else {
      setPullDistance(0);
    }
  }, [pullDistance, threshold, onRefresh]);

  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled) return;

    el.addEventListener('touchstart', handleTouchStart, { passive: true });
    el.addEventListener('touchmove', handleTouchMove, { passive: true });
    el.addEventListener('touchend', handleTouchEnd);

    return () => {
      el.removeEventListener('touchstart', handleTouchStart);
      el.removeEventListener('touchmove', handleTouchMove);
      el.removeEventListener('touchend', handleTouchEnd);
    };
  }, [ref, enabled, handleTouchStart, handleTouchMove, handleTouchEnd]);

  return { pullDistance, refreshing };
}
