"use client";

import { useBoltzWidget } from "../../hooks/useBoltzWidget";

interface WidgetProviderProps {
  id: string;
  children: React.ReactNode;
}

export default function WidgetProvider({ id, children }: WidgetProviderProps) {
  useBoltzWidget({ id });

  return <>{children}</>;
}
