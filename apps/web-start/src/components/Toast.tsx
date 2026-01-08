import { useEffect } from 'react';
import { CheckCircle, X, AlertCircle, Info } from 'lucide-react';

export interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
  duration?: number;
}

export function Toast({ message, type = 'success', onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-600" />,
    error: <AlertCircle className="w-5 h-5 text-red-600" />,
    info: <Info className="w-5 h-5 text-blue-600" />,
  };

  const colors = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
  };

  return (
    <div className="fixed top-20 right-4 z-[100] animate-in slide-in-from-right duration-300">
      <div className={`flex items-center gap-3 px-4 py-3 rounded shadow-lg border-2 ${colors[type]} backdrop-blur-sm max-w-md`}>
        {icons[type]}
        <p className="flex-1 font-medium">{message}</p>
        <button
          onClick={onClose}
          className="hover:opacity-70 transition-opacity"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
