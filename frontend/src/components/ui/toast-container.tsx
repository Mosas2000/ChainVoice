import { useToast } from '@/contexts/ToastContext';
import { ToastItem } from '@/components/ui/toast-item';

/**
 * Fixed-position container that renders all currently active toasts
 * in the bottom-right corner of the viewport. Should be placed once
 * at the app root level, inside the ToastProvider.
 */
export function ToastContainer() {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div
      aria-label="Notifications"
      className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none"
    >
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          title={toast.title}
          description={toast.description}
          variant={toast.variant}
          onDismiss={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
}
