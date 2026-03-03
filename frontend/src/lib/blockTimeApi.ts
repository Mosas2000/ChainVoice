import { blockHeightToTimestamp } from './blockTime';

/**
 * Stacks mainnet API base URL.
 */
const STACKS_API_BASE = 'https://api.hiro.so';

/**
 * In-memory cache of block-height → Unix-ms lookups so we only
 * hit the API once per block per session.
 */
const cache = new Map<number, number>();

/**
 * Resolve a Bitcoin burn block height to a precise Unix-ms timestamp
 * via the Stacks API. Falls back to the local estimation heuristic
 * if the network request fails.
 *
 * Results are cached in memory for the lifetime of the page session
 * so repeated calls with the same height do not generate additional
 * network traffic.
 */
export async function resolveBlockTimestamp(
  blockHeight: number,
): Promise<number> {
  const cached = cache.get(blockHeight);
  if (cached !== undefined) return cached;

  try {
    const url = STACKS_API_BASE + '/extended/v1/burn_block/' + blockHeight;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('API returned ' + response.status);
    }

    const data = await response.json();
    const burnTime: number | undefined = data.burn_block_time;

    if (typeof burnTime !== 'number' || burnTime <= 0) {
      throw new Error('Missing or invalid burn_block_time');
    }

    // API returns Unix seconds — convert to milliseconds
    const ms = burnTime * 1000;
    cache.set(blockHeight, ms);
    return ms;
  } catch {
    // Fall back to the offline estimation
    const estimated = blockHeightToTimestamp(blockHeight);
    cache.set(blockHeight, estimated);
    return estimated;
  }
}

/**
 * Clear the in-memory block timestamp cache. Useful in tests or
 * when the user changes networks.
 */
export function clearBlockTimestampCache(): void {
  cache.clear();
}
