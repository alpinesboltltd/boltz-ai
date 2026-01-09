/**
 * Level-X Widget Entry Point
 *
 * This module is compiled by Vite into an IIFE bundle that can be loaded
 * via a script tag on external websites.
 *
 * Usage:
 * ```html
 * <script>
 *   window.LEVEL_X_CONFIG = {
 *     id: "your-agent-id",
 *     apiUrl: "https://your-domain.com/api/widget" // optional
 *   };
 * </script>
 * <script src="https://your-domain.com/widget.js" async></script>
 * ```
 */

import { LevelXWidget } from "./widget";
import type { WidgetUserConfig } from "./types";

/**
 * Initialize the widget when DOM is ready
 */
function init(): void {
  const config = window.LEVEL_X_CONFIG;

  if (!config) {
    console.error(
      "[LevelX] LEVEL_X_CONFIG not found. Please set window.LEVEL_X_CONFIG before loading the widget."
    );
    return;
  }

  if (!config.id) {
    console.error("[LevelX] Agent ID is required in LEVEL_X_CONFIG");
    return;
  }

  const widget = new LevelXWidget(config);

  // Expose widget API globally
  window.LevelXWidget = widget;

  // Initialize the widget
  widget.init().catch((error) => {
    console.error("[LevelX] Widget initialization failed:", error);
  });
}

// Wait for DOM to be ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}

// Export for potential programmatic usage
export { LevelXWidget };
export type { WidgetUserConfig, LevelXWidgetAPI } from "./types";
