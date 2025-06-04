'use client';

import { useState } from 'react';
import { Spinner } from '@/components/common/Spinner';

interface ShopifyIntegrationModalProps {
  chatbotId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ShopifyIntegrationModal({
  chatbotId,
  isOpen,
  onClose,
  onSuccess
}: ShopifyIntegrationModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [shopUrl, setShopUrl] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [apiSecretKey, setApiSecretKey] = useState('');
  
  if (!isOpen) return null;
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Validate shop URL format
    if (!shopUrl.match(/^[a-zA-Z0-9][a-zA-Z0-9-]*\.myshopify\.com$/)) {
      setError('Please enter a valid Shopify store URL (e.g., your-store.myshopify.com)');
      setLoading(false);
      return;
    }
    
    try {
      // In production, this would call the real API
      // await fetch(`/api/chatbots/${chatbotId}/integrations/shopify/configure`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ shopUrl, apiKey, apiSecretKey }),
      // });
      
      // For development, simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      onSuccess();
      onClose();
    } catch (err) {
      console.error('Failed to configure Shopify integration:', err);
      setError('Failed to configure Shopify integration. Please check your credentials and try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Connect Shopify Store</h3>
        
        {error && (
          <div className="mb-4 rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="shopUrl" className="block text-sm font-medium text-gray-700">
                Shopify Store URL
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="shopUrl"
                  value={shopUrl}
                  onChange={(e) => setShopUrl(e.target.value)}
                  className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="your-store.myshopify.com"
                  required
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700">
                API Key
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="apiKey"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  required
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="apiSecretKey" className="block text-sm font-medium text-gray-700">
                API Secret Key
              </label>
              <div className="mt-1">
                <input
                  type="password"
                  id="apiSecretKey"
                  value={apiSecretKey}
                  onChange={(e) => setApiSecretKey(e.target.value)}
                  className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  required
                />
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
            >
              {loading ? <Spinner size="sm" color="white" /> : 'Connect'}
            </button>
          </div>
        </form>
        
        <div className="mt-4 pt-4 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-900">How to find your Shopify API credentials</h4>
          <ol className="mt-2 text-xs text-gray-500 list-decimal list-inside space-y-1">
            <li>Log in to your Shopify admin panel</li>
            <li>Go to Apps > App and sales channel settings</li>
            <li>Click "Develop apps for your store"</li>
            <li>Create a new app or select an existing one</li>
            <li>Under "API credentials", click "Configure Admin API scopes"</li>
            <li>Add the required scopes and save</li>
            <li>Your API key and secret will be displayed</li>
          </ol>
          <p className="mt-2 text-xs text-gray-500">
            Need help? <a href="https://shopify.dev/docs/apps/auth/admin-app-access-tokens" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-500">Read the Shopify API documentation</a>
          </p>
        </div>
      </div>
    </div>
  );
}