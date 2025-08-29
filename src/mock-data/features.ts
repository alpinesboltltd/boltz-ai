export interface Feature {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: "ai" | "integration" | "customization" | "analytics" | "security";
}

export const features: Feature[] = [
  {
    id: "custom-ai-models",
    name: "Custom AI Model Selection",
    description:
      "Choose from multiple AI models including Google Gemini, GPT-4, Claude, and Mistral to power your chatagent.",
    icon: "CpuChip",
    category: "ai",
  },
  {
    id: "no-code-builder",
    name: "No-Code Chatbot Builder",
    description:
      "Build and customize your chatagent without writing a single line of code using our intuitive drag-and-drop interface.",
    icon: "CubeTransparent",
    category: "customization",
  },
  {
    id: "knowledge-base",
    name: "Knowledge Base Integration",
    description:
      "Train your chatagent with your documents, FAQs, and website data to provide accurate and relevant responses.",
    icon: "DocumentText",
    category: "ai",
  },
  {
    id: "real-time-training",
    name: "Real-time Training",
    description:
      "Update and improve your chatagent's responses in real-time as you receive user feedback.",
    icon: "ArrowPath",
    category: "ai",
  },
  {
    id: "multi-channel",
    name: "Multi-channel Deployment",
    description:
      "Deploy your chatagent on your website, WhatsApp, Slack, and other platforms with a single click.",
    icon: "GlobeAlt",
    category: "integration",
  },
  {
    id: "advanced-analytics",
    name: "Advanced Analytics",
    description:
      "Track user interactions, conversation quality, and conversion metrics with detailed analytics.",
    icon: "ChartBar",
    category: "analytics",
  },
  {
    id: "multilingual",
    name: "Multilingual Support",
    description:
      "Communicate with your customers in over 80 languages with automatic language detection and translation.",
    icon: "ChatBubbleLeftRight",
    category: "customization",
  },
  {
    id: "enterprise-security",
    name: "Enterprise-grade Security",
    description:
      "Keep your data safe with end-to-end encryption, GDPR compliance, and advanced security features.",
    icon: "ShieldCheck",
    category: "security",
  },
  {
    id: "human-handoff",
    name: "Human Handoff",
    description:
      "Seamlessly transfer conversations from your chatagent to human agents when needed.",
    icon: "UserGroup",
    category: "integration",
  },
  {
    id: "conversation-flows",
    name: "Visual Conversation Flows",
    description:
      "Design complex conversation paths with our visual flow editor to guide users through specific scenarios.",
    icon: "ArrowsPointingOut",
    category: "customization",
  },
  {
    id: "api-access",
    name: "API Access",
    description:
      "Integrate your chatagent with your existing systems using our comprehensive API.",
    icon: "CodeBracket",
    category: "integration",
  },
  {
    id: "team-collaboration",
    name: "Team Collaboration",
    description:
      "Work together with your team to build, train, and improve your chatagents.",
    icon: "UserGroup",
    category: "customization",
  },
  {
    id: "conversation-history",
    name: "Conversation History",
    description:
      "Access and analyze past conversations to improve your chatagent's performance.",
    icon: "Clock",
    category: "analytics",
  },
  {
    id: "custom-appearance",
    name: "Custom Appearance",
    description:
      "Customize your chatagent's appearance to match your brand identity.",
    icon: "PaintBrush",
    category: "customization",
  },
  {
    id: "data-export",
    name: "Data Export",
    description:
      "Export conversation data and analytics for further analysis or integration with other tools.",
    icon: "ArrowDownTray",
    category: "analytics",
  },
  {
    id: "adaptive-learning",
    name: "Adaptive Learning",
    description:
      "Your chatagent gets smarter over time by learning from conversations and user feedback.",
    icon: "LightBulb",
    category: "ai",
  },
];
