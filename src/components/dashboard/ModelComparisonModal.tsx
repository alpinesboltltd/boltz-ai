"use client";

import { useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface ModelComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const modelComparison = [
  {
    name: "Google Gemini",
    description:
      "Google's multimodal AI model with strong reasoning capabilities.",
    strengths: [
      "Balanced performance",
      "Cost-effective",
      "Good reasoning abilities",
      "Multimodal capabilities",
    ],
    limitations: ["Less specialized than some alternatives"],
    bestFor: [
      "General purpose chatagents",
      "Knowledge-based assistants",
      "Image understanding",
    ],
    pricing: "Included in all plans",
  },
  {
    name: "GPT-4",
    description:
      "OpenAI's advanced large language model with superior reasoning.",
    strengths: [
      "Excellent reasoning",
      "Strong coding abilities",
      "Nuanced responses",
      "Context understanding",
    ],
    limitations: ["Higher cost", "Can be verbose"],
    bestFor: ["Complex reasoning tasks", "Code generation", "Creative content"],
    pricing: "Pro plan and above",
  },
  {
    name: "Claude",
    description:
      "Anthropic's assistant focused on helpfulness, harmlessness, and honesty.",
    strengths: [
      "Long context window",
      "Nuanced responses",
      "Good at following instructions",
      "Less hallucination",
    ],
    limitations: ["Limited availability in some regions"],
    bestFor: ["Long-form content", "Detailed responses", "Document analysis"],
    pricing: "Pro plan and above",
  },
  {
    name: "Mistral",
    description:
      "Efficient open-source model with strong multilingual capabilities.",
    strengths: [
      "Efficient performance",
      "Strong multilingual support",
      "Open weights",
      "Low latency",
    ],
    limitations: ["Smaller parameter count than some alternatives"],
    bestFor: [
      "Multilingual applications",
      "Performance-sensitive deployments",
      "Edge computing",
    ],
    pricing: "Pro plan and above",
  },
  {
    name: "Llama 3",
    description:
      "Meta's open-source large language model with competitive performance.",
    strengths: [
      "Open weights",
      "Competitive performance",
      "Active community",
      "Customizable",
    ],
    limitations: ["Requires more prompt engineering"],
    bestFor: [
      "Self-hosted deployments",
      "Customized fine-tuning",
      "Research applications",
    ],
    pricing: "Business plan and above",
  },
];

export default function ModelComparisonModal({
  isOpen,
  onClose,
}: ModelComparisonModalProps) {
  const [selectedModel, setSelectedModel] = useState<string | null>(null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900">
            AI Model Comparison
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 overflow-auto max-h-[calc(90vh-120px)]">
          <div className="mb-6">
            <p className="text-gray-600">
              Choose the right AI model for your chatagent based on your
              specific needs. Each model has different strengths and is
              optimized for different use cases.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1 space-y-4">
              {modelComparison.map((model) => (
                <div
                  key={model.name}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    selectedModel === model.name
                      ? "border-primary-500 bg-primary-50 shadow-md"
                      : "border-gray-200 hover:border-primary-300 hover:bg-gray-50"
                  }`}
                  onClick={() => setSelectedModel(model.name)}
                >
                  <h4 className="font-medium text-gray-900">{model.name}</h4>
                  <p className="text-sm text-gray-500 mt-1">
                    {model.description}
                  </p>
                  <p className="text-xs text-primary-600 mt-2">
                    {model.pricing}
                  </p>
                </div>
              ))}
            </div>

            <div className="md:col-span-2">
              {selectedModel ? (
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">
                    {
                      modelComparison.find((m) => m.name === selectedModel)
                        ?.name
                    }
                  </h4>

                  <div className="space-y-6">
                    <div>
                      <h5 className="text-sm font-medium text-gray-900 mb-2">
                        Strengths
                      </h5>
                      <ul className="list-disc pl-5 space-y-1">
                        {modelComparison
                          .find((m) => m.name === selectedModel)
                          ?.strengths.map((strength, index) => (
                            <li key={index} className="text-sm text-gray-600">
                              {strength}
                            </li>
                          ))}
                      </ul>
                    </div>

                    <div>
                      <h5 className="text-sm font-medium text-gray-900 mb-2">
                        Limitations
                      </h5>
                      <ul className="list-disc pl-5 space-y-1">
                        {modelComparison
                          .find((m) => m.name === selectedModel)
                          ?.limitations.map((limitation, index) => (
                            <li key={index} className="text-sm text-gray-600">
                              {limitation}
                            </li>
                          ))}
                      </ul>
                    </div>

                    <div>
                      <h5 className="text-sm font-medium text-gray-900 mb-2">
                        Best For
                      </h5>
                      <ul className="list-disc pl-5 space-y-1">
                        {modelComparison
                          .find((m) => m.name === selectedModel)
                          ?.bestFor.map((use, index) => (
                            <li key={index} className="text-sm text-gray-600">
                              {use}
                            </li>
                          ))}
                      </ul>
                    </div>

                    <div className="pt-4 border-t border-gray-200">
                      <p className="text-sm text-gray-500">
                        Pricing:{" "}
                        <span className="font-medium">
                          {
                            modelComparison.find(
                              (m) => m.name === selectedModel
                            )?.pricing
                          }
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 flex items-center justify-center h-full">
                  <p className="text-gray-500">
                    Select a model to see detailed information
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-gray-50 px-6 py-4 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
