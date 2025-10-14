"use client";

import { useEffect } from "react";

interface BoltzConfig {
  id: string;
}

declare global {
  interface Window {
    // Global Boltz widget config
    BOLTZ_CONFIG?: {
      id: string;
    };
  }
}

export function useBoltzWidget(config: BoltzConfig) {
  useEffect(() => {
    // Set global config
    window.BOLTZ_CONFIG = {
      id: config.id,
    };

    // Load widget script
    const script = document.createElement("script");
    script.src = "http://192.168.1.162:3000/widget.js";
    script.async = true;
    document.head.appendChild(script);

    return () => {
      // Cleanup
      const widget = document.getElementById("boltz-widget");
      if (widget) {
        widget.remove();
      }
      document.head.removeChild(script);
    };
  }, [config.id]);
}
