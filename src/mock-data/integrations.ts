export interface Integration {
  id: string;
  name: string;
  category: "messaging" | "crm" | "ecommerce" | "knowledge" | "analytics";
  description: string;
  icon: string;
  availableInPlans: ("free" | "pro" | "business")[];
}

export const integrations: Integration[] = [
  {
    id: "website",
    name: "Website Widget",
    category: "messaging",
    description:
      "Embed your chatagent on your website with a customizable chat widget.",
    icon: "globe",
    availableInPlans: ["free", "pro", "business"],
  },
  {
    id: "whatsapp",
    name: "WhatsApp",
    category: "messaging",
    description:
      "Connect your chatagent to WhatsApp to engage with customers on their preferred platform.",
    icon: "whatsapp",
    availableInPlans: ["pro", "business"],
  },
  {
    id: "slack",
    name: "Slack",
    category: "messaging",
    description:
      "Integrate your chatagent with Slack to provide instant support to your team.",
    icon: "slack",
    availableInPlans: ["pro", "business"],
  },
  {
    id: "messenger",
    name: "Facebook Messenger",
    category: "messaging",
    description:
      "Connect your chatagent to Facebook Messenger to engage with customers on social media.",
    icon: "facebook",
    availableInPlans: ["pro", "business"],
  },
  {
    id: "telegram",
    name: "Telegram",
    category: "messaging",
    description:
      "Integrate your chatagent with Telegram to provide instant support to your customers.",
    icon: "telegram",
    availableInPlans: ["pro", "business"],
  },
  {
    id: "shopify",
    name: "Shopify",
    category: "ecommerce",
    description:
      "Connect your chatagent to your Shopify store to provide product recommendations and support.",
    icon: "shopify",
    availableInPlans: ["pro", "business"],
  },
  {
    id: "woocommerce",
    name: "WooCommerce",
    category: "ecommerce",
    description:
      "Integrate your chatagent with WooCommerce to enhance your online store experience.",
    icon: "woocommerce",
    availableInPlans: ["pro", "business"],
  },
  {
    id: "salesforce",
    name: "Salesforce",
    category: "crm",
    description:
      "Connect your chatagent to Salesforce to streamline customer data management.",
    icon: "salesforce",
    availableInPlans: ["business"],
  },
  {
    id: "hubspot",
    name: "HubSpot",
    category: "crm",
    description:
      "Integrate your chatagent with HubSpot to enhance your marketing and sales efforts.",
    icon: "hubspot",
    availableInPlans: ["business"],
  },
  {
    id: "zendesk",
    name: "Zendesk",
    category: "crm",
    description:
      "Connect your chatagent to Zendesk to provide seamless customer support.",
    icon: "zendesk",
    availableInPlans: ["business"],
  },
  {
    id: "google-drive",
    name: "Google Drive",
    category: "knowledge",
    description:
      "Train your chatagent with documents from Google Drive to provide accurate information.",
    icon: "google-drive",
    availableInPlans: ["pro", "business"],
  },
  {
    id: "notion",
    name: "Notion",
    category: "knowledge",
    description:
      "Connect your chatagent to Notion to leverage your knowledge base for accurate responses.",
    icon: "notion",
    availableInPlans: ["business"],
  },
  {
    id: "google-analytics",
    name: "Google Analytics",
    category: "analytics",
    description:
      "Track chatagent performance and user interactions with Google Analytics integration.",
    icon: "google-analytics",
    availableInPlans: ["pro", "business"],
  },
  {
    id: "mixpanel",
    name: "Mixpanel",
    category: "analytics",
    description:
      "Analyze chatagent conversations and user behavior with Mixpanel integration.",
    icon: "mixpanel",
    availableInPlans: ["business"],
  },
];
