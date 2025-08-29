"use client";

import { useState } from "react";
import { Spinner } from "@/components/common/Spinner";
import {
  ShieldCheckIcon,
  LockClosedIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";

interface SecuritySettingsProps {
  chatagentId: string;
  initialSettings?: {
    dataRetention: number;
    piiFiltering: boolean;
    endToEndEncryption: boolean;
    ipWhitelist: string[];
    sensitiveTopics: string[];
    gdprCompliant: boolean;
    hipaaCompliant: boolean;
  };
  onSave: (settings: any) => Promise<void>;
}

export default function SecuritySettings({
  chatagentId,
  initialSettings = {
    dataRetention: 30,
    piiFiltering: true,
    endToEndEncryption: false,
    ipWhitelist: [],
    sensitiveTopics: ["medical", "financial", "legal"],
    gdprCompliant: true,
    hipaaCompliant: false,
  },
  onSave,
}: SecuritySettingsProps) {
  const [settings, setSettings] = useState(initialSettings);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [newIp, setNewIp] = useState("");
  const [newTopic, setNewTopic] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAddIp = () => {
    // Basic IP validation
    const ipRegex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
    if (!ipRegex.test(newIp)) {
      setError("Please enter a valid IP address");
      return;
    }

    setSettings((prev) => ({
      ...prev,
      ipWhitelist: [...prev.ipWhitelist, newIp],
    }));
    setNewIp("");
    setError("");
  };

  const handleRemoveIp = (ip) => {
    setSettings((prev) => ({
      ...prev,
      ipWhitelist: prev.ipWhitelist.filter((item) => item !== ip),
    }));
  };

  const handleAddTopic = () => {
    if (!newTopic.trim()) {
      return;
    }

    setSettings((prev) => ({
      ...prev,
      sensitiveTopics: [...prev.sensitiveTopics, newTopic.trim()],
    }));
    setNewTopic("");
  };

  const handleRemoveTopic = (topic) => {
    setSettings((prev) => ({
      ...prev,
      sensitiveTopics: prev.sensitiveTopics.filter((item) => item !== topic),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await onSave(settings);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error("Failed to save settings:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-center">
          <ShieldCheckIcon className="h-6 w-6 text-primary-600 mr-2" />
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            Security Settings
          </h3>
        </div>
        <p className="mt-1 text-sm text-gray-500">
          Configure security and privacy settings for your chatagent.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          <div>
            <label
              htmlFor="dataRetention"
              className="block text-sm font-medium text-gray-700"
            >
              Data Retention Period (days)
            </label>
            <div className="mt-1">
              <input
                type="number"
                name="dataRetention"
                id="dataRetention"
                min="1"
                max="365"
                value={settings.dataRetention}
                onChange={handleChange}
                className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
              />
              <p className="mt-1 text-xs text-gray-500">
                Number of days to retain conversation data. After this period,
                data will be automatically deleted.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="piiFiltering"
                  name="piiFiltering"
                  type="checkbox"
                  checked={settings.piiFiltering}
                  onChange={handleChange}
                  className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label
                  htmlFor="piiFiltering"
                  className="font-medium text-gray-700"
                >
                  PII Filtering
                </label>
                <p className="text-gray-500">
                  Automatically detect and redact personally identifiable
                  information (PII).
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="endToEndEncryption"
                  name="endToEndEncryption"
                  type="checkbox"
                  checked={settings.endToEndEncryption}
                  onChange={handleChange}
                  className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label
                  htmlFor="endToEndEncryption"
                  className="font-medium text-gray-700"
                >
                  End-to-End Encryption
                </label>
                <p className="text-gray-500">
                  Enable end-to-end encryption for all conversations (Business
                  and Enterprise plans only).
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="gdprCompliant"
                  name="gdprCompliant"
                  type="checkbox"
                  checked={settings.gdprCompliant}
                  onChange={handleChange}
                  className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label
                  htmlFor="gdprCompliant"
                  className="font-medium text-gray-700"
                >
                  GDPR Compliance Mode
                </label>
                <p className="text-gray-500">
                  Enable additional features required for GDPR compliance.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="hipaaCompliant"
                  name="hipaaCompliant"
                  type="checkbox"
                  checked={settings.hipaaCompliant}
                  onChange={handleChange}
                  className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label
                  htmlFor="hipaaCompliant"
                  className="font-medium text-gray-700"
                >
                  HIPAA Compliance Mode
                </label>
                <p className="text-gray-500">
                  Enable additional features required for HIPAA compliance
                  (Enterprise plan only).
                </p>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-200">
            <h4 className="text-sm font-medium text-gray-900 flex items-center">
              <LockClosedIcon className="h-4 w-4 mr-1 text-gray-500" />
              IP Whitelist
            </h4>
            <p className="mt-1 text-xs text-gray-500">
              Restrict access to your chatagent to specific IP addresses. Leave
              empty to allow all IPs.
            </p>

            <div className="mt-2">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newIp}
                  onChange={(e) => setNewIp(e.target.value)}
                  placeholder="192.168.1.1"
                  className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
                <button
                  type="button"
                  onClick={handleAddIp}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Add
                </button>
              </div>

              {error && (
                <p className="mt-1 text-xs text-red-600 flex items-center">
                  <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                  {error}
                </p>
              )}

              <div className="mt-2 flex flex-wrap gap-2">
                {settings.ipWhitelist.map((ip) => (
                  <span
                    key={ip}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-gray-100 text-gray-800"
                  >
                    {ip}
                    <button
                      type="button"
                      onClick={() => handleRemoveIp(ip)}
                      className="ml-1.5 h-4 w-4 text-gray-400 hover:text-gray-600"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-200">
            <h4 className="text-sm font-medium text-gray-900">
              Sensitive Topics
            </h4>
            <p className="mt-1 text-xs text-gray-500">
              Define topics that your chatagent should handle with extra care or
              avoid entirely.
            </p>

            <div className="mt-2">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newTopic}
                  onChange={(e) => setNewTopic(e.target.value)}
                  placeholder="Add a sensitive topic"
                  className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
                <button
                  type="button"
                  onClick={handleAddTopic}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Add
                </button>
              </div>

              <div className="mt-2 flex flex-wrap gap-2">
                {settings.sensitiveTopics.map((topic) => (
                  <span
                    key={topic}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-red-100 text-red-800"
                  >
                    {topic}
                    <button
                      type="button"
                      onClick={() => handleRemoveTopic(topic)}
                      className="ml-1.5 h-4 w-4 text-red-400 hover:text-red-600"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            {success && (
              <span className="mr-4 inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-green-100 text-green-800">
                Settings saved successfully
              </span>
            )}
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
            >
              {loading ? <Spinner size="sm" color="white" /> : "Save Settings"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
