import { AgentStatus } from "@/types/agent";

export const highlights = [
  {
    src: "/img/logo.webp",
    title: "Trained on your truth",
    description:
      "Feed your AI live business data — docs, tools, and systems — and watch it respond like an expert.",
  },
  {
    src: "/img/logo.webp",
    title: "Launch in minutes, not months",
    description:
      "No dev teams? No problem. Our intuitive no-code builder gets you from setup to support in record time.",
  },
  {
    src: "/img/logo.webp",

    title: "Secure, Scalable, Always Smarter",
    description:
      "Enterprise-grade security meets real-time learning and analytics — built to grow with you.",
  },
];

export const MOCK_AGENTS = [
  {
    id: "mock-1",
    name: "Victor",
    description: "Business Development Representative AI (BDR)",
    status: AgentStatus.INACTIVE,
    imageUrl: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop&crop=face",
    isTemplate: true,
    agent_type: "text",
    ai_model: "GPT-4",
    credits_per_1k: 15,
    average_rating: 4.8,
    strengths: ["Lead Qualification", "Email Outreach", "Meeting Scheduling"],
    summary: "Expert at identifying and qualifying potential business opportunities with high conversion rates."
  },
  {
    id: "mock-2",
    name: "Gabriel",
    description: "Sales Development Representative (SDR)",
    status: AgentStatus.INACTIVE,
    imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=face",
    isTemplate: true,
    agent_type: "multimodal",
    ai_model: "Claude-3",
    credits_per_1k: 12,
    average_rating: 4.6,
    strengths: ["Cold Calling", "Pipeline Management", "CRM Integration"],
    summary: "Specialized in prospecting and nurturing leads through the sales funnel with personalized engagement."
  },
  {
    id: "mock-3",
    name: "Eleazar",
    description: "Healthcare Virtual Assistant",
    status: AgentStatus.INACTIVE,
    imageUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face",
    isTemplate: true,
    agent_type: "voice",
    ai_model: "Gemini Pro",
    credits_per_1k: 8,
    average_rating: 4.9,
    strengths: ["Patient Support", "Appointment Booking", "Medical FAQs"],
    summary: "Provides compassionate patient care with HIPAA-compliant interactions and 24/7 availability."
  },
];
