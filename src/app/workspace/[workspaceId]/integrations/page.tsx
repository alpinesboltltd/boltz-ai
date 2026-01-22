"use client";

import { useState, useEffect } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { integrationsAPI } from "@/lib/api";
import { googleIntegrationService } from "@/services/google-integration.service";
import { Spinner } from "@/components/common/Spinner";
import {
  Puzzle,
  Plus,
  RefreshCw,
  CheckCircle,
  XCircle,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { toast } from "@/store/toastStore";

export default function WorkspaceIntegrationsPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const workspaceId = params.workspaceId as string;
  const [loading, setLoading] = useState(true);
  const [integrations, setIntegrations] = useState<any[]>([]);
  const [googleStatus, setGoogleStatus] = useState<
    "connected" | "disconnected" | "loading"
  >("loading");

  useEffect(() => {
    if (workspaceId) {
      fetchIntegrations();
      checkGoogleStatus();
    }
  }, [workspaceId]);

  useEffect(() => {
    const status = searchParams.get("status");
    if (status === "success") {
      toast.success("Integration connected successfully!");
      // Clean up URL
      router.replace(`/workspace/${workspaceId}/integrations`);
      checkGoogleStatus();
    }
  }, [searchParams, workspaceId, router]);

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

  const checkGoogleStatus = async () => {
    try {
      const { status } = await googleIntegrationService.getStatus(workspaceId);
      setGoogleStatus(status as "connected" | "disconnected");
    } catch (error) {
      console.error("Failed to check Google status:", error);
      setGoogleStatus("disconnected");
    }
  };

  const handleGoogleConnect = async () => {
    try {
      const url = await googleIntegrationService.getAuthUrl(workspaceId);
      window.location.href = url;
    } catch (error) {
      console.error("Failed to init Google connect:", error);
      toast.error("Failed to start Google connection");
    }
  };

  const handleGoogleDisconnect = async () => {
    if (
      !confirm(
        "Are you sure you want to disconnect Google Workspace? This will revoke access to Drive, Docs, and Calendar.",
      )
    )
      return;

    try {
      await googleIntegrationService.disconnect(workspaceId);
      toast.success("Google Workspace disconnected");
      setGoogleStatus("disconnected");
    } catch (error) {
      console.error("Failed to disconnect Google:", error);
      toast.error("Failed to disconnect Google Workspace");
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Google Workspace Card */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-primary-50 rounded-lg text-primary-600">
                {/* You might want a Google Icon here specifically */}
                <Puzzle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  Google Workspace
                </h3>
                <p className="text-sm text-gray-500">
                  Access Drive, Docs, Calendar
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {googleStatus === "loading" ? (
                <RefreshCw className="w-4 h-4 animate-spin text-gray-400" />
              ) : googleStatus === "connected" ? (
                <>
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span className="text-xs font-medium text-gray-600">
                    Active
                  </span>
                </>
                ) : (<>
                <RefreshCw className="w-4 h-4 text-gray-400"  onClick={checkGoogleStatus}/>
                <span className="text-xs font-medium text-gray-400">
                  Inactive
                </span>
              </>
              )}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end">
            {googleStatus === "connected" ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleGoogleDisconnect}
                className="h-8 px-2 text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                Disconnect
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={handleGoogleConnect}
                disabled={googleStatus === "loading"}
              >
                Connect
              </Button>
            )}
          </div>
        </div>

        {/* Existing Integrations Rendering */}
        {integrations
          .filter((i) => i.integration_name !== "google")
          .map((integration) => {
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

        {/* Placeholder for 'No integrations' if list empty AND google disconnected? 
            Currently showing Google card always, so technically never empty. 
            Removed the "No Integrations Connected" block for simplicity as we always show Google card now.
        */}
      </div>
    </div>
  );
}
