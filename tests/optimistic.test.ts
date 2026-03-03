import { describe, it, expect } from 'vitest';
import type {
  OptimisticMessage,
  OptimisticFollow,
  OptimisticStatus,
} from '../frontend/src/types';

/**
 * Unit tests for the optimistic UI type definitions and helper logic.
 * These verify the shape of the types and the pruneStale-style
 * filtering logic that the OptimisticContext uses.
 */

// ── Type shape tests ────────────────────────────

describe('OptimisticMessage type', () => {
  it('can be constructed with all required fields', () => {
    const msg: OptimisticMessage = {
      localId: 'opt_1',
      txId: '0xabc',
      content: 'Hello world',
      author: 'SP123',
      isPublic: true,
      createdAt: Date.now(),
      status: 'pending',
    };

    expect(msg.localId).toBe('opt_1');
    expect(msg.status).toBe('pending');
  });

  it('accepts an optional recipient for direct messages', () => {
    const dm: OptimisticMessage = {
      localId: 'opt_2',
      txId: '0xdef',
      content: 'Private note',
      author: 'SP123',
      isPublic: false,
      recipient: 'SP456',
      createdAt: Date.now(),
      status: 'pending',
    };

    expect(dm.recipient).toBe('SP456');
    expect(dm.isPublic).toBe(false);
  });
});

describe('OptimisticFollow type', () => {
  it('can represent a follow action', () => {
    const follow: OptimisticFollow = {
      localId: 'opt_3',
      txId: '0x111',
      targetAddress: 'SP789',
      isFollow: true,
      createdAt: Date.now(),
      status: 'pending',
    };

    expect(follow.isFollow).toBe(true);
    expect(follow.targetAddress).toBe('SP789');
  });

  it('can represent an unfollow action', () => {
    const unfollow: OptimisticFollow = {
      localId: 'opt_4',
      txId: '0x222',
      targetAddress: 'SP789',
      isFollow: false,
      createdAt: Date.now(),
      status: 'confirmed',
    };

    expect(unfollow.isFollow).toBe(false);
    expect(unfollow.status).toBe('confirmed');
  });
});

// ── Status lifecycle helpers ─────────────────────

describe('OptimisticStatus transitions', () => {
  const statuses: OptimisticStatus[] = ['pending', 'confirmed', 'failed'];

  it('allows only the three defined states', () => {
    expect(statuses).toHaveLength(3);
    expect(statuses).toContain('pending');
    expect(statuses).toContain('confirmed');
    expect(statuses).toContain('failed');
  });
});

// ── Prune logic (extracted for testing) ──────────

const STALE_THRESHOLD_MS = 30 * 60 * 1000;

function pruneStale<T extends { createdAt: number }>(entries: T[]): T[] {
  const cutoff = Date.now() - STALE_THRESHOLD_MS;
  return entries.filter((e) => e.createdAt > cutoff);
}

describe('pruneStale', () => {
  it('keeps entries newer than thirty minutes', () => {
    const recent: OptimisticMessage = {
      localId: 'opt_5',
      txId: '0xfresh',
      content: 'Recent post',
      author: 'SP123',
      isPublic: true,
      createdAt: Date.now() - 5 * 60 * 1000, // 5 minutes ago
      status: 'pending',
    };

    const result = pruneStale([recent]);
    expect(result).toHaveLength(1);
  });

  it('removes entries older than thirty minutes', () => {
    const stale: OptimisticMessage = {
      localId: 'opt_6',
      txId: '0xstale',
      content: 'Old post',
      author: 'SP123',
      isPublic: true,
      createdAt: Date.now() - 45 * 60 * 1000, // 45 minutes ago
      status: 'pending',
    };

    const result = pruneStale([stale]);
    expect(result).toHaveLength(0);
  });

  it('mixes fresh and stale entries correctly', () => {
    const entries: OptimisticMessage[] = [
      {
        localId: 'opt_7',
        txId: '0xa',
        content: 'Fresh',
        author: 'SP123',
        isPublic: true,
        createdAt: Date.now() - 10 * 60 * 1000,
        status: 'pending',
      },
      {
        localId: 'opt_8',
        txId: '0xb',
        content: 'Stale',
        author: 'SP123',
        isPublic: true,
        createdAt: Date.now() - 60 * 60 * 1000,
        status: 'pending',
      },
    ];

    const result = pruneStale(entries);
    expect(result).toHaveLength(1);
    expect(result[0].localId).toBe('opt_7');
  });
});
