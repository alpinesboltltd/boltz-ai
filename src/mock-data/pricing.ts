export interface PricingPlan {
  name: string;
  id: string;
  price: string;
  description: string;
  features: string[];
  cta: string;
  mostPopular: boolean;
  limits: {
    chatbots: number;
    messagesPerMonth: number;
    knowledgeBaseSizeMB: number;
    teamMembers: number;
  };
}

export const pricingPlans: PricingPlan[] = [
  {
    name: 'Free',
    id: 'tier-free',
    price: '$0',
    description: 'Perfect for small projects and personal websites.',
    features: [
      '1 chatbot',
      'Basic chatbot customization',
      'Website integration',
      'Google Gemini AI model',
      'Email support',
    ],
    cta: 'Start for free',
    mostPopular: false,
    limits: {
      chatbots: 1,
      messagesPerMonth: 1000,
      knowledgeBaseSizeMB: 10,
      teamMembers: 1,
    },
  },
  {
    name: 'Pro',
    id: 'tier-pro',
    price: '$29',
    description: 'Ideal for growing businesses and e-commerce sites.',
    features: [
      '5 chatbots',
      'Advanced chatbot customization',
      'Website & WhatsApp integration',
      'All AI models (Gemini, GPT-4, Claude)',
      'Knowledge base integration',
      'Analytics dashboard',
      'Priority support',
    ],
    cta: 'Get started',
    mostPopular: true,
    limits: {
      chatbots: 5,
      messagesPerMonth: 10000,
      knowledgeBaseSizeMB: 100,
      teamMembers: 3,
    },
  },
  {
    name: 'Business',
    id: 'tier-business',
    price: '$99',
    description: 'For businesses with advanced needs and multiple channels.',
    features: [
      '20 chatbots',
      'Full chatbot customization',
      'All platform integrations',
      'All AI models with fine-tuning',
      'Advanced analytics',
      'Team collaboration',
      'API access',
      'Dedicated support',
    ],
    cta: 'Contact sales',
    mostPopular: false,
    limits: {
      chatbots: 20,
      messagesPerMonth: 50000,
      knowledgeBaseSizeMB: 500,
      teamMembers: 10,
    },
  },
  {
    name: 'Enterprise',
    id: 'tier-enterprise',
    price: 'Custom',
    description: 'For large organizations with custom requirements.',
    features: [
      'Unlimited chatbots',
      'Custom message volume',
      'Custom integrations',
      'Custom AI model deployment',
      'White-labeling',
      'SLA guarantees',
      'Dedicated account manager',
      'On-premises deployment options',
    ],
    cta: 'Contact us',
    mostPopular: false,
    limits: {
      chatbots: Infinity,
      messagesPerMonth: Infinity,
      knowledgeBaseSizeMB: Infinity,
      teamMembers: Infinity,
    },
  },
];