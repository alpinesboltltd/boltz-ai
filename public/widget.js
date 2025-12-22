(function () {
  "use strict";

  if (typeof window.LEVEL_X_CONFIG === "undefined") {
    console.error("LEVEL_X_CONFIG not found");
    return;
  }

  const config = window.LEVEL_X_CONFIG;

  // Helper to determine API URL from the script source
  function getApiUrl() {
    if (config.apiUrl) return config.apiUrl;
    try {
      const scripts = document.getElementsByTagName("script");
      for (let i = 0; i < scripts.length; i++) {
        if (scripts[i].src && scripts[i].src.includes("/widget.js")) {
          const url = new URL(scripts[i].src);
          return `${url.origin}/api/widget`;
        }
      }
    } catch (e) {
      console.warn("Failed to derive API URL from script source", e);
    }
    return "https://level-x.alpinesbolt.com/api/widget";
  }

  const apiUrl = getApiUrl();
  let botConfig = {};
  let isOpen = false;

  // Inject CSS styles
  function injectStyles() {
    const style = document.createElement("style");
    style.textContent = `
      #boltz-widget {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      }
      #boltz-bubble {
        position: fixed;
        width: 60px;
        height: 60px;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 9999;
        transition: transform 0.2s;
        background: var(--boltz-primary-color, #3B82F6);
      }
      #boltz-bubble:hover {
        transform: scale(1.05);
      }
      #boltz-chat {
        position: fixed;
        background: white;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.12);
        z-index: 9998;
        display: none;
        flex-direction: column;
        width: min(350px, calc(100vw - 20px));
        height: min(500px, calc(100vh - 120px));
        max-height: 80vh;
      }
      #boltz-chat-header {
        background: var(--boltz-primary-color, #3B82F6);
        color: white;
        padding: 16px;
        border-radius: 12px 12px 0 0;
        font-weight: 600;
        font-size: 16px;
      }
      #boltz-messages {
        flex: 1;
        padding: 16px;
        overflow-y: auto;
        min-height: 200px;
      }
      #boltz-input-container {
        padding: 12px 16px 16px;
        border-top: 1px solid #E5E7EB;
      }
      #boltz-input-form {
        display: flex;
        gap: 8px;
        align-items: stretch;
      }
      #boltz-input {
        flex: 1;
        padding: 10px 12px;
        border: 1px solid #D1D5DB;
        border-radius: 6px;
        outline: none;
        font-size: 14px;
        min-width: 0;
      }
      #boltz-input:focus {
        border-color: var(--boltz-primary-color, #3B82F6);
        box-shadow: 0 0 0 2px var(--boltz-primary-color-light, rgba(59, 130, 246, 0.1));
      }
      #boltz-send {
        background: var(--boltz-primary-color, #3B82F6);
        color: white;
        border: none;
        padding: 10px 16px;
        border-radius: 6px;
        cursor: pointer;
        font-size: 14px;
        font-weight: 500;
        white-space: nowrap;
      }
      #boltz-send:hover {
        opacity: 0.9;
      }
      .boltz-message {
        margin-bottom: 12px;
        word-wrap: break-word;
      }
      .boltz-message-content {
        padding: 10px 12px;
        border-radius: 8px;
        display: inline-block;
        max-width: 85%;
        font-size: 14px;
        line-height: 1.4;
      }
      .boltz-user-message {
        text-align: right;
      }
      .boltz-user-message .boltz-message-content {
        background: var(--boltz-primary-color, #3B82F6);
        color: white;
      }
      .boltz-bot-message .boltz-message-content {
        background: #F3F4F6;
        color: #374151;
      }
      .boltz-error-message .boltz-message-content {
        background: #FEE2E2;
        color: #DC2626;
      }
      @media (max-width: 480px) {
        #boltz-chat {
          width: calc(100vw - 20px);
          height: calc(100vh - 100px);
          border-radius: 12px 12px 0 0;
        }
        #boltz-input {
          font-size: 16px;
        }
        #boltz-send {
          padding: 10px 12px;
        }
      }
    `;
    document.head.appendChild(style);
  }

  // Fetch bot configuration
  async function fetchBotConfig() {
    try {
      // Use the script's origin or current origin for the API call
      // config.apiUrl is now expected to be the base URL of the client app (e.g. https://client.com/api/widget)
      // or we just use relative path if we assume widget is on same domain or we construct it.
      // But typically widget is embedded elsewhere.
      // Let's assume apiUrl passed in config points to the client API base (e.g. https://lx-client.com/api/widget)

      const baseUrl = apiUrl.endsWith("/") ? apiUrl.slice(0, -1) : apiUrl;
      const response = await fetch(`${baseUrl}/config?agentId=${config.id}`);

      if (!response.ok) throw new Error("Failed to load config");

      const data = await response.json();
      console.log("Widget Config Data:", data.data);
      botConfig = data.data;
    } catch (error) {
      console.error("Failed to fetch bot config:", error);
      // Fallback removed as requested
      botConfig = {};
    }
  }

  // ... (createWidget remains same) ...

  // Send message
  function sendMessage() {
    const input = document.getElementById("boltz-input");
    const messages = document.getElementById("boltz-messages");
    const message = input.value.trim();

    if (!message) return;

    // Add user message
    const userMsg = document.createElement("div");
    userMsg.className = "boltz-message boltz-user-message";
    userMsg.innerHTML = `<div class="boltz-message-content">${message}</div>`;
    messages.appendChild(userMsg);

    input.value = "";
    messages.scrollTop = messages.scrollHeight;

    const baseUrl = apiUrl.endsWith("/") ? apiUrl.slice(0, -1) : apiUrl;

    // Send to API
    fetch(`${baseUrl}/api/v1/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: message,
        agentId: config.id,
      }),
    })
      .then(async (res) => {
        const ct = res.headers.get("content-type") || "";
        if (!res.ok) {
          throw new Error(`Chat API error ${res.status}`);
        }
        if (/application\/json/i.test(ct)) {
          return res.json();
        }
        return { reply: await res.text() };
      })
      .then((data) => {
        const botMsg = document.createElement("div");
        botMsg.className = "boltz-message boltz-bot-message";
        botMsg.innerHTML = `<div class="boltz-message-content">${data.reply || "Sorry, I could not process your request."}</div>`;
        messages.appendChild(botMsg);
        messages.scrollTop = messages.scrollHeight;
      })
      .catch((err) => {
        console.error("Chat error:", err);
        const errorMsg = document.createElement("div");
        errorMsg.className = "boltz-message boltz-error-message";
        errorMsg.innerHTML = `<div class="boltz-message-content">Sorry, something went wrong. Please try again.</div>`;
        messages.appendChild(errorMsg);
        messages.scrollTop = messages.scrollHeight;
      });
  }

  // Initialize widget
  async function init() {
    injectStyles();
    await fetchBotConfig();
    createWidget();

    // Event listeners
    document
      .getElementById("boltz-bubble")
      .addEventListener("click", toggleChat);
    document
      .getElementById("boltz-send")
      .addEventListener("click", sendMessage);
    document
      .getElementById("boltz-input")
      .addEventListener("keypress", function (e) {
        if (e.key === "Enter") sendMessage();
      });
  }

  // Wait for DOM to be ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
