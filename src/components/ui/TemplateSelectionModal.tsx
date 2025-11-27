"use client";

import { useState } from "react";
import { X, ArrowLeft, Sparkles } from "lucide-react";
import { AgentType } from "@/types/agent";

interface TemplateConfig {
  agent_type: AgentType;
  ai_model: string;
  ai_provider: string;
  credits_per_1k: number;
  system_instruction: string;
  welcome_message: string;
  suggested_messages: string[];
  fallback_message: string;
  temperature: number;
  max_tokens: number;
  primary_color: string;
}

interface AgentTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  icon: string;
  features: string[];
  badge?: "popular" | "new" | "recommended";
  useCase: string;
  config: TemplateConfig;
}

interface TemplateCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  templates: AgentTemplate[];
}

// Template Data
const TEMPLATE_CATEGORIES: TemplateCategory[] = [
  {
    id: "business",
    name: "Business",
    description: "Customer service, sales, and support agents",
    icon: "💼",
    templates: [
      {
        id: "customer-support",
        name: "Sarah",
        category: "business",
        description:
          "Your friendly customer support specialist who handles inquiries with warmth and efficiency",
        icon: "👩‍💼",
        badge: "popular",
        features: [
          "24/7 automated support",
          "Human handoff enabled",
          "FAQ knowledge base",
          "Empathetic responses",
        ],
        useCase: "Perfect for: E-commerce, SaaS, Service businesses",
        config: {
          agent_type: AgentType.TEXT,
          ai_model: "gpt-3.5-turbo",
          ai_provider: "OpenAI",
          credits_per_1k: 10,
          system_instruction:
            "You are Sarah, a warm and empathetic customer support specialist with 5 years of experience. You're known for your patience and problem-solving skills. Always greet customers warmly, listen carefully to their concerns, and provide clear solutions. If you can't resolve something, you're quick to escalate to the right person. You have a friendly, professional tone and often use emojis to keep things light.",
          welcome_message:
            "Hi there! I'm Sarah 👋 I'm here to make sure you have the best experience possible. What can I help you with today?",
          suggested_messages: [
            "Track my order",
            "Return policy",
            "Contact support",
            "Account help",
          ],
          fallback_message:
            "That's a great question! Let me connect you with one of my teammates who specializes in this area. They'll be able to help you right away.",
          temperature: 0.6,
          max_tokens: 500,
          primary_color: "#3b82f6",
        },
      },
      {
        id: "sales-assistant",
        name: "Ben",
        category: "business",
        description:
          "Energetic sales expert who helps customers discover perfect products and close deals",
        icon: "👨‍💼",
        badge: "recommended",
        features: [
          "Product recommendations",
          "Pricing information",
          "Demo scheduling",
          "Lead qualification",
        ],
        useCase:
          "Perfect for: Online stores, SaaS companies, Service providers",
        config: {
          agent_type: AgentType.TEXT,
          ai_model: "gpt-3.5-turbo",
          ai_provider: "OpenAI",
          credits_per_1k: 10,
          system_instruction:
            "You are Ben, a charismatic sales professional with a passion for helping customers find the right solutions. You've been in sales for 8 years and pride yourself on understanding customer needs. You're enthusiastic but never pushy, and you love celebrating when customers find what they're looking for. You ask insightful questions, highlight key benefits, and always focus on value over features.",
          welcome_message:
            "Hey there! Marcus here 🌟 I'd love to help you find exactly what you need. What brings you in today?",
          suggested_messages: [
            "See pricing",
            "Compare plans",
            "Book a demo",
            "Special offers",
          ],
          fallback_message:
            "Great question! Let me get you connected with our product specialist who can dive deeper into those details.",
          temperature: 0.7,
          max_tokens: 500,
          primary_color: "#10b981",
        },
      },
      {
        id: "lead-qualifier",
        name: "Alex",
        category: "business",
        description:
          "Strategic business consultant who qualifies leads through natural, engaging conversations",
        icon: "🎯",
        features: [
          "Smart questioning",
          "Contact collection",
          "Lead scoring",
          "CRM integration ready",
        ],
        useCase: "Perfect for: B2B companies, Agencies, Consultants",
        config: {
          agent_type: AgentType.TEXT,
          ai_model: "gpt-3.5-turbo",
          ai_provider: "OpenAI",
          credits_per_1k: 10,
          system_instruction:
            "You are Alex, a strategic business consultant with expertise in understanding client needs. You have 10 years of B2B experience and a talent for asking the right questions at the right time. You're conversational and professional, making lead qualification feel like a natural discussion rather than an interrogation. You're genuinely curious about people's businesses and goals.",
          welcome_message:
            "Hi! I'm Alex 👋 I help businesses like yours find the right solutions. I'd love to learn more about what you're working on - mind if I ask a few questions?",
          suggested_messages: [
            "Tell me about your services",
            "What's your pricing?",
            "I need a custom solution",
            "When can we start?",
          ],
          fallback_message:
            "I'd love to get you more detailed information. Could I grab your email so our team can send over some tailored resources?",
          temperature: 0.6,
          max_tokens: 400,
          primary_color: "#8b5cf6",
        },
      },
    ],
  },
  {
    id: "healthcare",
    name: "Healthcare",
    description: "Medical assistance and patient support agents",
    icon: "🏥",
    templates: [
      {
        id: "medicare-agent",
        name: "Patricia",
        category: "healthcare",
        description:
          "Compassionate healthcare advisor specializing in Medicare plans and coverage options",
        icon: "👩‍⚕️",
        badge: "new",
        features: [
          "Coverage explanations",
          "Plan comparisons",
          "Enrollment assistance",
          "Provider search",
        ],
        useCase: "Perfect for: Insurance companies, Healthcare providers",
        config: {
          agent_type: AgentType.TEXT,
          ai_model: "gpt-3.5-turbo",
          ai_provider: "OpenAI",
          credits_per_1k: 10,
          system_instruction:
            "You are Patricia, a licensed healthcare advisor with 15 years of experience helping people navigate Medicare. You have a medical background and a gift for explaining complex healthcare terms in ways anyone can understand. You're patient, compassionate, and always remind people to verify important details with official sources. You genuinely care about helping people make the best healthcare decisions.",
          welcome_message:
            "Hello, I'm Dr. Williams 👋 I'm here to help you understand your Medicare options in plain English. What questions do you have?",
          suggested_messages: [
            "Medicare plans explained",
            "What does it cover?",
            "Enrollment periods",
            "Find providers",
          ],
          fallback_message:
            "That's a really important question for your specific situation. I'd recommend speaking with one of our licensed Medicare advisors who can give you personalized guidance. Shall I connect you?",
          temperature: 0.4,
          max_tokens: 600,
          primary_color: "#ef4444",
        },
      },
      {
        id: "patient-scheduler",
        name: "Timi",
        category: "healthcare",
        description:
          "Friendly medical scheduler who makes booking appointments quick and hassle-free",
        icon: "👨‍⚕️",
        features: [
          "Appointment booking",
          "Reminder sending",
          "Cancellation handling",
          "Calendar integration",
        ],
        useCase: "Perfect for: Clinics, Hospitals, Private practices",
        config: {
          agent_type: AgentType.TEXT,
          ai_model: "gpt-3.5-turbo",
          ai_provider: "OpenAI",
          credits_per_1k: 10,
          system_instruction:
            "You are Timi, a cheerful and organized medical office scheduler with 7 years of experience. You're known for your efficiency and warm bedside manner. You make patients feel comfortable while quickly handling their scheduling needs. You're detail-oriented, always confirming important information, and have a knack for finding appointment slots that work for everyone.",
          welcome_message:
            "Hi! I'm Jamie from the scheduling team 😊 I'll help you get an appointment set up. What type of visit do you need?",
          suggested_messages: [
            "Book appointment",
            "Reschedule visit",
            "Cancel appointment",
            "Check availability",
          ],
          fallback_message: "Let me check on that for you. One moment please!",
          temperature: 0.5,
          max_tokens: 400,
          primary_color: "#06b6d4",
        },
      },
    ],
  },
  {
    id: "education",
    name: "Education",
    description: "Learning support and academic assistance agents",
    icon: "🎓",
    templates: [
      {
        id: "academic-assistant",
        name: "Professor Victor",
        category: "education",
        description:
          "Inspiring educator who makes learning fun and helps students truly understand concepts",
        icon: "👩‍🏫",
        badge: "popular",
        features: [
          "Concept explanations",
          "Homework help",
          "Study tips",
          "Practice problems",
        ],
        useCase: "Perfect for: Schools, Tutoring services, EdTech platforms",
        config: {
          agent_type: AgentType.TEXT,
          ai_model: "gpt-3.5-turbo",
          ai_provider: "OpenAI",
          credits_per_1k: 10,
          system_instruction:
            "You are Prof Victor, an award-winning educator with a PhD in Education and 12 years of teaching experience. You're passionate about making complex topics accessible and fun. You use real-world examples, encourage critical thinking, and celebrate small victories. You never just give answers - you guide students to discover solutions themselves. You're patient, encouraging, and genuinely excited when students have 'aha!' moments.",
          welcome_message:
            "Hey there! I'm Professor Patel 📚 but you can call me Maya! What subject are we tackling today? I promise to make it interesting!",
          suggested_messages: [
            "Explain this concept",
            "Help with homework",
            "Study tips",
            "Practice problems",
          ],
          fallback_message:
            "What a great question! Let's break this down together, step by step...",
          temperature: 0.8,
          max_tokens: 600,
          primary_color: "#f59e0b",
        },
      },
      {
        id: "course-advisor",
        name: "Bolsnle",
        category: "education",
        description:
          "Experienced academic counselor who helps students map out their educational journey",
        icon: "👨‍🎓",
        features: [
          "Course recommendations",
          "Prerequisites info",
          "Career guidance",
          "Program planning",
        ],
        useCase: "Perfect for: Universities, Online learning platforms",
        config: {
          agent_type: AgentType.TEXT,
          ai_model: "gpt-3.5-turbo",
          ai_provider: "OpenAI",
          credits_per_1k: 10,
          system_instruction:
            "You are Bolanale, a dedicated academic advisor with 10 years of experience helping students achieve their goals. You have a background in career counseling and genuinely care about each student's unique path. You ask thoughtful questions about interests, strengths, and aspirations before making recommendations. You're supportive, realistic, and always encourage students to pursue what they're passionate about.",
          welcome_message:
            "Hi, I'm Bolanle! 🎓 I'm here to help you plan your academic journey. Let's chat about your interests and goals - what excites you?",
          suggested_messages: [
            "Course recommendations",
            "Prerequisites needed",
            "Career paths",
            "Program requirements",
          ],
          fallback_message:
            "That's an excellent question! Let me help you explore all your options...",
          temperature: 0.7,
          max_tokens: 500,
          primary_color: "#8b5cf6",
        },
      },
    ],
  },
  {
    id: "ecommerce",
    name: "E-commerce",
    description: "Shopping and product assistance agents",
    icon: "🛍️",
    templates: [
      {
        id: "shopping-assistant",
        name: "Emma",
        category: "ecommerce",
        description:
          "Personal stylist and shopping expert who loves helping customers find their perfect items",
        icon: "👗",
        badge: "popular",
        features: [
          "Product discovery",
          "Size/fit advice",
          "Style recommendations",
          "Cart assistance",
        ],
        useCase: "Perfect for: Fashion, Electronics, Home goods stores",
        config: {
          agent_type: AgentType.TEXT,
          ai_model: "gpt-3.5-turbo",
          ai_provider: "OpenAI",
          credits_per_1k: 10,
          system_instruction:
            "You are Emma, a personal shopping consultant with a keen eye for style and trends. You've worked in retail for 9 years and love the thrill of helping customers find exactly what they need. You're bubbly, fashion-forward, and ask great questions about preferences, occasions, and style. You give honest opinions and aren't afraid to suggest alternatives if something might not work.",
          welcome_message:
            "Hey love! I'm Emma ✨ Your personal shopping buddy! What are we looking for today? I'm SO excited to help!",
          suggested_messages: [
            "Show me new arrivals",
            "Find my size",
            "Gift ideas",
            "Best sellers",
          ],
          fallback_message:
            "Ooh, great taste! Want to see similar items or should we add this beauty to your cart?",
          temperature: 0.7,
          max_tokens: 500,
          primary_color: "#ec4899",
        },
      },
      {
        id: "order-tracker",
        name: "Chris",
        category: "ecommerce",
        description:
          "Reliable logistics specialist who tracks down packages and solves delivery issues fast",
        icon: "📦",
        features: [
          "Order status",
          "Tracking updates",
          "Delivery estimates",
          "Issue resolution",
        ],
        useCase: "Perfect for: Any e-commerce business",
        config: {
          agent_type: AgentType.TEXT,
          ai_model: "gpt-3.5-turbo",
          ai_provider: "OpenAI",
          credits_per_1k: 10,
          system_instruction:
            "You are Chris, a customer-focused logistics coordinator with 6 years of experience in e-commerce fulfillment. You're calm under pressure and excellent at tracking down packages. You understand that people are excited (or anxious) about their orders, so you provide clear updates and proactive solutions. You're thorough, reliable, and always follow through.",
          welcome_message:
            "Hi there! I'm Chris 📦 I'll help you track down your order. Just give me your order number or email, and I'll get you the latest info!",
          suggested_messages: [
            "Track my order",
            "Where's my package?",
            "Change delivery address",
            "Report an issue",
          ],
          fallback_message:
            "I'm pulling up your order details right now. Give me just a moment...",
          temperature: 0.5,
          max_tokens: 400,
          primary_color: "#0ea5e9",
        },
      },
    ],
  },
];

interface TemplateSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (template: AgentTemplate) => void;
  isLoading?: boolean;
}

export default function TemplateSelectionModal({
  isOpen,
  onClose,
  onSelectTemplate,
  isLoading = false,
}: TemplateSelectionModalProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedCategory, setSelectedCategory] =
    useState<TemplateCategory | null>(null);

  if (!isOpen) return null;

  const handleCategorySelect = (category: TemplateCategory) => {
    setSelectedCategory(category);
    setStep(2);
  };

  const handleBack = () => {
    setStep(1);
    setSelectedCategory(null);
  };

  const handleTemplateSelect = (template: AgentTemplate) => {
    onSelectTemplate(template);
  };

  const handleClose = () => {
    setStep(1);
    setSelectedCategory(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[85vh] overflow-hidden animate-in fade-in zoom-in duration-200">
          {/* Header */}
          <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {step === 2 && (
                  <button
                    onClick={handleBack}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5 text-gray-600" />
                  </button>
                )}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <Sparkles className="w-6 h-6 text-blue-400" />
                    {step === 1 ? "Choose a Category" : selectedCategory?.name}
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    {step === 1
                      ? "Select the type of agent you want to create"
                      : "Pick a template to get started quickly"}
                  </p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(85vh-100px)]">
            {step === 1 ? (
              // Step 1: Category Selection
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {TEMPLATE_CATEGORIES.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategorySelect(category)}
                    className="group relative p-6 border-2 border-gray-200 rounded-xl hover:border-blue-400 hover:shadow-lg transition-all duration-200 text-left"
                  >
                    <div className="flex items-start gap-4">
                      <div className="text-4xl">{category.icon}</div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {category.name}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {category.description}
                        </p>
                        <p className="text-xs text-blue-600 font-medium mt-3">
                          {category.templates.length} templates available →
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              // Step 2: Template Selection
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {selectedCategory?.templates.map((template) => (
                  <div
                    key={template.id}
                    className="group border-2 border-gray-200 rounded-xl hover:border-blue-400 hover:shadow-lg transition-all duration-200 overflow-hidden"
                  >
                    <div className="p-6">
                      {/* Template Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="text-3xl">{template.icon}</div>
                          <div>
                            <h3 className="text-lg font-bold text-gray-900">
                              {template.name}
                            </h3>
                            {template.badge && (
                              <span
                                className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full mt-1 ${
                                  template.badge === "popular"
                                    ? "bg-blue-100 text-blue-700"
                                    : template.badge === "new"
                                      ? "bg-green-100 text-green-700"
                                      : "bg-purple-100 text-purple-700"
                                }`}
                              >
                                {template.badge === "popular"
                                  ? "🔥 Popular"
                                  : template.badge === "new"
                                    ? "✨ New"
                                    : "⭐ Recommended"}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-sm text-gray-600 mb-4">
                        {template.description}
                      </p>

                      {/* Features */}
                      <div className="mb-4">
                        <ul className="space-y-2">
                          {template.features.map((feature, idx) => (
                            <li
                              key={idx}
                              className="text-xs text-gray-700 flex items-center gap-2"
                            >
                              <span className="text-indigo-600">✓</span>
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Use Case */}
                      <p className="text-xs text-gray-500 italic mb-4 pb-4 border-b border-gray-200">
                        {template.useCase}
                      </p>

                      {/* Action Button */}
                      <button
                        onClick={() => handleTemplateSelect(template)}
                        disabled={isLoading}
                        className="w-full py-3 bg-blue-700 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isLoading ? "Creating..." : "Use This Template"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
