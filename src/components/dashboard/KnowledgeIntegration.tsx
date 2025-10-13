/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import {
  DocumentIcon,
  GlobeAltIcon,
  QuestionMarkCircleIcon,
  CloudArrowUpIcon,
} from "@heroicons/react/24/outline";

interface KnowledgeSource {
  id: string;
  type: "website" | "document" | "faq" | "manual";
  name: string;
  content?: string;
  url?: string;
  status: "pending" | "processing" | "completed" | "error";
}

interface KnowledgeIntegrationProps {
  onSourcesChange: (sources: KnowledgeSource[]) => void;
}

export default function KnowledgeIntegration({
  onSourcesChange,
}: KnowledgeIntegrationProps) {
  const [sources, setSources] = useState<KnowledgeSource[]>([]);
  const [activeTab, setActiveTab] = useState<"website" | "document" | "faq">(
    "website"
  );
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [faqPairs, setFaqPairs] = useState([{ question: "", answer: "" }]);

  const knowledgeOptions = [
    {
      id: "website",
      name: "Import from Website",
      description: "Crawl your website to extract knowledge",
      icon: GlobeAltIcon,
      color: "bg-blue-50 text-blue-600 border-blue-200",
    },
    {
      id: "document",
      name: "Upload Documents",
      description: "Upload PDFs, Word docs, or text files",
      icon: DocumentIcon,
      color: "bg-green-50 text-green-600 border-green-200",
    },
    {
      id: "faq",
      name: "Add Q&A Manually",
      description: "Create question and answer pairs",
      icon: QuestionMarkCircleIcon,
      color: "bg-purple-50 text-purple-600 border-purple-200",
    },
  ];

  const handleWebsiteCrawl = async () => {
    if (!websiteUrl.trim()) return;

    const newSource: KnowledgeSource = {
      id: Date.now().toString(),
      type: "website",
      name: websiteUrl,
      url: websiteUrl,
      status: "processing",
    };

    const updatedSources = [...sources, newSource];
    setSources(updatedSources);
    onSourcesChange(updatedSources);

    // Simulate crawling process
    setTimeout(() => {
      const updated = updatedSources.map((s) =>
        s.id === newSource.id ? { ...s, status: "completed" as const } : s
      );
      setSources(updated);
      onSourcesChange(updated);
    }, 3000);

    setWebsiteUrl("");
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const newSource: KnowledgeSource = {
        id: Date.now().toString() + Math.random(),
        type: "document",
        name: file.name,
        status: "processing",
      };

      const updatedSources = [...sources, newSource];
      setSources(updatedSources);
      onSourcesChange(updatedSources);

      // Simulate file processing
      setTimeout(() => {
        const updated = sources.map((s) =>
          s.id === newSource.id ? { ...s, status: "completed" as const } : s
        );
        setSources(updated);
        onSourcesChange(updated);
      }, 2000);
    });
  };

  const handleFaqSave = () => {
    const validPairs = faqPairs.filter(
      (pair) => pair.question.trim() && pair.answer.trim()
    );

    validPairs.forEach((pair) => {
      const newSource: KnowledgeSource = {
        id: Date.now().toString() + Math.random(),
        type: "faq",
        name: `FAQ: ${pair.question.substring(0, 50)}...`,
        content: `Q: ${pair.question}\nA: ${pair.answer}`,
        status: "completed",
      };

      const updatedSources = [...sources, newSource];
      setSources(updatedSources);
      onSourcesChange(updatedSources);
    });

    setFaqPairs([{ question: "", answer: "" }]);
  };

  const addFaqPair = () => {
    setFaqPairs([...faqPairs, { question: "", answer: "" }]);
  };

  const updateFaqPair = (
    index: number,
    field: "question" | "answer",
    value: string
  ) => {
    const updated = faqPairs.map((pair, i) =>
      i === index ? { ...pair, [field]: value } : pair
    );
    setFaqPairs(updated);
  };

  const removeFaqPair = (index: number) => {
    setFaqPairs(faqPairs.filter((_, i) => i !== index));
  };

  const removeSource = (sourceId: string) => {
    const updated = sources.filter((s) => s.id !== sourceId);
    setSources(updated);
    onSourcesChange(updated);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "website":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Website URL
              </label>
              <div className="flex space-x-3">
                <input
                  type="url"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  placeholder="https://yourwebsite.com"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={handleWebsiteCrawl}
                  disabled={!websiteUrl.trim()}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Crawl
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                We&#39;ll extract text content from your website pages
              </p>
            </div>
          </div>
        );

      case "document":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Files
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-4">
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <span className="mt-2 block text-sm font-medium text-gray-900">
                      Drop files here or click to upload
                    </span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      multiple
                      accept=".pdf,.doc,.docx,.txt"
                      className="sr-only"
                      onChange={handleFileUpload}
                    />
                  </label>
                  <p className="mt-1 text-xs text-gray-500">
                    PDF, DOC, DOCX, TXT up to 10MB each
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case "faq":
        return (
          <div className="space-y-4">
            <div className="space-y-4">
              {faqPairs.map((pair, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Question
                      </label>
                      <input
                        type="text"
                        value={pair.question}
                        onChange={(e) =>
                          updateFaqPair(index, "question", e.target.value)
                        }
                        placeholder="What is your return policy?"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Answer
                      </label>
                      <textarea
                        value={pair.answer}
                        onChange={(e) =>
                          updateFaqPair(index, "answer", e.target.value)
                        }
                        placeholder="We offer a 30-day return policy..."
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                    {faqPairs.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeFaqPair(index)}
                        className="text-sm text-red-600 hover:text-red-700"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex space-x-3">
              <button
                type="button"
                onClick={addFaqPair}
                className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Add Another Q&A
              </button>
              <button
                type="button"
                onClick={handleFaqSave}
                className="px-4 py-2 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                Save Q&A Pairs
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Knowledge Source Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {knowledgeOptions.map((option) => {
          const Icon = option.icon;
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => setActiveTab(option.id as any)}
              className={`p-4 rounded-lg border-2 text-left transition-all ${
                activeTab === option.id
                  ? option.color
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <Icon className="h-8 w-8 mb-3" />
              <h3 className="font-medium text-gray-900 mb-1">{option.name}</h3>
              <p className="text-sm text-gray-600">{option.description}</p>
            </button>
          );
        })}
      </div>

      {/* Active Tab Content */}
      <div className="bg-gray-50 rounded-lg p-6">{renderTabContent()}</div>

      {/* Knowledge Sources List */}
      {sources.length > 0 && (
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Knowledge Sources
          </h3>
          <div className="space-y-3">
            {sources.map((source) => (
              <div
                key={source.id}
                className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      source.status === "completed"
                        ? "bg-green-500"
                        : source.status === "processing"
                          ? "bg-yellow-500"
                          : source.status === "error"
                            ? "bg-red-500"
                            : "bg-gray-300"
                    }`}
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {source.name}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">
                      {source.type}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeSource(source.id)}
                  className="text-sm text-red-600 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
