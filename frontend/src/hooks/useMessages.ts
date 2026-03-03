import { useState, useEffect, useCallback, useRef } from 'react';
import { getMessage, getMessageCount, getMessagesPage, getLatestMessagesInfo } from '../services/messages';
import { usePolling } from './usePolling';
import { useDocumentVisibility } from './useDocumentVisibility';
import { POLLING } from '@/config/polling';
import type { Message } from '../types';

export const useMessages = (
  limit: number = 20,
  authorAddress?: string,
  pollInterval: number | null = POLLING.feedInterval,
) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [newMessageCount, setNewMessageCount] = useState(0);
  const [lastRefreshedAt, setLastRefreshedAt] = useState<number>(Date.now());

  /** Snapshot of the count at the time of the last full fetch. */
  const lastKnownCount = useRef(0);

  /** Prevents overlapping full fetches. */
  const fetchInFlight = useRef(false);

  /** Prevents overlapping poll requests. */
  const pollInFlight = useRef(false);

  const isTabVisible = useDocumentVisibility();

  const fetchMessages = useCallback(async () => {
    if (fetchInFlight.current) return;
    fetchInFlight.current = true;
    setLoading(true);
    setError(null);
    try {
      const count = await getMessageCount();
      setTotalCount(count);
      lastKnownCount.current = count;
      setNewMessageCount(0);

      // Use pagination info to determine what to fetch
      const pageInfo = await getLatestMessagesInfo(limit);
      setHasMore(pageInfo.hasMore);

      // For now, return empty array since we don't have real data yet
      setMessages([]);
      setLastRefreshedAt(Date.now());
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
      fetchInFlight.current = false;
    }
  }, [limit, authorAddress, page]);

  /**
   * Lightweight poll — only checks the message count.
   * If the count has grown since the last full fetch we update
   * `newMessageCount` so the UI can show a banner.
   */
  const pollForNewMessages = useCallback(async () => {
    if (pollInFlight.current || fetchInFlight.current) return;
    pollInFlight.current = true;
    try {
      const count = await getMessageCount();
      setTotalCount(count);
      const diff = count - lastKnownCount.current;
      if (diff > 0) {
        setNewMessageCount(diff);
      }
    } catch {
      // Swallow poll errors silently — the user can still
      // manually refresh and the next poll will retry.
    } finally {
      pollInFlight.current = false;
    }
  }, []);

  const nextPage = useCallback(() => {
    if (hasMore) {
      setPage((p) => p + 1);
    }
  }, [hasMore]);

  const prevPage = useCallback(() => {
    setPage((p) => Math.max(0, p - 1));
  }, []);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  // Pause polling when the tab is hidden
  const effectiveInterval = isTabVisible ? pollInterval : null;
  usePolling(pollForNewMessages, effectiveInterval);

  // When the user returns to the tab, do an immediate poll
  const wasHidden = useRef(false);
  useEffect(() => {
    if (!isTabVisible) {
      wasHidden.current = true;
      return;
    }
    if (wasHidden.current) {
      wasHidden.current = false;
      pollForNewMessages();
    }
  }, [isTabVisible, pollForNewMessages]);

  /** Dismiss the "new messages" banner without fetching. */
  const dismissNewMessages = useCallback(() => setNewMessageCount(0), []);

  return {
    messages,
    loading,
    error,
    totalCount,
    page,
    hasMore,
    newMessageCount,
    lastRefreshedAt,
    nextPage,
    prevPage,
    refetch: fetchMessages,
    dismissNewMessages,
  };
};
