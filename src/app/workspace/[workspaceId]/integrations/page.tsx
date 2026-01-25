"use client";

import { useState, useEffect } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { integrationsAPI } from "@/lib/api";
import { googleIntegrationService } from "@/services/google-integration.service";
import { linkedinIntegrationService } from "@/services/linkedin-integration.service";
import { Spinner } from "@/components/common/Spinner";
import { IntegrationCard } from "@/components/common/IntegrationCard";
import {
  Puzzle,
  Linkedin,
  Shield,
  Send,
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
  
  // Status states
  const [googleStatus, setGoogleStatus] = useState<"connected" | "disconnected" | "loading">("loading");
  const [linkedinStatus, setLinkedinStatus] = useState<"connected" | "disconnected" | "loading">("loading");
  const [linkedinDetails, setLinkedinDetails] = useState<{ scopes?: string[] } | null>(null);

  useEffect(() => {
    if (workspaceId) {
      loadAll();
    }
  }, [workspaceId]);

  useEffect(() => {
    const status = searchParams.get("status");
    if (status === "success") {
      toast.success("Integration connected successfully!");
      router.replace(`/workspace/${workspaceId}/integrations`);
      checkGoogleStatus();
      checkLinkedinStatus();
    }
  }, [searchParams, workspaceId, router]);

  const loadAll = async () => {
    setLoading(true);
    await Promise.all([
      fetchIntegrations(),
      checkGoogleStatus(),
      checkLinkedinStatus()
    ]);
    setLoading(false);
  };

  const fetchIntegrations = async () => {
    try {
      const res = await integrationsAPI.getWorkspaceIntegrations(workspaceId);
      setIntegrations(res.integrations || []);
    } catch (error) {
      console.error("Failed to load integrations:", error);
      toast.error("Failed to load integrations");
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

  const checkLinkedinStatus = async () => {
    try {
      const data = await linkedinIntegrationService.getStatus(workspaceId);
      setLinkedinStatus(data.status as "connected" | "disconnected");
      if(data.status === "connected") {
         setLinkedinDetails({ scopes: data.scopes });
      } else {
         setLinkedinDetails(null);
      }
    } catch (error) {
      console.error("Failed to check LinkedIn status:", error);
      setLinkedinStatus("disconnected");
      setLinkedinDetails(null);
    }
  };

  const handleConnect = async (service: 'google' | 'linkedin') => {
    try {
      const url = service === 'google' 
        ? await googleIntegrationService.getAuthUrl(workspaceId)
        : await linkedinIntegrationService.getAuthUrl(workspaceId);
      window.location.href = url;
    } catch (error) {
      console.error(`Failed to init ${service} connect:`, error);
      toast.error(`Failed to start ${service} connection`);
    }
  };

  const handleDisconnect = async (service: 'google' | 'linkedin') => {
    const name = service === 'google' ? 'Google Workspace' : 'LinkedIn';
    const warning = service === 'google' 
      ? "This will revoke access to Drive, Docs, and Calendar." 
      : "";
    
    if (!confirm(`Are you sure you want to disconnect ${name}? ${warning}`)) return;

    try {
      if (service === 'google') {
        await googleIntegrationService.disconnect(workspaceId);
        setGoogleStatus("disconnected");
      } else {
        await linkedinIntegrationService.disconnect(workspaceId);
        setLinkedinStatus("disconnected");
      }
      toast.success(`${name} disconnected`);
    } catch (error) {
      console.error(`Failed to disconnect ${service}:`, error);
      toast.error(`Failed to disconnect ${name}`);
    }
  };

  const getIntegrationMeta = (name: string) => {
    const map: Record<string, { label: string; description: string }> = {
      google: { label: "Google Workspace", description: "Access Drive, Docs, Calendar" },
      slack: { label: "Slack", description: "Send messages and alerts" },
      twilio: { label: "Twilio", description: "SMS and Voice capabilities" },
      discord: { label: "Discord", description: "Interact with Discord channels" },
      notion: { label: "Notion", description: "Access Notion pages and databases" },
    };
    return map[name.toLowerCase()] || { label: name, description: "External integration" };
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
        <IntegrationCard
          title="Google Workspace"
          description="Access Drive, Docs, Calendar"
          icon={<Puzzle className="w-6 h-6" />}
          status={googleStatus}
          onStatusCheck={checkGoogleStatus}
          actions={
            googleStatus === "connected" ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDisconnect('google')}
                className="h-8 px-2 text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                Disconnect
              </Button>
            ) : (
              <Button
                size="sm"
                  variant="primary"
                  className="text-white"
                onClick={() => handleConnect('google')}
                disabled={googleStatus === "loading"}
              >
                Connect
              </Button>
            )
          }
        />
        
        {/* LinkedIn Card */}
        <IntegrationCard
          title="LinkedIn"
          description="Connect profile, pages & events"
          icon={<Linkedin className="w-6 h-6" />}
          status={linkedinStatus}
          onStatusCheck={checkLinkedinStatus}
          className="transition-all hover:shadow-md"
          iconClassName="bg-blue-50 text-blue-600"
          actions={
            linkedinStatus === "connected" ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDisconnect('linkedin')}
                className="h-8 px-2 text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                Disconnect
              </Button>
            ) : (
              <Button
                size="sm"
                variant="primary"
                onClick={() => handleConnect('linkedin')}
                disabled={linkedinStatus === "loading"}
                className="text-white"
              >
                Connect LinkedIn
              </Button>
            )
          }
        >
          {linkedinDetails?.scopes && linkedinStatus === "connected" && (
            <div className="mb-4">
              <p className="text-xs font-medium text-gray-500 mb-2 flex items-center gap-1">
                <Shield className="w-3 h-3" /> Granted Permissions
              </p>
              <div className="flex flex-wrap gap-1">
                {linkedinDetails.scopes.map((scope) => (
                  <span key={scope} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-[10px] border border-gray-200">
                    {scope}
                  </span>
                ))}
              </div>
            </div>
          )}

          {linkedinStatus === "connected" && (
            <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
              <p className="text-xs font-medium text-gray-700 mb-2">Test Post</p>
              <textarea 
                className="w-full text-xs p-2 border border-gray-200 rounded mb-2 focus:outline-none focus:border-blue-400"
                rows={2}
                placeholder="Draft a post..."
                id="linkedin-post-draft"
              />
              <div className="flex justify-between items-center">
                <select className="text-[10px] bg-white border border-gray-200 rounded px-1 py-0.5 text-gray-600" id="linkedin-post-visibility">
                  <option value="PUBLIC">Public</option>
                  <option value="CONNECTIONS">Connections</option>
                </select>
                <Button size="sm" className="h-6 text-xs px-2 bg-[#0077b5] hover:bg-[#006396]" onClick={async () => {
                  const text = (document.getElementById('linkedin-post-draft') as HTMLTextAreaElement).value;
                  const visibility = (document.getElementById('linkedin-post-visibility') as HTMLSelectElement).value as any;
                  if(!text) return toast.error("Enter text");
                  try {
                      await linkedinIntegrationService.share(workspaceId, text, visibility);
                      toast.success("Posted to LinkedIn!");
                      (document.getElementById('linkedin-post-draft') as HTMLTextAreaElement).value = "";
                  } catch(e) {
                      console.error(e);
                      toast.error("Failed to post");
                  }
                }}>
                  <Send className="w-3 h-3 mr-1" /> Post
                </Button>
              </div>
            </div>
          )}
        </IntegrationCard>

        {/* Existing Integrations Rendering */}
        {integrations
          .filter((i) => i.integration_name !== "google")
          .map((integration) => {
            const meta = getIntegrationMeta(integration.integration_name);
            return (
              <IntegrationCard
                key={integration.id}
                title={meta.label}
                description={meta.description}
                icon={<Puzzle className="w-6 h-6" />}
                status="connected"
                footerMeta={
                  <span>
                    Added{" "}
                    {new Date(integration.created_at).toLocaleDateString()}
                  </span>
                }
                actions={
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    Disconnect
                  </Button>
                }
              />
            );
          })}
      </div>
    </div>
  );
}
