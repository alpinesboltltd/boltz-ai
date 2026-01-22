"use client";

import { useState } from "react";
import { Upload, FileText, Globe, MessageSquare, X } from "lucide-react";
import { trainingAPI } from "@/lib/api";

interface TrainingSourcesProps {
  agentId?: string | null;
  onDataAdded?: (data: any) => void;
}

export function TrainingSources({
  agentId,
  onDataAdded,
}: TrainingSourcesProps) {
  const [activeTab, setActiveTab] = useState("files");
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [textData, setTextData] = useState({ title: "", content: "" });
  const [urlData, setUrlData] = useState("");
  const [urlOptions, setUrlOptions] = useState({
    maxPages: 10,
    excludePatterns: "" as string,
  });
  const [qaData, setQaData] = useState({ question: "", answer: "" });

  const handleFileUpload = async (files: FileList) => {
    try {
      for (const file of Array.from(files)) {
        await trainingAPI.trainWithFile(agentId!, file);
        onDataAdded?.({ type: "file", name: file.name });
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const handleTextSubmit = async () => {
    if (!textData.title || !textData.content || !agentId) return;

    try {
      await trainingAPI.trainWithText(
        agentId,
        textData.title,
        textData.content
      );
      onDataAdded?.({ type: "text", title: textData.title });
      setTextData({ title: "", content: "" });
    } catch (error) {
      console.error("Error submitting text:", error);
    }
  };

  const handleUrlSubmit = async () => {
    if (!urlData || !agentId) return;

    const excludeList = urlOptions.excludePatterns
      .split("\n")
      .map((p) => p.trim())
      .filter((p) => p.length > 0);

    try {
      await trainingAPI.trainWithURL(
        agentId,
        urlData,
        urlOptions.maxPages,
        excludeList
      );
      onDataAdded?.({ type: "url", url: urlData });
      setUrlData("");
      setUrlOptions({ maxPages: 10, excludePatterns: "" });
    } catch (error) {
      console.error("Error submitting URL:", error);
    }
  };

  const handleQASubmit = async () => {
    if (!qaData.question || !qaData.answer || !agentId) return;

    try {
      const content = `Question: ${qaData.question}\nAnswer: ${qaData.answer}`;
      await trainingAPI.trainWithText(
        agentId,
        `Q&A: ${qaData.question}`,
        content
      );
      onDataAdded?.({ type: "qa", question: qaData.question });
      setQaData({ question: "", answer: "" });
    } catch (error) {
      console.error("Error submitting Q&A:", error);
    }
  };

  const tabs = [
    { id: "files", label: "Files", icon: FileText },
    { id: "text", label: "Text", icon: MessageSquare },
    { id: "website", label: "Website", icon: Globe },
    { id: "qa", label: "Q&A", icon: MessageSquare },
  ];

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {activeTab === "files" && (
          <div className="space-y-4">
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors cursor-pointer"
              onDrop={(e) => {
                e.preventDefault();
                handleFileUpload(e.dataTransfer.files);
              }}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => document.getElementById("file-input")?.click()}
            >
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-900 mb-2">
                Drop files here or click to upload
              </p>
              <p className="text-sm text-gray-500">
                Supports PDF, TXT, DOC, DOCX files up to 10MB
              </p>
            </div>

            <input
              id="file-input"
              type="file"
              multiple
              accept=".pdf,.txt,.doc,.docx"
              className="hidden"
              onChange={(e) =>
                e.target.files && handleFileUpload(e.target.files)
              }
            />

            {uploadedFiles.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium text-gray-900">Uploaded Files</h4>
                {uploadedFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <FileText className="w-5 h-5 text-gray-400" />
                      <span className="text-sm font-medium">{file.name}</span>
                      <span className="text-xs text-gray-500">
                        {(file.size / 1024).toFixed(1)} KB
                      </span>
                    </div>
                    <button
                      onClick={() =>
                        setUploadedFiles((prev) =>
                          prev.filter((_, i) => i !== index)
                        )
                      }
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "text" && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <input
                type="text"
                value={textData.title}
                onChange={(e) =>
                  setTextData((prev) => ({ ...prev, title: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="e.g., Return Policy"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content
              </label>
              <textarea
                value={textData.content}
                onChange={(e) =>
                  setTextData((prev) => ({ ...prev, content: e.target.value }))
                }
                rows={8}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                placeholder="Enter the text content you want your agent to learn from..."
              />
            </div>
            <button
              onClick={handleTextSubmit}
              disabled={!textData.title || !textData.content}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add Text Content
            </button>
          </div>
        )}

        {activeTab === "website" && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Website URL
              </label>
              <input
                type="url"
                value={urlData}
                onChange={(e) => setUrlData(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="https://example.com"
              />
              <p className="mt-1 text-xs text-gray-500">
                Enter the base URL to crawl and extract content from
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maximum Pages
                </label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={urlOptions.maxPages}
                  onChange={(e) =>
                    setUrlOptions((prev) => ({
                      ...prev,
                      maxPages: parseInt(e.target.value) || 10,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Limit the number of pages to crawl (1-100)
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Exclude URL Patterns
              </label>
              <textarea
                value={urlOptions.excludePatterns}
                onChange={(e) =>
                  setUrlOptions((prev) => ({
                    ...prev,
                    excludePatterns: e.target.value,
                  }))
                }
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                placeholder="/admin&#10;/login&#10;/cart&#10;*.pdf"
              />
              <p className="mt-1 text-xs text-gray-500">
                Enter URL patterns to exclude (one per line). Supports wildcards
                (*)
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-blue-900 mb-2">
                Crawl Settings Summary
              </h4>
              <ul className="text-xs text-blue-700 space-y-1">
                <li>• Will crawl up to {urlOptions.maxPages} pages</li>
                {urlOptions.excludePatterns && (
                  <li>
                    • Excluding:{" "}
                    {urlOptions.excludePatterns
                      .split("\n")
                      .filter((p) => p.trim())
                      .join(", ")}
                  </li>
                )}
              </ul>
            </div>

            <button
              onClick={handleUrlSubmit}
              disabled={!urlData}
              className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Start Crawling Website
            </button>
          </div>
        )}

        {activeTab === "qa" && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Question
              </label>
              <input
                type="text"
                value={qaData.question}
                onChange={(e) =>
                  setQaData((prev) => ({ ...prev, question: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="What is your return policy?"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Answer
              </label>
              <textarea
                value={qaData.answer}
                onChange={(e) =>
                  setQaData((prev) => ({ ...prev, answer: e.target.value }))
                }
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                placeholder="We offer a 30-day return policy..."
              />
            </div>
            <button
              onClick={handleQASubmit}
              disabled={!qaData.question || !qaData.answer}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add Q&A Pair
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
