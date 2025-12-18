"use client";

import { useEffect } from "react";

interface LevelXConfig {
  id: string;
  apiUrl?: string;
}

declare global {
  interface Window {
    // Global Level-x widget config
    LEVEL_X_CONFIG?: {
      id: string;
      apiUrl?: string;
    };
  }
}

export function useLevelXWidget(config: LevelXConfig) {
  useEffect(() => {
    // Set global config
    window.LEVEL_X_CONFIG = {
      id: config.id,
      apiUrl: config.apiUrl,
    };

    // Load widget script
    const script = document.createElement("script");
    script.src = "/widget.js";
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
  }, [config.id, config.apiUrl]);
}
