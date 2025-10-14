"use client";

import { Header } from "@/components/common/Header";
import { Footer } from "@/components/common/Footer";
import Link from "next/link";

const integrationCategories = [
  {
    name: "Messaging Platforms",
    description: "Connect your chatagent to popular messaging platforms",
    integrations: [
      {
        name: "WhatsApp Business",
        icon: "📱",
        description: "Reach 2 billion users on WhatsApp",
      },
      {
        name: "Facebook Messenger",
        icon: "👥",
        description: "Connect with customers on Facebook",
      },
      {
        name: "Telegram",
        icon: "✈️",
        description: "Deploy your bot on Telegram",
      },
      {
        name: "Instagram DM",
        icon: "📸",
        description: "Engage with Instagram followers",
      },
      {
        name: "Twitter DM",
        icon: "🐦",
        description: "Provide support via Twitter DMs",
      },
      {
        name: "Slack",
        icon: "💬",
        description: "Add your chatagent to Slack workspaces",
      },
      {
        name: "Discord",
        icon: "🎮",
        description: "Engage with communities on Discord",
      },
      {
        name: "MS Teams",
        icon: "👥",
        description: "Deploy in Microsoft Teams",
      },
    ],
  },
  {
    name: "Website & CMS",
    description: "Embed your chatagent on your website or CMS",
    integrations: [
      {
        name: "WordPress",
        icon: "📝",
        description: "Easy plugin for WordPress sites",
      },
      {
        name: "Shopify",
        icon: "🛒",
        description: "Enhance your Shopify store",
      },
      { name: "Wix", icon: "🌐", description: "Add to your Wix website" },
      {
        name: "Webflow",
        icon: "🌊",
        description: "Integrate with Webflow sites",
      },
      {
        name: "Squarespace",
        icon: "🟦",
        description: "Add to Squarespace sites",
      },
      {
        name: "Custom HTML",
        icon: "💻",
        description: "Simple JavaScript snippet for any site",
      },
    ],
  },
  {
    name: "Business Tools",
    description: "Connect with your existing business tools",
    integrations: [
      {
        name: "Zendesk",
        icon: "🎧",
        description: "Integrate with your support system",
      },
      { name: "Salesforce", icon: "☁️", description: "Connect to your CRM" },
      {
        name: "HubSpot",
        icon: "🧲",
        description: "Enhance your marketing automation",
      },
      {
        name: "Intercom",
        icon: "💬",
        description: "Seamless handoff to Intercom",
      },
      {
        name: "Freshdesk",
        icon: "🎫",
        description: "Create tickets from chat",
      },
      {
        name: "Google Workspace",
        icon: "📧",
        description: "Connect with Google tools",
      },
      {
        name: "Microsoft 365",
        icon: "📊",
        description: "Integrate with Microsoft services",
      },
    ],
  },
  {
    name: "AI Models",
    description: "Choose from leading AI models",
    integrations: [
      {
        name: "Google Gemini",
        icon: "🧠",
        description: "Google's advanced AI model",
      },
      {
        name: "OpenAI GPT-4",
        icon: "🤖",
        description: "Powerful language model from OpenAI",
      },
      {
        name: "Claude",
        icon: "🔮",
        description: "Anthropic's helpful assistant",
      },
      {
        name: "Mistral",
        icon: "💨",
        description: "Efficient open-source model",
      },
      { name: "Llama 3", icon: "🦙", description: "Meta's open-source LLM" },
    ],
  },
  {
    name: "Knowledge Sources",
    description: "Connect your knowledge sources",
    integrations: [
      {
        name: "Google Drive",
        icon: "📁",
        description: "Import documents from Google Drive",
      },
      {
        name: "Dropbox",
        icon: "📦",
        description: "Connect your Dropbox files",
      },
      {
        name: "OneDrive",
        icon: "☁️",
        description: "Use documents from OneDrive",
      },
      {
        name: "SharePoint",
        icon: "📚",
        description: "Access SharePoint documents",
      },
      {
        name: "Notion",
        icon: "📝",
        description: "Import from Notion workspaces",
      },
      {
        name: "Confluence",
        icon: "📊",
        description: "Use Confluence as knowledge source",
      },
    ],
  },
  {
    name: "Voice & Speech",
    description: "Add voice capabilities to your chatagent",
    integrations: [
      {
        name: "Amazon Polly",
        icon: "🔊",
        description: "Lifelike text-to-speech",
      },
      {
        name: "Google Text-to-Speech",
        icon: "🗣️",
        description: "Natural sounding voices",
      },
      {
        name: "Microsoft Azure Speech",
        icon: "🎙️",
        description: "Advanced speech services",
      },
      {
        name: "Twilio Voice",
        icon: "📞",
        description: "Phone call integration",
      },
    ],
  },
];

export default function IntegrationsPage() {
  return (
    <main>
      <Header />
      <div className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Powerful Integrations
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Connect your chatagent with all the platforms and tools you
              already use. Our extensive integration library makes deployment
              and management simple.
            </p>
          </div>
        </div>
      </div>

      {integrationCategories.map((category) => (
        <div key={category.name} className="py-16 sm:py-24 bg-white">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl lg:text-center">
              <h2 className="text-base font-semibold leading-7 text-primary-600">
                {category.name}
              </h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                {category.description}
              </p>
            </div>

            <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
              <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
                {category.integrations.map((integration) => (
                  <div
                    key={integration.name}
                    className="group relative bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-primary-500 rounded-lg border border-gray-200 hover:border-primary-300 transition-all"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-50 text-2xl">
                        {integration.icon}
                      </div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {integration.name}
                      </h3>
                    </div>
                    <p className="mt-4 text-sm text-gray-500">
                      {integration.description}
                    </p>
                    <Link
                      href="/dashboard/chatagents/create"
                      className="mt-4 inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-500"
                    >
                      Try it now
                      <svg
                        className="ml-1 h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}

      <div className="bg-primary-700">
        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:flex lg:items-center lg:justify-between lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Ready to connect your tools?
            <br />
            <span className="text-primary-200">
              Start building your AI chatagent today.
            </span>
          </h2>
          <div className="mt-10 flex items-center gap-x-6 lg:mt-0 lg:flex-shrink-0">
            <Link
              href="/auth/register"
              className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-primary-600 shadow-sm hover:bg-primary-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Get started for free
            </Link>
            <Link
              href="/dashboard/chatagents/create"
              className="text-sm font-semibold leading-6 text-white"
            >
              Create a chatagent <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
