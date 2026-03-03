import { useEffect, useState } from 'react';
import { isBlockHeight } from '@/lib/timestamp';
import { resolveBlockTimestamp } from '@/lib/blockTimeApi';

/**
 * Resolve a raw timestamp value (which may be a Bitcoin burn block
 * height) to a precise Unix-ms timestamp via the Stacks API.
 *
 * While the API request is in flight, the hook returns `null` so the
 * consumer can show a loading state or fall back to the offline
 * estimate. Once resolved, the value is cached in memory and
 * subsequent renders return instantly.
 *
 * Non-block-height values (Unix seconds or milliseconds) are returned
 * immediately without a network call.
 */
export function useResolvedTimestamp(raw: number): {
  resolved: number | null;
  loading: boolean;
} {
  const needsResolution = isBlockHeight(raw);
  const [resolved, setResolved] = useState<number | null>(
    needsResolution ? null : raw,
  );
  const [loading, setLoading] = useState(needsResolution);

  useEffect(() => {
    if (!needsResolution) {
      setResolved(raw);
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function resolve() {
      try {
        const ms = await resolveBlockTimestamp(raw);
        if (!cancelled) {
          setResolved(ms);
        }
      } catch {
        // resolveBlockTimestamp already falls back internally, so this
        // catch is purely defensive
        if (!cancelled) {
          setResolved(raw);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    resolve();
    return () => {
      cancelled = true;
    };
  }, [raw, needsResolution]);

  return { resolved, loading };
}
