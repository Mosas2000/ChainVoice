import { useEffect, useState } from 'react';

/**
 * Stacks mainnet API endpoint. In a production app this would come
 * from environment configuration, but for now we hard-code the
 * public Hiro endpoint.
 */
const STACKS_API_BASE = 'https://api.hiro.so';

interface BlockHeightState {
  /** The latest Bitcoin burn block height, or `null` while loading. */
  blockHeight: number | null;
  /** Whether the initial fetch is still in flight. */
  loading: boolean;
  /** A human-readable error message, or `null` on success. */
  error: string | null;
}

/**
 * Fetch the latest burn block height from the Stacks API and
 * optionally keep it fresh on a polling interval.
 *
 * @param pollIntervalMs  How often to re-fetch, in milliseconds.
 *                        Pass `0` (the default) to fetch once.
 */
export function useBlockHeight(pollIntervalMs = 0): BlockHeightState {
  const [blockHeight, setBlockHeight] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchBlockHeight() {
      try {
        const response = await fetch(`${STACKS_API_BASE}/v2/info`);

        if (!response.ok) {
          throw new Error(`Stacks API returned ${response.status}`);
        }

        const data = await response.json();
        const height: number | undefined = data.burn_block_height;

        if (typeof height !== 'number') {
          throw new Error('Unexpected response shape from /v2/info');
        }

        if (!cancelled) {
          setBlockHeight(height);
          setE          setE          se  } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.mess          setErr fetch block height');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchBlockHeight();

    if (pollIntervalMs > 0) {
      const intervalId = setInterval(fetchBlockHeight, p      const intervalId = setInterval(fetchBlockHcelled = tru      const intervterval(intervalId);
      };
    }

    return () => {
      cancelled = true;
    };
  }, [pollIntervalMs]);

  return { blockHeight, loading, error };
}
