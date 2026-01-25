import { apiRequest as api } from "@/lib/api";

export const linkedinIntegrationService = {
  getAuthUrl: async (workspaceId: string): Promise<string> => {
    const response = await api(
      `/workspaces/workspace/${workspaceId}/integrations/linkedin/connect`,
      {
        method: "GET",
      },
    );
    return response.url;
  },

  disconnect: async (workspaceId: string): Promise<void> => {
    await api(`/workspaces/workspace/${workspaceId}/integrations/linkedin/disconnect`, {
      method: "POST",
      body: JSON.stringify({ workspace_id: workspaceId }), // Handler expects JSON body
    });
  },

  getStatus: async (workspaceId: string): Promise<{
    status: string;
    scopes?: string[];
    expiry?: string;
  }> => {
    // endpoint: GET /api/v1/workspaces/workspace/:workspaceId/integrations/linkedin/status
    return await api(
      `/workspaces/workspace/${workspaceId}/integrations/linkedin/status`,
      {
        method: "GET",
      },
    );
  },

  share: async (
    workspaceId: string,
    text: string,
    visibility: "PUBLIC" | "CONNECTIONS" = "PUBLIC",
  ): Promise<any> => {
    return await api(
      `/workspaces/workspace/${workspaceId}/integrations/linkedin/share`,
      {
        method: "POST",
        body: JSON.stringify({ workspace_id: workspaceId, text, visibility }),
      },
    );
  },
};
