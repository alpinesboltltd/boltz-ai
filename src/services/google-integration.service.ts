import { apiRequest as api } from "@/lib/api";

export const googleIntegrationService = {
  getAuthUrl: async (workspaceId: string): Promise<string> => {
    const response = await api(
      `/workspaces/workspace/${workspaceId}/integrations/google/connect`,
      {
        method: "GET",
      },
    );
    return response.url;
  },

  disconnect: async (workspaceId: string): Promise<void> => {
    await api(`/workspaces/workspace/${workspaceId}/integrations/google`, {
      method: "DELETE",
    });
  },

  getStatus: async (workspaceId: string): Promise<{ status: string }> => {
    // The backend returns { status: "connected" | "disconnected" }
    // endpoint: GET /api/v1/workspaces/workspace/:workspaceId/integrations/google/status
    return await api(
      `/workspaces/workspace/${workspaceId}/integrations/google/status`,
      {
        method: "GET",
      },
    );
  },
};
