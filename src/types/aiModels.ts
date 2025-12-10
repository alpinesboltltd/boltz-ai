export interface AIModel {
  id: string;
  name: string;
  provider: string;
  credits_per_1k: number;
  supports_text: boolean;
  supports_vision: boolean;
  supports_voice: boolean;
  is_reasoning: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateAIModelRequest {
  name: string;
  provider: string;
  credits_per_1k: number;
  supports_text: boolean;
  supports_vision: boolean;
  supports_voice: boolean;
  is_reasoning: boolean;
}

export interface UpdateAIModelRequest {
  credits_per_1k?: number;
  supports_text?: boolean;
  supports_vision?: boolean;
  supports_voice?: boolean;
  is_reasoning?: boolean;
}

export interface AIModelResponse {
  ai_model: AIModel;
}

export interface AIModelsListResponse {
  ai_models: AIModel[];
}

import { z } from "zod";

export enum Provider {
  OPENAI = "openai",
  ANTHROPIC = "anthropic",
  GOOGLE = "google",
  META = "meta",
  GROQ = "groq",
}

export const CreateAIModelSchema = z.object({
  name: z.string().min(1, "Name is required"),
  provider: z.nativeEnum(Provider),
  credits_per_1k: z.number().min(0, "Credits must be positive"),
  supports_text: z.boolean(),
  supports_vision: z.boolean(),
  supports_voice: z.boolean(),
  is_reasoning: z.boolean(),
});

export type CreateAIModelFormValues = z.infer<typeof CreateAIModelSchema>;
