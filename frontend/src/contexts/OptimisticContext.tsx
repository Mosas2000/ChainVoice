import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import type {
  OptimisticMessage,
  OptimisticFollow,
  OptimisticStatus,
} from '@/types';

// ────────────────────────────────────────────────
// Context shape
// ────────────────────────────────────────────────

interface OptimisticStore {
  /** All optimistic messages currently in flight. */
  messages: OptimisticMessage[];
  /** All optimistic follow/unfollow actions currently in flight. */
  follows: OptimisticFollow[];

  /** Inject a new optimistic message into the store. */
  addMessage: (entry: Omit<OptimisticMessage, 'localId' | 'createdAt' | 'status'>) => void;
  /** Inject a new optimistic follow/unfollow into the store. */
  addFollow: (entry: Omit<OptimisticFollow, 'localId' | 'createdAt' | 'status'>) => void;
  /** Transition an entry to confirmed and schedule its removal. */
  confirmEntry: (txId: string) => void;
  /** Transition an entry to failed so the UI can show a revert notice. */
  failEntry: (txId: string) => void;
  /** Remove an entry from the store (e.g. after the confirmed animation finishes). */
  removeEntry: (txId: string) => void;
  /** Check if there is a pending follow/unfollow for a given address. */
  getOptimisticFollow: (targetAddress: string) => OptimisticFollow | undefined;
}

const OptimisticContext = createContext<OptimisticStore | null>(null);

// ────────────────────────────────────────────────
// Helpers
// ────────────────────────────────────────────────

let nextId = 0;
function generateLocalId(): string {
  return `opt_${Date.now()}_${++nextId}`;
}

// ── Session storage persistence ──────────────────

const STORAGE_KEY_MESSAGES = 'chainvoice:optimistic:messages';
const STORAGE_KEY_FOLLOWS = 'chainvoice:optimistic:follows';

function loadFromStorage<T>(key: string): T[] {
  try {
    const raw = sessionStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveToStorage<T>(key: string, data: T[]): void {
  try {
    sessionStorage.setItem(key, JSON.stringify(data));
  } catch {
    // Quota exceeded or private browsing — silently ignore.
  }
}

/** Entries older than this are considered stale and removed on mount. */
const STALE_THRESHOLD_MS = 30 * 60 * 1000; // 30 minutes

function pruneStale<T extends { createdAt: number }>(entries: T[]): T[] {
  const cutoff = Date.now() - STALE_THRESHOLD_MS;
  return entries.filter((e) => e.createdAt > cutoff);
}

// ────────────────────────────────────────────────
// Provider
// ────────────────────────────────────────────────

interface OptimisticProviderProps {
  children: ReactNode;
}

export function OptimisticProvider({ children }: OptimisticProviderProps) {
  const [messages, setMessages] = useState<OptimisticMessage[]>(
    () => pruneStale(loadFromStorage<OptimisticMessage>(STORAGE_KEY_MESSAGES)),
  );
  const [follows, setFollows] = useState<OptimisticFollow[]>(
    () => pruneStale(loadFromStorage<OptimisticFollow>(STORAGE_KEY_FOLLOWS)),
  );

  // Persist to sessionStorage whenever entries change.
  useEffect(() => {
    saveToStorage(STORAGE_KEY_MESSAGES, messages);
  }, [messages]);

  useEffect(() => {
    saveToStorage(STORAGE_KEY_FOLLOWS, follows);
  }, [follows]);

  const addMessage = useCallback(
    (entry: Omit<OptimisticMessage, 'localId' | 'createdAt' | 'status'>) => {
      const optimistic: OptimisticMessage = {
        ...entry,
        localId: generateLocalId(),
        createdAt: Date.now(),
        status: 'pending',
      };
      setMessages((prev) => [optimistic, ...prev]);
    },
    [],
  );

  const addFollow = useCallback(
    (entry: Omit<OptimisticFollow, 'localId' | 'createdAt' | 'status'>) => {
      const optimistic: OptimisticFollow = {
        ...entry,
        localId: generateLocalId(),
        createdAt: Date.now(),
        status: 'pending',
      };
      setFollows((prev) => [optimistic, ...prev]);
    },
    [],
  );

  const updateStatus = useCallback(
    (txId: string, status: OptimisticStatus) => {
      setMessages((prev) =>
        prev.map((m) => (m.txId === txId ? { ...m, status } : m)),
      );
      setFollows((prev) =>
        prev.map((f) => (f.txId === txId ? { ...f, status } : f)),
      );
    },
    [],
  );

  const confirmEntry = useCallback(
    (txId: string) => {
      updateStatus(txId, 'confirmed');
    },
    [updateStatus],
  );

  const failEntry = useCallback(
    (txId: string) => {
      updateStatus(txId, 'failed');
    },
    [updateStatus],
  );

  const removeEntry = useCallback((txId: string) => {
    setMessages((prev) => prev.filter((m) => m.txId !== txId));
    setFollows((prev) => prev.filter((f) => f.txId !== txId));
  }, []);

  const getOptimisticFollow = useCallback(
    (targetAddress: string) => {
      return follows.find(
        (f) => f.targetAddress === targetAddress && f.status === 'pending',
      );
    },
    [follows],
  );

  return (
    <OptimisticContext.Provider
      value={{
        messages,
        follows,
        addMessage,
        addFollow,
        confirmEntry,
        failEntry,
        removeEntry,
        getOptimisticFollow,
      }}
    >
      {children}
    </OptimisticContext.Provider>
  );
}

// ────────────────────────────────────────────────
// Hook
// ────────────────────────────────────────────────

export function useOptimistic(): OptimisticStore {
  const ctx = useContext(OptimisticContext);
  if (!ctx) {
    throw new Error('useOptimistic must be used within an OptimisticProvider');
  }
  return ctx;
}
