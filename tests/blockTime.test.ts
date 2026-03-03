import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  blockHeightToTimestamp,
  isBlockHeight,
  AVERAGE_BLOCK_TIME_SECONDS,
  BLOCK_HEIGHT_ANCHOR,
} from '../frontend/src/lib/blockTime';

describe('blockTime', () => {
  describe('AVERAGE_BLOCK_TIME_SECONDS', () => {
    it('should be 600 seconds (10 minutes)', () => {
      expect(AVERAGE_BLOCK_TIME_SECONDS).toBe(600);
    });
  });

  describe('BLOCK_HEIGHT_ANCHOR', () => {
    it('should have a height in the expected range', () => {
      expect(BLOCK_HEIGHT_ANCHOR.height).toBe(883_000);
    });

    it('should have a timestamp in the expected range', () => {
      // Feb 2025 in Unix seconds
      expect(BLOCK_HEIGHT_ANCHOR.timestampSeconds).toBe(1_740_000_000);
    });
  });

  describe('blockHeightToTimestamp', () => {
    it('should estimate a timestamp for the anchor block itself', () => {
      const result = blockHeightToTimestamp(883_000);
      expect(result).toBe(1_740_000_000 * 1000);
    });

    it('should estimate a later timestamp for a higher block', () => {
      const result = blockHeightToTimestamp(883_100);
      const expectedMs =
        (1_740_000_000 + 100 * AVERAGE_BLOCK_TIME_SECONDS) * 1000;
      expect(result).toBe(expectedMs);
    });

    it('should estimate an earlier timestamp for a lower block', () => {
      const result = blockHeightToTimestamp(882_900);
      const expectedMs =
        (1_740_000_000 - 100 * AVERAGE_BLOCK_TIME_SECONDS) * 1000;
      expect(result).toBe(expectedMs);
    });

    it('should pass through values already in Unix-ms range', () => {
      const nowMs = 1_700_000_000_000;
      expect(blockHeightToTimestamp(nowMs)).toBe(nowMs);
    });

    it('should convert Unix-seconds to Unix-ms', () => {
      const seconds = 1_700_000_000;
      expect(blockHeightToTimestamp(seconds)).toBe(seconds * 1000);
    });

    it('should return Date.now() for NaN', () => {
      const before = Date.now();
      const result = blockHeightToTimestamp(NaN);
      const after = Date.now();
      expect(result).toBeGreaterThanOrEqual(before);
      expect(result).toBeLessThanOrEqual(after);
    });

    it('should return Date.now() for negative values', () => {
      const before = Date.now();
      const result = blockHeightToTimestamp(-1);
      const after = Date.now();
      expect(result).toBeGreaterThanOrEqual(before);
      expect(result).toBeLessThanOrEqual(after);
    });

    it('should return Date.now() for Infinity', () => {
      const before = Date.now();
      const result = blockHeightToTimestamp(Infinity);
      const after = Date.now();
      expect(result).toBeGreaterThanOrEqual(before);
      expect(result).toBeLessThanOrEqual(after);
    });

    it('should clamp very low block heights to the Unix epoch at minimum', () => {
      // Block 0 would be well before the anchor minus 883000 blocks of offset
      // but should not go below zero
      const result = blockHeightToTimestamp(1);
      expect(result).toBeGreaterThan(0);
    });
  });

  describe('isBlockHeight', () => {
    it('should return true for typical Bitcoin block heights', () => {
      expect(isBlockHeight(883_000)).toBe(true);
      expect(isBlockHeight(1)).toBe(true);
      expect(isBlockHeight(999_999_999)).toBe(true);
    });

    it('should return false for Unix-seconds timestamps', () => {
      expect(isBlockHeight(1_700_000_000)).toBe(false);
    });

    it('should return false for Unix-ms timestamps', () => {
      expect(isBlockHeight(1_700_000_000_000)).toBe(false);
    });

    it('should return false for zero', () => {
      expect(isBlockHeight(0)).toBe(false);
    });

    it('should return false for negative numbers', () => {
      expect(isBlockHeight(-100)).toBe(false);
    });

    it('should return false for NaN', () => {
      expect(isBlockHeight(NaN)).toBe(false);
    });

    it('should return false for Infinity', () => {
      expect(isBlockHeight(Infinity)).toBe(false);
    });
  });
});
