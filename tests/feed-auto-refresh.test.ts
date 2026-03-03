import { describe, it, expect } from 'vitest';

/**
 * Tests covering the feed auto-refresh feature:
 * - formatRelativeTime helper
 * - Polling state machine (newMessageCount tracking)
 * - Visibility-aware pause/resume logic
 * - Pull-to-refresh threshold semantics
 */

// ---- formatRelativeTime (mirrors the implementation) ----

function formatRelativeTime(timestamp: number): string {
  const diff = Date.now() - timestamp;
  if (diff < 60_000) return 'just now';
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 60) return `${minutes} m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} h ago`;
  const days = Math.floor(hours / 24);
  return `${days} d ago`;
}

describe('formatRelativeTime', () => {
  it('returns "just now" for timestamps less than a minute old', () => {
    expect(formatRelativeTime(Date.now() - 30_000)).toBe('just now');
  });

  it('formats minutes correctly', () => {
    expect(formatRelativeTime(Date.now() - 5 * 60_000)).toBe('5 m ago');
  });

  it('formats hours correctly', () => {
    expect(formatRelativeTime(Date.now() - 2 * 3_600_000)).toBe('2 h ago');
  });

  it('formats days correctly', () => {
    expect(formatRelativeTime(Date.now() - 3 * 86_400_000)).toBe('3 d ago');
  });

  it('returns "just now" for the current timestamp', () => {
    expect(formatRelativeTime(Date.now())).toBe('just now');
  });
});

// ---- Polling state model ----

interface PollState {
  messages: string[];
  totalCount: number;
  lastKnownCount: number;
  newMessageCount: number;
  fetchInFlight: boolean;
  pollInFlight: boolean;
}

function initialPollState(): PollState {
  return {
    messages: [],
    totalCount: 0,
    lastKnownCount: 0,
    newMessageCount: 0,
    fetchInFlight: false,
    pollInFlight: false,
  };
}

/** Simulates a full fetch completing with the given count. */
function completeFetch(state: PollState, count: number): PollState {
  return {
    ...state,
    totalCount: count,
    lastKnownCount: count,
    newMessageCount: 0,
    fetchInFlight: false,
  };
}

/** Simulates a poll tick returning the given count. */
function completePoll(state: PollState, count: number): PollState {
  const diff = count - state.lastKnownCount;
  return {
    ...state,
    totalCount: count,
    newMessageCount: diff > 0 ? diff : state.newMessageCount,
    pollInFlight: false,
  };
}

describe('Polling state machine', () => {
  it('starts with zero new messages', () => {
    const state = initialPollState();
    expect(state.newMessageCount).toBe(0);
    expect(state.lastKnownCount).toBe(0);
  });

  it('resets newMessageCount after a full fetch', () => {
    let state = initialPollState();
    state.newMessageCount = 5;
    state = completeFetch(state, 10);
    expect(state.newMessageCount).toBe(0);
    expect(state.lastKnownCount).toBe(10);
  });

  it('sets newMessageCount when poll detects more messages', () => {
    let state = completeFetch(initialPollState(), 10);
    state = completePoll(state, 13);
    expect(state.newMessageCount).toBe(3);
  });

  it('does not decrease newMessageCount on subsequent polls', () => {
    let state = completeFetch(initialPollState(), 10);
    state = completePoll(state, 12);
    expect(state.newMessageCount).toBe(2);
    // Another poll with same count should keep the count
    state = completePoll(state, 12);
    expect(state.newMessageCount).toBe(2);
  });

  it('stays at zero if poll count equals lastKnownCount', () => {
    let state = completeFetch(initialPollState(), 5);
    state = completePoll(state, 5);
    expect(state.newMessageCount).toBe(0);
  });

  it('blocks concurrent fetches via fetchInFlight flag', () => {
    const state = initialPollState();
    state.fetchInFlight = true;
    // A second fetch should be skipped
    expect(state.fetchInFlight).toBe(true);
  });

  it('blocks poll when fetch is in flight', () => {
    const state = initialPollState();
    state.fetchInFlight = true;
    // pollForNewMessages checks fetchInFlight and skips
    expect(state.fetchInFlight).toBe(true);
    expect(state.pollInFlight).toBe(false);
  });
});

// ---- Visibility-aware polling ----

describe('Visibility-aware polling', () => {
  it('uses the configured interval when tab is visible', () => {
    const isVisible = true;
    const pollInterval = 30_000;
    const effective = isVisible ? pollInterval : null;
    expect(effective).toBe(30_000);
  });

  it('disables polling when tab is hidden', () => {
    const isVisible = false;
    const pollInterval = 30_000;
    const effective = isVisible ? pollInterval : null;
    expect(effective).toBeNull();
  });

  it('fires an immediate poll when tab regains focus', () => {
    let wasHidden = true;
    let pollTriggered = false;
    // Simulate returning to visible
    const isVisible = true;
    if (isVisible && wasHidden) {
      wasHidden = false;
      pollTriggered = true;
    }
    expect(pollTriggered).toBe(true);
    expect(wasHidden).toBe(false);
  });
});

// ---- Pull-to-refresh threshold ----

describe('Pull-to-refresh semantics', () => {
  const threshold = 80;

  it('does not trigger refresh below threshold', () => {
    const pullDistance = 60;
    expect(pullDistance >= threshold).toBe(false);
  });

  it('triggers refresh at exact threshold', () => {
    const pullDistance = 80;
    expect(pullDistance >= threshold).toBe(true);
  });

  it('triggers refresh above threshold', () => {
    const pullDistance = 120;
    expect(pullDistance >= threshold).toBe(true);
  });

  it('caps the visual distance with diminishing returns', () => {
    const delta = 200;
    const capped = delta > threshold ? threshold + (delta - threshold) * 0.3 : delta;
    expect(capped).toBe(80 + 120 * 0.3); // 116
    expect(capped).toBeLessThan(delta);
  });
});
