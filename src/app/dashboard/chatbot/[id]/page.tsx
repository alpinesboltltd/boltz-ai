'use client';

import { useState } from 'react';
import { use } from 'react';
import Link from 'next/link';
import ChatbotPage from '@/app/chatbot/[id]/page';
import Sources from '@/components/dashboard/Sources';
import Activity from '@/components/dashboard/Activity';
import { ArrowLeftIcon, PencilIcon, TrashIcon, ChartBarIcon, CogIcon, EyeIcon } from '@heroicons/react/24/outline';
import Actions from '@/components/dashboard/Actions';

export default function ChatbotDetailPage({ params }: { params: Promise<{ id: string }> }) {
  // Unwrap params using React.use()
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  


  const [activeTab, setActiveTab] = useState('playground');

  

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <Link
          href="/dashboard/chatbots"
          className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-500"
        >
          <ArrowLeftIcon className="mr-1 h-4 w-4" />
          Back to AI Agents
        </Link>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('playground')}
            className={`${
              activeTab === 'playground'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Playground
          </button>
          <button
            onClick={() => setActiveTab('activity')}
            className={`${
              activeTab === 'activity'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Activity
          </button>
          <button
            onClick={() => setActiveTab('sources')}
            className={`${
              activeTab === 'sources'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Sources
          </button>
          <button
            onClick={() => setActiveTab('action')}
            className={`${
              activeTab === 'action'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Action
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`${
              activeTab === 'settings'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Settings
          </button>
        </nav>
      </div>

      
      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'playground' && (<ChatbotPage params={params} showHeader={false} />)}
          

        {activeTab === 'activity' && (
          <Activity params={params} />
        )}

        {activeTab === 'sources' && (
          <Sources />
        )}

        {activeTab === 'action' && (
            <Actions />
        )}

        {activeTab === 'settings' && (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
            <div className="flex items-center justify-center h-64 border-2 border-dashed border-gray-300 rounded-lg">
              <div className="text-center">
                <CogIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Chatbot Settings</h3>
                <p className="mt-1 text-sm text-gray-500">Customize your chatbot's appearance and behavior.</p>
                <div className="mt-6">
                  <Link
                    href={`/dashboard/chatbot/${id}/preview`}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Edit Settings
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}