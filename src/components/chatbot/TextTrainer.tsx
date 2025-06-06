'use client';

import { useState } from 'react';
import { DocumentTextIcon, PlusIcon } from '@heroicons/react/24/outline';

interface TextTrainerProps {
  onSubmit: (data: TextTrainerData) => void;
}

export interface TextTrainerData {
  title: string;
  content: string;
  type: 'article' | 'description' | 'conversation';
}

export function TextTrainer({ onSubmit }: TextTrainerProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState<'article' | 'description' | 'conversation'>('article');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title && content) {
      onSubmit({
        title,
        content,
        type
      });
      
      // Reset form after submission
      setTitle('');
      setContent('');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 my-4">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        Train Agent with Text Content
      </h3>
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label htmlFor="contentType" className="block text-sm font-medium text-gray-700">
              Content Type
            </label>
            <select
              id="contentType"
              value={type}
              onChange={(e) => setType(e.target.value as any)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
            >
              <option value="article">Article</option>
              <option value="description">Description</option>
              <option value="conversation">Conversation</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              placeholder="Enter a title for this content"
              required
            />
          </div>
          
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700">
              Content
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={8}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              placeholder={type === 'conversation' ? "Paste your conversation history here..." : "Enter or paste your content here..."}
              required
            />
          </div>
          
          <div className="pt-4">
            <button
              type="submit"
              disabled={!title || !content}
              className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Add Content to Training
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}