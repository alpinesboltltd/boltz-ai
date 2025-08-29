export interface AIModel {
  provider: string;
  model: string;
  multimodal: boolean;
  description: string;
  credits: number; // Credits per 1000 tokens/requests
  credits_per_1k: number; // Alias for credits
  capabilities: string[]; // text, voice, multimodal
}

export const AI_MODELS: AIModel[] = [
  {
    provider: "OpenAI",
    model: "GPT-5",
    multimodal: true,
    description: "State-of-the-art AI with superior intelligence, excels in coding, math, writing, multimodal tasks.",
    credits: 50,
    credits_per_1k: 50,
    capabilities: ["text", "multimodal"]
  },
  {
    provider: "OpenAI",
    model: "GPT-5 mini",
    multimodal: true,
    description: "Efficient compact version of GPT-5, fast for general multimodal applications.",
    credits: 25,
    credits_per_1k: 25,
    capabilities: ["text", "multimodal"]
  },
  {
    provider: "OpenAI",
    model: "GPT-5 nano",
    multimodal: false,
    description: "Ultra-small model for edge devices, basic language processing capabilities.",
    credits: 5,
    credits_per_1k: 5,
    capabilities: ["text"]
  },
  {
    provider: "OpenAI",
    model: "GPT-4o",
    multimodal: true,
    description: "Multimodal model handling text, vision, audio; excels in integrated content creation.",
    credits: 30,
    credits_per_1k: 30,
    capabilities: ["text", "voice", "multimodal"]
  },
  {
    provider: "OpenAI",
    model: "GPT-4o mini",
    multimodal: true,
    description: "Lightweight multimodal, cost-effective for apps requiring speed and efficiency.",
    credits: 15,
    credits_per_1k: 15,
    capabilities: ["text", "voice", "multimodal"]
  },
  {
    provider: "OpenAI",
    model: "o3",
    multimodal: false,
    description: "Advanced reasoning model, excels in complex problem-solving and logic.",
    credits: 40,
    credits_per_1k: 40,
    capabilities: ["text"]
  },
  {
    provider: "OpenAI",
    model: "o1",
    multimodal: false,
    description: "Entry-level reasoning, efficient for simple logical and mathematical tasks.",
    credits: 20,
    credits_per_1k: 20,
    capabilities: ["text"]
  },
  {
    provider: "OpenAI",
    model: "o1-mini",
    multimodal: false,
    description: "Compact reasoning model, fast for basic problem-solving.",
    credits: 10,
    credits_per_1k: 10,
    capabilities: ["text"]
  },
  {
    provider: "OpenAI",
    model: "GPT-4 Turbo",
    multimodal: false,
    description: "High-speed text processing with long context, excels in detailed responses.",
    credits: 25,
    credits_per_1k: 25,
    capabilities: ["text"]
  },
  {
    provider: "OpenAI",
    model: "GPT-3.5 Turbo",
    multimodal: false,
    description: "Affordable general-purpose chat model, good for everyday tasks.",
    credits: 8,
    credits_per_1k: 8,
    capabilities: ["text"]
  },
  {
    provider: "Anthropic",
    model: "Claude Opus 4.1",
    multimodal: true,
    description: "Most capable, excels in complex reasoning, advanced coding.",
    credits: 45,
    credits_per_1k: 45,
    capabilities: ["text", "multimodal"]
  },
  {
    provider: "Anthropic",
    model: "Claude Sonnet 4",
    multimodal: true,
    description: "High-performance, balanced for reasoning, efficiency, multilingual.",
    credits: 30,
    credits_per_1k: 30,
    capabilities: ["text", "multimodal"]
  },
  {
    provider: "Anthropic",
    model: "Claude Haiku 3.5",
    multimodal: true,
    description: "Fastest model, excels in quick, accurate targeted tasks.",
    credits: 15,
    credits_per_1k: 15,
    capabilities: ["text", "voice", "multimodal"]
  },
  {
    provider: "Mistral AI",
    model: "Mistral Medium 3.1",
    multimodal: false,
    description: "Frontier-class reasoning, August 2025, excels in complex tasks.",
    credits: 35,
    credits_per_1k: 35,
    capabilities: ["text"]
  },
  {
    provider: "Mistral AI",
    model: "Voxtral Mini Transcribe",
    multimodal: true,
    description: "Audio input, optimized for transcription.",
    credits: 18,
    credits_per_1k: 18,
    capabilities: ["voice", "multimodal"]
  },
  {
    provider: "Mistral AI",
    model: "Pixtral Large",
    multimodal: true,
    description: "Frontier-class multimodal, excels in text, image tasks, 128k tokens.",
    credits: 35,
    credits_per_1k: 35,
    capabilities: ["text", "multimodal"]
  },
  {
    provider: "Google",
    model: "Gemini Ultra 2.5",
    multimodal: true,
    description: "Largest model, excels in complex tasks, reasoning, multimodal outputs.",
    credits: 45,
    credits_per_1k: 45,
    capabilities: ["text", "voice", "multimodal"]
  },
  {
    provider: "Google",
    model: "Gemini Pro 2.5",
    multimodal: true,
    description: "Scalable multimodal, excels in large-scale text, image, video tasks.",
    credits: 30,
    credits_per_1k: 30,
    capabilities: ["text", "multimodal"]
  },
  {
    provider: "Google",
    model: "Gemini Flash 2.5",
    multimodal: true,
    description: "Fast multimodal, excels in real-time apps, agentic systems.",
    credits: 15,
    credits_per_1k: 15,
    capabilities: ["text", "multimodal"]
  },
  {
    provider: "Meta AI",
    model: "Llama 4 Maverick",
    multimodal: true,
    description: "17B params, top performer in reasoning, coding, multimodal.",
    credits: 22,
    credits_per_1k: 22,
    capabilities: ["text", "multimodal"]
  },
  {
    provider: "Meta AI",
    model: "Llama 3.2 Vision",
    multimodal: true,
    description: "Image and text processing, excels in vision-language tasks.",
    credits: 20,
    credits_per_1k: 20,
    capabilities: ["text", "multimodal"]
  },
  {
    provider: "DeepSeek",
    model: "DeepSeek-V3.1",
    multimodal: false,
    description: "Hybrid architecture, excels in reasoning and agent tasks.",
    credits: 18,
    credits_per_1k: 18,
    capabilities: ["text"]
  },
  {
    provider: "DeepSeek",
    model: "DeepSeek-R1",
    multimodal: false,
    description: "Open reasoning model, strong in logic, math, coding.",
    credits: 15,
    credits_per_1k: 15,
    capabilities: ["text"]
  },
  {
    provider: "DeepSeek",
    model: "DeepSeek-VL",
    multimodal: true,
    description: "Vision-language model, excels in image understanding, multimodal tasks.",
    credits: 22,
    credits_per_1k: 22,
    capabilities: ["text", "multimodal"]
  },
  {
    provider: "xAI",
    model: "grok-4-0709",
    multimodal: true,
    description: "Text, vision, image gen soon; excels in reasoning, 256k context.",
    credits: 35,
    credits_per_1k: 35,
    capabilities: ["text", "multimodal"]
  },
  {
    provider: "xAI",
    model: "grok-3",
    multimodal: false,
    description: "Text-only, excels in structured outputs, reasoning, 131k context.",
    credits: 25,
    credits_per_1k: 25,
    capabilities: ["text"]
  }
];

export const getModelsByType = (agentType: 'text' | 'voice' | 'multimodal') => {
  switch (agentType) {
    case 'text':
      return AI_MODELS.filter(model => model.capabilities.includes('text') && !model.capabilities.includes('multimodal'));
    case 'voice':
      return AI_MODELS.filter(model => model.capabilities.includes('voice'));
    case 'multimodal':
      return AI_MODELS.filter(model => model.capabilities.includes('multimodal'));
    default:
      return AI_MODELS;
  }
};

export const getModelByName = (modelName: string): AIModel | undefined => {
  return AI_MODELS.find(model => model.model === modelName);
};