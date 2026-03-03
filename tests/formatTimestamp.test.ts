import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { formatTimestamp, toISOString } from '../frontend/src/lib/formatTimestamp';
import { BLOCK_HEIGHT_ANCHOR, AVERAGE_BLOCK_TIME_SECONDS } from '../frontend/src/lib/blockTime';

describe('formatTimestamp', () => {
  // Fix "now" so relative formatting is deterministic
  const fixedNow = new Date('2025-03-01T12:00:00Z');

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(fixedNow);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('relative format', () => {
    it('should show "just now" for timestamps less than a minute ago', () => {
      const thirtySecondsAgo = fixedNow.getTime() - 30_000;
      expect(formatTimestamp(thirtySecondsAgo, { format: 'relative' })).toBe('just now');
    });

    it('should show minutes for timestamps less than an hour ago', () => {
      const fiveMinutesAgo = fixedNow.getTime() - 5 * 60 * 1000;
      expect(formatTimestamp(fiveMinutesAgo, { format: 'relative' })).toBe('5m ago');
    });

    it('should show hours for timestamps less than a day ago', () => {
      const threeHoursAgo = fixedNow.getTime() - 3 * 60 * 60 * 1000;
      expect(formatTimestamp(threeHoursAgo, { format: 'relative' })).toBe('3h ago');
    });

    it('should show days for timestamps less than a week ago', () => {
      const twoDaysAgo = fixedNow.getTime() - 2 * 24 * 60 * 60 * 1000;
      expect(formatTimestamp(twoDaysAgo, { format: 'relative' })).toBe('2d ago');
    });

    it('should fall back to short date for timestamps older than a week', () => {
      const twoWeeksAgo = fixedNow.getTime() - 14 * 24 * 60 * 60 * 1000;
      const result = formatTimestamp(twoWeeksAgo, { format: 'relative' });
      // Should be a short date string like "Feb 15"
      expect(result).toContain('Feb');
      expect(result).toContain('15');
    });

    it('should show "just now" for future timestamps', () => {
      const futureMs = fixedNow.getTime() + 60_000;
      expect(formatTimestamp(futureMs, { format: 'relative' })).toBe('just now');
    });
  });

  describe('short format', () => {
    it('should show month and day for same-year dates', () => {
      const jan15 = new Date('2025-01-15T00:00:00Z').getTime();
      const result = formatTimestamp(jan15, { format: 'short' });
      expect(result).toContain('Jan');
      expect(result).toContain('15');
    });

    it('should include the year for dates in different years', () => {
      const lastYear = new Date('2024-06-10T00:00:00Z').getTime();
      const result = formatTimestamp(lastYear, { format: 'short' });
      expect(result).toContain('2024');
    });
  });

  describe('long format', () => {
    it('should produce a full date with month name', () => {
      const date = new Date('2025-01-15T00:00:00Z').getTime();
      const result = formatTimestamp(date, { format: 'long' });
      expect(result).toContain('January');
      expect(result).toContain('15');
      expect(result).toContain('2025');
    });
  });

  describe('iso format', () => {
    it('should return a valid ISO 8601 string', () => {
      const date = new Date('2025-02-20T08:30:00Z').getTime();
      const result = formatTimestamp(date, { format: 'iso' });
      expect(result).toBe('2025-02-20T08:30:00.000Z');
    });
  });

  describe('block height detection', () => {
    it('should convert block heights automatically', () => {
      // The anchor block should map to the anchor timestamp
      const result = formatTimestamp(BLOCK_HEIGHT_ANCHOR.height, { format: 'iso' });
      const expectedDate = new Date(BLOCK_HEIGHT_ANCHOR.timestampSeconds * 1000);
      expect(result).toBe(expectedDate.toISOString());
    });

    it('should respect forceBlockHeight option', () => {
      const result = formatTimestamp(883_100, { format: 'iso', forceBlockHeight: true });
      const expectedMs =
        (BLOCK_HEIGHT_ANCHOR.timestampSeconds + 100 * AVERAGE_BLOCK_TIME_SECONDS) * 1000;
      const expectedDate = new Date(expectedMs);
      expect(result).toBe(expectedDate.toISOString());
    });

    it('should pass through Unix-ms values without conversion', () => {
      const ms = new Date('2025-01-01T00:00:00Z').getTime();
      const result = formatTimestamp(ms, { format: 'iso' });
      expect(result).toBe('2025-01-01T00:00:00.000Z');
    });

    it('should convert Unix-seconds to ms then format', () => {
      const seconds = Math.floor(new Date('2025-01-01T00:00:00Z').getTime() / 1000);
      const result = formatTimestamp(seconds, { format: 'iso' });
      expect(result).toBe('2025-01-01T00:00:00.000Z');
    });
  });

  describe('default format', () => {
    it('should default to relative when no format is specified', () => {
      const recentMs = fixedNow.getTime() - 120_000; // 2 minutes ago
      expect(formatTimestamp(recentMs)).toBe('2m ago');
    });
  });
});

describe('toISOString', () => {
  it('should return the same result as formatTimestamp with iso format', () => {
    const ms = new Date('2025-06-15T14:00:00Z').getTime();
    expect(toISOString(ms)).toBe('2025-06-15T14:00:00.000Z');
  });

  it('should handle block heights correctly', () => {
    const iso = toISOString(BLOCK_HEIGHT_ANCHOR.height);
    const expectedDate = new Date(BLOCK_HEIGHT_ANCHOR.timestampSeconds * 1000);
    expect(iso).toBe(expectedDate.toISOString());
  });
});
