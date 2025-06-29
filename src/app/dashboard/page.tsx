"use client"
import Link from 'next/link';
import { useState } from 'react';
import { MessageSquare } from "lucide-react"

export default function Dashboard() {
  // Mock data for dashboard
  const chatbots = [
    { id: 1, name: 'Customer Support Bot', status: 'active', messages: 1245, platform: 'Website' },
    { id: 2, name: 'Customer testing Bot', status: 'active', messages: 125, platform: 'facebook' },
    { id: 3, name: 'Customer Support', status: 'not active', messages: 1245, platform: 'slack' },
  ];

  const [activeTab, setActiveTab] = useState('agents');

  return (
    <>
      {/* Tabs */}
      <div className="border-b border-gray-200 py-2">
          <nav className="-mb-px flex justify-center space-x-10 items-center" aria-label="tabs">
              <button
                  onClick={() => setActiveTab('agents')}
                  className={`${
                  activeTab === 'agents'
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium flex items-center gap-x-1 text-sm`}
              >
                  Agents
              </button>
              <button
                  onClick={() => setActiveTab('usage')}
                  className={`${
                  activeTab === 'usage'
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium flex items-center gap-x-1 text-sm`}
              >
                  Usage
              </button>
              <button
                  onClick={() => setActiveTab('settings')}
                  className={`${
                  activeTab === 'settings'
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium flex items-center gap-x-1 text-sm`}
              >
                  Settings
              </button>
          </nav>
      </div>

      {activeTab === 'agents' && 
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">AI Agents</h1>
          <Link 
            href="/dashboard/chatbots/create" 
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
             New Agents
          </Link>
        </div>
        {/* Chatbots List */}
        <div className="mt-8">
          
            <ul className="flex space-x-16">
              {chatbots.map((chatbot) => (
                <li key={chatbot.id}>
                  <Link href={`/dashboard/chatbot/${chatbot.id}`} className="block hover:bg-gray-50 w-fit">
                    <div className="h-60 border-gray-400 border rounded-lg flex flex-col hover:shadow-xl hover:scale-105 transition-all duration-300">
                        <div className="flex-grow flex items-center justify-center bg-gray-200 p-4">
                          <MessageSquare width={88} height={88} />
                        </div>
                        <div className=" p-4 flex-col flex-shrink-0 flex items-center justify-center">
                          <p className="text-sm font-medium truncate text-center text-gray-800 break-words w-full px-2">{chatbot.name}</p>
                          <div className={`ml-2 flex-shrink-0 flex`}>
                            <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              chatbot.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {chatbot.status}
                            </p>
                          </div>
                        </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
        </div>
      </div>}
    </>
  );
}