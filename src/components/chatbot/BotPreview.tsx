'use client';

import { useState } from 'react';
import { ChatBubbleLeftRightIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface BotPreviewProps {
  botConfig: {
    name: string;
    welcomeMessage: string;
    primaryColor: string;
    avatar: string;
    position: 'bottom-right' | 'bottom-left';
    iconSize: 'small' | 'medium' | 'large';
    bubbleStyle: 'rounded' | 'square';
  };
}

export function BotPreview({ botConfig }: BotPreviewProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: botConfig.welcomeMessage }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage = { role: 'user', content: inputValue };
    setMessages([...messages, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate bot response
    setTimeout(() => {
      const botResponse = { 
        role: 'assistant', 
        content: `This is a preview of how your bot will respond to "${inputValue}". In the actual deployment, responses will be generated based on your training data and AI model.` 
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000);
  };

  // Position styles
  const positionStyles = {
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4'
  };

  // Icon size styles
  const iconSizes = {
    'small': 'h-12 w-12',
    'medium': 'h-14 w-14',
    'large': 'h-16 w-16'
  };

  // Bubble style
  const bubbleStyles = {
    'rounded': 'rounded-full',
    'square': 'rounded-md'
  };

  // Avatar display
  const getAvatar = () => {
    switch (botConfig.avatar) {
      case 'default': return '😊';
      case 'robot': return '🤖';
      case 'human': return '👤';
      case 'custom': return '📷';
      default: return '🤖';
    }
  };

  return (
    <div className="relative h-[500px] border border-gray-200 rounded-lg overflow-hidden bg-gray-100">
      {/* Website content simulation */}
      <div className="w-full h-full p-4 flex flex-col">
        <div className="bg-white w-full h-12 rounded-t-lg border-b border-gray-200 flex items-center px-4">
          <div className="flex space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <div className="mx-auto">
            <div className="w-64 h-6 bg-gray-200 rounded-full"></div>
          </div>
        </div>
        <div className="flex-1 bg-white p-4">
          <div className="w-full h-8 bg-gray-200 rounded-md mb-4"></div>
          <div className="w-3/4 h-4 bg-gray-200 rounded-md mb-2"></div>
          <div className="w-5/6 h-4 bg-gray-200 rounded-md mb-2"></div>
          <div className="w-2/3 h-4 bg-gray-200 rounded-md mb-6"></div>
          
          <div className="w-full h-32 bg-gray-200 rounded-md mb-6"></div>
          
          <div className="w-full h-4 bg-gray-200 rounded-md mb-2"></div>
          <div className="w-5/6 h-4 bg-gray-200 rounded-md mb-2"></div>
          <div className="w-4/5 h-4 bg-gray-200 rounded-md mb-2"></div>
          <div className="w-3/4 h-4 bg-gray-200 rounded-md"></div>
        </div>
      </div>

      {/* Chat widget */}
      <div className={`absolute ${positionStyles[botConfig.position]} z-10`}>
        {!isOpen ? (
          <button 
            onClick={toggleChat}
            className={`${iconSizes[botConfig.iconSize]} ${bubbleStyles[botConfig.bubbleStyle]} flex items-center justify-center shadow-lg`}
            style={{ backgroundColor: botConfig.primaryColor }}
          >
            <span className="text-2xl text-white">{getAvatar()}</span>
          </button>
        ) : (
          <div className="w-80 h-96 flex flex-col bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden">
            {/* Chat header */}
            <div 
              className="px-4 py-3 flex justify-between items-center"
              style={{ backgroundColor: botConfig.primaryColor }}
            >
              <div className="flex items-center">
                <span className="text-xl mr-2">{getAvatar()}</span>
                <h3 className="font-medium text-white">{botConfig.name}</h3>
              </div>
              <button onClick={toggleChat} className="text-white hover:text-gray-200">
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
            
            {/* Chat messages */}
            <div className="flex-1 p-4 overflow-y-auto">
              {messages.map((message, index) => (
                <div 
                  key={index} 
                  className={`mb-3 flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[80%] px-3 py-2 rounded-lg ${
                      message.role === 'user' 
                        ? 'bg-primary-600 text-white' 
                        : 'bg-gray-100 text-gray-800'
                    }`}
                    style={message.role === 'user' ? { backgroundColor: botConfig.primaryColor } : {}}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start mb-3">
                  <div className="bg-gray-100 px-3 py-2 rounded-lg">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Chat input */}
            <form onSubmit={handleSendMessage} className="border-t border-gray-200 p-3 flex">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 border border-gray-300 rounded-l-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
              <button 
                type="submit"
                className="px-4 py-2 rounded-r-md text-white"
                style={{ backgroundColor: botConfig.primaryColor }}
              >
                Send
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}