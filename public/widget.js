(function () {
  "use strict";

  if (typeof window.LEVEL_X_CONFIG === "undefined") {
    console.error("LEVEL_X_CONFIG not found");
    return;
  }

  const config = window.LEVEL_X_CONFIG;
  const apiUrl = config.apiUrl || "http://localhost:3000/api";
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
      // Fetch agent data
      const agentResponse = await fetch(`${apiUrl}/chatagents/${config.id}`);
      const agentData = await agentResponse.json();
      // Fetch appearance data
      const appearanceResponse = await fetch(
        `${apiUrl}/chatagents/${config.id}/appearance`
      );
      const appearanceData = await appearanceResponse.json();
      // TODO: CORRECT IMPLEMENTATION OF AGENT APPEARANCE
      botConfig = {
        name: agentData.data?.name || "Chat with us",
        ...appearanceData.data,
      };
    } catch (error) {
      console.error("Failed to fetch bot config:", error);
      botConfig = {
        name: "Chat with us",
        primary_color: "#3B82F6",
        welcome_message: "Hello! How can I help you today?",
        position: "bottom-right",
      };
    }
  }

  // Create widget HTML
  function createWidget() {
    const primaryColor = botConfig.primary_color || "#3B82F6";
    const position = botConfig.position || "bottom-right";
    const welcomeMessage =
      botConfig.welcome_message || "Hello! How can I help you today?";

    // Set CSS custom properties for dynamic colors
    document.documentElement.style.setProperty(
      "--boltz-primary-color",
      primaryColor
    );
    // Create a lighter version for focus states
    // const lightColor = primaryColor + "20"; // Add transparency
    document.documentElement.style.setProperty(
      "--boltz-primary-color-light",
      `${primaryColor}20`
    );

    const positionStyles =
      position === "bottom-left"
        ? "bottom: 20px; left: 20px;"
        : "bottom: 20px; right: 20px;";

    const chatPositionStyles =
      position === "bottom-left"
        ? "bottom: 90px; left: 10px;"
        : "bottom: 90px; right: 10px;";

    const widget = document.createElement("div");
    widget.id = "boltz-widget";
    widget.innerHTML = `
      <div id="boltz-bubble" style="${positionStyles}">
        <span style="color: white; font-size: 24px;">💬</span>
      </div>
      <div id="boltz-chat" style="${chatPositionStyles}">
        <div id="boltz-chat-header">
          ${botConfig.name || "Chat with us"}
        </div>
        <div id="boltz-messages">
          <div class="boltz-message boltz-bot-message">
            <div class="boltz-message-content">
              ${welcomeMessage}
            </div>
          </div>
        </div>
        <div id="boltz-input-container">
          <div id="boltz-input-form">
            <input id="boltz-input" type="text" placeholder="Type your message...">
            <button id="boltz-send">Send</button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(widget);
  }

  // Toggle chat window
  function toggleChat() {
    const chat = document.getElementById("boltz-chat");
    const bubble = document.getElementById("boltz-bubble");

    if (isOpen) {
      chat.style.display = "none";
      bubble.innerHTML =
        '<span style="color: white; font-size: 24px;">💬</span>';
    } else {
      chat.style.display = "flex";
      bubble.innerHTML =
        '<span style="color: white; font-size: 20px;">✕</span>';
    }
    isOpen = !isOpen;
  }

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

    // Send to API
    fetch(`${apiUrl}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: message,
        history: [],
        agentId: config.id,
      }),
    })
      .then(async (res) => {
        const ct = res.headers.get("content-type") || "";
        if (!res.ok) {
          const text = await res.text().catch(() => "<no body>");
          throw new Error(
            `Chat API error ${res.status}: ${text.substring(0, 200)}`
          );
        }
        if (/application\/json/i.test(ct)) {
          return res.json();
        }
        const text = await res.text().catch(() => "");
        return { reply: text || "No response" };
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
