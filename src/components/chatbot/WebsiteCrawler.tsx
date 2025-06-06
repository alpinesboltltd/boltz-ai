'use client';

import { useState } from 'react';
import { GlobeAltIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface WebsiteCrawlerProps {
  onSubmit: (data: WebsiteCrawlerData) => void;
}

export interface WebsiteCrawlerData {
  websiteUrl: string;
  includePaths: string[];
  excludePaths: string[];
}

export function WebsiteCrawler({ onSubmit }: WebsiteCrawlerProps) {
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [includePath, setIncludePath] = useState('');
  const [excludePath, setExcludePath] = useState('');
  const [includePaths, setIncludePaths] = useState<string[]>([]);
  const [excludePaths, setExcludePaths] = useState<string[]>([]);
  const [isValidUrl, setIsValidUrl] = useState(true);

  const validateUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setWebsiteUrl(url);
    setIsValidUrl(url === '' || validateUrl(url));
  };

  const addIncludePath = () => {
    if (includePath && !includePaths.includes(includePath)) {
      setIncludePaths([...includePaths, includePath]);
      setIncludePath('');
    }
  };

  const addExcludePath = () => {
    if (excludePath && !excludePaths.includes(excludePath)) {
      setExcludePaths([...excludePaths, excludePath]);
      setExcludePath('');
    }
  };

  const removeIncludePath = (path: string) => {
    setIncludePaths(includePaths.filter(p => p !== path));
  };

  const removeExcludePath = (path: string) => {
    setExcludePaths(excludePaths.filter(p => p !== path));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (websiteUrl && validateUrl(websiteUrl)) {
      onSubmit({
        websiteUrl,
        includePaths,
        excludePaths
      });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 my-4">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        Train Agent with Website Content
      </h3>
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label htmlFor="websiteUrl" className="block text-sm font-medium text-gray-700">
              Website URL
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <GlobeAltIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <input
                type="text"
                id="websiteUrl"
                value={websiteUrl}
                onChange={handleUrlChange}
                className={`block w-full pl-10 pr-12 py-2 sm:text-sm rounded-md ${
                  isValidUrl 
                    ? 'border-gray-300 focus:ring-primary-500 focus:border-primary-500' 
                    : 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500'
                }`}
                placeholder="https://example.com"
              />
            </div>
            {!isValidUrl && (
              <p className="mt-2 text-sm text-red-600">
                Please enter a valid URL (e.g., https://example.com)
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="includePath" className="block text-sm font-medium text-gray-700">
                Include Paths (Optional)
              </label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <input
                  type="text"
                  id="includePath"
                  value={includePath}
                  onChange={(e) => setIncludePath(e.target.value)}
                  className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-l-md sm:text-sm border-gray-300 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="/blog, /docs, etc."
                />
                <button
                  type="button"
                  onClick={addIncludePath}
                  className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 text-gray-500 sm:text-sm hover:bg-gray-100"
                >
                  Add
                </button>
              </div>
              {includePaths.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {includePaths.map((path) => (
                    <span 
                      key={path} 
                      className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-green-100 text-green-800"
                    >
                      {path}
                      <button 
                        type="button" 
                        onClick={() => removeIncludePath(path)}
                        className="ml-1.5 inline-flex text-green-400 hover:text-green-600 focus:outline-none"
                      >
                        <XMarkIcon className="h-4 w-4" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label htmlFor="excludePath" className="block text-sm font-medium text-gray-700">
                Exclude Paths (Optional)
              </label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <input
                  type="text"
                  id="excludePath"
                  value={excludePath}
                  onChange={(e) => setExcludePath(e.target.value)}
                  className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-l-md sm:text-sm border-gray-300 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="/admin, /private, etc."
                />
                <button
                  type="button"
                  onClick={addExcludePath}
                  className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 text-gray-500 sm:text-sm hover:bg-gray-100"
                >
                  Add
                </button>
              </div>
              {excludePaths.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {excludePaths.map((path) => (
                    <span 
                      key={path} 
                      className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-red-100 text-red-800"
                    >
                      {path}
                      <button 
                        type="button" 
                        onClick={() => removeExcludePath(path)}
                        className="ml-1.5 inline-flex text-red-400 hover:text-red-600 focus:outline-none"
                      >
                        <XMarkIcon className="h-4 w-4" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={!websiteUrl || !isValidUrl}
              className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
            >
              <CheckIcon className="h-5 w-5 mr-2" />
              Start Website Crawling
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}