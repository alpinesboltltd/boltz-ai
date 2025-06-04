import React from 'react';

interface MessageBubbleProps {
  message: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  primaryColor?: string;
  avatarEmoji?: string;
}

export default function MessageBubble({
  message,
  sender,
  timestamp,
  primaryColor = '#6366F1',
  avatarEmoji = '😊',
}: MessageBubbleProps) {
  return (
    <div
      className={`mb-4 flex ${
        sender === 'user' ? 'justify-end' : 'justify-start'
      }`}
    >
      {sender === 'bot' && (
        <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center mr-2 flex-shrink-0">
          <span className="text-sm">{avatarEmoji}</span>
        </div>
      )}
      <div
        className={`px-4 py-2 rounded-lg max-w-[75%] ${
          sender === 'user'
            ? 'bg-primary-600 text-white'
            : 'bg-white text-gray-800 border border-gray-200'
        }`}
        style={{ 
          backgroundColor: sender === 'user' ? primaryColor : undefined 
        }}
      >
        <p className="text-sm">{message}</p>
        <p className="text-xs mt-1 opacity-70">
          {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
      {sender === 'user' && (
        <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center ml-2 flex-shrink-0">
          <span className="text-sm">👤</span>
        </div>
      )}
    </div>
  );
}