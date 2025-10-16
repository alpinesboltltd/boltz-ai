"use client";

import { useState } from "react";
import { Spinner } from "@/components/common/Spinner";

interface TelegramIntegrationModalProps {
  chatagentId?: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function TelegramIntegrationModal({
  // chatagentId,
  isOpen,
  onClose,
  onSuccess,
}: TelegramIntegrationModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [botToken, setBotToken] = useState("");
  const [botUsername, setBotUsername] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validate bot token format
    if (!botToken.match(/^\d+:[A-Za-z0-9_-]+$/)) {
      setError(
        "Please enter a valid Telegram bot token (e.g., 123456789:ABCDefGhIJKlmNoPQRsTUVwxyZ)"
      );
      setLoading(false);
      return;
    }

    try {
      // In production, this would call the real API
      // await fetch(`/api/chatagents/${chatagentId}/integrations/telegram/configure`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ botToken, botUsername }),
      // });

      // For development, simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      onSuccess();
      onClose();
    } catch (err) {
      console.error("Failed to configure Telegram integration:", err);
      setError(
        "Failed to configure Telegram integration. Please check your bot token and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Connect Telegram Bot
        </h3>

        {error && (
          <div className="mb-4 rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="botToken"
                className="block text-sm font-medium text-gray-700"
              >
                Bot Token
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="botToken"
                  value={botToken}
                  onChange={(e) => setBotToken(e.target.value)}
                  className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="123456789:ABCDefGhIJKlmNoPQRsTUVwxyZ"
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="botUsername"
                className="block text-sm font-medium text-gray-700"
              >
                Bot Username
              </label>
              <div className="mt-1 flex">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                  @
                </span>
                <input
                  type="text"
                  id="botUsername"
                  value={botUsername}
                  onChange={(e) => setBotUsername(e.target.value)}
                  className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md focus:ring-primary-500 focus:border-primary-500 sm:text-sm border-gray-300"
                  placeholder="YourBotName_bot"
                  required
                />
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
            >
              {loading ? <Spinner size="sm" color="white" /> : "Connect"}
            </button>
          </div>
        </form>

        <div className="mt-4 pt-4 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-900">
            How to create a Telegram bot
          </h4>
          <ol className="mt-2 text-xs text-gray-500 list-decimal list-inside space-y-1">
            <li>Open Telegram and search for @BotFather</li>
            <li>Start a chat with BotFather and send the command /newbot</li>
            <li>Follow the instructions to create your bot</li>
            <li>BotFather will give you a token for your new bot</li>
            <li>Copy the token and paste it above</li>
          </ol>
          <p className="mt-2 text-xs text-gray-500">
            After connecting, you&apos;ll need to set a webhook URL in your bot
            settings. This will be done automatically when you click
            &quot;Connect&quot;.
          </p>
          <p className="mt-2 text-xs text-gray-500">
            Need help?{" "}
            <a
              href="https://core.telegram.org/bots#creating-a-new-bot"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-600 hover:text-primary-500"
            >
              Read the Telegram Bot documentation
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
