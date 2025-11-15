// export interface AIModel {
//   provider: string;
//   image: string;
//   model: string;
//   multimodal: boolean;
//   description: string;
//   credits: number; // Credits per 1000 tokens/requests
//   credits_per_1k: number; // Alias for credits
//   capabilities: string[]; // text, voice, multimodal
// }

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
