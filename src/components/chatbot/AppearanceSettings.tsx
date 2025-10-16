"use client";

import { useState, useRef } from "react";
import { Spinner } from "@/components/common/Spinner";
import ChatInterface from "@/components/chatbot/ChatInterface";
import Image from "next/image";

interface AppearanceSettingsProps {
  chatagentId: string;
  initialSettings?: {
    primaryColor: string;
    secondaryColor: string;
    fontFamily: string;
    avatarType: "default" | "custom" | "none";
    avatarImage?: string;
    welcomeMessage: string;
    botName: string;
    bubbleIcon: "default" | "custom";
    bubbleIconImage?: string;
    position: "bottom-right" | "bottom-left";
    darkMode: boolean;
  };
  onSave: (
    settings: AppearanceSettingsProps["initialSettings"]
  ) => Promise<void>;
}

const fontOptions = [
  { value: "Inter, sans-serif", label: "Inter (Default)" },
  { value: "Arial, sans-serif", label: "Arial" },
  { value: "Helvetica, sans-serif", label: "Helvetica" },
  { value: "Georgia, serif", label: "Georgia" },
  { value: "Verdana, sans-serif", label: "Verdana" },
  { value: "Roboto, sans-serif", label: "Roboto" },
  { value: "Open Sans, sans-serif", label: "Open Sans" },
];

export default function AppearanceSettings({
  initialSettings = {
    primaryColor: "#6366F1",
    secondaryColor: "#F3F4F6",
    fontFamily: "Inter, sans-serif",
    avatarType: "default",
    welcomeMessage: "Hello! How can I help you today?",
    botName: "AI Assistant",
    bubbleIcon: "default",
    position: "bottom-right",
    darkMode: false,
  },
  onSave,
}: AppearanceSettingsProps) {
  const [settings, setSettings] = useState(initialSettings);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const avatarFileRef = useRef<HTMLInputElement>(null);
  const bubbleIconFileRef = useRef<HTMLInputElement>(null);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;

    setSettings((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleAvatarTypeChange = (type: "default" | "custom" | "none") => {
    setSettings((prev) => ({
      ...prev,
      avatarType: type,
    }));
  };

  const handleBubbleIconChange = (type: "default" | "custom") => {
    setSettings((prev) => ({
      ...prev,
      bubbleIcon: type,
    }));
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setSettings((prev) => ({
        ...prev,
        avatarImage: event.target?.result as string,
        avatarType: "custom",
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleBubbleIconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setSettings((prev) => ({
        ...prev,
        bubbleIconImage: event.target?.result as string,
        bubbleIcon: "custom",
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      await onSave(settings);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error("Failed to save appearance settings:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900">
          Appearance Settings
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Customize how your chatagent looks and feels to match your brand.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label
                htmlFor="botName"
                className="block text-sm font-medium text-gray-700"
              >
                Bot Name
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="botName"
                  id="botName"
                  value={settings.botName}
                  onChange={handleChange}
                  className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="fontFamily"
                className="block text-sm font-medium text-gray-700"
              >
                Font Family
              </label>
              <div className="mt-1">
                <select
                  id="fontFamily"
                  name="fontFamily"
                  value={settings.fontFamily}
                  onChange={handleChange}
                  className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                >
                  {fontOptions.map((font) => (
                    <option key={font.value} value={font.value}>
                      {font.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label
                htmlFor="primaryColor"
                className="block text-sm font-medium text-gray-700"
              >
                Primary Color
              </label>
              <div className="mt-1 flex items-center">
                <input
                  type="color"
                  name="primaryColor"
                  id="primaryColor"
                  value={settings.primaryColor}
                  onChange={handleChange}
                  className="h-8 w-8 rounded-md border-gray-300 cursor-pointer"
                />
                <input
                  type="text"
                  value={settings.primaryColor}
                  onChange={handleChange}
                  name="primaryColor"
                  className="ml-2 shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="secondaryColor"
                className="block text-sm font-medium text-gray-700"
              >
                Secondary Color
              </label>
              <div className="mt-1 flex items-center">
                <input
                  type="color"
                  name="secondaryColor"
                  id="secondaryColor"
                  value={settings.secondaryColor}
                  onChange={handleChange}
                  className="h-8 w-8 rounded-md border-gray-300 cursor-pointer"
                />
                <input
                  type="text"
                  value={settings.secondaryColor}
                  onChange={handleChange}
                  name="secondaryColor"
                  className="ml-2 shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="welcomeMessage"
                className="block text-sm font-medium text-gray-700"
              >
                Welcome Message
              </label>
              <div className="mt-1">
                <textarea
                  id="welcomeMessage"
                  name="welcomeMessage"
                  rows={3}
                  value={settings.welcomeMessage}
                  onChange={handleChange}
                  className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Bot Avatar
              </label>
              <div className="mt-2 space-y-3">
                <div className="flex items-center space-x-4">
                  <div
                    className={`flex items-center justify-center h-12 w-12 rounded-full cursor-pointer ${
                      settings.avatarType === "default"
                        ? "ring-2 ring-primary-500"
                        : "ring-1 ring-gray-200"
                    }`}
                    onClick={() => handleAvatarTypeChange("default")}
                  >
                    <span className="text-2xl">😊</span>
                  </div>

                  <div
                    className={`flex items-center justify-center h-12 w-12 rounded-full cursor-pointer ${
                      settings.avatarType === "none"
                        ? "ring-2 ring-primary-500"
                        : "ring-1 ring-gray-200"
                    }`}
                    onClick={() => handleAvatarTypeChange("none")}
                  >
                    <span className="text-2xl">❌</span>
                  </div>

                  <div
                    className={`flex items-center justify-center h-12 w-12 rounded-full cursor-pointer overflow-hidden ${
                      settings.avatarType === "custom"
                        ? "ring-2 ring-primary-500"
                        : "ring-1 ring-gray-200"
                    }`}
                    onClick={() => avatarFileRef.current?.click()}
                  >
                    {settings.avatarImage ? (
                      <Image
                        height={40}
                        width={40}
                        src={settings.avatarImage}
                        alt="Custom avatar"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-2xl">📷</span>
                    )}
                  </div>
                </div>

                <input
                  type="file"
                  ref={avatarFileRef}
                  onChange={handleAvatarUpload}
                  accept="image/*"
                  className="hidden"
                />

                <button
                  type="button"
                  onClick={() => avatarFileRef.current?.click()}
                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Upload Custom Avatar
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Chat Bubble Icon
              </label>
              <div className="mt-2 space-y-3">
                <div className="flex items-center space-x-4">
                  <div
                    className={`flex items-center justify-center h-12 w-12 rounded-full cursor-pointer ${
                      settings.bubbleIcon === "default"
                        ? "ring-2 ring-primary-500"
                        : "ring-1 ring-gray-200"
                    }`}
                    onClick={() => handleBubbleIconChange("default")}
                  >
                    <span className="text-2xl">💬</span>
                  </div>

                  <div
                    className={`flex items-center justify-center h-12 w-12 rounded-full cursor-pointer overflow-hidden ${
                      settings.bubbleIcon === "custom"
                        ? "ring-2 ring-primary-500"
                        : "ring-1 ring-gray-200"
                    }`}
                    onClick={() => bubbleIconFileRef.current?.click()}
                  >
                    {settings.bubbleIconImage ? (
                      <Image
                        height={40}
                        width={40}
                        src={settings.bubbleIconImage}
                        alt="Custom bubble icon"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-2xl">📷</span>
                    )}
                  </div>
                </div>

                <input
                  type="file"
                  ref={bubbleIconFileRef}
                  onChange={handleBubbleIconUpload}
                  accept="image/*"
                  className="hidden"
                />

                <button
                  type="button"
                  onClick={() => bubbleIconFileRef.current?.click()}
                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Upload Custom Icon
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Chat Position
              </label>
              <div className="mt-2 flex items-center space-x-4">
                <div
                  className={`flex items-center justify-center h-12 w-24 rounded cursor-pointer ${
                    settings.position === "bottom-right"
                      ? "bg-primary-100 border-2 border-primary-500"
                      : "bg-gray-100 border border-gray-300"
                  }`}
                  onClick={() =>
                    setSettings((prev) => ({
                      ...prev,
                      position: "bottom-right",
                    }))
                  }
                >
                  <span className="text-sm font-medium">Bottom Right</span>
                </div>

                <div
                  className={`flex items-center justify-center h-12 w-24 rounded cursor-pointer ${
                    settings.position === "bottom-left"
                      ? "bg-primary-100 border-2 border-primary-500"
                      : "bg-gray-100 border border-gray-300"
                  }`}
                  onClick={() =>
                    setSettings((prev) => ({
                      ...prev,
                      position: "bottom-left",
                    }))
                  }
                >
                  <span className="text-sm font-medium">Bottom Left</span>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center">
                <input
                  id="darkMode"
                  name="darkMode"
                  type="checkbox"
                  checked={settings.darkMode}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="darkMode"
                  className="ml-2 block text-sm font-medium text-gray-700"
                >
                  Dark Mode
                </label>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Enable dark mode for the chat interface.
              </p>
            </div>
          </div>

          <div className="pt-5 border-t border-gray-200">
            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => setPreviewOpen(true)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Preview
              </button>

              <div className="flex">
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
                  {loading ? (
                    <Spinner size="sm" color="white" />
                  ) : (
                    "Save Settings"
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Preview Modal */}
      {previewOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Chat Preview
              </h3>
              <button
                type="button"
                onClick={() => setPreviewOpen(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <span className="sr-only">Close</span>
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="h-[600px] border border-gray-200 rounded-lg">
              <ChatInterface
                chatagentName={settings.botName}
                welcomeMessage={settings.welcomeMessage}
                primaryColor={settings.primaryColor}
                avatarStyle={
                  settings.avatarType === "custom"
                    ? "custom"
                    : settings.avatarType === "none"
                      ? "none"
                      : "default"
                }
                avatarImage={settings.avatarImage}
                isOpen={true}
                darkMode={settings.darkMode}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
