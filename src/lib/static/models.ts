export interface AIModel {
  id: string;
  name: string;
  provider: string;
  description: string;
  capabilities: string[];
  pricing: string;
  isPopular: boolean;
}

export const aiModels: AIModel[] = [
  {
    id: 'gemini-pro',
    name: 'Gemini Pro',
    provider: 'Google',
    description: 'Google\'s most capable AI model for text understanding and generation.',
    capabilities: [
      'Advanced reasoning',
      'Complex instruction following',
      'Nuanced conversation',
      'Creative content generation'
    ],
    pricing: 'Included in all plans',
    isPopular: true
  },
  {
    id: 'gpt-4',
    name: 'GPT-4',
    provider: 'OpenAI',
    description: 'OpenAI\'s most advanced model with improved reasoning and instruction following.',
    capabilities: [
      'Advanced reasoning',
      'Complex problem solving',
      'Nuanced instruction following',
      'Creative content generation'
    ],
    pricing: 'Pro and Business plans',
    isPopular: true
  },
  {
    id: 'claude-2',
    name: 'Claude 2',
    provider: 'Anthropic',
    description: 'Anthropic\'s advanced AI assistant focused on helpfulness, harmlessness, and honesty.',
    capabilities: [
      'Nuanced conversation',
      'Detailed responses',
      'Creative writing',
      'Thoughtful analysis'
    ],
    pricing: 'Pro and Business plans',
    isPopular: false
  },
  {
    id: 'mistral-large',
    name: 'Mistral Large',
    provider: 'Mistral AI',
    description: 'Mistral\'s flagship model with strong reasoning and language understanding capabilities.',
    capabilities: [
      'Efficient reasoning',
      'Multilingual support',
      'Code generation',
      'Knowledge processing'
    ],
    pricing: 'Business plan only',
    isPopular: false
  },
  {
    id: 'llama-3',
    name: 'Llama 3',
    provider: 'Meta',
    description: 'Meta\'s open-source large language model with strong performance across various tasks.',
    capabilities: [
      'General knowledge',
      'Instruction following',
      'Conversational ability',
      'Content generation'
    ],
    pricing: 'Pro and Business plans',
    isPopular: false
  }
];