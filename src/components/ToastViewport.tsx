import { AnimatePresence, motion } from 'framer-motion';
import { useAppContext } from '../context/useAppContext';

export function ToastViewport() {
  const { toasts, dismissToast } = useAppContext();

  return (
    <div className="toast-viewport" aria-live="polite" aria-label="Notifications">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            className={`toast toast--${toast.type}`}
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 60 }}
            transition={{ duration: 0.2 }}
          >
            <span>{toast.message}</span>
            <button onClick={() => dismissToast(toast.id)} aria-label="Dismiss notification">
              x
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
