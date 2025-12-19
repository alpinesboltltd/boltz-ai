"use client";

import { useState } from "react";
import { use } from "react";
import Link from "next/link";
import {
  ArrowLeftIcon,
  CodeBracketIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";
import { BotCustomizer } from "@/components/chatbot/BotCustomizer";
import { AgentPlayground } from "@/components/chatbot/AgentPlayground";
import { Tab, TabGroup, TabList, TabPanels, TabPanel } from "@headlessui/react";
import { toast } from "@/store/toastStore";

export default function AgentPreviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Unwrap params using React.use()
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  // Mock data for the chatagent
  const chatagent = {
    id,
    name: "Customer Support Bot",
  };

  const [showSavedMessage, setShowSavedMessage] = useState(false);

  const handleSaveConfig = () => {
    setShowSavedMessage(true);
    setTimeout(() => setShowSavedMessage(false), 3000);
  };

  const embedCode = `<script>
  window.LEVEL_X_CONFIG = {
    id: "${id}",
  };
</script>
<script src="${window.location.origin}/widget.js" async></script>`;

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <Link
          href={`/dashboard/agent/${id}`}
          className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-500"
        >
          <ArrowLeftIcon className="mr-1 h-4 w-4" />
          Back to AI Agent Details
        </Link>
        <div className="mt-2 md:flex md:items-center md:justify-between">
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-semibold text-gray-900 sm:truncate">
              {chatagent.name} - Preview & Customize
            </h1>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4 space-x-3">
            <Link
              href={`/agent/${id}`}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <EyeIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
              Public View
            </Link>
          </div>
        </div>
      </div>

      {showSavedMessage && (
        <div className="mb-6 rounded-md bg-green-50 p-4">
          <div className="flex">
            <div className="shrink-0">
              <svg
                className="h-5 w-5 text-green-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">
                Customization saved successfully!
              </p>
            </div>
          </div>
        </div>
      )}

      <TabGroup>
        <TabList className="flex space-x-1 rounded-xl bg-primary-100 p-1 mb-8">
          <Tab
            className={({ selected }) =>
              `w-full rounded-lg py-2.5 text-sm font-medium leading-5 
              ${
                selected
                  ? "bg-white text-primary-700 shadow"
                  : "text-primary-600 hover:bg-white/[0.12] hover:text-primary-700"
              }`
            }
          >
            Customize Appearance
          </Tab>
          <Tab
            className={({ selected }) =>
              `w-full rounded-lg py-2.5 text-sm font-medium leading-5 
              ${
                selected
                  ? "bg-white text-primary-700 shadow"
                  : "text-primary-600 hover:bg-white/[0.12] hover:text-primary-700"
              }`
            }
          >
            Test Playground
          </Tab>
          <Tab
            className={({ selected }) =>
              `w-full rounded-lg py-2.5 text-sm font-medium leading-5 
              ${
                selected
                  ? "bg-white text-primary-700 shadow"
                  : "text-primary-600 hover:bg-white/[0.12] hover:text-primary-700"
              }`
            }
          >
            Installation
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <BotCustomizer onSave={handleSaveConfig} />
          </TabPanel>
          <TabPanel>
            <AgentPlayground />
          </TabPanel>
          <TabPanel>
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Installation Instructions
                </h3>
                <div className="mt-2 max-w-xl text-sm text-gray-500">
                  <p>
                    Add the following code snippet to your website to install
                    your chatagent. Place it just before the closing{" "}
                    <code>&lt;/body&gt;</code> tag.
                  </p>
                </div>
                <div className="mt-5">
                  <div className="relative">
                    <pre className="bg-gray-800 text-gray-100 rounded-md p-4 overflow-x-auto text-sm">
                      {embedCode}
                    </pre>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(embedCode);
                        toast.success("Copied!", "Code copied to clipboard!");
                      }}
                      className="absolute top-2 right-2 inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-primary-700 bg-primary-100 hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      <CodeBracketIcon className="-ml-0.5 mr-1 h-4 w-4" />
                      Copy
                    </button>
                  </div>
                </div>
                <div className="mt-5">
                  <h4 className="text-md font-medium text-gray-900">
                    Additional Options
                  </h4>
                  <ul className="mt-3 list-disc list-inside text-sm text-gray-500 space-y-1">
                    <li>
                      The script automatically adapts to your website&apos;s
                      theme
                    </li>
                    <li>
                      Your chatagent will use the customizations you&apos;ve set
                      in the Customize tab
                    </li>
                    <li>
                      The chatagent will appear on all pages where you include
                      this script
                    </li>
                    <li>
                      You can update your chatagent&apos;s behavior and
                      appearance anytime from this dashboard
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </div>
  );
}
