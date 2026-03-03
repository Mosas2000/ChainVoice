import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';

// ────────────────────────────────────────────────
// Types
// ────────────────────────────────────────────────

export type ToastVariant = 'default' | 'success' | 'error' | 'loading';

export interface Toast {
  id: string;
  title: string;
  description?: string;
  variant: ToastVariant;
  /** Auto-dismiss delay in ms. `0` = sticky. */
  duration: number;
}

type AddToastInput = Omit<Toast, 'id'>;

// ────────────────────────────────────────────────
// Context
// ────────────────────────────────────────────────

interface ToastStore {
  toasts: Toast[];
  addToast: (toast: AddToastInput) => string;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastStore | null>(null);

let nextId = 0;

// ────────────────────────────────────────────────
// Provider
// ────────────────────────────────────────────────

interface ToastProviderProps {
  children: ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    (input: AddToastInput): string => {
      const id = 'toast-' + (++nextId);
      const toast: Toast = { ...input, id };

      setToasts((prev) => [...prev, toast]);

      if (toast.duration > 0) {
        setTimeout(() => removeToast(id), toast.duration);
      }

      return id;
    },
    [removeToast],
  );

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
    </ToastContext.Provider>
  );
}

// ────────────────────────────────────────────────
// Hook
// ────────────────────────────────────────────────

export function useToast(): ToastStore {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return ctx;
}
