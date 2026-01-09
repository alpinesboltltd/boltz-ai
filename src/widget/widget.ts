import type {
  WidgetUserConfig,
  AgentAppearanceConfig,
  ChatMessage,
  LevelXWidgetAPI,
} from "./types";
import { WidgetAPI } from "./api";
import { injectStyles, removeStyles } from "./styles";
import {
  createWidgetContainer,
  createBubble,
  createChatWindow,
  addMessage,
  showTypingIndicator,
  hideTypingIndicator,
  toggleChatWindow,
  setSendButtonLoading,
  destroyWidget,
} from "./dom";

/**
 * Level-X Chat Widget
 * A customizable chat widget that integrates with agent-specific configuration
 */
export class LevelXWidget implements LevelXWidgetAPI {
  private config: WidgetUserConfig;
  private appearance: AgentAppearanceConfig | null = null;
  private api: WidgetAPI;
  private isOpen = false;
  private isInitialized = false;
  private container: HTMLDivElement | null = null;
  private styleElement: HTMLStyleElement | null = null;

  constructor(config: WidgetUserConfig) {
    this.config = config;
    this.api = new WidgetAPI(config.id, config.apiUrl);
  }

  /**
   * Initialize the widget
   */
  async init(): Promise<void> {
    if (this.isInitialized) {
      console.warn("[LevelX] Widget already initialized");
      return;
    }

    try {
      // Fetch agent configuration
      this.appearance = await this.api.fetchConfig();

      // Inject styles
      this.styleElement = injectStyles(this.appearance);

      // Create widget elements
      this.container = createWidgetContainer();

      const bubble = createBubble(() => this.toggle());
      this.container.appendChild(bubble);

      const chat = createChatWindow(
        this.appearance,
        () => this.close(),
        (message) => this.sendMessage(message)
      );
      this.container.appendChild(chat);

      // Add welcome message if configured
      if (this.appearance.welcome_message) {
        addMessage({
          role: "assistant",
          content: this.appearance.welcome_message,
          timestamp: new Date(),
        });
      }

      this.isInitialized = true;
      console.log("[LevelX] Widget initialized successfully");
    } catch (error) {
      console.error("[LevelX] Failed to initialize widget:", error);
      throw error;
    }
  }

  /**
   * Open the chat window
   */
  open(): void {
    if (!this.isInitialized) {
      console.warn("[LevelX] Widget not initialized");
      return;
    }

    this.isOpen = true;
    toggleChatWindow(true);
  }

  /**
   * Close the chat window
   */
  close(): void {
    if (!this.isInitialized) {
      console.warn("[LevelX] Widget not initialized");
      return;
    }

    this.isOpen = false;
    toggleChatWindow(false);
  }

  /**
   * Toggle the chat window
   */
  toggle(): void {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  /**
   * Send a message to the agent
   */
  async sendMessage(message: string): Promise<void> {
    if (!this.isInitialized || !message.trim()) {
      return;
    }

    // Add user message
    addMessage({
      role: "user",
      content: message,
      timestamp: new Date(),
    });

    // Show loading state
    setSendButtonLoading(true);
    showTypingIndicator();

    try {
      const reply = await this.api.sendMessage(message);

      hideTypingIndicator();

      addMessage({
        role: "assistant",
        content: reply,
        timestamp: new Date(),
      });
    } catch (error) {
      console.error("[LevelX] Failed to send message:", error);

      hideTypingIndicator();

      addMessage({
        role: "error",
        content: "Sorry, something went wrong. Please try again.",
        timestamp: new Date(),
      });
    } finally {
      setSendButtonLoading(false);
    }
  }

  /**
   * Destroy the widget and clean up
   */
  destroy(): void {
    removeStyles();
    destroyWidget();
    this.isInitialized = false;
    this.isOpen = false;
    this.container = null;
    this.styleElement = null;
    console.log("[LevelX] Widget destroyed");
  }
}
