"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { integrationsAPI } from "@/lib/api";
import { Spinner } from "@/components/common/Spinner";
import { Puzzle, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { toast } from "@/store/toastStore";

export default function WorkspaceIntegrationsPage() {
  const params = useParams();
  const workspaceId = params.workspaceId as string;
  const [loading, setLoading] = useState(true);
  const [integrations, setIntegrations] = useState<any[]>([]);

  useEffect(() => {
    if (workspaceId) {
      fetchIntegrations();
    }
  }, [workspaceId]);

  const fetchIntegrations = async () => {
    try {
      const res = await integrationsAPI.getWorkspaceIntegrations(workspaceId);
      setIntegrations(res.integrations || []);
    } catch (error) {
      console.error("Failed to load integrations:", error);
      toast.error("Failed to load integrations");
    } finally {
      setLoading(false);
    }
  };

  const getIntegrationMeta = (name: string) => {
    const map: Record<string, { label: string; description: string }> = {
      google: {
        label: "Google Workspace",
        description: "Access Drive, Docs, Calendar",
      },
      slack: { label: "Slack", description: "Send messages and alerts" },
      twilio: { label: "Twilio", description: "SMS and Voice capabilities" },
      discord: {
        label: "Discord",
        description: "Interact with Discord channels",
      },
      notion: {
        label: "Notion",
        description: "Access Notion pages and databases",
      },
    };
    return (
      map[name.toLowerCase()] || {
        label: name,
        description: "External integration",
      }
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Integrations</h1>
          <p className="text-gray-500 mt-1">
            Manage external services connected to your workspace.
          </p>
        </div>
        <Button onClick={() => toast.info("Integration setup coming soon!")}>
          <Plus className="w-4 h-4 mr-2" />
          Connect Integration
        </Button>
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3">
        <Puzzle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <h3 className="text-sm font-medium text-blue-900">Workspace Level</h3>
          <p className="text-sm text-blue-700 mt-1">
            Integrations connected here are available to all agents in this
            workspace, unless explicitly disabled in Agent settings.
          </p>
        </div>
      </div>

      {integrations.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-200">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Puzzle className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900">
            No Integrations Connected
          </h3>
          <p className="text-gray-500 mb-6 max-w-sm mx-auto">
            Connect your favorite tools to supercharge your AI agents.
          </p>
          <Button
            onClick={() => toast.info("Integration setup coming soon!")}
            variant="outline"
          >
            Browse Integrations
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {integrations.map((integration) => {
            const meta = getIntegrationMeta(integration.integration_name);
            return (
              <div
                key={integration.id}
                className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-primary-50 rounded-lg text-primary-600">
                      <Puzzle className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {meta.label}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {meta.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span className="text-xs font-medium text-gray-600">
                      Active
                    </span>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center text-xs text-gray-500">
                  <span>
                    Added{" "}
                    {new Date(integration.created_at).toLocaleDateString()}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    Disconnect
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
