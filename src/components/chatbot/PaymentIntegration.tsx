'use client';

import { useState } from 'react';
import { CreditCardIcon, CheckIcon } from '@heroicons/react/24/outline';

interface PaymentIntegrationProps {
  onSubmit: (data: PaymentIntegrationData) => void;
}

export interface PaymentIntegrationData {
  provider: 'stripe' | 'paystack' | 'opay' | 'moneypoint';
  settings: {
    publishableKey?: string;
    secretKey?: string;
    merchantId?: string;
    apiKey?: string;
  };
}

export function PaymentIntegration({ onSubmit }: PaymentIntegrationProps) {
  const [provider, setProvider] = useState<'stripe' | 'paystack' | 'opay' | 'moneypoint'>('stripe');
  const [publishableKey, setPublishableKey] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [merchantId, setMerchantId] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [isConnected, setIsConnected] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const settings = {
      ...(provider === 'stripe' && { publishableKey, secretKey }),
      ...(provider === 'paystack' && { publishableKey, secretKey }),
      ...(provider === 'opay' && { merchantId, secretKey }),
      ...(provider === 'moneypoint' && { merchantId, apiKey })
    };
    
    onSubmit({
      provider,
      settings
    });
    
    // In a real app, this would verify the connection
    setIsConnected(true);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 my-4">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        Payment Integration
      </h3>
      
      {!isConnected ? (
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Provider
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <input
                    type="radio"
                    id="stripe"
                    name="provider"
                    value="stripe"
                    checked={provider === 'stripe'}
                    onChange={() => setProvider('stripe')}
                    className="sr-only"
                  />
                  <label
                    htmlFor="stripe"
                    className={`flex flex-col items-center p-3 border rounded-md cursor-pointer ${
                      provider === 'stripe'
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <span className="text-2xl">💳</span>
                    <span className="mt-2 text-sm font-medium">Stripe</span>
                  </label>
                </div>
                
                <div>
                  <input
                    type="radio"
                    id="paystack"
                    name="provider"
                    value="paystack"
                    checked={provider === 'paystack'}
                    onChange={() => setProvider('paystack')}
                    className="sr-only"
                  />
                  <label
                    htmlFor="paystack"
                    className={`flex flex-col items-center p-3 border rounded-md cursor-pointer ${
                      provider === 'paystack'
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <span className="text-2xl">💰</span>
                    <span className="mt-2 text-sm font-medium">Paystack</span>
                  </label>
                </div>
                
                <div>
                  <input
                    type="radio"
                    id="opay"
                    name="provider"
                    value="opay"
                    checked={provider === 'opay'}
                    onChange={() => setProvider('opay')}
                    className="sr-only"
                  />
                  <label
                    htmlFor="opay"
                    className={`flex flex-col items-center p-3 border rounded-md cursor-pointer ${
                      provider === 'opay'
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <span className="text-2xl">📱</span>
                    <span className="mt-2 text-sm font-medium">OPay</span>
                  </label>
                </div>
                
                <div>
                  <input
                    type="radio"
                    id="moneypoint"
                    name="provider"
                    value="moneypoint"
                    checked={provider === 'moneypoint'}
                    onChange={() => setProvider('moneypoint')}
                    className="sr-only"
                  />
                  <label
                    htmlFor="moneypoint"
                    className={`flex flex-col items-center p-3 border rounded-md cursor-pointer ${
                      provider === 'moneypoint'
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <span className="text-2xl">💵</span>
                    <span className="mt-2 text-sm font-medium">MoneyPoint</span>
                  </label>
                </div>
              </div>
            </div>
            
            {(provider === 'stripe' || provider === 'paystack') && (
              <>
                <div>
                  <label htmlFor="publishableKey" className="block text-sm font-medium text-gray-700">
                    {provider === 'stripe' ? 'Publishable Key' : 'Public Key'}
                  </label>
                  <input
                    type="text"
                    id="publishableKey"
                    value={publishableKey}
                    onChange={(e) => setPublishableKey(e.target.value)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    placeholder={`Enter your ${provider === 'stripe' ? 'Stripe publishable key' : 'Paystack public key'}`}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="secretKey" className="block text-sm font-medium text-gray-700">
                    Secret Key
                  </label>
                  <input
                    type="password"
                    id="secretKey"
                    value={secretKey}
                    onChange={(e) => setSecretKey(e.target.value)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    placeholder={`Enter your ${provider} secret key`}
                    required
                  />
                </div>
              </>
            )}
            
            {provider === 'opay' && (
              <>
                <div>
                  <label htmlFor="merchantId" className="block text-sm font-medium text-gray-700">
                    Merchant ID
                  </label>
                  <input
                    type="text"
                    id="merchantId"
                    value={merchantId}
                    onChange={(e) => setMerchantId(e.target.value)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    placeholder="Enter your OPay merchant ID"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="secretKey" className="block text-sm font-medium text-gray-700">
                    Secret Key
                  </label>
                  <input
                    type="password"
                    id="secretKey"
                    value={secretKey}
                    onChange={(e) => setSecretKey(e.target.value)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    placeholder="Enter your OPay secret key"
                    required
                  />
                </div>
              </>
            )}
            
            {provider === 'moneypoint' && (
              <>
                <div>
                  <label htmlFor="merchantId" className="block text-sm font-medium text-gray-700">
                    Merchant ID
                  </label>
                  <input
                    type="text"
                    id="merchantId"
                    value={merchantId}
                    onChange={(e) => setMerchantId(e.target.value)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    placeholder="Enter your MoneyPoint merchant ID"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700">
                    API Key
                  </label>
                  <input
                    type="password"
                    id="apiKey"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    placeholder="Enter your MoneyPoint API key"
                    required
                  />
                </div>
              </>
            )}
            
            <div className="pt-4">
              <button
                type="submit"
                className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <CreditCardIcon className="h-5 w-5 mr-2" />
                Connect Payment Provider
              </button>
            </div>
          </div>
        </form>
      ) : (
        <div className="text-center py-6">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
            <CheckIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
          </div>
          <h3 className="mt-3 text-lg font-medium text-gray-900">Payment Provider Connected</h3>
          <p className="mt-2 text-sm text-gray-500">
            Your {provider === 'stripe' ? 'Stripe' : provider === 'paystack' ? 'Paystack' : provider === 'opay' ? 'OPay' : 'MoneyPoint'} account has been successfully connected.
          </p>
          <div className="mt-4">
            <button
              type="button"
              onClick={() => setIsConnected(false)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Disconnect
            </button>
          </div>
        </div>
      )}
    </div>
  );
}