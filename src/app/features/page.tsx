'use client';

import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { FeaturesTable } from '@/components/landing/FeaturesTable';

export default function FeaturesPage() {
  return (
    <main>
      <Header />
      <div className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Powerful Features for AI Chatbots
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Explore our comprehensive set of features designed to help you build, deploy, and manage
              intelligent chatbots across multiple platforms.
            </p>
          </div>
        </div>
      </div>
      
      <FeaturesTable />
      
      <div className="bg-gray-50 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-primary-600">Integration Partners</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Seamlessly connect with your favorite platforms
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Our chatbots integrate with all the tools and platforms you already use, making deployment and management simple.
            </p>
          </div>
          
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              <div className="flex flex-col">
                <dt className="text-lg font-semibold leading-7 text-gray-900">
                  Messaging Platforms
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">
                    Deploy your chatbot on popular messaging platforms to reach your customers where they already are.
                  </p>
                  <p className="mt-6">
                    <span className="font-semibold">Integrations:</span> WhatsApp Business, Facebook Messenger, Telegram, Instagram, Twitter DMs, Slack, Discord, MS Teams
                  </p>
                </dd>
              </div>
              
              <div className="flex flex-col">
                <dt className="text-lg font-semibold leading-7 text-gray-900">
                  Website & CMS
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">
                    Easily embed your chatbot on your website or content management system with just a few clicks.
                  </p>
                  <p className="mt-6">
                    <span className="font-semibold">Integrations:</span> WordPress, Shopify, Wix, Webflow, Squarespace, Custom HTML/JavaScript
                  </p>
                </dd>
              </div>
              
              <div className="flex flex-col">
                <dt className="text-lg font-semibold leading-7 text-gray-900">
                  Business Tools
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">
                    Connect your chatbot with your existing business tools for seamless workflow integration.
                  </p>
                  <p className="mt-6">
                    <span className="font-semibold">Integrations:</span> Zendesk, Salesforce, HubSpot, Intercom, Freshdesk, Google Workspace, Microsoft 365
                  </p>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
      
      <Footer />
    </main>
  );
}