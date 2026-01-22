import type { AgentAppearanceConfig, ChatMessage } from "./types";
import { marked } from "marked";
import DOMPurify from "isomorphic-dompurify";

/**
 * SVG icons used in the widget
 */
const ICONS = {
  chat: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
  close: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
  send: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>`,
};

/**
 * Create the widget container element
 */
export function createWidgetContainer(): HTMLDivElement {
  const container = document.createElement("div");
  container.id = "lx-widget";
  document.body.appendChild(container);
  return container;
}

/**
 * Create the floating bubble button
 */
export function createBubble(onClick: () => void): HTMLButtonElement {
  const bubble = document.createElement("button");
  bubble.id = "lx-bubble";
  bubble.setAttribute("aria-label", "Open chat");
  bubble.innerHTML = ICONS.chat;
  bubble.addEventListener("click", onClick);
  return bubble;
}

/**
 * Create the chat window element
 */
export function createChatWindow(
  config: AgentAppearanceConfig,
  onClose: () => void,
  onSubmit: (message: string) => void
): HTMLDivElement {
  const chat = document.createElement("div");
  chat.id = "lx-chat";
  chat.setAttribute("role", "dialog");
  chat.setAttribute("aria-label", "Chat window");

  chat.innerHTML = `
    <div id="lx-chat-header">
      <span>${escapeHtml(config.name || "Chat with us")}</span>
      <button id="lx-close" aria-label="Close chat">${ICONS.close}</button>
    </div>
    <div id="lx-messages" role="log" aria-live="polite"></div>
    <div id="lx-input-container">
      <form id="lx-input-form">
        <input
          type="text"
          id="lx-input"
          placeholder="Type your message..."
          autocomplete="off"
          aria-label="Message input"
        />
        <button type="submit" id="lx-send" aria-label="Send message">
          ${ICONS.send}
        </button>
      </form>
    </div>
  `;

  // Close button handler
  const closeBtn = chat.querySelector("#lx-close") as HTMLButtonElement;
  closeBtn.addEventListener("click", onClose);

  // Form submit handler
  const form = chat.querySelector("#lx-input-form") as HTMLFormElement;
  const input = chat.querySelector("#lx-input") as HTMLInputElement;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const message = input.value.trim();
    if (message) {
      onSubmit(message);
      input.value = "";
    }
  });

  return chat;
}

/**
 * Add a message to the chat window
 */
export function addMessage(message: ChatMessage): HTMLDivElement {
  const messages = document.getElementById("lx-messages");
  if (!messages) return document.createElement("div");

  const msgDiv = document.createElement("div");
  msgDiv.className = `lx-message lx-message-${message.role}`;
  const html = DOMPurify.sanitize(marked.parse(message.content) as string);
  msgDiv.innerHTML = `<div class="lx-message-content">${html}</div>`;

  messages.appendChild(msgDiv);
  messages.scrollTop = messages.scrollHeight;

  return msgDiv;
}

/**
 * Show typing indicator
 */
export function showTypingIndicator(): HTMLDivElement {
  const messages = document.getElementById("lx-messages");
  if (!messages) return document.createElement("div");

  const typing = document.createElement("div");
  typing.id = "lx-typing";
  typing.className = "lx-message lx-message-assistant";
  typing.innerHTML = `
    <div class="lx-message-content lx-typing">
      <span></span><span></span><span></span>
    </div>
  `;

  messages.appendChild(typing);
  messages.scrollTop = messages.scrollHeight;

  return typing;
}

/**
 * Remove typing indicator
 */
export function hideTypingIndicator(): void {
  const typing = document.getElementById("lx-typing");
  if (typing) {
    typing.remove();
  }
}

/**
 * Toggle chat window visibility
 */
export function toggleChatWindow(open: boolean): void {
  const chat = document.getElementById("lx-chat");
  const bubble = document.getElementById("lx-bubble");

  if (chat) {
    chat.classList.toggle("lx-open", open);
  }

  if (bubble) {
    bubble.setAttribute("aria-label", open ? "Close chat" : "Open chat");
    bubble.innerHTML = open ? ICONS.close : ICONS.chat;
  }

  // Focus input when opening
  if (open) {
    const input = document.getElementById("lx-input") as HTMLInputElement;
    if (input) {
      setTimeout(() => input.focus(), 100);
    }
  }
}

/**
 * Set send button loading state
 */
export function setSendButtonLoading(loading: boolean): void {
  const sendBtn = document.getElementById("lx-send") as HTMLButtonElement;
  const input = document.getElementById("lx-input") as HTMLInputElement;

  if (sendBtn) {
    sendBtn.disabled = loading;
  }
  if (input) {
    input.disabled = loading;
  }
}

/**
 * Remove all widget elements from DOM
 */
export function destroyWidget(): void {
  const container = document.getElementById("lx-widget");
  if (container) {
    container.remove();
  }
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text: string): string {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}
