import { useState, useEffect } from "react";
import { agentsAPI, integrationsAPI } from "@/lib/api";
import { Spinner } from "@/components/common/Spinner";
import {
  Puzzle,
  AlertCircle,
  CheckCircle2,
  XCircle,
  RefreshCw,
} from "lucide-react";
import { useWorkspaceStore } from "@/store/workspaceStore";
import { toast } from "@/store/toastStore";
import { Agent } from "@/types/agent";

interface IntegrationsProps {
  agentId: string;
}

export const Integrations = ({ agentId }: IntegrationsProps) => {
  const { currentWorkspace } = useWorkspaceStore();
  const [loading, setLoading] = useState(true);
  const [agent, setAgent] = useState<Agent | null>(null);
  const [workspaceIntegrations, setWorkspaceIntegrations] = useState<any[]>([]);
  const [disabledList, setDisabledList] = useState<string[]>([]);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    if (agentId && currentWorkspace) {
      fetchData();
    }
  }, [agentId, currentWorkspace?.id]);

  const fetchData = async () => {
    if (!currentWorkspace?.id) return;
    setLoading(true);
    try {
      const [agentRes, integrationsRes] = await Promise.all([
        agentsAPI.getById(agentId),
        integrationsAPI.getWorkspaceIntegrations(currentWorkspace.id),
      ]);

      setAgent(agentRes.agent);
      setWorkspaceIntegrations(integrationsRes.integrations || []);

      // Ensure disabled_integrations is initialized
      const integration = agentRes.agent;
      // @ts-ignore - The type might not be fully updated in frontend types yet
      setDisabledList(integration?.disabled_integrations || []);
    } catch (error) {
      console.error("Failed to load data:", error);
      toast.error("Failed to load integrations data");
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (
    integrationName: string,
    currentlyEnabled: boolean
  ) => {
    if (updating) return;
    setUpdating(integrationName);

    let newDisabledList = [...disabledList];
    if (currentlyEnabled) {
      // Disable it (add to list)
      if (!newDisabledList.includes(integrationName)) {
        newDisabledList.push(integrationName);
      }
    } else {
      // Enable it (remove from list)
      newDisabledList = newDisabledList.filter((n) => n !== integrationName);
    }

    try {
      // Optimistic update
      setDisabledList(newDisabledList);

      await agentsAPI.createIntegration({
        agent_id: agentId,
        disabled_integrations: newDisabledList,
      });

      toast.success("Integration settings updated");
    } catch (error) {
      console.error("Failed to update integration:", error);
      toast.error("Failed to update settings");
      // Revert
      setDisabledList(disabledList);
    } finally {
      setUpdating(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <Spinner />
      </div>
    );
  }

  // Pre-define common integration metadata for display
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

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3">
        <Puzzle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <h3 className="text-sm font-medium text-blue-900">
            Workspace Integrations
          </h3>
          <p className="text-sm text-blue-700 mt-1">
            This agent has access to all enabled Workspace Integrations by
            default. You can disable specific integrations for this agent below.
          </p>
        </div>
      </div>

      {workspaceIntegrations.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
          <Puzzle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-gray-900">
            No Integrations Configured
          </h3>
          <p className="text-gray-500 mb-4 max-w-sm mx-auto">
            Your workspace hasn't connected to any external services yet.
          </p>
          {/* Link to workspace settings could go here */}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {workspaceIntegrations.map((integration) => {
            const meta = getIntegrationMeta(integration.integration_name);
            const isEnabled = !disabledList.includes(
              integration.integration_name
            );
            const isUpdating = updating === integration.integration_name;

            return (
              <div
                key={integration.id}
                className={`
                  flex items-center justify-between p-5 rounded-xl border transition-all duration-200
                  ${
                    isEnabled
                      ? "bg-white border-gray-200 shadow-sm"
                      : "bg-gray-50 border-gray-200 opacity-75"
                  }
                `}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`p-3 rounded-lg ${isEnabled ? "bg-primary-50 text-primary-600" : "bg-gray-200 text-gray-500"}`}
                  >
                    <Puzzle className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="translate-y-px font-semibold text-gray-900">
                      {meta.label}
                    </h4>
                    <p className="text-sm text-gray-500">{meta.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {isEnabled ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-100">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Enabled
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
                      <XCircle className="w-3.5 h-3.5" />
                      Disabled
                    </span>
                  )}

                  <div className="h-6 w-px bg-gray-200 mx-2" />

                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={isEnabled}
                      onChange={() =>
                        handleToggle(integration.integration_name, isEnabled)
                      }
                      disabled={isUpdating}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
