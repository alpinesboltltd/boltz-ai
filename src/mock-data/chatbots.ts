import { Chatbot } from '@/types';

export const chatbots: Chatbot[] = [
  {
    id: '1',
    name: 'Customer Support Bot',
    description: 'A chatbot for handling customer support inquiries',
    aiModel: 'gemini-pro',
    status: 'active',
    createdAt: '2023-11-15T10:30:00Z',
    updatedAt: '2023-12-05T14:22:00Z',
    settings: {
      appearance: {
        primaryColor: '#0ea5e9',
        fontFamily: 'Inter',
        chatIcon: 'chat-bubble',
        welcomeMessage: 'Hi there! How can I help you today?',
      },
      behavior: {
        initialMessages: [
          'Hi there! How can I help you today?',
          'You can ask me about our products, services, or support issues.',
        ],
        fallbackMessage: "I'm sorry, I don't understand that question. Could you rephrase it?",
        enableHumanHandoff: true,
        offlineMessage: 'Our support team is currently offline. Please leave a message and we'll get back to you.',
      },
      integrations: {
        platforms: ['website', 'whatsapp'],
        apiKeys: {
          whatsapp: 'wa_api_key_123',
        },
      },
    },
    stats: {
      totalMessages: 1245,
      uniqueUsers: 342,
      averageRating: 4.7,
      responseRate: 0.92,
      conversionsCount: 56,
    },
  },
  {
    id: '2',
    name: 'Sales Assistant',
    description: 'A chatbot for helping with product recommendations and sales',
    aiModel: 'gpt-4',
    status: 'active',
    createdAt: '2023-10-20T09:15:00Z',
    updatedAt: '2023-12-01T11:45:00Z',
    settings: {
      appearance: {
        primaryColor: '#8b5cf6',
        fontFamily: 'Lexend',
        chatIcon: 'shopping-cart',
        welcomeMessage: 'Hello! Looking for product recommendations?',
      },
      behavior: {
        initialMessages: [
          'Hello! Looking for product recommendations?',
          'I can help you find the perfect product based on your needs.',
        ],
        fallbackMessage: "I'm not sure I understand. Could you tell me more about what you're looking for?",
        enableHumanHandoff: true,
        offlineMessage: 'Our sales team is currently unavailable. Please leave your contact information and we'll reach out to you.',
      },
      integrations: {
        platforms: ['website', 'whatsapp', 'shopify'],
        apiKeys: {
          whatsapp: 'wa_api_key_456',
          shopify: 'shopify_api_key_789',
        },
      },
    },
    stats: {
      totalMessages: 876,
      uniqueUsers: 215,
      averageRating: 4.5,
      responseRate: 0.88,
      conversionsCount: 42,
    },
  },
  {
    id: '3',
    name: 'Product Recommender',
    description: 'A chatbot for recommending products based on user preferences',
    aiModel: 'claude-2',
    status: 'draft',
    createdAt: '2023-12-01T15:20:00Z',
    updatedAt: '2023-12-01T15:20:00Z',
    settings: {
      appearance: {
        primaryColor: '#10b981',
        fontFamily: 'Inter',
        chatIcon: 'gift',
        welcomeMessage: 'Hi! I can help you find the perfect product. What are you looking for today?',
      },
      behavior: {
        initialMessages: [
          'Hi! I can help you find the perfect product. What are you looking for today?',
        ],
        fallbackMessage: "I'm not sure I understand. Could you provide more details about what you're looking for?",
        enableHumanHandoff: false,
        offlineMessage: 'Our product specialists are currently unavailable. Please leave a message and we'll get back to you.',
      },
      integrations: {
        platforms: ['website'],
        apiKeys: {},
      },
    },
    stats: {
      totalMessages: 0,
      uniqueUsers: 0,
      averageRating: 0,
      responseRate: 0,
      conversionsCount: 0,
    },
  },
];