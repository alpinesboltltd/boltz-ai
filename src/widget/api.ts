import type {
  AgentAppearanceConfig,
  ConfigApiResponse,
  ChatApiResponse,
} from "./types";

/**
 * Widget API client for communicating with the backend
 */
export class WidgetAPI {
  private baseUrl: string;
  private agentId: string;

  constructor(agentId: string, apiUrl?: string) {
    this.agentId = agentId;
    this.baseUrl = this.resolveApiUrl(apiUrl);
  }

  /**
   * Resolve the API URL from config or script source
   */
  private resolveApiUrl(configUrl?: string): string {
    if (configUrl) {
      return configUrl.replace(/\/$/, "");
    }

    try {
      const scripts = document.getElementsByTagName("script");
      for (let i = 0; i < scripts.length; i++) {
        const src = scripts[i].src;
        if (src && src.includes("/widget.js")) {
          const url = new URL(src);
          return `${url.origin}/api/widget`;
        }
      }
    } catch (e) {
      console.warn("[LevelX] Failed to derive API URL from script source", e);
    }

    return "https://level-x.alpinesbolt.com/api/widget";
  }

  /**
   * Fetch agent configuration from the server
   */
  async fetchConfig(): Promise<AgentAppearanceConfig> {
    const response = await fetch(
      `${this.baseUrl}/config?agentId=${this.agentId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch config: ${response.status}`);
    }

    const data: ConfigApiResponse = await response.json();
    return data.data;
  }

  /**
   * Send a chat message and get a response
   */
  async sendMessage(message: string): Promise<string> {
    const response = await fetch(`${this.baseUrl}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message,
        agentId: this.agentId,
      }),
    });

    if (!response.ok) {
      throw new Error(`Chat API error: ${response.status}`);
    }

    const contentType = response.headers.get("content-type") || "";

    if (/application\/json/i.test(contentType)) {
      const data: ChatApiResponse = await response.json();
      return data.reply || "Sorry, I could not process your request.";
    }

    return await response.text();
  }
}
