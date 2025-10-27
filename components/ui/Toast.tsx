// components/ui/Toast.tsx
import React, { useEffect } from 'react';

interface ToastProps {
  message: string;
  onUndo: () => void;
  onDismiss: () => void;
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({ message, onUndo, onDismiss, duration = 5000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss();
    }, duration);

    return () => {
      clearTimeout(timer);
    };
  }, [onDismiss, duration]);

  const handleUndo = () => {
    onUndo();
    onDismiss();
  };

  return (
    <div className="fixed bottom-20 left-1/2 -translate-x-1/2 w-full max-w-sm p-4 bg-gray-800 text-white rounded-lg shadow-lg flex items-center justify-between z-50">
      <span>{message}</span>
      <button
        onClick={handleUndo}
        className="ml-4 font-bold uppercase text-primary-400 hover:text-primary-300"
      >
        Desfazer
      </button>
    </div>
  );
};

export default Toast;
