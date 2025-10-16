import { create } from "zustand";
import { Toast, ToastType } from "@/components/ui/Toast";

interface ToastState {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: string) => void;
  clearToasts: () => void;
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  
  addToast: (toast) => {
    const id = Math.random().toString(36).substr(2, 9);
    set((state) => ({
      toasts: [...state.toasts, { ...toast, id }],
    }));
  },
  
  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    }));
  },
  
  clearToasts: () => {
    set({ toasts: [] });
  },
}));

// Helper functions for common toast types
export const toast = {
  success: (title: string, message?: string, duration?: number) => {
    useToastStore.getState().addToast({
      type: "success" as ToastType,
      title,
      message,
      duration,
    });
  },
  
  error: (title: string, message?: string, duration?: number) => {
    useToastStore.getState().addToast({
      type: "error" as ToastType,
      title,
      message,
      duration,
    });
  },
  
  warning: (title: string, message?: string, duration?: number) => {
    useToastStore.getState().addToast({
      type: "warning" as ToastType,
      title,
      message,
      duration,
    });
  },
  
  info: (title: string, message?: string, duration?: number) => {
    useToastStore.getState().addToast({
      type: "info" as ToastType,
      title,
      message,
      duration,
    });
  },
};