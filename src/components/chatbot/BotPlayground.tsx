'use client';

import { useState, useEffect } from 'react';
import { PaperAirplaneIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

interface BotPlaygroundProps {
  botId: string;
  botName: string;
  model: string;
}

export function BotPlayground({ botId, botName, model }: BotPlaygroundProps) {
  const [messages, setMessages] = useState<any[]>([
    { role: 'system', content: `You are now testing the "${botName}" chatbot powered by ${model}.` },
    { role: 'assistant', content: `Hello! I'm ${botName}. How can I help you today?` }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [testQueries, setTestQueries] = useState([
    'Tell me about your services',
    'How can I contact support?',
    'What are your business hours?',
    'Do you offer refunds?',
    'How do I book an appointment?'
  ]);

  const handleSendMessage = (e?: React.FormEvent, predefinedQuery?: string) => {
    if (e) e.preventDefault();
    
    const query = predefinedQuery || inputValue;
    if (!query.trim()) return;

    // Add user message
    const userMessage = { role: 'user', content: query };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response based on training data
    setTimeout(() => {
      let responseContent = '';
      
      // Simple pattern matching for demo purposes
      // In a real app, this would call your AI backend
      if (query.toLowerCase().includes('service')) {
        responseContent = "We offer a range of services including consultation, implementation, and support. Our team specializes in providing tailored solutions for your specific needs.";
      } else if (query.toLowerCase().includes('contact') || query.toLowerCase().includes('support')) {
        responseContent = "You can reach our support team at support@example.com or call us at (555) 123-4567 during business hours.";
      } else if (query.toLowerCase().includes('hour') || query.toLowerCase().includes('time')) {
        responseContent = "Our business hours are Monday to Friday, 9:00 AM to 5:00 PM Eastern Time.";
      } else if (query.toLowerCase().includes('refund') || query.toLowerCase().includes('return')) {
        responseContent = "We offer a 30-day money-back guarantee on all our products. Please contact our support team to initiate a refund.";
      } else if (query.toLowerCase().includes('book') || query.toLowerCase().includes('appointment') || query.toLowerCase().includes('schedule')) {
        responseContent = "You can book an appointment through our online scheduling system. Would you like me to help you schedule one now?";
      } else {
        responseContent = `Thank you for your question. In the actual deployment, I would provide a response based on the training data and knowledge base you've provided. This is just a simulation to help you test how your bot will interact with users.`;
      }

      const assistantMessage = { role: 'assistant', content: responseContent };
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleReset = () => {
    setMessages([
      { role: 'system', content: `You are now testing the "${botName}" chatbot powered by ${model}.` },
      { role: 'assistant', content: `Hello! I'm ${botName}. How can I help you today?` }
    ]);
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden flex flex-col h-[600px]">
      <div className="bg-primary-600 text-white px-4 py-3 flex justify-between items-center">
        <div>
          <h3 className="font-medium">Testing: {botName}</h3>
          <p className="text-xs text-primary-100">Powered by {model}</p>
        </div>
        <button 
          onClick={handleReset}
          className="p-1 rounded-full hover:bg-primary-500 transition-colors"
          title="Reset conversation"
        >
          <ArrowPathIcon className="h-5 w-5" />
        </button>
      </div>
      
      <div className="flex flex-1 overflow-hidden">
        {/* Chat area */}
        <div className="flex-1 flex flex-col">
          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto">
            {messages.filter(m => m.role !== 'system').map((message, index) => (
              <div 
                key={index} 
                className={`mb-4 flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[80%] px-4 py-2 rounded-lg ${
                    message.role === 'user' 
                      ? 'bg-primary-600 text-white' 
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start mb-4">
                <div className="bg-gray-100 px-4 py-2 rounded-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Input area */}
          <div className="border-t border-gray-200 p-4">
            <form onSubmit={handleSendMessage} className="flex space-x-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your test message..."
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <PaperAirplaneIcon className="h-5 w-5" />
              </button>
            </form>
          </div>
        </div>
        
        {/* Test queries sidebar */}
        <div className="hidden md:block w-64 border-l border-gray-200 p-4 bg-gray-50">
          <h4 className="font-medium text-sm text-gray-700 mb-3">Test Queries</h4>
          <div className="space-y-2">
            {testQueries.map((query, index) => (
              <button
                key={index}
                onClick={() => handleSendMessage(undefined, query)}
                className="w-full text-left px-3 py-2 text-sm bg-white border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
              >
                {query}
              </button>
            ))}
          </div>
          
          <div className="mt-6">
            <h4 className="font-medium text-sm text-gray-700 mb-2">Add Custom Test Query</h4>
            <div className="flex">
              <input
                type="text"
                placeholder="New test query"
                className="flex-1 text-sm rounded-l-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.currentTarget.value) {
                    setTestQueries([...testQueries, e.currentTarget.value]);
                    e.currentTarget.value = '';
                  }
                }}
              />
              <button
                type="button"
                className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 text-sm font-medium rounded-r-md bg-gray-50 hover:bg-gray-100"
                onClick={(e) => {
                  const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                  if (input.value) {
                    setTestQueries([...testQueries, input.value]);
                    input.value = '';
                  }
                }}
              >
                Add
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}