"use client";

import { CheckIcon, XMarkIcon } from "@heroicons/react/20/solid";

const features = [
  {
    name: "Custom AI Selection",
    description:
      "Choose from multiple AI models, including Gemini, GPT-4, Claude, and Mistral",
    platforms: "Gemini, OpenAI GPT-4, Claude, Mistral",
    tiers: { free: true, pro: true, business: true },
  },
  {
    name: "AI-Powered Knowledge Retrieval",
    description:
      "Retrieves company knowledge from uploaded documents, FAQs, and databases",
    platforms: "Slack, MS Teams, Discord, Google Drive, Dropbox",
    tiers: { free: false, pro: true, business: true },
  },
  {
    name: "Advanced NLP & Machine Learning",
    description: "AI learns from conversations and improves over time",
    platforms: "Rasa Core, TensorFlow, Hugging Face, OpenAI API",
    tiers: { free: false, pro: true, business: true },
  },
  {
    name: "Real-Time Chatbot Training",
    description: "Train and update your bot dynamically",
    platforms: "Boltz Web Platform, OpenAI Playground, Google Gemini Sandbox",
    tiers: { free: false, pro: true, business: true },
  },
  {
    name: "Multilingual Support",
    description: "Supports 80+ languages for global accessibility",
    platforms: "Google Translate API, Microsoft Translator, AWS Polly",
    tiers: { free: true, pro: true, business: true },
  },
  {
    name: "No-Code Chatbot Builder",
    description:
      "Drag-and-drop interface for building AI assistants without technical expertise",
    platforms: "Web Platform, Shopify, WordPress, Wix, Webflow",
    tiers: { free: true, pro: true, business: true },
  },
  {
    name: "Deep Analytics & User Insights",
    description:
      "Provides chatagent performance data, user interactions, and conversion tracking",
    platforms: "Google Analytics, HubSpot, Tableau, Mixpanel",
    tiers: { free: false, pro: true, business: true },
  },
  {
    name: "Omnichannel Integrations",
    description:
      "Deploy chatagents on websites, WhatsApp, Slack, and social media",
    platforms:
      "WhatsApp Business, Facebook Messenger, Telegram, Instagram, Twitter DMs",
    tiers: { free: false, pro: true, business: true },
  },
  {
    name: "Live Human Handoff",
    description:
      "Routes conversations to human agents when AI assistance is not enough",
    platforms: "Intercom, Zendesk, Freshdesk, Salesforce",
    tiers: { free: false, pro: true, business: true },
  },
  {
    name: "Secure Transactions & Privacy Controls",
    description: "Offers encrypted messaging and compliance with GDPR & HIPAA",
    platforms: "AWS Cloud Security, Google Cloud Encryption, Microsoft Azure",
    tiers: { free: false, pro: false, business: true },
  },
  {
    name: "Voice Capabilities",
    description: "Support for voice input and output in conversations",
    platforms:
      "Amazon Polly, Google Text-to-Speech, Microsoft Azure Speech Services",
    tiers: { free: false, pro: true, business: true },
  },
  {
    name: "Custom Avatar & Branding",
    description:
      "Personalized chatagent appearance with custom avatars and brand colors",
    platforms: "Web Platform, Custom CSS, Image Processing API",
    tiers: { free: false, pro: true, business: true },
  },
  {
    name: "Conversation Interface Customization",
    description: "Fully customizable chat interface with themes and layouts",
    platforms: "Web Components, React, Vue.js",
    tiers: { free: false, pro: true, business: true },
  },
  {
    name: "Enterprise SSO",
    description: "Single sign-on for enterprise customers",
    platforms: "Okta, Auth0, Microsoft Azure AD, Google Workspace",
    tiers: { free: false, pro: false, business: true },
  },
  {
    name: "API Access",
    description: "RESTful API for custom integrations and extensions",
    platforms: "Swagger/OpenAPI, GraphQL",
    tiers: { free: false, pro: false, business: true },
  },
];

export function FeaturesTable() {
  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-primary-600">
            Comprehensive Features
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Everything you need to build powerful AI chatagents
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Compare our features across different plans and see the platforms we
            integrate with.
          </p>
        </div>

        <div className="mt-16 overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                >
                  Feature
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Description
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Free
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Pro
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Business
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {features.map((feature) => (
                <tr key={feature.name}>
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                    {feature.name}
                  </td>
                  <td className="px-3 py-4 text-sm text-gray-500">
                    <div>
                      <p>{feature.description}</p>
                      <p className="mt-1 text-xs text-gray-400">
                        <span className="font-medium">Integrations:</span>{" "}
                        {feature.platforms}
                      </p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {feature.tiers.free ? (
                      <CheckIcon className="h-5 w-5 text-green-500" />
                    ) : (
                      <XMarkIcon className="h-5 w-5 text-gray-300" />
                    )}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {feature.tiers.pro ? (
                      <CheckIcon className="h-5 w-5 text-green-500" />
                    ) : (
                      <XMarkIcon className="h-5 w-5 text-gray-300" />
                    )}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {feature.tiers.business ? (
                      <CheckIcon className="h-5 w-5 text-green-500" />
                    ) : (
                      <XMarkIcon className="h-5 w-5 text-gray-300" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
