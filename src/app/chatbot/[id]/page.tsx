'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChatInterface } from '@/components/chatbot';
import { Spinner } from '@/components/common/Spinner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AppearanceSettings } from '@/components/chatbot';
import { HumanHandoffSettings, SecuritySettings } from '@/components/dashboard';
import { PlatformIntegrations } from '@/components/dashboard';
import { KnowledgeBaseManager } from '@/components/knowledge';
import Link from 'next/link';

interface Chatbot {
  id: string;
  name: string;
  welcomeMessage: string;
  primaryColor: string;
  secondaryColor: string;
  avatarStyle: 'default' | 'robot' | 'human' | 'custom' | 'none';
  avatarImage?: string;
  fontFamily: string;
  darkMode: boolean;
  platforms: string[];
  integrations: Record<string, boolean>;
  apiKey: string;
  createdAt: string;
  updatedAt: string;
}

export default function ChatbotPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [chatbot, setChatbot] = useState<Chatbot | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('preview');
  const [previewOpen, setPreviewOpen] = useState(true);
  
  useEffect(() => {
    async function loadChatbot() {
      try {
        // In production, this would call the real API
        // const response = await fetch(`/api/chatbots/${params.id}`);
        // const data = await response.json();
        
        // For development, use mock data
        await new Promise(resolve => setTimeout(resolve, 1000));
        const data = {
          id: params.id,
          name: 'Customer Support Bot',
          welcomeMessage: 'Hello! I\'m here to help with any questions about our products and services.',
          primaryColor: '#6366F1',
          secondaryColor: '#F3F4F6',
          avatarStyle: 'robot' as const,
          fontFamily: 'Inter, sans-serif',
          darkMode: false,
          platforms: ['website'],
          integrations: {
            website: true,
            whatsapp: false,
            slack: false,
            facebook: false,
            shopify: false,
            wordpress: false,
            twilio: false,
            telegram: false,
            instagram: false,
            twitter: false,
            discord: false
          },
          apiKey: 'sk_test_' + Math.random().toString(36).substring(2, 15),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        setChatbot(data);
      } catch (error) {
        console.error('Failed to load chatbot:', error);
      } finally {
        setLoading(false);
      }
    }
    
    loadChatbot();
  }, [params.id]);
  
  const handleSaveAppearance = async (settings: any) => {
    try {
      // In production, this would call the real API
      // await fetch(`/api/chatbots/${params.id}`, {
      //   method: 'PATCH',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(settings),
      // });
      
      // For development, simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setChatbot(prev => ({
        ...prev!,
        ...settings
      }));
      
      return Promise.resolve();
    } catch (error) {
      console.error('Failed to save appearance settings:', error);
      return Promise.reject(error);
    }
  };
  
  const handleSaveHumanHandoff = async (settings: any) => {
    try {
      // In production, this would call the real API
      // await fetch(`/api/chatbots/${params.id}/human-handoff`, {
      //   method: 'PATCH',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(settings),
      // });
      
      // For development, simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return Promise.resolve();
    } catch (error) {
      console.error('Failed to save human handoff settings:', error);
      return Promise.reject(error);
    }
  };
  
  const handleSaveSecurity = async (settings: any) => {
    try {
      // In production, this would call the real API
      // await fetch(`/api/chatbots/${params.id}/security`, {
      //   method: 'PATCH',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(settings),
      // });
      
      // For development, simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return Promise.resolve();
    } catch (error) {
      console.error('Failed to save security settings:', error);
      return Promise.reject(error);
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }
  
  if (!chatbot) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Chatbot not found</h2>
          <p className="mt-2 text-gray-600">The chatbot you're looking for doesn't exist or you don't have access to it.</p>
          <Link 
            href="/dashboard/chatbots"
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
          >
            Back to Chatbots
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{chatbot.name}</h1>
            <p className="text-sm text-gray-500">Created on {new Date(chatbot.createdAt).toLocaleDateString()}</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setPreviewOpen(!previewOpen)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              {previewOpen ? 'Hide Preview' : 'Show Preview'}
            </button>
            <Link
              href="/dashboard/chatbots"
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Back to Chatbots
            </Link>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="preview">Preview</TabsTrigger>
                <TabsTrigger value="appearance">Appearance</TabsTrigger>
                <TabsTrigger value="integrations">Integrations</TabsTrigger>
                <TabsTrigger value="knowledge">Knowledge Base</TabsTrigger>
                <TabsTrigger value="handoff">Human Handoff</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
              </TabsList>
              
              <TabsContent value="preview" className="space-y-4">
                <div className="bg-white shadow rounded-lg p-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Chatbot Preview</h2>
                  <p className="text-sm text-gray-500 mb-6">
                    This is how your chatbot will appear to your users. You can customize its appearance in the Appearance tab.
                  </p>
                  
                  <div className="h-[600px] border border-gray-200 rounded-lg relative">
                    <ChatInterface
                      chatbotName={chatbot.name}
                      welcomeMessage={chatbot.welcomeMessage}
                      primaryColor={chatbot.primaryColor}
                      secondaryColor={chatbot.secondaryColor}
                      avatarStyle={chatbot.avatarStyle}
                      avatarImage={chatbot.avatarImage}
                      isOpen={true}
                      darkMode={chatbot.darkMode}
                      fontFamily={chatbot.fontFamily}
                    />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="appearance">
                <AppearanceSettings
                  chatbotId={params.id}
                  initialSettings={{
                    primaryColor: chatbot.primaryColor,
                    secondaryColor: chatbot.secondaryColor,
                    fontFamily: chatbot.fontFamily,
                    avatarType: chatbot.avatarStyle,
                    avatarImage: chatbot.avatarImage,
                    welcomeMessage: chatbot.welcomeMessage,
                    botName: chatbot.name,
                    bubbleIcon: 'default',
                    position: 'bottom-right',
                    darkMode: chatbot.darkMode,
                  }}
                  onSave={handleSaveAppearance}
                />
              </TabsContent>
              
              <TabsContent value="integrations">
                <PlatformIntegrations
                  chatbotId={params.id}
                  initialIntegrations={chatbot.integrations}
                />
              </TabsContent>
              
              <TabsContent value="knowledge">
                <KnowledgeBaseManager chatbotId={params.id} />
              </TabsContent>
              
              <TabsContent value="handoff">
                <HumanHandoffSettings
                  chatbotId={params.id}
                  onSave={handleSaveHumanHandoff}
                />
              </TabsContent>
              
              <TabsContent value="security">
                <SecuritySettings
                  chatbotId={params.id}
                  onSave={handleSaveSecurity}
                />
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Right sidebar with preview */}
          {previewOpen && (
            <div className="lg:col-span-1">
              <div className="bg-white shadow rounded-lg p-4 sticky top-8">
                <h3 className="text-md font-medium text-gray-900 mb-4">Live Preview</h3>
                <div className="h-[500px] border border-gray-200 rounded-lg relative">
                  <ChatInterface
                    chatbotName={chatbot.name}
                    welcomeMessage={chatbot.welcomeMessage}
                    primaryColor={chatbot.primaryColor}
                    secondaryColor={chatbot.secondaryColor}
                    avatarStyle={chatbot.avatarStyle}
                    avatarImage={chatbot.avatarImage}
                    isOpen={true}
                    darkMode={chatbot.darkMode}
                    fontFamily={chatbot.fontFamily}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}