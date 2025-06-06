'use client';

import { useState, useEffect } from 'react';
import { Spinner } from '@/components/common/Spinner';
import { 
  ChatBubbleLeftRightIcon, 
  UserIcon, 
  ClockIcon, 
  QuestionMarkCircleIcon 
} from '@heroicons/react/24/outline';

// Mock chart component - in a real app, you'd use a library like Chart.js or Recharts
const Chart = ({ type, data, labels, height = 300 }: { type: string; data: number[]; labels: string[]; height?: number }) => {
  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200" style={{ height }}>
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500 text-sm">Chart visualization would appear here ({type} chart with {data.length} data points)</p>
      </div>
    </div>
  );
};

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');
  const [selectedChatbot, setSelectedChatbot] = useState('all');
  const [chatbots, setChatbots] = useState<{id: string, name: string}[]>([]);
  const [analytics, setAnalytics] = useState({
    totalConversations: 0,
    totalMessages: 0,
    avgConversationLength: 0,
    avgResponseTime: 0,
    topQuestions: [] as {question: string, count: number}[],
    conversationsByDay: [] as number[],
    conversationsByHour: [] as number[],
    messagesByDay: [] as number[],
    userSatisfaction: [] as number[],
    platformDistribution: [] as {platform: string, percentage: number}[]
  });
  
  useEffect(() => {
    async function loadAnalytics() {
      try {
        // In production, this would call the real API
        // const response = await fetch(`/api/analytics?timeRange=${timeRange}&chatbotId=${selectedChatbot}`);
        // const data = await response.json();
        
        // For development, use mock data
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockChatbots = [
          { id: 'bot1', name: 'Customer Support Bot' },
          { id: 'bot2', name: 'Sales Assistant' },
          { id: 'bot3', name: 'Product Recommender' }
        ];
        
        // Generate some random data based on the time range
        const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
        const conversationsByDay = Array.from({ length: days }, () => Math.floor(Math.random() * 100) + 20);
        const messagesByDay = conversationsByDay.map(c => c * (Math.floor(Math.random() * 5) + 3));
        const totalConversations = conversationsByDay.reduce((sum, val) => sum + val, 0);
        const totalMessages = messagesByDay.reduce((sum, val) => sum + val, 0);
        
        const mockAnalytics = {
          totalConversations,
          totalMessages,
          avgConversationLength: +(totalMessages / totalConversations).toFixed(1),
          avgResponseTime: +(Math.random() * 5 + 1).toFixed(1),
          topQuestions: [
            { question: "How do I reset my password?", count: Math.floor(Math.random() * 200) + 100 },
            { question: "What are your business hours?", count: Math.floor(Math.random() * 150) + 80 },
            { question: "How do I cancel my subscription?", count: Math.floor(Math.random() * 120) + 60 },
            { question: "Where can I find pricing information?", count: Math.floor(Math.random() * 100) + 50 },
            { question: "How do I contact customer support?", count: Math.floor(Math.random() * 80) + 40 }
          ],
          conversationsByDay,
          conversationsByHour: Array.from({ length: 24 }, () => Math.floor(Math.random() * 50) + 5),
          messagesByDay,
          userSatisfaction: Array.from({ length: days }, () => +(Math.random() * 2 + 3).toFixed(1)),
          platformDistribution: [
            { platform: "Website", percentage: 65 },
            { platform: "WhatsApp", percentage: 20 },
            { platform: "Facebook", percentage: 10 },
            { platform: "Slack", percentage: 5 }
          ]
        };
        
        setChatbots(mockChatbots);
        setAnalytics(mockAnalytics);
      } catch (error) {
        console.error('Failed to load analytics:', error);
      } finally {
        setLoading(false);
      }
    }
    
    loadAnalytics();
  }, [timeRange, selectedChatbot]);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }
  
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Analytics Dashboard</h1>
          <p className="mt-2 text-sm text-gray-700">
            View performance metrics and insights for your chatbots.
          </p>
        </div>
      </div>
      
      {/* Filters */}
      <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-4">
          <div>
            <label htmlFor="chatbot-filter" className="block text-sm font-medium text-gray-700">
              Chatbot
            </label>
            <select
              id="chatbot-filter"
              name="chatbot-filter"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
              value={selectedChatbot}
              onChange={(e) => setSelectedChatbot(e.target.value)}
            >
              <option value="all">All Chatbots</option>
              {chatbots.map((bot) => (
                <option key={bot.id} value={bot.id}>{bot.name}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="time-range" className="block text-sm font-medium text-gray-700">
              Time Range
            </label>
            <select
              id="time-range"
              name="time-range"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
            </select>
          </div>
        </div>
        
        <button
          type="button"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
          onClick={() => {
            // In a real app, this would download a report
            alert('Downloading analytics report...');
          }}
        >
          Export Report
        </button>
      </div>
      
      {/* Stats Cards */}
      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-primary-100 rounded-md p-3">
                <ChatBubbleLeftRightIcon className="h-6 w-6 text-primary-600" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Conversations</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">{analytics.totalConversations.toLocaleString()}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-primary-100 rounded-md p-3">
                <UserIcon className="h-6 w-6 text-primary-600" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Messages</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">{analytics.totalMessages.toLocaleString()}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-primary-100 rounded-md p-3">
                <ClockIcon className="h-6 w-6 text-primary-600" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Avg. Response Time</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">{analytics.avgResponseTime} seconds</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-primary-100 rounded-md p-3">
                <QuestionMarkCircleIcon className="h-6 w-6 text-primary-600" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Avg. Conversation Length</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">{analytics.avgConversationLength} messages</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Charts */}
      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div>
          <h2 className="text-lg font-medium text-gray-900 mb-4">Conversations Over Time</h2>
          <Chart 
            type="line" 
            data={analytics.conversationsByDay} 
            labels={Array.from({ length: analytics.conversationsByDay.length }, (_, i) => `Day ${i + 1}`)} 
          />
        </div>
        
        <div>
          <h2 className="text-lg font-medium text-gray-900 mb-4">Messages Over Time</h2>
          <Chart 
            type="line" 
            data={analytics.messagesByDay} 
            labels={Array.from({ length: analytics.messagesByDay.length }, (_, i) => `Day ${i + 1}`)} 
          />
        </div>
        
        <div>
          <h2 className="text-lg font-medium text-gray-900 mb-4">Conversations by Hour</h2>
          <Chart 
            type="bar" 
            data={analytics.conversationsByHour} 
            labels={Array.from({ length: 24 }, (_, i) => `${i}:00`)} 
          />
        </div>
        
        <div>
          <h2 className="text-lg font-medium text-gray-900 mb-4">Platform Distribution</h2>
          <Chart 
            type="pie" 
            data={analytics.platformDistribution.map(p => p.percentage)} 
            labels={analytics.platformDistribution.map(p => p.platform)} 
          />
        </div>
      </div>
      
      {/* Top Questions */}
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Top Questions</h2>
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul role="list" className="divide-y divide-gray-200">
            {analytics.topQuestions.map((item, index) => (
              <li key={index}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-primary-600 truncate">{item.question}</p>
                    <div className="ml-2 flex-shrink-0 flex">
                      <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {item.count} times
                      </p>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}