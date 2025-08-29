export interface IntegrationStatus {
  id: string;
  name: string;
  platform: "slack" | "whatsapp" | "messenger" | "instagram" | "telegram";
  status: "connected" | "disconnected" | "error";
  enabled: boolean;
  config?: Record<string, any>;
  last_sync?: string;
}

export interface EmbedSettings {
  isPublic: boolean;
  embedCode: string;
  allowedDomains: string[];
  customization: {
    theme: "light" | "dark" | "auto";
    position: "bottom-right" | "bottom-left";
    showBranding: boolean;
  };
}

export interface ShareSettings {
  isPublic: boolean;
  shareUrl: string;
  accessCode?: string;
  expiresAt?: string;
}

export interface AgentActions {
  integrations: IntegrationStatus[];
  embedSettings: EmbedSettings;
  shareSettings: ShareSettings;
}

export interface UpdateActionsRequest {
  integrations?: Partial<IntegrationStatus>[];
  embedSettings?: Partial<EmbedSettings>;
  shareSettings?: Partial<ShareSettings>;
}