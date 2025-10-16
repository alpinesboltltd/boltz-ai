"use client";

import { useState } from "react";
import { Spinner } from "@/components/common/Spinner";

interface TwitterIntegrationModalProps {
  chatagentId?: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function TwitterIntegrationModal({
  // chatagentId,
  isOpen,
  onClose,
  onSuccess,
}: TwitterIntegrationModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState(1);
  const [apiKey, setApiKey] = useState("");
  const [apiKeySecret, setApiKeySecret] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [accessTokenSecret, setAccessTokenSecret] = useState("");

  if (!isOpen) return null;

  const handleConnectTwitter = async () => {
    setLoading(true);
    setError("");

    try {
      // In production, this would redirect to Twitter OAuth
      // window.location.href = `/api/integrations/twitter/oauth?chatagentId=${chatagentId}`;

      // For development, simulate OAuth flow
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setStep(2);
    } catch (err) {
      console.error("Failed to connect to Twitter:", err);
      setError("Failed to connect to Twitter. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // In production, this would call the real API
      // await fetch(`/api/chatagents/${chatagentId}/integrations/twitter/configure`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ apiKey, apiKeySecret, accessToken, accessTokenSecret }),
      // });

      // For development, simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      onSuccess();
      onClose();
    } catch (err) {
      console.error("Failed to configure Twitter integration:", err);
      setError(
        "Failed to configure Twitter integration. Please check your credentials and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Connect Twitter Direct Messages
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
              Connect your chatagent to Twitter Direct Messages to engage with
              customers directly on Twitter.
            </p>

            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-md">
                <h4 className="text-sm font-medium text-blue-800">
                  Before you connect
                </h4>
                <ul className="mt-2 text-xs text-blue-700 list-disc list-inside space-y-1">
                  <li>You need to have a Twitter Developer account</li>
                  <li>
                    You must create a Twitter App with Direct Message
                    permissions
                  </li>
                  <li>Your app needs to have OAuth 1.0a enabled</li>
                </ul>
              </div>

              <button
                type="button"
                onClick={handleConnectTwitter}
                disabled={loading}
                className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
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
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                    </svg>
                    Connect with Twitter
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
                  htmlFor="apiKey"
                  className="block text-sm font-medium text-gray-700"
                >
                  API Key (Consumer Key)
                </label>
                <input
                  type="text"
                  id="apiKey"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="apiKeySecret"
                  className="block text-sm font-medium text-gray-700"
                >
                  API Key Secret (Consumer Secret)
                </label>
                <input
                  type="password"
                  id="apiKeySecret"
                  value={apiKeySecret}
                  onChange={(e) => setApiKeySecret(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="accessToken"
                  className="block text-sm font-medium text-gray-700"
                >
                  Access Token
                </label>
                <input
                  type="text"
                  id="accessToken"
                  value={accessToken}
                  onChange={(e) => setAccessToken(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="accessTokenSecret"
                  className="block text-sm font-medium text-gray-700"
                >
                  Access Token Secret
                </label>
                <input
                  type="password"
                  id="accessTokenSecret"
                  value={accessTokenSecret}
                  onChange={(e) => setAccessTokenSecret(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
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
            How to find your Twitter credentials
          </h4>
          <ol className="mt-2 text-xs text-gray-500 list-decimal list-inside space-y-1">
            <li>
              Go to the{" "}
              <a
                href="https://developer.twitter.com/en/portal/dashboard"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 hover:text-primary-500"
              >
                Twitter Developer Portal
              </a>
            </li>
            <li>Create a new app or select an existing one</li>
            <li>Go to the &quot;Keys and tokens&quot; tab</li>
            <li>
              Find your API Key and API Key Secret under &quot;Consumer
              Keys&quot;
            </li>
            <li>
              Generate Access Token and Access Token Secret under
              &quot;Authentication Tokens&quote;
            </li>
          </ol>
          <p className="mt-2 text-xs text-gray-500">
            Need help?{" "}
            <a
              href="https://developer.twitter.com/en/docs/twitter-api/getting-started/getting-access-to-the-twitter-api"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-600 hover:text-primary-500"
            >
              Read the Twitter API documentation
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
