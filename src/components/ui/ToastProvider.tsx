"use client";

import { ToastContainer } from "./Toast";
import { useToastStore } from "@/store/toastStore";

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const { toasts, removeToast } = useToastStore();

  return (
    <>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </>
  );
}