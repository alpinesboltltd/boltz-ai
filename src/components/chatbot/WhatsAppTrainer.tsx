'use client';

import { useState } from 'react';
import { ChatBubbleLeftRightIcon, ArrowUpTrayIcon } from '@heroicons/react/24/outline';

interface WhatsAppTrainerProps {
  onSubmit: (data: WhatsAppTrainerData) => void;
}

export interface WhatsAppTrainerData {
  chatName: string;
  exportFile: File | null;
  conversationText: string;
}

export function WhatsAppTrainer({ onSubmit }: WhatsAppTrainerProps) {
  const [chatName, setChatName] = useState('');
  const [exportFile, setExportFile] = useState<File | null>(null);
  const [conversationText, setConversationText] = useState('');
  const [uploadMethod, setUploadMethod] = useState<'file' | 'paste'>('file');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setExportFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (chatName && (exportFile || conversationText)) {
      onSubmit({
        chatName,
        exportFile,
        conversationText
      });
      
      // Reset form after submission
      setChatName('');
      setExportFile(null);
      setConversationText('');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 my-4">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        Train Agent with WhatsApp Conversations
      </h3>
      
      <div className="mb-4">
        <div className="flex items-center space-x-4">
          <button
            type="button"
            onClick={() => setUploadMethod('file')}
            className={`flex-1 py-2 px-4 text-center text-sm font-medium rounded-md ${
              uploadMethod === 'file' 
                ? 'bg-primary-100 text-primary-700 border border-primary-300' 
                : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
            }`}
          >
            Upload Chat Export
          </button>
          <button
            type="button"
            onClick={() => setUploadMethod('paste')}
            className={`flex-1 py-2 px-4 text-center text-sm font-medium rounded-md ${
              uploadMethod === 'paste' 
                ? 'bg-primary-100 text-primary-700 border border-primary-300' 
                : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
            }`}
          >
            Paste Conversation
          </button>
        </div>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label htmlFor="chatName" className="block text-sm font-medium text-gray-700">
              Chat Name
            </label>
            <input
              type="text"
              id="chatName"
              value={chatName}
              onChange={(e) => setChatName(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              placeholder="E.g., Customer Support Chat"
              required
            />
          </div>
          
          {uploadMethod === 'file' ? (
            <div>
              <label htmlFor="chatExport" className="block text-sm font-medium text-gray-700">
                WhatsApp Chat Export (.txt)
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <ArrowUpTrayIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="chatExport"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
                    >
                      <span>Upload a file</span>
                      <input 
                        id="chatExport" 
                        name="chatExport" 
                        type="file" 
                        accept=".txt" 
                        className="sr-only"
                        onChange={handleFileChange}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    TXT file exported from WhatsApp
                  </p>
                  {exportFile && (
                    <p className="text-sm text-primary-600 font-medium">
                      {exportFile.name}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div>
              <label htmlFor="conversationText" className="block text-sm font-medium text-gray-700">
                Paste WhatsApp Conversation
              </label>
              <textarea
                id="conversationText"
                value={conversationText}
                onChange={(e) => setConversationText(e.target.value)}
                rows={8}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                placeholder="Paste your WhatsApp conversation here..."
                required={uploadMethod === 'paste'}
              />
              <p className="mt-2 text-xs text-gray-500">
                Include timestamps and names in the format: [DD/MM/YY, HH:MM:SS] Name: Message
              </p>
            </div>
          )}
          
          <div className="pt-4">
            <button
              type="submit"
              disabled={(uploadMethod === 'file' && !exportFile) || (uploadMethod === 'paste' && !conversationText) || !chatName}
              className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
            >
              <ChatBubbleLeftRightIcon className="h-5 w-5 mr-2" />
              Train with WhatsApp Data
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}