"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/common/Spinner";
import {
  ArrowPathIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

const aiModels = [
  {
    id: "gemini",
    name: "Google Gemini",
    description:
      "Google's advanced AI model with strong reasoning capabilities",
    icon: "🧠",
  },
  {
    id: "gpt4",
    name: "OpenAI GPT-4",
    description: "Powerful language model with excellent comprehension",
    icon: "🤖",
  },
  {
    id: "claude",
    name: "Claude",
    description: "Anthropic's helpful, harmless, and honest AI assistant",
    icon: "🔮",
  },
  {
    id: "mistral",
    name: "Mistral",
    description: "Efficient open-source model with strong performance",
    icon: "💨",
  },
  {
    id: "llama3",
    name: "Llama 3",
    description: "Meta's open-source LLM with competitive performance",
    icon: "🦙",
  },
];

const templates = [
  {
    id: "customer-support",
    name: "Customer Support",
    description: "Handle customer inquiries and support requests",
    icon: "🛎️",
  },
  {
    id: "sales",
    name: "Sales Assistant",
    description: "Help customers find and purchase products",
    icon: "💼",
  },
  {
    id: "faq",
    name: "FAQ Agent",
    description: "Answer frequently asked questions",
    icon: "❓",
  },
  {
    id: "lead-gen",
    name: "Lead Generation",
    description: "Capture leads and qualify prospects",
    icon: "🎯",
  },
  {
    id: "product-recommender",
    name: "Product Recommender",
    description: "Recommend products based on customer preferences",
    icon: "🛍️",
  },
  {
    id: "appointment",
    name: "Appointment Scheduler",
    description: "Help users book appointments and meetings",
    icon: "📅",
  },
  {
    id: "blank",
    name: "Blank",
    description: "Start from scratch with a blank template",
    icon: "📝",
  },
];

export default function CreateAgentPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    welcomeMessage: "Hello! How can I help you today?",
    templateId: "",
    aiModel: "",
    primaryColor: "#6366F1",
    avatarStyle: "robot",
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTemplateSelect = (templateId: string) => {
    setFormData((prev) => ({ ...prev, templateId }));
  };

  const handleModelSelect = (modelId: string) => {
    setFormData((prev) => ({ ...prev, aiModel: modelId }));
  };

  const handleAvatarSelect = (style: string) => {
    setFormData((prev) => ({ ...prev, avatarStyle: style }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // In production, this would call the real API
      // const response = await fetch('/api/agents', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData),
      // });
      // const data = await response.json();

      // For development, simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Navigate to the dashboard
      router.push("/dashboard");
    } catch (error) {
      console.error("Failed to create agent:", error);
    } finally {
      setLoading(false);
    }
  };

  const isStepComplete = () => {
    switch (step) {
      case 1:
        return formData.name.trim() !== "" && formData.templateId !== "";
      case 2:
        return formData.aiModel !== "";
      case 3:
        return formData.welcomeMessage.trim() !== "";
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (isStepComplete()) {
      setStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    setStep((prev) => prev - 1);
  };

  return (
    <div className="py-6">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold text-gray-900">
              Create New AI Agent
            </h1>
            <p className="mt-2 text-sm text-gray-700">
              Set up a new AI agent for your business in just a few steps.
            </p>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="mt-8">
          <nav aria-label="Progress">
            <ol
              role="list"
              className="space-y-4 md:flex md:space-y-0 md:space-x-8"
            >
              {[
                { id: 1, name: "Basic Info", description: "Name and template" },
                {
                  id: 2,
                  name: "AI Model",
                  description: "Select AI capabilities",
                },
                {
                  id: 3,
                  name: "Appearance",
                  description: "Customize look and feel",
                },
                { id: 4, name: "Review", description: "Finalize your agent" },
              ].map((stepItem) => (
                <li key={stepItem.id} className="md:flex-1">
                  <div
                    className={`group flex flex-col border-l-4 py-2 pl-4 ${
                      step > stepItem.id
                        ? "border-primary-600"
                        : step === stepItem.id
                          ? "border-primary-600"
                          : "border-gray-200"
                    } md:border-l-0 md:border-t-4 md:pl-0 md:pt-4 md:pb-0`}
                  >
                    <span
                      className={`text-xs font-semibold uppercase tracking-wide ${
                        step >= stepItem.id
                          ? "text-primary-600"
                          : "text-gray-500"
                      }`}
                    >
                      Step {stepItem.id}
                    </span>
                    <span className="text-sm font-medium">{stepItem.name}</span>
                    <span className="text-xs text-gray-500">
                      {stepItem.description}
                    </span>
                  </div>
                </li>
              ))}
            </ol>
          </nav>
        </div>

        <div className="mt-8 bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <form onSubmit={handleSubmit}>
              {/* Step 1: Basic Info */}
              {step === 1 && (
                <div>
                  <h2 className="text-lg font-medium text-gray-900 mb-4">
                    Basic Information
                  </h2>

                  <div className="space-y-6">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Agent Name <span className="text-red-500">*</span>
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="name"
                          id="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          placeholder="e.g., Customer Support Assistant"
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
                          value={formData.description}
                          onChange={handleInputChange}
                          className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          placeholder="Describe what your AI agent will do"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select a Template{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {templates.map((template) => (
                          <div
                            key={template.id}
                            onClick={() => handleTemplateSelect(template.id)}
                            className={`relative rounded-lg border p-4 cursor-pointer ${
                              formData.templateId === template.id
                                ? "border-primary-500 ring-2 ring-primary-500"
                                : "border-gray-300 hover:border-gray-400"
                            }`}
                          >
                            <div className="flex items-center space-x-3">
                              <div className="text-2xl">{template.icon}</div>
                              <div>
                                <h3 className="text-sm font-medium text-gray-900">
                                  {template.name}
                                </h3>
                                <p className="text-xs text-gray-500">
                                  {template.description}
                                </p>
                              </div>
                            </div>
                            {formData.templateId === template.id && (
                              <div className="absolute top-2 right-2 text-primary-600">
                                <CheckCircleIcon className="h-5 w-5" />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: AI Model */}
              {step === 2 && (
                <div>
                  <h2 className="text-lg font-medium text-gray-900 mb-4">
                    Select AI Model
                  </h2>
                  <p className="text-sm text-gray-500 mb-6">
                    Choose the AI model that will power your agent. Different
                    models have different capabilities and pricing.
                  </p>

                  <div className="space-y-4">
                    {aiModels.map((model) => (
                      <div
                        key={model.id}
                        onClick={() => handleModelSelect(model.id)}
                        className={`relative rounded-lg border p-4 cursor-pointer ${
                          formData.aiModel === model.id
                            ? "border-primary-500 ring-2 ring-primary-500"
                            : "border-gray-300 hover:border-gray-400"
                        }`}
                      >
                        <div className="flex items-center">
                          <div className="text-3xl mr-4">{model.icon}</div>
                          <div>
                            <h3 className="text-sm font-medium text-gray-900">
                              {model.name}
                            </h3>
                            <p className="text-xs text-gray-500">
                              {model.description}
                            </p>
                          </div>
                          {formData.aiModel === model.id && (
                            <div className="absolute top-4 right-4 text-primary-600">
                              <CheckCircleIcon className="h-5 w-5" />
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 3: Appearance */}
              {step === 3 && (
                <div>
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
                        <textarea
                          id="welcomeMessage"
                          name="welcomeMessage"
                          rows={3}
                          value={formData.welcomeMessage}
                          onChange={handleInputChange}
                          className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
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
                          value={formData.primaryColor}
                          onChange={handleInputChange}
                          className="h-8 w-8 rounded-md border-gray-300 cursor-pointer"
                        />
                        <input
                          type="text"
                          value={formData.primaryColor}
                          onChange={handleInputChange}
                          name="primaryColor"
                          className="ml-2 shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Avatar Style
                      </label>
                      <div className="flex items-center space-x-4">
                        <div
                          className={`flex items-center justify-center h-12 w-12 rounded-full cursor-pointer ${
                            formData.avatarStyle === "default"
                              ? "ring-2 ring-primary-500"
                              : "ring-1 ring-gray-200"
                          }`}
                          onClick={() => handleAvatarSelect("default")}
                        >
                          <span className="text-2xl">😊</span>
                        </div>

                        <div
                          className={`flex items-center justify-center h-12 w-12 rounded-full cursor-pointer ${
                            formData.avatarStyle === "robot"
                              ? "ring-2 ring-primary-500"
                              : "ring-1 ring-gray-200"
                          }`}
                          onClick={() => handleAvatarSelect("robot")}
                        >
                          <span className="text-2xl">🤖</span>
                        </div>

                        <div
                          className={`flex items-center justify-center h-12 w-12 rounded-full cursor-pointer ${
                            formData.avatarStyle === "human"
                              ? "ring-2 ring-primary-500"
                              : "ring-1 ring-gray-200"
                          }`}
                          onClick={() => handleAvatarSelect("human")}
                        >
                          <span className="text-2xl">👤</span>
                        </div>

                        <div
                          className={`flex items-center justify-center h-12 w-12 rounded-full cursor-pointer ${
                            formData.avatarStyle === "none"
                              ? "ring-2 ring-primary-500"
                              : "ring-1 ring-gray-200"
                          }`}
                          onClick={() => handleAvatarSelect("none")}
                        >
                          <span className="text-2xl">❌</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Review */}
              {step === 4 && (
                <div>
                  <h2 className="text-lg font-medium text-gray-900 mb-4">
                    Review Your AI Agent
                  </h2>

                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <dl className="divide-y divide-gray-200">
                      <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
                        <dt className="text-sm font-medium text-gray-500">
                          Name
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                          {formData.name}
                        </dd>
                      </div>

                      <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
                        <dt className="text-sm font-medium text-gray-500">
                          Template
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                          {templates.find((t) => t.id === formData.templateId)
                            ?.name || "None"}
                        </dd>
                      </div>

                      <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
                        <dt className="text-sm font-medium text-gray-500">
                          AI Model
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                          {aiModels.find((m) => m.id === formData.aiModel)
                            ?.name || "None"}
                        </dd>
                      </div>

                      <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
                        <dt className="text-sm font-medium text-gray-500">
                          Welcome Message
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                          {formData.welcomeMessage}
                        </dd>
                      </div>

                      <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
                        <dt className="text-sm font-medium text-gray-500">
                          Primary Color
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 flex items-center">
                          <div
                            className="h-4 w-4 rounded-full mr-2"
                            style={{ backgroundColor: formData.primaryColor }}
                          ></div>
                          {formData.primaryColor}
                        </dd>
                      </div>

                      <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
                        <dt className="text-sm font-medium text-gray-500">
                          Avatar Style
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 flex items-center">
                          <span className="text-xl mr-2">
                            {formData.avatarStyle === "default" && "😊"}
                            {formData.avatarStyle === "robot" && "🤖"}
                            {formData.avatarStyle === "human" && "👤"}
                            {formData.avatarStyle === "none" && "❌"}
                          </span>
                          {formData.avatarStyle.charAt(0).toUpperCase() +
                            formData.avatarStyle.slice(1)}
                        </dd>
                      </div>
                    </dl>
                  </div>

                  <div className="rounded-md bg-blue-50 p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <ArrowPathIcon
                          className="h-5 w-5 text-blue-400"
                          aria-hidden="true"
                        />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-blue-800">
                          Next Steps
                        </h3>
                        <div className="mt-2 text-sm text-blue-700">
                          <p>
                            After creating your AI agent, you'll be able to:
                          </p>
                          <ul className="list-disc pl-5 space-y-1 mt-2">
                            <li>Customize its appearance further</li>
                            <li>Add knowledge base documents</li>
                            <li>Configure integrations with other platforms</li>
                            <li>Set up human handoff rules</li>
                            <li>Deploy it to your website or other channels</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="mt-8 flex justify-between">
                <button
                  type="button"
                  onClick={prevStep}
                  disabled={step === 1}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                >
                  Back
                </button>

                <div>
                  {step < 4 ? (
                    <button
                      type="button"
                      onClick={nextStep}
                      disabled={!isStepComplete()}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                    >
                      Continue
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={loading}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                    >
                      {loading ? (
                        <Spinner size="sm" color="white" />
                      ) : (
                        "Create Agent"
                      )}
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
