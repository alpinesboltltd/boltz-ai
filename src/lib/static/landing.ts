// Landing page static data

export interface PricingTier {
    name: string;
    id: string;
    price: string;
    description: string;
    features: string[];
    cta: string;
    mostPopular: boolean;
}

export interface Testimonial {
    content: string;
    author: string;
    role: string;
    company: string;
}

export interface AgentType {
    name: string;
    description: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    icon: any;
    features: string[];
}

export interface CoreFeature {
    name: string;
    description: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    icon: any;
}

export interface FeaturesTableItem {
    name: string;
    description: string;
    platforms: string;
    tiers: {
        free: boolean;
        pro: boolean;
        business: boolean;
    };
}

export interface Feature {
    title: string;
    description: string;
}

export interface EnterpriseFeature {
    title: string;
    description: string;
}

export const pricingTiers: PricingTier[] = [
    {
        name: "Free",
        id: "tier-free",
        price: "$0",
        description: "Perfect for small projects and personal websites.",
        features: [
            "1,000 messages per month",
            "Basic chatagent customization",
            "Website integration",
            "Google Gemini AI model",
            "Email support",
        ],
        cta: "Start for free",
        mostPopular: false,
    },
    {
        name: "Pro",
        id: "tier-pro",
        price: "$29",
        description: "Ideal for growing businesses and e-commerce sites.",
        features: [
            "10,000 messages per month",
            "Advanced chatagent customization",
            "Website & WhatsApp integration",
            "All AI models (Gemini, GPT-4, Claude)",
            "Knowledge base integration",
            "Analytics dashboard",
            "Priority support",
        ],
        cta: "Get started",
        mostPopular: true,
    },
    {
        name: "Business",
        id: "tier-business",
        price: "$99",
        description: "For businesses with advanced needs and multiple channels.",
        features: [
            "50,000 messages per month",
            "Full chatagent customization",
            "All platform integrations",
            "All AI models with fine-tuning",
            "Advanced analytics",
            "Team collaboration",
            "API access",
            "Dedicated support",
        ],
        cta: "Contact sales",
        mostPopular: false,
    },
];

export const testimonials: Testimonial[] = [
    {
        content:
            "Boltz Ai transformed our customer support. We reduced response times by 80% and increased satisfaction by 35%.",
        author: "Sarah Johnson",
        role: "Customer Success Manager",
        company: "TechCorp Inc.",
    },
    {
        content:
            "Setting up our AI agent took minutes. The platform is intuitive and the responses are incredibly accurate.",
        author: "Michael Chen",
        role: "E-commerce Director",
        company: "Retail Solutions",
    },
    {
        content:
            "Our voice agent handles 70% of calls without human intervention. The ROI has been phenomenal.",
        author: "Jessica Patel",
        role: "Head of Support",
        company: "SaaS Platform",
    },
];

// Agent types data (icons should be passed as props)
export const agentTypesData = [
    {
        name: "Multimodal AI Agents",
        description:
            "Handle text, images, documents, and voice in one intelligent agent. Perfect for complex customer support scenarios.",
        features: [
            "Image recognition",
            "Document processing",
            "Voice integration",
            "Multi-format responses",
        ],
    },
    {
        name: "Text AI Agents",
        description:
            "Lightning-fast text-based agents for chat, email, and messaging platforms. Optimized for quick, accurate responses.",
        features: [
            "Instant responses",
            "Context awareness",
            "Multi-language",
            "Smart routing",
        ],
    },
    {
        name: "Voice AI Agents",
        description:
            "Natural voice conversations with advanced speech recognition and synthesis. Handle phone calls like a human.",
        features: [
            "Natural speech",
            "Real-time processing",
            "Emotion detection",
            "Call handling",
        ],
    },
];

// Core features data (icons should be passed as props)
export const coreFeaturesData = [
    {
        name: "Advanced AI Models",
        description:
            "Powered by GPT-5, Claude, Gemini, and other leading AI models for superior performance.",
    },
    {
        name: "Real-time Analytics",
        description:
            "Track performance, user satisfaction, and conversion metrics with detailed dashboards.",
    },
    {
        name: "Enterprise Security",
        description:
            "Bank-level security with encryption, compliance, and data protection built-in.",
    },
];

// Features table data
export const featuresTableData: Feature[] = [
    {
        title: "AI-Powered Conversations",
        description: "Natural language processing for human-like conversations",
    },
    {
        title: "Multi-Channel Support",
        description: "Deploy on website, WhatsApp, Slack, and more",
    },
    {
        title: "Knowledge Base",
        description: "Train your agent with documents, FAQs, and website data",
    },
    {
        title: "Custom Actions",
        description: "Create workflows and automations specific to your business",
    },
    {
        title: "Analytics Dashboard",
        description: "Track conversations, user satisfaction, and performance",
    },
    {
        title: "Team Collaboration",
        description: "Work together to build and improve your agents",
    },
];

// Enterprise features data
export const enterpriseFeatures: EnterpriseFeature[] = [
    {
        title: "Unlimited Agents",
        description: "Create as many AI agents as you need for your organization",
    },
    {
        title: "Custom Integrations",
        description: "Connect with your existing tools and systems",
    },
    {
        title: "Dedicated Support",
        description: "24/7 priority support with a dedicated account manager",
    },
    {
        title: "White-Label Solution",
        description: "Brand the entire platform as your own",
    },
    {
        title: "Advanced Security",
        description: "Enterprise-grade security with custom compliance requirements",
    },
    {
        title: "On-Premise Deployment",
        description: "Deploy on your own infrastructure for maximum control",
    },
    {
        title: "SLA Guarantees",
        description: "Guaranteed uptime and response times",
    },
    {
        title: "Custom AI Models",
        description: "Fine-tune or deploy your own AI models",
    },
];

// Plans for pricing page
export const pricingPlans = [
    {
        name: "Free",
        price: "$0",
        period: "forever",
        description: "Perfect for getting started",
        features: [
            "1 AI Agent",
            "1,000 messages/month",
            "Basic customization",
            "Email support",
        ],
        cta: "Start Free",
        highlighted: false,
    },
    {
        name: "Pro",
        price: "$29",
        period: "per month",
        description: "For growing businesses",
        features: [
            "5 AI Agents",
            "10,000 messages/month",
            "Advanced customization",
            "All integrations",
            "Priority support",
            "Analytics dashboard",
        ],
        cta: "Get Started",
        highlighted: true,
    },
    {
        name: "Business",
        price: "$99",
        period: "per month",
        description: "For larger teams",
        features: [
            "20 AI Agents",
            "50,000 messages/month",
            "Custom branding",
            "API access",
            "Team collaboration",
            "Advanced analytics",
            "Dedicated support",
        ],
        cta: "Contact Sales",
        highlighted: false,
    },
    {
        name: "Enterprise",
        price: "Custom",
        period: "contact us",
        description: "For enterprise needs",
        features: [
            "Unlimited AI Agents",
            "Unlimited messages",
            "White-label solution",
            "On-premise deployment",
            "Custom integrations",
            "SLA guarantees",
            "Account manager",
        ],
        cta: "Contact Us",
        highlighted: false,
    },
];

export const FeaturesTableItem: FeaturesTableItem[] = [
    {
        name: "AI Conversations",
        description: "Natural language processing with context awareness",
        platforms: "All",
        tiers: { free: true, pro: true, business: true },
    },
    {
        name: "Website Widget",
        description: "Embeddable chat widget for your website",
        platforms: "Web",
        tiers: { free: true, pro: true, business: true },
    },
    {
        name: "WhatsApp Integration",
        description: "Connect your agent to WhatsApp Business",
        platforms: "WhatsApp",
        tiers: { free: false, pro: true, business: true },
    },
    {
        name: "Knowledge Base",
        description: "Train on your own documents and data",
        platforms: "All",
        tiers: { free: false, pro: true, business: true },
    },
    {
        name: "API Access",
        description: "Programmatic access to your agents",
        platforms: "API",
        tiers: { free: false, pro: false, business: true },
    },
    {
        name: "Team Collaboration",
        description: "Invite team members to manage agents",
        platforms: "Web",
        tiers: { free: false, pro: false, business: true },
    },
];
