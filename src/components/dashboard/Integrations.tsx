import { useState, useEffect } from "react";
import {
  connectGoogleService,
  disconnectGoogleService,
  getGoogleStatus,
} from "@/lib/api";
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
} from "lucide-react";
import { cn } from "@/lib/utils";

interface IntegrationsProps {
  agentId: string;
}

export const Integrations = ({ agentId }: IntegrationsProps) => {
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<Record<string, boolean>>({});
  const [toggling, setToggling] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"integrations" | "widget">(
    "integrations"
  );

  const services = [
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
    {
      id: "linkedin",
      label: "LinkedIn",
      icon: Linkedin,
      description: "Post and interact on LinkedIn",
    },
    {
      id: "x",
      label: "X (Twitter)",
      icon: Twitter,
      description: "Post and engage on X",
    },
  ];

  useEffect(() => {
    fetchStatus();
  }, [agentId]);

  const fetchStatus = async () => {
    try {
      const res = await getGoogleStatus(agentId);
      setStatus(res.services || {});
    } catch (error) {
      console.error("Failed to fetch integration status", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (serviceId: string, currentState: boolean) => {
    setToggling(serviceId);
    try {
      if (currentState) {
        await disconnectGoogleService(agentId, serviceId);
      } else {
        await connectGoogleService(agentId, serviceId);
      }
      setStatus((prev) => ({ ...prev, [serviceId]: !currentState }));
    } catch (error) {
      console.error("Failed to toggle service", error);
    } finally {
      setToggling(null);
    }
  };

  const getWidgetCode = () => {
    if (typeof window === "undefined") return "";
    return `<script>
  window.BOLTZ_CONFIG = { id: "${agentId}" };
</script>
<script src="${window.location.origin}/widget.js" async></script>`;
  };

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <Spinner />
      </div>
    );
  }

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => {
              const Icon = service.icon;
              const isConnected = status[service.id];
              const isToggling = toggling === service.id;

              return (
                <div
                  key={service.id}
                  className={cn(
                    "relative group rounded-xl border p-6 transition-all duration-200",
                    isConnected
                      ? "bg-primary-50/50 border-primary-200"
                      : "bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm"
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

                    <button
                      onClick={() => handleToggle(service.id, isConnected)}
                      disabled={isToggling}
                      className={cn(
                        "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2",
                        isConnected ? "bg-primary-600" : "bg-gray-200",
                        isToggling && "opacity-50 cursor-wait"
                      )}
                    >
                      <span
                        aria-hidden="true"
                        className={cn(
                          "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                          isConnected ? "translate-x-5" : "translate-x-0"
                        )}
                      />
                    </button>
                  </div>
                </div>
              );
            })}
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
                    alert("Widget code copied to clipboard!");
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
