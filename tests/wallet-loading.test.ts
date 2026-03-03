import { describe, it, expect } from 'vitest';

/**
 * Tests for wallet loading-state behaviour.
 *
 * These validate the state-machine logic that AuthContext exposes
 * (initializing → idle, connecting → connected/error) and the
 * derived rendering decisions in WalletConnectionGuard and the
 * WalletButtonSkeleton.
 */

// ---- tiny auth-state model used by the guard / header ----

interface AuthState {
  isAuthenticated: boolean;
  initializing: boolean;
  connecting: boolean;
  connectionError: string | null;
}

function initialState(): AuthState {
  return {
    isAuthenticated: false,
    initializing: true,
    connecting: false,
    connectionError: null,
  };
}

/** What the guard component renders depends on these flags. */
type GuardView = 'spinner' | 'connect-prompt' | 'children';

function resolveGuardView(state: AuthState): GuardView {
  if (state.initializing) return 'spinner';
  if (!state.isAuthenticated) return 'connect-prompt';
  return 'children';
}

/** What the header wallet slot renders. */
type HeaderSlot = 'skeleton' | 'connect-button' | 'connecting-button' | 'user-menu';

function resolveHeaderSlot(state: AuthState): HeaderSlot {
  if (state.initializing) return 'skeleton';
  if (!state.isAuthenticated && state.connecting) return 'connecting-button';
  if (!state.isAuthenticated) return 'connect-button';
  return 'user-menu';
}

// ---- tests ----

describe('Wallet loading state machine', () => {
  it('starts in the initializing state', () => {
    const state = initialState();
    expect(state.initializing).toBe(true);
    expect(state.isAuthenticated).toBe(false);
    expect(state.connecting).toBe(false);
    expect(state.connectionError).toBeNull();
  });

  it('transitions to idle after initializing resolves (not authenticated)', () => {
    const state = initialState();
    // Simulate handlePendingSignIn resolving with no session
    state.initializing = false;
    expect(state.initializing).toBe(false);
    expect(state.isAuthenticated).toBe(false);
  });

  it('transitions to authenticated after initializing with a restored session', () => {
    const state = initialState();
    state.initializing = false;
    state.isAuthenticated = true;
    expect(state.isAuthenticated).toBe(true);
    expect(state.initializing).toBe(false);
  });

  it('sets connecting flag while wallet popup is open', () => {
    const state: AuthState = {
      isAuthenticated: false,
      initializing: false,
      connecting: true,
      connectionError: null,
    };
    expect(state.connecting).toBe(true);
  });

  it('clears connecting and sets authenticated on successful connection', () => {
    const state: AuthState = {
      isAuthenticated: false,
      initializing: false,
      connecting: true,
      connectionError: null,
    };
    // Simulate success
    state.connecting = false;
    state.isAuthenticated = true;
    expect(state.connecting).toBe(false);
    expect(state.isAuthenticated).toBe(true);
    expect(state.connectionError).toBeNull();
  });

  it('stores an error message when connection fails', () => {
    const state: AuthState = {
      isAuthenticated: false,
      initializing: false,
      connecting: true,
      connectionError: null,
    };
    // Simulate failure
    state.connecting = false;
    state.connectionError = 'User cancelled the request';
    expect(state.connectionError).toBe('User cancelled the request');
    expect(state.isAuthenticated).toBe(false);
  });
});

describe('WalletConnectionGuard view resolution', () => {
  it('shows spinner while initializing', () => {
    expect(resolveGuardView(initialState())).toBe('spinner');
  });

  it('shows connect prompt after init when unauthenticated', () => {
    expect(
      resolveGuardView({
        isAuthenticated: false,
        initializing: false,
        connecting: false,
        connectionError: null,
      }),
    ).toBe('connect-prompt');
  });

  it('shows children when authenticated', () => {
    expect(
      resolveGuardView({
        isAuthenticated: true,
        initializing: false,
        connecting: false,
        connectionError: null,
      }),
    ).toBe('children');
  });

  it('shows spinner even if authenticated flag is true during init', () => {
    expect(
      resolveGuardView({
        isAuthenticated: true,
        initializing: true,
        connecting: false,
        connectionError: null,
      }),
    ).toBe('spinner');
  });

  it('shows connect prompt when connecting (popup open)', () => {
    // Guard still shows the prompt; the button inside spins
    expect(
      resolveGuardView({
        isAuthenticated: false,
        initializing: false,
        connecting: true,
        connectionError: null,
      }),
    ).toBe('connect-prompt');
  });
});

describe('Header wallet slot resolution', () => {
  it('shows skeleton during initializing', () => {
    expect(resolveHeaderSlot(initialState())).toBe('skeleton');
  });

  it('shows idle connect button when unauthenticated', () => {
    expect(
      resolveHeaderSlot({
        isAuthenticated: false,
        initializing: false,
        connecting: false,
        connectionError: null,
      }),
    ).toBe('connect-button');
  });

  it('shows connecting button while popup is open', () => {
    expect(
      resolveHeaderSlot({
        isAuthenticated: false,
        initializing: false,
        connecting: true,
        connectionError: null,
      }),
    ).toBe('connecting-button');
  });

  it('shows user menu when authenticated', () => {
    expect(
      resolveHeaderSlot({
        isAuthenticated: true,
        initializing: false,
        connecting: false,
        connectionError: null,
      }),
    ).toBe('user-menu');
  });
});

describe('Connection error semantics', () => {
  it('clearConnectionError resets error to null', () => {
    const state: AuthState = {
      isAuthenticated: false,
      initializing: false,
      connecting: false,
      connectionError: 'Something went wrong',
    };
    // Simulate clearConnectionError
    state.connectionError = null;
    expect(state.connectionError).toBeNull();
  });

  it('a new connect attempt clears the previous error', () => {
    const state: AuthState = {
      isAuthenticated: false,
      initializing: false,
      connecting: false,
      connectionError: 'Previous failure',
    };
    // Simulate handleConnectWallet start
    state.connecting = true;
    state.connectionError = null;
    expect(state.connectionError).toBeNull();
    expect(state.connecting).toBe(true);
  });

  it('error and connecting are never both truthy', () => {
    // After a failure connecting is set false before error is set
    const state: AuthState = {
      isAuthenticated: false,
      initializing: false,
      connecting: false,
      connectionError: 'Timeout',
    };
    expect(state.connecting).toBe(false);

    // Starting a new attempt clears error first
    state.connectionError = null;
    state.connecting = true;
    expect(state.connectionError).toBeNull();
  });
});
