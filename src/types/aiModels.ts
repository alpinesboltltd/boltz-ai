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
