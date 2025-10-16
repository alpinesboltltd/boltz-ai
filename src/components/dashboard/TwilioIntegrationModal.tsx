/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Spinner } from "@/components/common/Spinner";

interface TwilioIntegrationModalProps {
  chatagentId?: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function TwilioIntegrationModal({
  // chatagentId,
  isOpen,
  onClose,
  onSuccess,
}: TwilioIntegrationModalProps) {
  const [accountSid, setAccountSid] = useState("");
  const [authToken, setAuthToken] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // In production, this would call the real API
      // await integrationsAPI.configureTwilio(chatagentId, phoneNumber, accountSid, authToken);

      // For development, simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      onSuccess();
      onClose();
    } catch (err) {
      console.error("Failed to configure Twilio:", err);
      setError(
        "Failed to configure Twilio integration. Please check your credentials and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Connect Twilio Phone Number
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
                htmlFor="accountSid"
                className="block text-sm font-medium text-gray-700"
              >
                Twilio Account SID
              </label>
              <input
                type="text"
                id="accountSid"
                value={accountSid}
                onChange={(e) => setAccountSid(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                placeholder="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                required
              />
            </div>

            <div>
              <label
                htmlFor="authToken"
                className="block text-sm font-medium text-gray-700"
              >
                Twilio Auth Token
              </label>
              <input
                type="password"
                id="authToken"
                value={authToken}
                onChange={(e) => setAuthToken(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                placeholder="Your Twilio Auth Token"
                required
              />
            </div>

            <div>
              <label
                htmlFor="phoneNumber"
                className="block text-sm font-medium text-gray-700"
              >
                Twilio Phone Number
              </label>
              <input
                type="text"
                id="phoneNumber"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                placeholder="+1234567890"
                required
              />
              <p className="mt-1 text-xs text-gray-500">
                Enter the phone number in E.164 format (e.g., +1234567890)
              </p>
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
            How to find your Twilio credentials
          </h4>
          <ol className="mt-2 text-xs text-gray-500 list-decimal list-inside space-y-1">
            <li>Log in to your Twilio account</li>
            <li>Go to the Twilio Console Dashboard</li>
            <li>
              Your Account SID and Auth Token are displayed on the dashboard
            </li>
            <li>
              Purchase a phone number from the Phone Numbers section if you
              don&#39;t have one
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
}
