// components/ChatbotPage.tsx (or wherever your component is located)
'use client';

import { useState } from 'react';
import { use } from 'react';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { ChatInterface, ModifiedCalendarWidget } from '@/components/chatbot';

// Add showHeader to your component's props interface
export default function ChatbotPage({ 
  params, 
  showHeader = true // Set a default value of true, so it shows by default
}: { 
  params: Promise<{ id: string }>,
  showHeader?: boolean // Make it optional
}) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const [messages, setMessages] = useState<any[]>([
    {
      role: 'assistant',
      content: 'Hello! How can I help you today?',
      timestamp: new Date().toISOString(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);

  const chatbot = {
    id,
    name: 'Customer Support Bot',
    description: 'A helpful assistant for customer inquiries',
    primaryColor: '#6366F1',
    welcomeMessage: 'Hello! How can I help you today?',
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage = {
      role: 'user',
      content: inputValue,
      timestamp: new Date().toISOString(),
    };
    setMessages([...messages, userMessage]);
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      let responseContent = '';

      if (inputValue.toLowerCase().includes('appointment') || 
          inputValue.toLowerCase().includes('book') || 
          inputValue.toLowerCase().includes('schedule')) {
        responseContent = "I'd be happy to help you book an appointment. Let me show you the available dates.";
        setShowCalendar(true);
      } else {
        responseContent = "I understand you're asking about " + inputValue.substring(0, 20) + "... How can I assist you further with this?";
      }

      const assistantMessage = {
        role: 'assistant',
        content: responseContent,
        timestamp: new Date().toISOString(),
      };
      setMessages(prevMessages => [...prevMessages, assistantMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const handleTimeSelected = (time: string, date: Date) => {
    setShowCalendar(false);
    
    const formattedDate = date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    
    const confirmationMessage = {
      role: 'assistant',
      content: `Great! Your appointment has been scheduled for ${formattedDate} at ${time}. You'll receive a confirmation email shortly. Is there anything else you need help with?`,
      timestamp: new Date().toISOString(),
    };
    
    setMessages(prevMessages => [...prevMessages, confirmationMessage]);
  };

  const availableTimes = ['9:00 AM', '10:00 AM', '11:00 AM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'];

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Conditional Rendering of the Header */}
      {showHeader && (
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <div className="flex items-center">
                <Link href="/" className="flex-shrink-0">
                  <span className="text-2xl font-bold text-primary-600">Boltz.co</span>
                </Link>
              </div>
              <div className="flex items-center">
                <Link
                  href="/dashboard/chatbots"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200"
                >
                  <ArrowLeftIcon className="mr-2 h-4 w-4" />
                  Back to Dashboard
                </Link>
              </div>
            </div>
          </div>
        </header>
      )}

      {/* Rest of your component remains the same */}
      <div className="flex-1 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 h-full">
          <div className="bg-white rounded-lg shadow h-full flex flex-col">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">{chatbot.name}</h2>
              <p className="text-sm text-gray-500">{chatbot.description}</p>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-xs sm:max-w-md px-4 py-2 rounded-lg ${
                      message.role === 'user'
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p className="text-xs text-right mt-1 opacity-70">
                      {new Date(message.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              
              {showCalendar && (
                <ModifiedCalendarWidget
                  availableTimes={availableTimes}
                  onTimeSelected={handleTimeSelected}
                  onClose={() => setShowCalendar(false)}
                />
              )}
            </div>

            <div className="px-6 py-4 border-t border-gray-200">
              <form onSubmit={handleSendMessage} className="flex space-x-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  placeholder="Type your message..."
                />
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Send
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}