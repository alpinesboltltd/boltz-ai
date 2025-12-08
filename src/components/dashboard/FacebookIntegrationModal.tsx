/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Spinner } from "@/components/common/Spinner";

interface FacebookIntegrationModalProps {
  chatagentId?: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function FacebookIntegrationModal({
  // chatagentId,
  isOpen,
  onClose,
  onSuccess,
}: FacebookIntegrationModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState(1);
  const [pageId, setPageId] = useState("");
  const [accessToken, setAccessToken] = useState("");

  if (!isOpen) return null;

  const handleConnectFacebook = async () => {
    setLoading(true);
    setError("");

    try {
      // In production, this would redirect to Facebook OAuth
      // window.location.href = `/api/integrations/facebook/oauth?chatagentId=${chatagentId}`;

      // For development, simulate OAuth flow
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setStep(2);
    } catch (err) {
      console.error("Failed to connect to Facebook:", err);
      setError("Failed to connect to Facebook. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // In production, this would call the real API
      // await fetch(`/api/chatagents/${chatagentId}/integrations/facebook/configure`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ pageId, accessToken }),
      // });

      // For development, simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      onSuccess();
      onClose();
    } catch (err) {
      console.error("Failed to configure Facebook integration:", err);
      setError(
        "Failed to configure Facebook integration. Please check your credentials and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Connect Facebook Messenger
        </h3>

        {error && (
          <div className="mb-4 rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="shrink-0">
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
              Connect your chatagent to Facebook Messenger to engage with
              customers directly on Facebook.
            </p>

            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-md">
                <h4 className="text-sm font-medium text-blue-800">
                  Before you connect
                </h4>
                <ul className="mt-2 text-xs text-blue-700 list-disc list-inside space-y-1">
                  <li>You need to have a Facebook Page</li>
                  <li>You must be an admin of the Facebook Page</li>
                  <li>Your Facebook app needs Messenger permissions</li>
                </ul>
              </div>

              <button
                type="button"
                onClick={handleConnectFacebook}
                disabled={loading}
                className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
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
                      <path d="M12 2.04C6.5 2.04 2 6.53 2 12.06C2 17.06 5.66 21.21 10.44 21.96V14.96H7.9V12.06H10.44V9.85C10.44 7.34 11.93 5.96 14.22 5.96C15.31 5.96 16.45 6.15 16.45 6.15V8.62H15.19C13.95 8.62 13.56 9.39 13.56 10.18V12.06H16.34L15.89 14.96H13.56V21.96C15.9 21.59 18.03 20.39 19.6 18.57C21.17 16.76 22.04 14.43 22 12.06C22 6.53 17.5 2.04 12 2.04Z" />
                    </svg>
                    Connect with Facebook
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
                  Facebook Page ID
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
                  Page Access Token
                </label>
                <input
                  type="password"
                  id="accessToken"
                  value={accessToken}
                  onChange={(e) => setAccessToken(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  placeholder="Your Page Access Token"
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
            How to find your Facebook Page ID
          </h4>
          <ol className="mt-2 text-xs text-gray-500 list-decimal list-inside space-y-1">
            <li>Go to your Facebook Page</li>
            <li>Click on &apos;About&apos; in the left sidebar</li>
            <li>Scroll down to find your Page ID</li>
            <li>
              For the access token, you&#39;ll need to create a Facebook App in
              the Meta for Developers portal
            </li>
          </ol>
          <p className="mt-2 text-xs text-gray-500">
            Need help?{" "}
            <a
              href="https://developers.facebook.com/docs/messenger-platform/getting-started"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-600 hover:text-primary-500"
            >
              Read the Facebook Messenger API documentation
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
