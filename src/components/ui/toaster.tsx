import { useState, useEffect } from "react";
import { RiCloseLine } from "@remixicon/react";
import { cn } from "@/lib/utils";

// Minimal toast implementation for MVP without heavy dependencies
let toastCount = 0;
const listeners = new Set<Function>();

export interface ToastProps {
  id: number;
  title: string;
  description?: string;
  variant?: "default" | "destructive";
}

export const toast = (props: Omit<ToastProps, "id">) => {
  const id = ++toastCount;
  listeners.forEach((listener) => listener({ ...props, id }));
};

export function Toaster() {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  useEffect(() => {
    const handleToast = (newToast: ToastProps) => {
      setToasts((prev) => [...prev, newToast]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
      }, 3000);
    };
    listeners.add(handleToast);
    return () => {
      listeners.delete(handleToast);
    };
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
      {toasts.map((t) => (
        <div key={t.id} className={cn("pointer-events-auto flex w-full max-w-sm items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all", t.variant === "destructive" ? "destructive group border-destructive bg-destructive text-destructive-foreground" : "bg-background border-border text-foreground")}>
           <div className="grid gap-1">
              {t.title && <div className="text-sm font-semibold">{t.title}</div>}
              {t.description && <div className="text-sm opacity-90">{t.description}</div>}
           </div>
        </div>
      ))}
    </div>
  )
}
