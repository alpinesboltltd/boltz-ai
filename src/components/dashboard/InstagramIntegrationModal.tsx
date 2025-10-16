"use client";

import { useState } from "react";
import { Spinner } from "@/components/common/Spinner";

interface InstagramIntegrationModalProps {
  chatagentId?: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function InstagramIntegrationModal({
  // chatagentId,
  isOpen,
  onClose,
  onSuccess,
}: InstagramIntegrationModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState(1);
  const [pageId, setPageId] = useState("");
  const [accessToken, setAccessToken] = useState("");

  if (!isOpen) return null;

  const handleConnectInstagram = async () => {
    setLoading(true);
    setError("");

    try {
      // In production, this would redirect to Facebook OAuth
      // window.location.href = `/api/integrations/instagram/oauth?chatagentId=${chatagentId}`;

      // For development, simulate OAuth flow
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setStep(2);
    } catch (err) {
      console.error("Failed to connect to Instagram:", err);
      setError("Failed to connect to Instagram. Please try again.");
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
      // await fetch(`/api/chatagents/${chatagentId}/integrations/instagram/configure`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ pageId, accessToken }),
      // });

      // For development, simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      onSuccess();
      onClose();
    } catch (err) {
      console.error("Failed to configure Instagram integration:", err);
      setError(
        "Failed to configure Instagram integration. Please check your credentials and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Connect Instagram Direct Messages
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
              Connect your chatagent to Instagram Direct Messages to engage with
              customers directly on Instagram.
            </p>

            <div className="space-y-4">
              <div className="bg-pink-50 p-4 rounded-md">
                <h4 className="text-sm font-medium text-pink-800">
                  Before you connect
                </h4>
                <ul className="mt-2 text-xs text-pink-700 list-disc list-inside space-y-1">
                  <li>
                    You need to have a Facebook Page connected to an Instagram
                    Professional account
                  </li>
                  <li>You must be an admin of the Facebook Page</li>
                  <li>
                    Your Facebook app needs Instagram messaging permissions
                  </li>
                </ul>
              </div>

              <button
                type="button"
                onClick={handleConnectInstagram}
                disabled={loading}
                className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:opacity-50"
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
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                    Connect with Instagram
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
                  htmlFor="pageId"
                  className="block text-sm font-medium text-gray-700"
                >
                  Instagram Business Account ID
                </label>
                <input
                  type="text"
                  id="pageId"
                  value={pageId}
                  onChange={(e) => setPageId(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  placeholder="123456789012345"
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
                  type="password"
                  id="accessToken"
                  value={accessToken}
                  onChange={(e) => setAccessToken(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  placeholder="Your Instagram Access Token"
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
            How to find your Instagram credentials
          </h4>
          <ol className="mt-2 text-xs text-gray-500 list-decimal list-inside space-y-1">
            <li>Make sure your Instagram account is a Professional account</li>
            <li>Connect your Instagram account to a Facebook Page</li>
            <li>Create a Facebook App with Instagram Messaging permissions</li>
            <li>
              Get your Instagram Business Account ID from the Facebook Graph API
            </li>
            <li>
              Generate a long-lived access token with the
              instagram_manage_messages permission
            </li>
          </ol>
          <p className="mt-2 text-xs text-gray-500">
            Need help?{" "}
            <a
              href="https://developers.facebook.com/docs/instagram-api/getting-started"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-600 hover:text-primary-500"
            >
              Read the Instagram API documentation
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
