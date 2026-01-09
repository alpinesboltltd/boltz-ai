import type {
  AgentAppearanceConfig,
  IconSize,
  BubbleStyle,
  Position,
} from "./types";
import { ICON_SIZE_MAP } from "./types";

/**
 * Generate CSS styles based on agent appearance configuration
 */
export function generateStyles(config: AgentAppearanceConfig): string {
  const primaryColor = config.primary_color || "#3B82F6";
  const fontFamily =
    config.font_family ||
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  const iconSize = ICON_SIZE_MAP[config.icon_size] || 60;
  const borderRadius = getBorderRadius(config.bubble_style);
  const position = getPositionStyles(config.position);

  return `
    #lx-widget {
      font-family: ${fontFamily};
      --lx-primary: ${primaryColor};
      --lx-primary-light: ${hexToRgba(primaryColor, 0.1)};
    }

    #lx-bubble {
      position: fixed;
      width: ${iconSize}px;
      height: ${iconSize}px;
      border-radius: ${borderRadius};
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 9999;
      transition: transform 0.2s, box-shadow 0.2s;
      background: var(--lx-primary);
      color: white;
      border: none;
      ${position.bubble}
    }

    #lx-bubble:hover {
      transform: scale(1.05);
      box-shadow: 0 6px 16px rgba(0,0,0,0.2);
    }

    #lx-bubble:focus {
      outline: 2px solid var(--lx-primary);
      outline-offset: 2px;
    }

    #lx-bubble svg {
      width: ${iconSize * 0.5}px;
      height: ${iconSize * 0.5}px;
      fill: currentColor;
    }

    #lx-chat {
      position: fixed;
      background: white;
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.12);
      z-index: 9998;
      display: none;
      flex-direction: column;
      width: min(380px, calc(100vw - 24px));
      height: min(520px, calc(100vh - 120px));
      max-height: 80vh;
      overflow: hidden;
      ${position.chat}
    }

    #lx-chat.lx-open {
      display: flex;
    }

    #lx-chat-header {
      background: var(--lx-primary);
      color: white;
      padding: 16px 20px;
      border-radius: 12px 12px 0 0;
      font-weight: 600;
      font-size: 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-shrink: 0;
    }

    #lx-chat-header button {
      background: none;
      border: none;
      color: white;
      cursor: pointer;
      padding: 4px;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    #lx-chat-header button:hover {
      background: rgba(255,255,255,0.2);
    }

    #lx-messages {
      flex: 1;
      padding: 16px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    #lx-messages::-webkit-scrollbar {
      width: 6px;
    }

    #lx-messages::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 3px;
    }

    #lx-messages::-webkit-scrollbar-thumb {
      background: #c1c1c1;
      border-radius: 3px;
    }

    .lx-message {
      display: flex;
      flex-direction: column;
      max-width: 85%;
    }

    .lx-message-content {
      padding: 10px 14px;
      border-radius: 12px;
      font-size: 14px;
      line-height: 1.5;
      word-wrap: break-word;
    }

    .lx-message-user {
      align-self: flex-end;
    }

    .lx-message-user .lx-message-content {
      background: var(--lx-primary);
      color: white;
      border-bottom-right-radius: 4px;
    }

    .lx-message-assistant {
      align-self: flex-start;
    }

    .lx-message-assistant .lx-message-content {
      background: #F3F4F6;
      color: #374151;
      border-bottom-left-radius: 4px;
    }

    .lx-message-error .lx-message-content {
      background: #FEE2E2;
      color: #DC2626;
    }

    #lx-input-container {
      padding: 12px 16px 16px;
      border-top: 1px solid #E5E7EB;
      flex-shrink: 0;
    }

    #lx-input-form {
      display: flex;
      gap: 8px;
      align-items: stretch;
    }

    #lx-input {
      flex: 1;
      padding: 10px 14px;
      border: 1px solid #D1D5DB;
      border-radius: 8px;
      outline: none;
      font-size: 14px;
      font-family: inherit;
      min-width: 0;
      transition: border-color 0.2s, box-shadow 0.2s;
    }

    #lx-input:focus {
      border-color: var(--lx-primary);
      box-shadow: 0 0 0 3px var(--lx-primary-light);
    }

    #lx-send {
      background: var(--lx-primary);
      color: white;
      border: none;
      padding: 10px 16px;
      border-radius: 8px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
      font-family: inherit;
      white-space: nowrap;
      transition: opacity 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    #lx-send:hover {
      opacity: 0.9;
    }

    #lx-send:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    #lx-send svg {
      width: 18px;
      height: 18px;
    }

    .lx-typing {
      display: flex;
      gap: 4px;
      padding: 12px 14px;
    }

    .lx-typing span {
      width: 8px;
      height: 8px;
      background: #9CA3AF;
      border-radius: 50%;
      animation: lx-bounce 1.4s infinite ease-in-out;
    }

    .lx-typing span:nth-child(1) { animation-delay: -0.32s; }
    .lx-typing span:nth-child(2) { animation-delay: -0.16s; }
    .lx-typing span:nth-child(3) { animation-delay: 0s; }

    @keyframes lx-bounce {
      0%, 80%, 100% { transform: translateY(0); }
      40% { transform: translateY(-6px); }
    }

    @media (max-width: 480px) {
      #lx-chat {
        width: calc(100vw - 16px);
        height: calc(100vh - 80px);
        border-radius: 12px 12px 0 0;
        bottom: 0 !important;
        left: 8px !important;
        right: 8px !important;
      }

      #lx-input {
        font-size: 16px; /* Prevent iOS zoom */
      }
    }
  `;
}

function getBorderRadius(style: BubbleStyle): string {
  return style === "square" ? "12px" : "50%";
}

function getPositionStyles(position: Position): {
  bubble: string;
  chat: string;
} {
  const isRight = position === "bottom-right";
  return {
    bubble: isRight
      ? "bottom: 20px; right: 20px;"
      : "bottom: 20px; left: 20px;",
    chat: isRight
      ? "bottom: 100px; right: 20px;"
      : "bottom: 100px; left: 20px;",
  };
}

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * Inject styles into the document head
 */
export function injectStyles(config: AgentAppearanceConfig): HTMLStyleElement {
  const style = document.createElement("style");
  style.id = "lx-widget-styles";
  style.textContent = generateStyles(config);
  document.head.appendChild(style);
  return style;
}

/**
 * Remove injected styles
 */
export function removeStyles(): void {
  const style = document.getElementById("lx-widget-styles");
  if (style) {
    style.remove();
  }
}
