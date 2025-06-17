"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import {
  WebsiteCrawler,
  TextTrainer,
  WhatsAppTrainer,
  SystemPromptEditor,
  IntegrationSettings,
} from "@/components/chatbot";

// Mock data for AI models
const aiModels = [
  {
    id: "gemini",
    name: "Google Gemini",
    description: "Default model with balanced performance and cost.",
    isDefault: true,
  },
  {
    id: "gpt4",
    name: "GPT-4",
    description: "Advanced model with superior reasoning capabilities.",
    isDefault: false,
  },
  {
    id: "claude",
    name: "Claude",
    description: "Excellent for long-form content and detailed responses.",
    isDefault: false,
  },
  {
    id: "mistral",
    name: "Mistral",
    description: "Efficient model with strong multilingual capabilities.",
    isDefault: false,
  },
  {
    id: "llama3",
    name: "Llama 3",
    description: "Open-source model with good performance for various tasks.",
    isDefault: false,
  },
];

// Mock data for deployment platforms
const platforms = [
  { id: "website", name: "Website", icon: "🌐" },
  { id: "whatsapp", name: "WhatsApp", icon: "📱" },
  { id: "facebook", name: "Facebook Messenger", icon: "👥" },
  { id: "wordpress", name: "WordPress", icon: "📝" },
];

// Default system prompt
const defaultSystemPrompt = `You are a helpful AI assistant. Your goal is to provide accurate, helpful, and friendly responses to user queries.

Instructions:
- Be concise and clear in your responses
- If you're unsure about something, acknowledge your uncertainty
- Maintain a professional but friendly tone
- Avoid making up information
- Ask clarifying questions when needed`;

export default function CreateChatbotPage() {
  const [step, setStep] = useState(1);
  const [chatbotData, setChatbotData] = useState({
    name: "",
    description: "",
    aiModel: "gemini",
    platforms: [],
    welcomeMessage: "Hello! How can I help you today?",
    primaryColor: "#6366F1",
    avatar: "default",
    systemPrompt: defaultSystemPrompt,
    trainingData: {
      websites: [],
      texts: [],
      whatsappChats: [],
    },
    integrations: {
      calendly: { enabled: false },
      googleCalendar: { enabled: false },
      cal: { enabled: false },
      stripe: { enabled: false },
      paystack: { enabled: false },
      opay: { enabled: false },
      moneypoint: { enabled: false },
    },
  });

  const updateChatbotData = (field, value) => {
    setChatbotData({
      ...chatbotData,
      [field]: value,
    });
  };

  const togglePlatform = (platformId: string) => {
    const currentPlatforms = [...chatbotData.platforms] as string[];
    if (currentPlatforms.includes(platformId)) {
      updateChatbotData(
        "platforms",
        currentPlatforms.filter((id) => id !== platformId)
      );
    } else {
      updateChatbotData("platforms", [...currentPlatforms, platformId]);
    }
  };

  const handleWebsiteTraining = (data) => {
    updateChatbotData("trainingData", {
      ...chatbotData.trainingData,
      websites: [...chatbotData.trainingData.websites, data],
    });
  };

  const handleTextTraining = (data) => {
    updateChatbotData("trainingData", {
      ...chatbotData.trainingData,
      texts: [...chatbotData.trainingData.texts, data],
    });
  };

  const handleWhatsAppTraining = (data) => {
    updateChatbotData("trainingData", {
      ...chatbotData.trainingData,
      whatsappChats: [...chatbotData.trainingData.whatsappChats, data],
    });
  };

  const handleSystemPromptUpdate = (prompt: string) => {
    updateChatbotData("systemPrompt", prompt);
  };

  const handleIntegrationsUpdate = (integrations) => {
    updateChatbotData("integrations", integrations);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would save the chatbot data
    // For now, we'll just simulate completion
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Navigate to the chatbot list or the new chatbot page
      window.location.href = "/dashboard/chatbots";
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <Link
          href="/dashboard/chatbots"
          className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-500"
        >
          <ArrowLeftIcon className="mr-1 h-4 w-4" />
          Back to AI Agent
        </Link>
        <h1 className="mt-2 text-2xl font-semibold text-gray-900">
          Create New AI Agent
        </h1>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <nav aria-label="Progress">
          <ol className="flex items-center">
            <li
              className={`relative pr-8 sm:pr-20 ${step > 1 ? "text-primary-600" : "text-primary-600"}`}
            >
              <div className="flex items-center">
                <div
                  className={`h-8 w-8 flex items-center justify-center rounded-full ${step >= 1 ? "bg-primary-600" : "bg-gray-300"}`}
                >
                  <span className="text-white font-medium">1</span>
                </div>
                <span className="ml-2 text-sm font-medium">Basic Info</span>
              </div>
              <div className="absolute top-4 right-0 h-0.5 w-full bg-gray-300">
                <div
                  className={`h-0.5 ${step > 1 ? "bg-primary-600 w-full" : "w-0"} transition-all duration-300`}
                ></div>
              </div>
            </li>
            
            <li
              className={`relative pr-8 sm:pr-20 ${step > 2 ? "text-primary-600" : step === 2 ? "text-primary-600" : "text-gray-500"}`}
            >
              <div className="flex items-center">
                <div
                  className={`h-8 w-8 flex items-center justify-center rounded-full ${step >= 2 ? "bg-primary-600" : "bg-gray-300"}`}
                >
                  <span className="text-white font-medium">2</span>
                </div>
                <span className="ml-2 text-sm font-medium">Training</span>
              </div>
              <div className="absolute top-4 right-0 h-0.5 w-full bg-gray-300">
                <div
                  className={`h-0.5 ${step > 3 ? "bg-primary-600 w-full" : "w-0"} transition-all duration-300`}
                ></div>
              </div>
            </li>
            
            <li
              className={`relative ${step === 3 ? "text-primary-600" : "text-gray-500"}`}
            >
              <div className="flex items-center">
                <div
                  className={`h-8 w-8 flex items-center justify-center rounded-full ${step >= 3 ? "bg-primary-600" : "bg-gray-300"}`}
                >
                  <span className="text-white font-medium">3</span>
                </div>
                <span className="ml-2 text-sm font-medium">Appearance</span>
              </div>
            </li>
          </ol>
        </nav>
      </div>

      <div className="bg-white shadow rounded-lg">
        <form onSubmit={handleSubmit}>
          {/* Step 1: Basic Information */}
          {step === 1 && (
            <div className="p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Basic Information
              </h2>
              <div className="space-y-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    AI Agent Name
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={chatbotData.name}
                      onChange={(e) =>
                        updateChatbotData("name", e.target.value)
                      }
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      placeholder="e.g., Customer Support Bot"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Description
                  </label>
                  <div className="mt-1">
                    <textarea
                      id="description"
                      name="description"
                      rows={3}
                      value={chatbotData.description}
                      onChange={(e) =>
                        updateChatbotData("description", e.target.value)
                      }
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      placeholder="Describe what your chatbot does"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Deployment Platforms
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {platforms.map((platform) => (
                      <div key={platform.id} className="relative">
                        <input
                          type="checkbox"
                          id={`platform-${platform.id}`}
                          checked={chatbotData.platforms.includes(platform.id)}
                          onChange={() => togglePlatform(platform.id)}
                          className="sr-only"
                        />
                        <label
                          htmlFor={`platform-${platform.id}`}
                          className={`flex items-center p-3 border rounded-md cursor-pointer ${
                            chatbotData.platforms.includes(platform.id)
                              ? "border-primary-500 bg-primary-50"
                              : "border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          <span className="text-xl mr-2">{platform.icon}</span>
                          <span className="text-sm font-medium">
                            {platform.name}
                          </span>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          

          {/* Step 2: Training */}
          {step === 2 && (
            <div className="p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Train Your Agent
              </h2>
              <p className="text-sm text-gray-500 mb-6">
                Provide data to train your agent. You can use website content,
                text documents, or WhatsApp conversations.
              </p>

              <div className="space-y-8">
                <WebsiteCrawler onSubmit={handleWebsiteTraining} />

                <TextTrainer onSubmit={handleTextTraining} />

                <WhatsAppTrainer onSubmit={handleWhatsAppTraining} />

                {/* Training Data Summary */}
                {(chatbotData.trainingData.websites.length > 0 ||
                  chatbotData.trainingData.texts.length > 0 ||
                  chatbotData.trainingData.whatsappChats.length > 0) && (
                  <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">
                      Training Data Summary
                    </h3>

                    {chatbotData.trainingData.websites.length > 0 && (
                      <div className="mb-3">
                        <h4 className="text-xs font-medium text-gray-600">
                          Websites ({chatbotData.trainingData.websites.length})
                        </h4>
                        <ul className="mt-1 text-xs text-gray-500">
                          {chatbotData.trainingData.websites.map(
                            (website, index) => (
                              <li key={index} className="truncate">
                                {website.websiteUrl}
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                    )}

                    {chatbotData.trainingData.texts.length > 0 && (
                      <div className="mb-3">
                        <h4 className="text-xs font-medium text-gray-600">
                          Text Content ({chatbotData.trainingData.texts.length})
                        </h4>
                        <ul className="mt-1 text-xs text-gray-500">
                          {chatbotData.trainingData.texts.map((text, index) => (
                            <li key={index} className="truncate">
                              {text.title} ({text.type})
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {chatbotData.trainingData.whatsappChats.length > 0 && (
                      <div>
                        <h4 className="text-xs font-medium text-gray-600">
                          WhatsApp Chats (
                          {chatbotData.trainingData.whatsappChats.length})
                        </h4>
                        <ul className="mt-1 text-xs text-gray-500">
                          {chatbotData.trainingData.whatsappChats.map(
                            (chat, index) => (
                              <li key={index} className="truncate">
                                {chat.chatName}
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          

          {/* Step 3: Appearance */}
          {step === 3 && (
            <div className="p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Customize Appearance
              </h2>
              <div className="space-y-6">
                <div>
                  <label
                    htmlFor="welcomeMessage"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Welcome Message
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="welcomeMessage"
                      id="welcomeMessage"
                      value={chatbotData.welcomeMessage}
                      onChange={(e) =>
                        updateChatbotData("welcomeMessage", e.target.value)
                      }
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      placeholder="Hello! How can I help you today?"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="primaryColor"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Primary Color
                  </label>
                  <div className="mt-1 flex items-center">
                    <input
                      type="color"
                      name="primaryColor"
                      id="primaryColor"
                      value={chatbotData.primaryColor}
                      onChange={(e) =>
                        updateChatbotData("primaryColor", e.target.value)
                      }
                      className="h-8 w-8 rounded-md border-gray-300 cursor-pointer"
                    />
                    <span className="ml-2 text-sm text-gray-500">
                      {chatbotData.primaryColor}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Avatar Style
                  </label>
                  <div className="grid grid-cols-4 gap-4">
                    {["default", "robot", "human", "custom"].map((avatar) => (
                      <div key={avatar} className="relative">
                        <input
                          type="radio"
                          id={`avatar-${avatar}`}
                          name="avatar"
                          value={avatar}
                          checked={chatbotData.avatar === avatar}
                          onChange={() => updateChatbotData("avatar", avatar)}
                          className="sr-only"
                        />
                        <label
                          htmlFor={`avatar-${avatar}`}
                          className={`flex flex-col items-center p-3 border rounded-md cursor-pointer ${
                            chatbotData.avatar === avatar
                              ? "border-primary-500 bg-primary-50"
                              : "border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                            {avatar === "default" && "😊"}
                            {avatar === "robot" && "🤖"}
                            {avatar === "human" && "👤"}
                            {avatar === "custom" && "📷"}
                          </div>
                          <span className="mt-2 text-xs font-medium capitalize">
                            {avatar}
                          </span>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="px-6 py-4 bg-gray-50 rounded-b-lg flex justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Previous
              </button>
            ) : (
              <div></div>
            )}
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              {step < 5 ? "Continue" : "Create Chatbot"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}