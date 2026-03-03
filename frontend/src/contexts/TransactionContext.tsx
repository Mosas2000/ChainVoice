import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import type {
  TrackedTransaction,
  TransactionAction,
  TransactionStatus,
} from '@/types/transactions';
import { pollTransactionStatus } from '@/services/transactionStatus';

// ────────────────────────────────────────────────
// Context shape
// ────────────────────────────────────────────────

interface TransactionStore {
  /** All transactions tracked during this session. */
  transactions: TrackedTransaction[];
  /** Add a newly submitted transaction and start polling its status. */
  trackTransaction: (
    txId: string,
    action: TransactionAction,
    description?: string,
  ) => void;
  /** Remove all tracked transactions from the list. */
  clearAll: () => void;
  /** Number of currently pending/submitted transactions. */
  pendingCount: number;
}

const TransactionContext = createContext<TransactionStore | null>(null);

// ────────────────────────────────────────────────
// Provider
// ────────────────────────────────────────────────

const SESSION_STORAGE_KEY = 'chainvoice:transactions';

function loadFromStorage(): TrackedTransaction[] {
  try {
    const raw = sessionStorage.getItem(SESSION_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveToStorage(txs: TrackedTransaction[]): void {
  try {
    sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(txs));
  } catch {
    // Quota exceeded or private browsing — silently ignore
  }
}

interface TransactionProviderProps {
  children: ReactNode;
}

export function TransactionProvider({ children }: TransactionProviderProps) {
  const [transactions, setTransactions] = useState<TrackedTransaction[]>(loadFromStorage);
  const cleanupRefs = useRef<Map<string, () => void>>(new Map());

  // Persist to sessionStorage on every change
  useEffect(() => {
    saveToStorage(transactions);
  }, [transactions]);

  // Restart polling for any non-terminal transactions on mount
  // (handles page refreshes)
  useEffect(() => {
    transactions.forEach((tx) => {
      if (tx.status !== 'confirmed' && tx.status !== 'failed') {
        startPolling(tx.txId);
      }
    });

    return () => {
      cleanupRefs.current.forEach((cleanup) => cleanup());
      cleanupRefs.current.clear();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── helpers ───────────────────────────────────

  function updateTransaction(
    txId: string,
    patch: Partial<Pick<TrackedTransaction, 'status' | 'errorMessage'>>,
  ) {
    setTransactions((prev) =>
      prev.map((tx) =>
        tx.txId === txId
          ? { ...tx, ...patch, updatedAt: new Date().toISOString() }
          : tx,
      ),
    );
  }

  function startPolling(txId: string) {
    // Avoid duplicate pollers for the same tx
    if (cleanupRefs.current.has(txId)) return;

    const cleanup = pollTransactionStatus(txId, (result) => {
      const newStatus: TransactionStatus = result.status;
      updateTransaction(txId, {
        status: newStatus,
        errorMessage:
          newStatus === 'failed'
            ? 'Transaction failed (' + result.rawStatus + ')'
            : undefined,
      });

      if (newStatus === 'confirmed' || newStatus === 'failed') {
        cleanupRefs.current.delete(txId);
      }
    });

    cleanupRefs.current.set(txId, cleanup);
  }

  // ── public API ────────────────────────────────

  const trackTransaction = useCallback(
    (txId: string, action: TransactionAction, description?: string) => {
      const now = new Date().toISOString();

      const newTx: TrackedTransaction = {
        txId,
        action,
        status: 'submitted',
        createdAt: now,
        updatedAt: now,
        description,
      };

      setTransactions((prev) => [newTx, ...prev]);
      startPolling(txId);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const clearAll = useCallback(() => {
    cleanupRefs.current.forEach((cleanup) => cleanup());
    cleanupRefs.current.clear();
    setTransactions([]);
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
  }, []);

  const pendingCount = transactions.filter(
    (tx) => tx.status === 'pending' || tx.status === 'submitted',
  ).length;

  return (
    <TransactionContext.Provider
      value={{ transactions, trackTransaction, clearAll, pendingCount }}
    >
      {children}
    </TransactionContext.Provider>
  );
}

// ────────────────────────────────────────────────
// Hook
// ────────────────────────────────────────────────

/**
 * Access the global transaction store from any component inside
 * the TransactionProvider tree.
 */
export function useTransactions(): TransactionStore {
  const ctx = useContext(TransactionContext);
  if (!ctx) {
    throw new Error('useTransactions must be used within a TransactionProvider');
  }
  return ctx;
}
