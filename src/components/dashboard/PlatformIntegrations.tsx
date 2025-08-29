"use client";

import { useState } from "react";
import { Spinner } from "@/components/common/Spinner";
import {
  WhatsAppIntegrationModal,
  SlackIntegrationModal,
  FacebookIntegrationModal,
  TwilioIntegrationModal,
  ShopifyIntegrationModal,
  WordPressIntegrationModal,
  TelegramIntegrationModal,
  InstagramIntegrationModal,
  TwitterIntegrationModal,
  DiscordIntegrationModal,
} from "@/components/dashboard";

interface PlatformIntegrationsProps {
  chatagentId: string;
  initialIntegrations?: {
    website: boolean;
    whatsapp: boolean;
    slack: boolean;
    facebook: boolean;
    shopify: boolean;
    wordpress: boolean;
    twilio: boolean;
    telegram: boolean;
    instagram: boolean;
    twitter: boolean;
    discord: boolean;
  };
}

interface Platform {
  id: string;
  name: string;
  icon: string;
  description: string;
  setupType: string;
  availableOnPlans: string[];
}

const platforms: Platform[] = [
  {
    id: "website",
    name: "Website",
    icon: "🌐",
    description: "Embed your chatagent on your website",
    setupType: "code",
    availableOnPlans: ["free", "pro", "business", "enterprise"],
  },
  {
    id: "whatsapp",
    name: "WhatsApp",
    icon: "📱",
    description: "Connect to WhatsApp Business API",
    setupType: "oauth",
    availableOnPlans: ["pro", "business", "enterprise"],
  },
  {
    id: "slack",
    name: "Slack",
    icon: "💬",
    description: "Add your chatagent to Slack workspaces",
    setupType: "oauth",
    availableOnPlans: ["pro", "business", "enterprise"],
  },
  {
    id: "facebook",
    name: "Facebook Messenger",
    icon: "👥",
    description: "Connect to Facebook Messenger",
    setupType: "oauth",
    availableOnPlans: ["pro", "business", "enterprise"],
  },
  {
    id: "shopify",
    name: "Shopify",
    icon: "🛒",
    description: "Install on your Shopify store",
    setupType: "app",
    availableOnPlans: ["business", "enterprise"],
  },
  {
    id: "wordpress",
    name: "WordPress",
    icon: "📝",
    description: "Add to your WordPress site",
    setupType: "plugin",
    availableOnPlans: ["pro", "business", "enterprise"],
  },
  {
    id: "twilio",
    name: "Twilio SMS/Voice",
    icon: "📞",
    description: "Connect to Twilio for SMS and voice",
    setupType: "api",
    availableOnPlans: ["business", "enterprise"],
  },
  {
    id: "telegram",
    name: "Telegram",
    icon: "✈️",
    description: "Create a Telegram bot",
    setupType: "api",
    availableOnPlans: ["pro", "business", "enterprise"],
  },
  {
    id: "instagram",
    name: "Instagram DM",
    icon: "📸",
    description: "Connect to Instagram Direct Messages",
    setupType: "oauth",
    availableOnPlans: ["business", "enterprise"],
  },
  {
    id: "twitter",
    name: "Twitter DM",
    icon: "🐦",
    description: "Connect to Twitter Direct Messages",
    setupType: "oauth",
    availableOnPlans: ["business", "enterprise"],
  },
  {
    id: "discord",
    name: "Discord",
    icon: "🎮",
    description: "Add your chatagent to Discord servers",
    setupType: "oauth",
    availableOnPlans: ["business", "enterprise"],
  },
];

export default function PlatformIntegrations({
  chatagentId,
  initialIntegrations = {
    website: true,
    whatsapp: false,
    slack: false,
    facebook: false,
    shopify: false,
    wordpress: false,
    twilio: false,
    telegram: false,
    instagram: false,
    twitter: false,
    discord: false,
  },
}: PlatformIntegrationsProps) {
  const [integrations, setIntegrations] = useState(initialIntegrations);
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [activeModal, setActiveModal] = useState<string | null>(null);

  // Current user plan - in a real app, this would come from the user's subscription
  const currentPlan = "pro"; // 'free', 'pro', 'business', or 'enterprise'

  const handleConnect = async (platformId: string) => {
    setLoading((prev) => ({ ...prev, [platformId]: true }));

    try {
      // In production, this would call the real API
      // await integrationsAPI.connect(chatagentId, platformId);

      // For development, simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // For platforms that need OAuth or additional setup, show modal
      if (
        [
          "whatsapp",
          "slack",
          "facebook",
          "shopify",
          "wordpress",
          "twilio",
          "telegram",
          "instagram",
          "twitter",
          "discord",
        ].includes(platformId)
      ) {
        setActiveModal(platformId);
      } else {
        // For simple integrations like website, just mark as connected
        setIntegrations((prev) => ({
          ...prev,
          [platformId]: true,
        }));
      }
    } catch (error) {
      console.error(`Failed to connect to ${platformId}:`, error);
    } finally {
      setLoading((prev) => ({ ...prev, [platformId]: false }));
    }
  };

  const handleDisconnect = async (platformId: string) => {
    setLoading((prev) => ({ ...prev, [platformId]: true }));

    try {
      // In production, this would call the real API
      // await integrationsAPI.disconnect(chatagentId, platformId);

      // For development, simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setIntegrations((prev) => ({
        ...prev,
        [platformId]: false,
      }));
    } catch (error) {
      console.error(`Failed to disconnect from ${platformId}:`, error);
    } finally {
      setLoading((prev) => ({ ...prev, [platformId]: false }));
    }
  };

  const handleModalSuccess = (platformId: string) => {
    setIntegrations((prev) => ({
      ...prev,
      [platformId]: true,
    }));
    setActiveModal(null);
  };

  const isPlatformAvailable = (availableOnPlans: string[]) => {
    return availableOnPlans.includes(currentPlan);
  };

  const getWebsiteEmbedCode = () => {
    return `<script>
  window.boltzConfig = {
    chatagentId: "${chatagentId}",
    position: "bottom-right",
  }
</script>
<script 
  src="https://cdn.Helix/widget.js" 
  async>
</script>`;
  };

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900">
          Platform Integrations
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Connect your chatagent to multiple platforms to reach your users
          wherever they are.
        </p>

        <div className="mt-6 space-y-6">
          {platforms.map((platform) => {
            const isAvailable = isPlatformAvailable(platform.availableOnPlans);
            const isConnected =
              integrations[platform.id as keyof typeof integrations];

            return (
              <div
                key={platform.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
              >
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                    <span className="text-xl">{platform.icon}</span>
                  </div>
                  <div className="ml-3">
                    <h4 className="text-sm font-medium text-gray-900">
                      {platform.name}
                    </h4>
                    <p className="text-xs text-gray-500">
                      {platform.description}
                    </p>
                  </div>
                </div>

                {isAvailable ? (
                  <div>
                    {isConnected ? (
                      <div className="flex items-center space-x-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Connected
                        </span>
                        {platform.id === "website" && (
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(
                                getWebsiteEmbedCode()
                              );
                              alert("Embed code copied to clipboard!");
                            }}
                            className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
                          >
                            Copy Code
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleDisconnect(platform.id)}
                          disabled={loading[platform.id]}
                          className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                        >
                          {loading[platform.id] ? (
                            <Spinner size="sm" />
                          ) : (
                            "Disconnect"
                          )}
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleConnect(platform.id)}
                        disabled={loading[platform.id]}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                      >
                        {loading[platform.id] ? (
                          <Spinner size="sm" color="white" />
                        ) : (
                          "Connect"
                        )}
                      </button>
                    )}
                  </div>
                ) : (
                  <div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      Available on{" "}
                      {platform.availableOnPlans
                        .slice(-1)[0]
                        .charAt(0)
                        .toUpperCase() +
                        platform.availableOnPlans.slice(-1)[0].slice(1)}{" "}
                      plan
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Integration Modals */}
      <WhatsAppIntegrationModal
        chatagentId={chatagentId}
        isOpen={activeModal === "whatsapp"}
        onClose={() => setActiveModal(null)}
        onSuccess={() => handleModalSuccess("whatsapp")}
      />

      <SlackIntegrationModal
        chatagentId={chatagentId}
        isOpen={activeModal === "slack"}
        onClose={() => setActiveModal(null)}
        onSuccess={() => handleModalSuccess("slack")}
      />

      <FacebookIntegrationModal
        chatagentId={chatagentId}
        isOpen={activeModal === "facebook"}
        onClose={() => setActiveModal(null)}
        onSuccess={() => handleModalSuccess("facebook")}
      />

      <TwilioIntegrationModal
        chatagentId={chatagentId}
        isOpen={activeModal === "twilio"}
        onClose={() => setActiveModal(null)}
        onSuccess={() => handleModalSuccess("twilio")}
      />

      <ShopifyIntegrationModal
        chatagentId={chatagentId}
        isOpen={activeModal === "shopify"}
        onClose={() => setActiveModal(null)}
        onSuccess={() => handleModalSuccess("shopify")}
      />

      <WordPressIntegrationModal
        chatagentId={chatagentId}
        isOpen={activeModal === "wordpress"}
        onClose={() => setActiveModal(null)}
        onSuccess={() => handleModalSuccess("wordpress")}
      />

      <TelegramIntegrationModal
        chatagentId={chatagentId}
        isOpen={activeModal === "telegram"}
        onClose={() => setActiveModal(null)}
        onSuccess={() => handleModalSuccess("telegram")}
      />

      <InstagramIntegrationModal
        chatagentId={chatagentId}
        isOpen={activeModal === "instagram"}
        onClose={() => setActiveModal(null)}
        onSuccess={() => handleModalSuccess("instagram")}
      />

      <TwitterIntegrationModal
        chatagentId={chatagentId}
        isOpen={activeModal === "twitter"}
        onClose={() => setActiveModal(null)}
        onSuccess={() => handleModalSuccess("twitter")}
      />

      <DiscordIntegrationModal
        chatagentId={chatagentId}
        isOpen={activeModal === "discord"}
        onClose={() => setActiveModal(null)}
        onSuccess={() => handleModalSuccess("discord")}
      />
    </div>
  );
}
