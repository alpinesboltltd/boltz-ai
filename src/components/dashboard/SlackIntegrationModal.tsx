"use client";

import { useState } from "react";
import { Spinner } from "@/components/common/Spinner";

interface SlackIntegrationModalProps {
  chatagentId?: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function SlackIntegrationModal({
  // chatagentId,
  isOpen,
  onClose,
  onSuccess,
}: SlackIntegrationModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState(1);
  const [botToken, setBotToken] = useState("");
  const [signingSecret, setSigningSecret] = useState("");

  if (!isOpen) return null;

  const handleConnectSlack = async () => {
    setLoading(true);
    setError("");

    try {
      // In production, this would redirect to Slack OAuth
      // window.location.href = `/api/integrations/slack/oauth?chatagentId=${chatagentId}`;

      // For development, simulate OAuth flow
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setStep(2);
    } catch (err) {
      console.error("Failed to connect to Slack:", err);
      setError("Failed to connect to Slack. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // In production, this would call the real API
      // await fetch(`/api/chatagents/${chatagentId}/integrations/slack/configure`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ botToken, signingSecret }),
      // });

      // For development, simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      onSuccess();
      onClose();
    } catch (err) {
      console.error("Failed to configure Slack integration:", err);
      setError(
        "Failed to configure Slack integration. Please check your credentials and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Connect Slack
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

        {step === 1 ? (
          <div>
            <p className="text-sm text-gray-500 mb-6">
              Connect your chatagent to Slack to provide support and assistance
              directly in your workspace.
            </p>

            <div className="space-y-4">
              <div className="bg-purple-50 p-4 rounded-md">
                <h4 className="text-sm font-medium text-purple-800">
                  Before you connect
                </h4>
                <ul className="mt-2 text-xs text-purple-700 list-disc list-inside space-y-1">
                  <li>You need to create a Slack app in your workspace</li>
                  <li>
                    Your app needs bot and interactive message permissions
                  </li>
                  <li>You must be a workspace admin to install the app</li>
                </ul>
              </div>

              <button
                type="button"
                onClick={handleConnectSlack}
                disabled={loading}
                className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
              >
                {loading ? (
                  <Spinner size="sm" color="white" />
                ) : (
                  <>
                    <svg
                      className="h-5 w-5 mr-2"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M6 15a2 2 0 100-4 2 2 0 000 4zm0-6a2 2 0 100-4 2 2 0 000 4zm6 0a2 2 0 100-4 2 2 0 000 4zm8 0a2 2 0 100-4 2 2 0 000 4zm-8 6a2 2 0 100-4 2 2 0 000 4zm8 0a2 2 0 100-4 2 2 0 000 4z" />
                    </svg>
                    Connect with Slack
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="botToken"
                  className="block text-sm font-medium text-gray-700"
                >
                  Bot Token
                </label>
                <input
                  type="text"
                  id="botToken"
                  value={botToken}
                  onChange={(e) => setBotToken(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  placeholder="xoxb-..."
                  required
                />
                <p className="mt-1 text-xs text-gray-500">
                  Starts with &quot;xoxb-&quot;
                </p>
              </div>

              <div>
                <label
                  htmlFor="signingSecret"
                  className="block text-sm font-medium text-gray-700"
                >
                  Signing Secret
                </label>
                <input
                  type="password"
                  id="signingSecret"
                  value={signingSecret}
                  onChange={(e) => setSigningSecret(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  placeholder="Your Slack Signing Secret"
                  required
                />
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
        )}

        <div className="mt-4 pt-4 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-900">
            How to find your Slack credentials
          </h4>
          <ol className="mt-2 text-xs text-gray-500 list-decimal list-inside space-y-1">
            <li>
              Go to{" "}
              <a
                href="https://api.slack.com/apps"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 hover:text-primary-500"
              >
                api.slack.com/apps
              </a>
            </li>
            <li>Select your app or create a new one</li>
            <li>
              For Bot Token: Navigate to &quot;OAuth & Permissions&quot; and
              find it under &quot;Bot User OAuth Token&quot;
            </li>
            <li>
              For Signing Secret: Go to &quot;Basic Information&quot; and find
              it under &quot;App Credentials&quot;
            </li>
          </ol>
          <p className="mt-2 text-xs text-gray-500">
            Need help?{" "}
            <a
              href="https://api.slack.com/bot-users"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-600 hover:text-primary-500"
            >
              Read the Slack Bot documentation
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
