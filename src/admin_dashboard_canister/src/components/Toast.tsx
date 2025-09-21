/**
 * Toast Notification Component
 *
 * Simple toast notifications for success, error, and info messages
 */

import React, { useState, useEffect } from "react";
import { Check, AlertCircle, Info, X } from "lucide-react";

export type ToastType = "success" | "error" | "info";

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastProps {
  toast: Toast;
  onDismiss: (id: string) => void;
}

const ToastComponent: React.FC<ToastProps> = ({ toast, onDismiss }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onDismiss(toast.id), 300); // Allow fade out animation
    }, toast.duration || 5000);

    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, onDismiss]);

  const getIcon = () => {
    switch (toast.type) {
      case "success":
        return <Check className="h-5 w-5 text-green-600" />;
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      case "info":
        return <Info className="h-5 w-5 text-blue-600" />;
    }
  };

  const getStyles = () => {
    switch (toast.type) {
      case "success":
        return "bg-green-50 border-green-200 text-green-800";
      case "error":
        return "bg-red-50 border-red-200 text-red-800";
      case "info":
        return "bg-blue-50 border-blue-200 text-blue-800";
    }
  };

  return (
    <div
      className={`
        fixed top-4 right-4 z-[100] max-w-sm w-full
        transform transition-all duration-300 ease-in-out
        ${isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"}
      `}
    >
      <div className={`p-4 border rounded-lg shadow-lg ${getStyles()}`}>
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">{getIcon()}</div>
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-sm">{toast.title}</h4>
            {toast.message && (
              <p className="text-sm mt-1 opacity-90">{toast.message}</p>
            )}
          </div>
          <button
            onClick={() => onDismiss(toast.id)}
            className="flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Toast Manager Hook
export const useToast = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (toast: Omit<Toast, "id">) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { ...toast, id }]);
    return id;
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const success = (title: string, message?: string) => {
    return addToast({ type: "success", title, message });
  };

  const error = (title: string, message?: string) => {
    return addToast({ type: "error", title, message });
  };

  const info = (title: string, message?: string) => {
    return addToast({ type: "info", title, message });
  };

  return {
    toasts,
    addToast,
    dismissToast,
    success,
    error,
    info,
  };
};

// Toast Container Component
export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useToast();

  return (
    <>
      {toasts.map((toast) => (
        <ToastComponent key={toast.id} toast={toast} onDismiss={dismissToast} />
      ))}
    </>
  );
};
