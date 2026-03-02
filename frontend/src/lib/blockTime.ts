/**
 * Stacks blockchain average block time in seconds.
 *
 * Bitcoin targets 10-minute blocks, and Stacks anchors to that cadence.
 * This constant is used to estimate wall-clock times from block heights
 * when no API is available. Real block times vary, so estimates become
 * less accurate the further they are from the anchor point.
 */
export const AVERAGE_BLOCK_TIME_SECONDS = 600;

/**
 * A known reference point that ties a Bitcoin burn block height to a
 * Unix timestamp. Used as the anchor for block-height-to-time estimates.
 *
 * This reference is from Bitcoin block 883000 (approximately Feb 2025).
 * Periodically update this to keep estimates accurate.
 */
export const BLOCK_HEIGHT_ANCHOR = {
  height: 883_000,
  /** Unix timestamp in seconds (not milliseconds) */
  timestampSeconds: 1_740_000_000,
} as const;

/**
 * Estimate a Unix timestamp (in milliseconds) from a Bitcoin burn
 * block height.
 *
 * The estimate works by calculating the difference between the given
 * block height and a known anchor point, multiplying by the average
 * block time, and offsetting from the anchor's known timestamp.
 *
 * Falls back to the raw value treated as a Unix-ms timestamp if the
 * block height looks like it could already be milliseconds (i.e. it
 * is unreasonably large to be a block height).
 */
export function blockHeightToTimestamp(blockHeight: number): number {
  // Guard against obviously invalid values
  if (!Number.isFinite(blockHeight) || blockHeight < 0) {
    return Date.now();
  }

  // If the value is already in the Unix-ms range (> 1e12), assume it
  // was already converted by the caller or came from a stub service
  if (blockHeight > 1e12) {
    return blockHeight;
  }

  // If the value looks like a Unix-seconds timestamp (> 1e9 but < 1e12)
  // convert to milliseconds directly
  if (blockHeight > 1e9) {
    return blockHeight * 1000;
  }

  const blockDiff = blockHeight - BLOCK_HEIGHT_ANCHOR.height;
  const estimatedSeconds =
    BLOCK_HEIGHT_ANCHOR.timestampSeconds + blockDiff * AVERAGE_BLOCK_TIME_SECONDS;

  // Clamp to a sane range: no earlier than the Unix epoch and no
  // later than approximately the year 2100
  const clampedSeconds = Math.max(0, Math.min(estimatedSeconds, 4_102_444_800));

  return clampedSeconds * 1000;
}

/**
 * Whether a raw numeric value looks like a block height rather than a
 * Unix timestamp. Block heights on Bitcoin are currently in the
 * hundreds of thousands, while Unix timestamps are in the billions.
 */
export function isBlockHeight(value: number): boolean {
  return Number.isFinite(value) && value > 0 && value < 1e9;
}
