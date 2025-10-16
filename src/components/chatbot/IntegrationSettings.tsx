/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { CalendarIcon, CreditCardIcon } from "@heroicons/react/24/outline";

interface IntegrationSettingsProps {
  onSave: (settings: IntegrationSettings) => void;
}

export interface IntegrationSettings {
  calendly: {
    enabled: boolean;
    apiKey?: string;
    username?: string;
  };
  googleCalendar: {
    enabled: boolean;
    clientId?: string;
    clientSecret?: string;
  };
  cal: {
    enabled: boolean;
    apiKey?: string;
  };
  stripe: {
    enabled: boolean;
    publishableKey?: string;
    secretKey?: string;
  };
  paystack: {
    enabled: boolean;
    publicKey?: string;
    secretKey?: string;
  };
  opay: {
    enabled: boolean;
    merchantId?: string;
    secretKey?: string;
  };
  moneypoint: {
    enabled: boolean;
    merchantId?: string;
    apiKey?: string;
  };
}

export function IntegrationSettings({ onSave }: IntegrationSettingsProps) {
  const [settings, setSettings] = useState<IntegrationSettings>({
    calendly: { enabled: false },
    googleCalendar: { enabled: false },
    cal: { enabled: false },
    stripe: { enabled: false },
    paystack: { enabled: false },
    opay: { enabled: false },
    moneypoint: { enabled: false },
  });

  const [activeTab, setActiveTab] = useState<"calendar" | "payment">(
    "calendar"
  );

  const updateSetting = (
    category: keyof IntegrationSettings,
    field: string,
    value: any
  ) => {
    setSettings({
      ...settings,
      [category]: {
        ...settings[category],
        [field]: value,
      },
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(settings);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 my-4">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        Integration Settings
      </h3>

      <div className="border-b border-gray-200 mb-4">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setActiveTab("calendar")}
            className={`${
              activeTab === "calendar"
                ? "border-primary-500 text-primary-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
          >
            <CalendarIcon className="h-5 w-5 mr-2" />
            Calendar Integrations
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("payment")}
            className={`${
              activeTab === "payment"
                ? "border-primary-500 text-primary-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
          >
            <CreditCardIcon className="h-5 w-5 mr-2" />
            Payment Integrations
          </button>
        </nav>
      </div>

      <form onSubmit={handleSubmit}>
        {activeTab === "calendar" && (
          <div className="space-y-6">
            {/* Calendly Integration */}
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-base font-medium text-gray-900">
                  Calendly
                </h4>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.calendly.enabled}
                    onChange={(e) =>
                      updateSetting("calendly", "enabled", e.target.checked)
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>

              {settings.calendly.enabled && (
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="calendlyApiKey"
                      className="block text-sm font-medium text-gray-700"
                    >
                      API Key
                    </label>
                    <input
                      type="password"
                      id="calendlyApiKey"
                      value={settings.calendly.apiKey || ""}
                      onChange={(e) =>
                        updateSetting("calendly", "apiKey", e.target.value)
                      }
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      placeholder="Enter your Calendly API key"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="calendlyUsername"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Username
                    </label>
                    <input
                      type="text"
                      id="calendlyUsername"
                      value={settings.calendly.username || ""}
                      onChange={(e) =>
                        updateSetting("calendly", "username", e.target.value)
                      }
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      placeholder="your.username"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Google Calendar Integration */}
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-base font-medium text-gray-900">
                  Google Calendar
                </h4>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.googleCalendar.enabled}
                    onChange={(e) =>
                      updateSetting(
                        "googleCalendar",
                        "enabled",
                        e.target.checked
                      )
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>

              {settings.googleCalendar.enabled && (
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="googleClientId"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Client ID
                    </label>
                    <input
                      type="text"
                      id="googleClientId"
                      value={settings.googleCalendar.clientId || ""}
                      onChange={(e) =>
                        updateSetting(
                          "googleCalendar",
                          "clientId",
                          e.target.value
                        )
                      }
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      placeholder="Enter your Google Client ID"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="googleClientSecret"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Client Secret
                    </label>
                    <input
                      type="password"
                      id="googleClientSecret"
                      value={settings.googleCalendar.clientSecret || ""}
                      onChange={(e) =>
                        updateSetting(
                          "googleCalendar",
                          "clientSecret",
                          e.target.value
                        )
                      }
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      placeholder="Enter your Google Client Secret"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Cal.com Integration */}
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-base font-medium text-gray-900">Cal.com</h4>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.cal.enabled}
                    onChange={(e) =>
                      updateSetting("cal", "enabled", e.target.checked)
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>

              {settings.cal.enabled && (
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
                    value={settings.cal.apiKey || ""}
                    onChange={(e) =>
                      updateSetting("cal", "apiKey", e.target.value)
                    }
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    placeholder="Enter your Cal.com API key"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "payment" && (
          <div className="space-y-6">
            {/* Stripe Integration */}
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-base font-medium text-gray-900">Stripe</h4>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.stripe.enabled}
                    onChange={(e) =>
                      updateSetting("stripe", "enabled", e.target.checked)
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>

              {settings.stripe.enabled && (
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="stripePublishableKey"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Publishable Key
                    </label>
                    <input
                      type="text"
                      id="stripePublishableKey"
                      value={settings.stripe.publishableKey || ""}
                      onChange={(e) =>
                        updateSetting(
                          "stripe",
                          "publishableKey",
                          e.target.value
                        )
                      }
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      placeholder="pk_test_..."
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="stripeSecretKey"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Secret Key
                    </label>
                    <input
                      type="password"
                      id="stripeSecretKey"
                      value={settings.stripe.secretKey || ""}
                      onChange={(e) =>
                        updateSetting("stripe", "secretKey", e.target.value)
                      }
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      placeholder="sk_test_..."
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Paystack Integration */}
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-base font-medium text-gray-900">
                  Paystack
                </h4>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.paystack.enabled}
                    onChange={(e) =>
                      updateSetting("paystack", "enabled", e.target.checked)
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>

              {settings.paystack.enabled && (
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="paystackPublicKey"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Public Key
                    </label>
                    <input
                      type="text"
                      id="paystackPublicKey"
                      value={settings.paystack.publicKey || ""}
                      onChange={(e) =>
                        updateSetting("paystack", "publicKey", e.target.value)
                      }
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      placeholder="pk_test_..."
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="paystackSecretKey"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Secret Key
                    </label>
                    <input
                      type="password"
                      id="paystackSecretKey"
                      value={settings.paystack.secretKey || ""}
                      onChange={(e) =>
                        updateSetting("paystack", "secretKey", e.target.value)
                      }
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      placeholder="sk_test_..."
                    />
                  </div>
                </div>
              )}
            </div>

            {/* OPay Integration */}
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-base font-medium text-gray-900">OPay</h4>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.opay.enabled}
                    onChange={(e) =>
                      updateSetting("opay", "enabled", e.target.checked)
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>

              {settings.opay.enabled && (
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="opayMerchantId"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Merchant ID
                    </label>
                    <input
                      type="text"
                      id="opayMerchantId"
                      value={settings.opay.merchantId || ""}
                      onChange={(e) =>
                        updateSetting("opay", "merchantId", e.target.value)
                      }
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      placeholder="Enter your OPay Merchant ID"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="opaySecretKey"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Secret Key
                    </label>
                    <input
                      type="password"
                      id="opaySecretKey"
                      value={settings.opay.secretKey || ""}
                      onChange={(e) =>
                        updateSetting("opay", "secretKey", e.target.value)
                      }
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      placeholder="Enter your OPay Secret Key"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* MoneyPoint Integration */}
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-base font-medium text-gray-900">
                  MoneyPoint
                </h4>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.moneypoint.enabled}
                    onChange={(e) =>
                      updateSetting("moneypoint", "enabled", e.target.checked)
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>

              {settings.moneypoint.enabled && (
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="moneypointMerchantId"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Merchant ID
                    </label>
                    <input
                      type="text"
                      id="moneypointMerchantId"
                      value={settings.moneypoint.merchantId || ""}
                      onChange={(e) =>
                        updateSetting(
                          "moneypoint",
                          "merchantId",
                          e.target.value
                        )
                      }
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      placeholder="Enter your MoneyPoint Merchant ID"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="moneypointApiKey"
                      className="block text-sm font-medium text-gray-700"
                    >
                      API Key
                    </label>
                    <input
                      type="password"
                      id="moneypointApiKey"
                      value={settings.moneypoint.apiKey || ""}
                      onChange={(e) =>
                        updateSetting("moneypoint", "apiKey", e.target.value)
                      }
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      placeholder="Enter your MoneyPoint API Key"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="mt-6">
          <button
            type="submit"
            className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Save Integration Settings
          </button>
        </div>
      </form>
    </div>
  );
}
