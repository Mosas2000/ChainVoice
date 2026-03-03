import {
  createContext,
  useCallback,
  useContext,
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

// ────────────────────────────────────────────────
// Provider
// ────────────────────────────────────────────────

interface OptimisticProviderProps {
  children: ReactNode;
}

export function OptimisticProvider({ children }: OptimisticProviderProps) {
  const [messages, setMessages] = useState<OptimisticMessage[]>([]);
  const [follows, setFollows] = useState<OptimisticFollow[]>([]);

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
