
import React, { createContext, useContext, ReactNode } from 'react';
import { useNotificationToast } from '@/hooks/useNotificationToast';

interface ToastContextType {
  toasts: any[];
  removeToast: (id: string) => void;
  showSuccess: (title: string, message?: string, duration?: number) => string;
  showError: (title: string, message?: string, duration?: number) => string;
  showInfo: (title: string, message?: string, duration?: number) => string;
  showWarning: (title: string, message?: string, duration?: number) => string;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { toasts, removeToast, showSuccess, showError, showInfo, showWarning } = useNotificationToast();

  return (
    <ToastContext.Provider value={{ toasts, removeToast, showSuccess, showError, showInfo, showWarning }}>
      {children}
    </ToastContext.Provider>
  );
};

export const useToastContext = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToastContext must be used within a ToastProvider');
  }
  return context;
};
