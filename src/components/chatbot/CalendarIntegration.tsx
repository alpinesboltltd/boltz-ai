"use client";

import { useState } from "react";
import { CalendarIcon, CheckIcon } from "@heroicons/react/24/outline";

interface CalendarIntegrationProps {
  onSubmit: (data: CalendarIntegrationData) => void;
}

export interface CalendarIntegrationData {
  provider: "calendly" | "google" | "cal";
  settings: {
    apiKey?: string;
    username?: string;
    clientId?: string;
    clientSecret?: string;
  };
}

export function CalendarIntegration({ onSubmit }: CalendarIntegrationProps) {
  const [provider, setProvider] = useState<"calendly" | "google" | "cal">(
    "calendly"
  );
  const [apiKey, setApiKey] = useState("");
  const [username, setUsername] = useState("");
  const [clientId, setClientId] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [isConnected, setIsConnected] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const settings = {
      ...(provider === "calendly" && { apiKey, username }),
      ...(provider === "google" && { clientId, clientSecret }),
      ...(provider === "cal" && { apiKey }),
    };

    onSubmit({
      provider,
      settings,
    });

    // In a real app, this would verify the connection
    setIsConnected(true);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 my-4">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        Calendar Integration
      </h3>

      {!isConnected ? (
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Calendar Provider
              </label>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <input
                    type="radio"
                    id="calendly"
                    name="provider"
                    value="calendly"
                    checked={provider === "calendly"}
                    onChange={() => setProvider("calendly")}
                    className="sr-only"
                  />
                  <label
                    htmlFor="calendly"
                    className={`flex flex-col items-center p-3 border rounded-md cursor-pointer ${
                      provider === "calendly"
                        ? "border-primary-500 bg-primary-50"
                        : "border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <CalendarIcon className="h-6 w-6 text-gray-400" />
                    <span className="mt-2 text-sm font-medium">Calendly</span>
                  </label>
                </div>

                <div>
                  <input
                    type="radio"
                    id="google"
                    name="provider"
                    value="google"
                    checked={provider === "google"}
                    onChange={() => setProvider("google")}
                    className="sr-only"
                  />
                  <label
                    htmlFor="google"
                    className={`flex flex-col items-center p-3 border rounded-md cursor-pointer ${
                      provider === "google"
                        ? "border-primary-500 bg-primary-50"
                        : "border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <span className="text-2xl">📅</span>
                    <span className="mt-2 text-sm font-medium">
                      Google Calendar
                    </span>
                  </label>
                </div>

                <div>
                  <input
                    type="radio"
                    id="cal"
                    name="provider"
                    value="cal"
                    checked={provider === "cal"}
                    onChange={() => setProvider("cal")}
                    className="sr-only"
                  />
                  <label
                    htmlFor="cal"
                    className={`flex flex-col items-center p-3 border rounded-md cursor-pointer ${
                      provider === "cal"
                        ? "border-primary-500 bg-primary-50"
                        : "border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <span className="text-2xl">🗓️</span>
                    <span className="mt-2 text-sm font-medium">Cal.com</span>
                  </label>
                </div>
              </div>
            </div>

            {provider === "calendly" && (
              <>
                <div>
                  <label
                    htmlFor="apiKey"
                    className="block text-sm font-medium text-gray-700"
                  >
                    API Key
                  </label>
                  <input
                    type="password"
                    id="apiKey"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    placeholder="Enter your Calendly API key"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Username
                  </label>
                  <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    placeholder="your.username"
                    required
                  />
                </div>
              </>
            )}

            {provider === "google" && (
              <>
                <div>
                  <label
                    htmlFor="clientId"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Client ID
                  </label>
                  <input
                    type="text"
                    id="clientId"
                    value={clientId}
                    onChange={(e) => setClientId(e.target.value)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    placeholder="Enter your Google Client ID"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="clientSecret"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Client Secret
                  </label>
                  <input
                    type="password"
                    id="clientSecret"
                    value={clientSecret}
                    onChange={(e) => setClientSecret(e.target.value)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    placeholder="Enter your Google Client Secret"
                    required
                  />
                </div>
              </>
            )}

            {provider === "cal" && (
              <div>
                <label
                  htmlFor="calApiKey"
                  className="block text-sm font-medium text-gray-700"
                >
                  API Key
                </label>
                <input
                  type="password"
                  id="calApiKey"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  placeholder="Enter your Cal.com API key"
                  required
                />
              </div>
            )}

            <div className="pt-4">
              <button
                type="submit"
                className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <CalendarIcon className="h-5 w-5 mr-2" />
                Connect Calendar
              </button>
            </div>
          </div>
        </form>
      ) : (
        <div className="text-center py-6">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
            <CheckIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
          </div>
          <h3 className="mt-3 text-lg font-medium text-gray-900">
            Calendar Connected
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            Your{" "}
            {provider === "calendly"
              ? "Calendly"
              : provider === "google"
                ? "Google Calendar"
                : "Cal.com"}{" "}
            account has been successfully connected.
          </p>
          <div className="mt-4">
            <button
              type="button"
              onClick={() => setIsConnected(false)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Disconnect
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
