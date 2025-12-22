import { useState, useEffect } from "react";
import { getGoogleStatus, agentsAPI } from "@/lib/api";
import { Spinner } from "@/components/common/Spinner";
import {
  HardDrive,
  Calendar,
  Mail,
  BookOpen,
  Presentation,
  Table,
  Globe,
  Linkedin,
  Twitter,
  MessageSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/store/toastStore";

import { Button } from "@/components/ui/Button";
import { GoogleServicesModal } from "./GoogleServicesModal";
import DiscordIntegrationModal from "./DiscordIntegrationModal";
import { AgentIntegration, Platform } from "@/types/agent";

interface IntegrationsProps {
  agentId: string;
}

export const Integrations = ({ agentId }: IntegrationsProps) => {
  const [loading, setLoading] = useState(true);
  const [googleStatus, setGoogleStatus] = useState<Record<string, boolean>>({});
  const [genericIntegration, setGenericIntegration] =
    useState<AgentIntegration | null>(null);

  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);
  const [isDiscordModalOpen, setIsDiscordModalOpen] = useState(false);

  const [activeTab, setActiveTab] = useState<"integrations" | "widget">(
    "integrations"
  );

  const googleServices = [
    {
      id: "drive",
      label: "Google Drive",
      icon: HardDrive,
      description: "Access and manage files",
    },
    {
      id: "calendar",
      label: "Google Calendar",
      icon: Calendar,
      description: "Schedule and manage events",
    },
    {
      id: "mail",
      label: "Gmail",
      icon: Mail,
      description: "Send and read emails",
    },
    {
      id: "classroom",
      label: "Google Classroom",
      icon: BookOpen,
      description: "Manage classes and assignments",
    },
    {
      id: "slides",
      label: "Google Slides",
      icon: Presentation,
      description: "Create and edit presentations",
    },
    {
      id: "sheets",
      label: "Google Sheets",
      icon: Table,
      description: "Manage spreadsheets",
    },
  ];

  useEffect(() => {
    fetchStatus();
  }, [agentId]);

  const fetchStatus = async () => {
    try {
      const [googleRes, integrationRes] = await Promise.all([
        getGoogleStatus(agentId),
        agentsAPI.getIntegration(agentId).catch(() => ({ integration: null })),
      ]);
      setGoogleStatus(googleRes.services || {});
      setGenericIntegration(integrationRes.integration);
    } catch (error) {
      console.error("Failed to fetch integration status", error);
    } finally {
      setLoading(false);
    }
  };

  const getWidgetCode = () => {
    if (typeof window === "undefined") return "";
    return `<script>
  window.LEVEL_X_CONFIG = { 
    id: "${agentId}"
  };
</script>
<script src="https://level-x.alpinesbolt.com/widget.js" async></script>`;
  };

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <Spinner />
      </div>
    );
  }

  // Check if Discord is active
  const isDiscordActive =
    genericIntegration?.platform === Platform.DISCORD &&
    genericIntegration?.is_active;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab("integrations")}
          className={cn(
            "px-6 py-3 text-sm font-medium border-b-2 transition-colors",
            activeTab === "integrations"
              ? "border-primary-600 text-primary-600"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
          )}
        >
          Integrations
        </button>
        <button
          onClick={() => setActiveTab("widget")}
          className={cn(
            "px-6 py-3 text-sm font-medium border-b-2 transition-colors",
            activeTab === "widget"
              ? "border-primary-600 text-primary-600"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
          )}
        >
          Website Widget
        </button>
      </div>

      {activeTab === "integrations" && (
        <div className="space-y-8">
          {/* Google Services Section */}
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div>
                <h3 className="text-sm font-medium text-gray-900">
                  Google Integrations
                </h3>
                <p className="text-sm text-gray-500">
                  Manage your connected Google services
                </p>
              </div>
              <Button onClick={() => setIsGoogleModalOpen(true)}>
                Manage Services
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {googleServices.map((service) => {
                const Icon = service.icon;
                const isConnected = googleStatus[service.id];

                return (
                  <div
                    key={service.id}
                    className={cn(
                      "relative group rounded-xl border p-6 transition-all duration-200",
                      isConnected
                        ? "bg-primary-50/50 border-primary-200"
                        : "bg-white border-gray-200 opacity-70"
                    )}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "p-2.5 rounded-lg transition-colors",
                            isConnected
                              ? "bg-primary-100 text-primary-600"
                              : "bg-gray-100 text-gray-500"
                          )}
                        >
                          <Icon className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {service.label}
                          </h3>
                          <p className="text-sm text-gray-500 mt-0.5">
                            {service.description}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className={cn(
                            "w-2 h-2 rounded-full",
                            isConnected ? "bg-green-500" : "bg-gray-300"
                          )}
                        />
                        <span className="text-xs font-medium text-gray-600">
                          {isConnected ? "Active" : "Disconnected"}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Other Integrations Section */}
          <div className="space-y-6 pt-6 border-t">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Platform Integrations
                </h3>
                <p className="text-sm text-gray-500">
                  Connect to other platforms
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Discord Card */}
              <div
                className={cn(
                  "relative group rounded-xl border p-6 transition-all duration-200 cursor-pointer hover:border-primary-300 hover:shadow-md",
                  isDiscordActive
                    ? "bg-primary-50/50 border-primary-200"
                    : "bg-white border-gray-200"
                )}
                onClick={() => setIsDiscordModalOpen(true)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "p-2.5 rounded-lg transition-colors",
                        isDiscordActive
                          ? "bg-primary-100 text-primary-600"
                          : "bg-gray-100 text-gray-500"
                      )}
                    >
                      <MessageSquare className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Discord</h3>
                      <p className="text-sm text-gray-500 mt-0.5">
                        Connect Discord Bot
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className={cn(
                        "w-2 h-2 rounded-full",
                        isDiscordActive ? "bg-green-500" : "bg-gray-300"
                      )}
                    />
                    <span className="text-xs font-medium text-gray-600">
                      {isDiscordActive ? "Active" : "Configure"}
                    </span>
                  </div>
                  <Button variant="ghost" size="sm" className="ml-auto">
                    Configure
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t pt-8">
            <h3 className="text-lg font-medium text-gray-900 mb-6">
              Coming Soon
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 opacity-60">
              {["Slack", "Telegram"].map((name) => (
                <div
                  key={name}
                  className="border border-dashed border-gray-300 rounded-xl p-6 bg-gray-50 flex items-center justify-center"
                >
                  <span className="text-gray-500 font-medium">{name}</span>
                </div>
              ))}
            </div>
          </div>

          <GoogleServicesModal
            isOpen={isGoogleModalOpen}
            onClose={() => setIsGoogleModalOpen(false)}
            agentId={agentId}
            initialServices={Object.keys(googleStatus).filter(
              (k) => googleStatus[k]
            )}
            onSuccess={fetchStatus}
          />

          <DiscordIntegrationModal
            isOpen={isDiscordModalOpen}
            onClose={() => setIsDiscordModalOpen(false)}
            agentId={agentId}
            initialData={
              isDiscordActive
                ? {
                    apiKey: genericIntegration?.api_key || "",
                    apiSecret: genericIntegration?.api_secret || "",
                  }
                : undefined
            }
            onSuccess={fetchStatus}
          />
        </div>
      )}

      {activeTab === "widget" && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-start gap-6">
            <div className="p-3 bg-primary-100 rounded-lg text-primary-600">
              <Globe className="w-8 h-8" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Embed Website Widget
              </h3>
              <p className="text-gray-500 mb-6">
                Copy and paste this code snippet into your website's HTML, just
                before the closing <code>&lt;/body&gt;</code> tag.
              </p>

              <div className="relative group">
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm font-mono leading-relaxed">
                  {getWidgetCode()}
                </pre>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(getWidgetCode());
                    toast.info("Success", "Widget code copied to clipboard!");
                  }}
                  className="absolute top-3 right-3 bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded text-xs font-medium transition-colors backdrop-blur-sm"
                >
                  Copy Code
                </button>
              </div>

              <div className="mt-8 p-4 bg-yellow-50 text-yellow-800 rounded-lg text-sm border border-yellow-100">
                <strong>Note:</strong> Customize your agent's appearance using
                the "Appearance" tab in the playground.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
