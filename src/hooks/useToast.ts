import { useToastStore, toast } from "@/store/toastStore";

export function useToast() {
  const { toasts, removeToast, clearToasts } = useToastStore();

  return {
    toasts,
    removeToast,
    clearToasts,
    toast,
  };
}