
export interface AIModel {
  id: string;
  name: string;
  provider: string;
  image: string;
  credits_per_1k: number;
  supports_text: boolean;
  supports_voice: boolean;
  supports_vision: boolean;
  is_reasoning: boolean;
  created_at: Date;
  updated_at: Date;
}

export const AI_MODELS = [
  {
    provider: "OpenAI",
    image: "/openai.png",
    model: "gpt-4-turbo",
    multimodal: true,
    description: "Most capable model for complex tasks",
    credits: 30,
    credits_per_1k: 30,
    capabilities: ["text", "vision"],
  },
  {
    provider: "Anthropic",
    image: "/anthropic.png",
    model: "claude-3-opus",
    multimodal: true,
    description: "High intelligence model with strong reasoning",
    credits: 30,
    credits_per_1k: 30,
    capabilities: ["text", "vision"],
  },
  {
    provider: "Google",
    image: "/google.png",
    model: "gemini-1.5-pro",
    multimodal: true,
    description: "Google's best model for multimodal tasks",
    credits: 15,
    credits_per_1k: 15,
    capabilities: ["text", "vision", "voice"],
  },
  {
    provider: "OpenAI",
    image: "/openai.png",
    model: "gpt-3.5-turbo",
    multimodal: false,
    description: "Fast and cost-effective for simple tasks",
    credits: 1,
    credits_per_1k: 1,
    capabilities: ["text"],
  },
];
