/**
 * Widget Configuration Types
 * These types mirror the AgentAppearance settings from the backend
 */

export type Position = "bottom-right" | "bottom-left";
export type IconSize = "small" | "medium" | "large";
export type BubbleStyle = "round" | "square";

/**
 * User-provided configuration via window.LEVEL_X_CONFIG
 */
export interface WidgetUserConfig {
  /** Agent ID to load configuration for */
  id: string;
  /** Optional API URL override */
  apiUrl?: string;
}

/**
 * Agent appearance configuration from the backend
 */
export interface AgentAppearanceConfig {
  name: string;
  primary_color: string;
  font_family?: string;
  chat_icon?: string;
  welcome_message: string;
  position: Position;
  icon_size: IconSize;
  bubble_style: BubbleStyle;
}

/**
 * Complete widget configuration (merged user + server config)
 */
export interface WidgetConfig extends WidgetUserConfig {
  appearance: AgentAppearanceConfig;
}

/**
 * Chat message structure
 */
export interface ChatMessage {
  role: "user" | "assistant" | "error";
  content: string;
  timestamp: Date;
}

/**
 * API response for config endpoint
 */
export interface ConfigApiResponse {
  data: AgentAppearanceConfig;
}

/**
 * API response for chat endpoint
 */
export interface ChatApiResponse {
  reply: string;
}

/**
 * Icon size to pixel dimension mapping
 */
export const ICON_SIZE_MAP: Record<IconSize, number> = {
  small: 48,
  medium: 60,
  large: 72,
};

declare global {
  interface Window {
    LEVEL_X_CONFIG?: WidgetUserConfig;
    LevelXWidget?: LevelXWidgetAPI;
  }
}

/**
 * Public API exposed on window.LevelXWidget
 */
export interface LevelXWidgetAPI {
  open(): void;
  close(): void;
  toggle(): void;
  sendMessage(message: string): Promise<void>;
  destroy(): void;
}
