"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { gsap } from "gsap";
import { AI_MODELS } from "@/mock-data/ai-models";
import { AgentType } from "@/types/agent";
import KnowledgeIntegration from "./KnowledgeIntegration";
import Image from "next/image";

interface WizardStep {
  id: number;
  title: string;
  subtitle: string;
}

interface AgentTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  defaultBehavior: {
    systemInstruction: string;
    welcomeMessage: string;
    fallbackMessage: string;
  };
}

const WIZARD_STEPS: WizardStep[] = [
  {
    id: 1,
    title: "Choose Template",
    subtitle: "Start with a pre-built template or create from scratch",
  },
  {
    id: 2,
    title: "Basic Info",
    subtitle: "Name your agent and describe its purpose",
  },
  {
    id: 3,
    title: "Add Knowledge",
    subtitle: "Teach your agent with your content",
  },
  {
    id: 4,
    title: "AI Model",
    subtitle: "Select the AI model that powers your agent",
  },
  {
    id: 5,
    title: "Appearance",
    subtitle: "Customize how your agent looks and feels",
  },
];

const AGENT_TEMPLATES: AgentTemplate[] = [
  {
    id: "customer-support",
    name: "Customer Support",
    description:
      "Handle customer inquiries, troubleshoot issues, and provide helpful solutions",
    icon: "🛎️",
    category: "Support",
    defaultBehavior: {
      systemInstruction:
        "You are a helpful customer support agent. Be friendly, professional, and solution-oriented.",
      welcomeMessage:
        "Hi! I'm here to help with any questions or issues you might have. How can I assist you today?",
      fallbackMessage:
        "I'm not sure about that. Let me connect you with a human agent who can better assist you.",
    },
  },
  {
    id: "sales",
    name: "Sales Assistant",
    description:
      "Guide customers through products, answer questions, and help close deals",
    icon: "💼",
    category: "Sales",
    defaultBehavior: {
      systemInstruction:
        "You are a knowledgeable sales assistant. Help customers find the right products and guide them toward purchase.",
      welcomeMessage:
        "Welcome! I'm here to help you find exactly what you're looking for. What can I help you with today?",
      fallbackMessage:
        "Let me get you in touch with one of our sales specialists for more detailed assistance.",
    },
  },
  {
    id: "lead-gen",
    name: "Lead Generation",
    description: "Capture visitor information and qualify potential customers",
    icon: "🎯",
    category: "Marketing",
    defaultBehavior: {
      systemInstruction:
        "You are a lead qualification agent. Engage visitors and collect their information naturally.",
      welcomeMessage:
        "Hi there! I'd love to learn more about your needs and see how we can help. What brings you here today?",
      fallbackMessage:
        "Would you like to schedule a call with our team to discuss your specific needs?",
    },
  },
  {
    id: "faq",
    name: "FAQ Assistant",
    description: "Answer common questions and provide instant information",
    icon: "❓",
    category: "Support",
    defaultBehavior: {
      systemInstruction:
        "You are an FAQ assistant. Provide clear, accurate answers to common questions.",
      welcomeMessage:
        "Hello! I can help answer your questions quickly. What would you like to know?",
      fallbackMessage:
        "I don't have information about that specific topic. Please contact our support team for more help.",
    },
  },
  {
    id: "blank",
    name: "Start from Scratch",
    description: "Create a custom agent tailored to your specific needs",
    icon: "✨",
    category: "Custom",
    defaultBehavior: {
      systemInstruction: "You are a helpful AI assistant.",
      welcomeMessage: "Hello! How can I help you today?",
      fallbackMessage:
        "I'm not sure about that. Could you please rephrase your question?",
    },
  },
];

interface KnowledgeSource {
  id: string;
  type: "website" | "document" | "faq" | "manual";
  name: string;
  content?: string;
  url?: string;
  status: "pending" | "processing" | "completed" | "error";
}

interface FormData {
  templateId: string;
  name: string;
  description: string;
  agentType: AgentType;
  aiModel: string;
  aiProvider: string;
  creditsPerK: number;
  primaryColor: string;
  welcomeMessage: string;
  systemInstruction: string;
  fallbackMessage: string;
  knowledgeSources: KnowledgeSource[];
}

export default function AgentCreationWizard() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    templateId: "",
    name: "",
    description: "",
    agentType: AgentType.TEXT,
    aiModel: "",
    aiProvider: "",
    creditsPerK: 0,
    primaryColor: "#6366F1",
    welcomeMessage: "",
    systemInstruction: "",
    fallbackMessage: "",
    knowledgeSources: [],
  });

  const stepRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (progressRef.current) {
      gsap.to(progressRef.current, {
        width: `${(currentStep / WIZARD_STEPS.length) * 100}%`,
        duration: 0.6,
        ease: "power2.out",
      });
    }
  }, [currentStep]);

  const animateStepTransition = (direction: "next" | "prev") => {
    if (!stepRef.current || isAnimating) return;

    setIsAnimating(true);
    const tl = gsap.timeline();

    tl.to(stepRef.current, {
      x: direction === "next" ? -50 : 50,
      opacity: 0,
      duration: 0.3,
      ease: "power2.in",
    })
      .set(stepRef.current, { x: direction === "next" ? 50 : -50 })
      .to(stepRef.current, {
        x: 0,
        opacity: 1,
        duration: 0.4,
        ease: "power2.out",
        onComplete: () => setIsAnimating(false),
      });
  };

  const handleNext = () => {
    if (currentStep < WIZARD_STEPS.length && !isAnimating) {
      animateStepTransition("next");
      setTimeout(() => setCurrentStep((prev) => prev + 1), 300);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1 && !isAnimating) {
      animateStepTransition("prev");
      setTimeout(() => setCurrentStep((prev) => prev - 1), 300);
    }
  };

  const handleTemplateSelect = (template: AgentTemplate) => {
    setFormData((prev) => ({
      ...prev,
      templateId: template.id,
      systemInstruction: template.defaultBehavior.systemInstruction,
      welcomeMessage: template.defaultBehavior.welcomeMessage,
      fallbackMessage: template.defaultBehavior.fallbackMessage,
    }));
  };

  const handleModelSelect = (model: any) => {
    setFormData((prev) => ({
      ...prev,
      aiModel: model.model,
      aiProvider: model.provider,
      creditsPerK: model.credits_per_1k,
    }));
  };

  const handleFinish = async () => {
    try {
      // Create agent logic here
      console.log("Creating agent with data:", formData);

      // Navigate to chatagent page
      router.push("/dashboard/chatagent/1");
    } catch (error) {
      console.error("Failed to create agent:", error);
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.templateId !== "";
      case 2:
        return formData.name.trim() !== "";
      case 3:
        return true; // Knowledge is optional
      case 4:
        return formData.aiModel !== "";
      case 5:
        return true;
      default:
        return false;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Choose Your Starting Point
              </h2>
              <p className="text-gray-600">
                Select a template that matches your use case or start from
                scratch
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {AGENT_TEMPLATES.map((template) => (
                <div
                  key={template.id}
                  onClick={() => handleTemplateSelect(template)}
                  className={`relative p-6 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:shadow-lg ${
                    formData.templateId === template.id
                      ? "border-primary-500 bg-primary-50 shadow-md"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="text-center">
                    <div className="text-4xl mb-3">{template.icon}</div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      {template.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                      {template.description}
                    </p>
                    <span className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                      {template.category}
                    </span>
                  </div>

                  {formData.templateId === template.id && (
                    <div className="absolute top-3 right-3">
                      <div className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center">
                        <svg
                          className="w-4 h-4 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6 max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Tell Us About Your Agent
              </h2>
              <p className="text-gray-600">
                Give your agent a name and describe what it should do
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Agent Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="e.g., Customer Support Assistant"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Describe what your agent will help users with..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Agent Type
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {Object.values(AgentType).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, agentType: type }))
                      }
                      className={`p-3 rounded-lg border-2 text-center capitalize transition-all ${
                        formData.agentType === type
                          ? "border-primary-500 bg-primary-50 text-primary-700"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Teach Your Agent
              </h2>
              <p className="text-gray-600">
                Add knowledge sources to make your agent smarter
              </p>
            </div>

            <KnowledgeIntegration
              onSourcesChange={(sources) =>
                setFormData((prev) => ({ ...prev, knowledgeSources: sources }))
              }
            />
          </div>
        );

      case 4:
        const availableModels = AI_MODELS.filter((model) =>
          formData.agentType === AgentType.TEXT
            ? model.capabilities.includes("text") &&
              !model.capabilities.includes("multimodal")
            : formData.agentType === AgentType.VOICE
              ? model.capabilities.includes("voice")
              : model.capabilities.includes("multimodal")
        );

        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Choose Your AI Model
              </h2>
              <p className="text-gray-600">
                Select the AI model that will power your agent
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
              {availableModels.map((model) => (
                <div
                  key={`${model.provider}-${model.model}`}
                  onClick={() => handleModelSelect(model)}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${
                    formData.aiModel === model.model
                      ? "border-primary-500 bg-primary-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <Image
                      height={40}
                      width={40}
                      src={model.image}
                      alt={model.provider}
                      className="w-8 h-8"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-gray-900">
                          {model.model}
                        </h3>
                        <span className="text-sm text-gray-500">
                          {model.credits} credits/1k
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {model.description}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {model.capabilities.map((cap) => (
                          <span
                            key={cap}
                            className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded"
                          >
                            {cap}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6 max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Customize Appearance
              </h2>
              <p className="text-gray-600">Make your agent match your brand</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Primary Color
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={formData.primaryColor}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        primaryColor: e.target.value,
                      }))
                    }
                    className="w-12 h-12 rounded-lg border border-gray-300"
                  />
                  <input
                    type="text"
                    value={formData.primaryColor}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        primaryColor: e.target.value,
                      }))
                    }
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Welcome Message
                </label>
                <textarea
                  value={formData.welcomeMessage}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      welcomeMessage: e.target.value,
                    }))
                  }
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="The first message users will see..."
                />
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-3">Preview</h3>
                <div className="bg-white rounded-lg shadow-sm border p-4">
                  <div className="flex items-start space-x-3">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
                      style={{ backgroundColor: formData.primaryColor }}
                    >
                      AI
                    </div>
                    <div className="flex-1">
                      <div
                        className="inline-block px-4 py-2 rounded-lg text-white text-sm"
                        style={{ backgroundColor: formData.primaryColor }}
                      >
                        {formData.welcomeMessage ||
                          "Hello! How can I help you today?"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-900">
              Create New Agent
            </h1>
            <span className="text-sm text-gray-500">
              Step {currentStep} of {WIZARD_STEPS.length}
            </span>
          </div>

          <div className="relative">
            <div className="h-2 bg-gray-200 rounded-full">
              <div
                ref={progressRef}
                className="h-2 bg-primary-500 rounded-full transition-all duration-600"
                style={{
                  width: `${(currentStep / WIZARD_STEPS.length) * 100}%`,
                }}
              />
            </div>

            <div className="flex justify-between mt-2">
              {WIZARD_STEPS.map((step) => (
                <div key={step.id} className="text-center">
                  <div
                    className={`text-xs font-medium ${
                      currentStep >= step.id
                        ? "text-primary-600"
                        : "text-gray-400"
                    }`}
                  >
                    {step.title}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-xl shadow-sm border">
          <div ref={stepRef} className="p-8">
            {renderStep()}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between p-6 border-t bg-gray-50 rounded-b-xl">
            <button
              onClick={handlePrev}
              disabled={currentStep === 1}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            <div className="flex space-x-3">
              {currentStep < WIZARD_STEPS.length ? (
                <button
                  onClick={handleNext}
                  disabled={!isStepValid() || isAnimating}
                  className="px-6 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={handleFinish}
                  disabled={!isStepValid()}
                  className="px-6 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Create Agent
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
