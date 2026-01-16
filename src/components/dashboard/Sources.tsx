"use client";

import { useState, useRef, useEffect } from "react";
import {
  DocumentTextIcon,
  GlobeAltIcon,
  TrashIcon,
  CloudArrowUpIcon,
  ChatBubbleLeftRightIcon,
  DocumentIcon,
  LinkIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/24/outline";
import { trainingAPI, TrainingDocument } from "@/lib/api";
import { toast } from "@/store/toastStore";

interface TrainingSource {
  id: string;
  type: "document" | "website" | "text" | "qa";
  title: string;
  content: string; // Kept for UI state (optimistic), backend might not return full content
  url?: string;
  file?: File;
  question?: string;
  answer?: string;
  status: "processing" | "completed" | "error";
  vectorized: boolean; // Keep for UI compatibility though server handles it
  chunksCount?: number;
  created_at: string;
}

enum ActiveTab {
  document = "document",
  website = "website",
  text = "text",
  qa = "qa",
}

interface SourcesProps {
  workspaceId: string;
}

export function Sources({ workspaceId }: SourcesProps) {
  const [sources, setSources] = useState<TrainingSource[]>([]);
  const [activeTab, setActiveTab] = useState<ActiveTab>(ActiveTab.document);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form states
  const [documentFiles, setDocumentFiles] = useState<FileList | null>(null);

  // Website Form Config
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [maxPages, setMaxPages] = useState(5);
  const [excludePatterns, setExcludePatterns] = useState("");
  const [trace, setTrace] = useState(true);

  // Text Form
  const [textContent, setTextContent] = useState("");
  const [textTitle, setTextTitle] = useState("");

  // QA Form
  const [qaQuestion, setQaQuestion] = useState("");
  const [qaAnswer, setQaAnswer] = useState("");

  // Load existing documents on mount
  useEffect(() => {
    if (workspaceId) {
      loadDocuments();
    }
  }, [workspaceId]);

  const mapDocumentType = (
    type: TrainingDocument["document_type"]
  ): TrainingSource["type"] => {
    switch (type) {
      case "text":
      case "pdf":
      case "audio":
      case "video":
      case "image":
        return "document"; // Map all file types to document for simplified UI
      case "faq":
        return "qa";
      default:
        return "document";
    }
  };

  const loadDocuments = async () => {
    try {
      const response = await trainingAPI.getDocuments(workspaceId);

      const mappedDocs: TrainingSource[] = response.documents.map((d) => ({
        id: d.id,
        type: mapDocumentType(d.document_type),
        title: d.title,
        content: "", // Content is extracted into chunks, not fully returned
        status: "completed",
        vectorized: true,
        created_at: d.created_at,
        chunksCount: d.chunks?.length || 0,
        url: d.source_url,
      }));

      setSources(mappedDocs);
    } catch (error) {
      console.error("Failed to load documents:", error);
      toast.error("Failed to load training documents");
    }
  };

  const handleDocumentUpload = async () => {
    if (!documentFiles) return;

    // Validate file sizes (limit 10MB)
    const MAX_SIZE = 10 * 1024 * 1024;
    for (let i = 0; i < documentFiles.length; i++) {
      if (documentFiles[i].size > MAX_SIZE) {
        toast.error(`File ${documentFiles[i].name} exceeds 10MB limit`);
        return;
      }
    }

    setIsProcessing(true);

    try {
      let successCount = 0;
      for (let i = 0; i < documentFiles.length; i++) {
        const file = documentFiles[i];

        // Optimistic UI update
        const tempId = Date.now().toString() + i;
        const source: TrainingSource = {
          id: tempId,
          type: "document",
          title: file.name,
          content: "",
          file,
          status: "processing",
          vectorized: false,
          created_at: new Date().toISOString(),
        };
        setSources((prev) => [...prev, source]);

        try {
          await trainingAPI.trainWithFile(workspaceId, file);
          successCount++;
        } catch (error) {
          console.error(`Failed to upload ${file.name}:`, error);
          setSources((prev) =>
            prev.map((s) => (s.id === tempId ? { ...s, status: "error" } : s))
          );
          toast.error(`Failed to upload ${file.name}`);
        }
      }

      if (successCount > 0) {
        toast.success(`Successfully uploaded ${successCount} documents`);
        await loadDocuments();
      }
    } finally {
      setIsProcessing(false);
      setDocumentFiles(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleWebsiteAdd = async () => {
    if (!websiteUrl.trim()) return;
    setIsProcessing(true);

    const tempId = Date.now().toString();
    const source: TrainingSource = {
      id: tempId,
      type: "website",
      title: `Website: ${websiteUrl}`,
      content: "",
      url: websiteUrl,
      status: "processing",
      vectorized: false,
      created_at: new Date().toISOString(),
    };
    setSources((prev) => [...prev, source]);

    try {
      let finalUrl = websiteUrl.trim();
      if (!/^https?:\/\//i.test(finalUrl)) {
        finalUrl = `https://${finalUrl}`;
      }

      const patterns = excludePatterns
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      await trainingAPI.trainWithURL(
        workspaceId,
        finalUrl,
        maxPages,
        patterns,
        trace
      );
      setWebsiteUrl("");
      toast.success("Website training started");
      // Reload to get server ID and status
      await loadDocuments();
    } catch (error) {
      console.error("Failed to add website:", error);
      setSources((prev) =>
        prev.map((s) => (s.id === tempId ? { ...s, status: "error" } : s))
      );
      toast.error("Failed to process website");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleTextAdd = async () => {
    if (!textContent.trim() || !textTitle.trim()) return;
    setIsProcessing(true);

    const tempId = Date.now().toString();
    const source: TrainingSource = {
      id: tempId,
      type: "text",
      title: textTitle,
      content: textContent,
      status: "processing",
      vectorized: false,
      created_at: new Date().toISOString(),
    };
    setSources((prev) => [...prev, source]);

    try {
      await trainingAPI.trainWithText(
        workspaceId,
        textTitle,
        textContent,
        "text"
      );
      setTextContent("");
      setTextTitle("");
      toast.success("Text content added");
      await loadDocuments();
    } catch (error) {
      console.error("Failed to add text:", error);
      setSources((prev) =>
        prev.map((s) => (s.id === tempId ? { ...s, status: "error" } : s))
      );
      toast.error("Failed to add text content");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleQAAdd = async () => {
    if (!qaQuestion.trim() || !qaAnswer.trim()) return;
    setIsProcessing(true);

    const tempId = Date.now().toString();
    const title = `Q: ${qaQuestion.substring(0, 50)}...`;
    const content = `Question: ${qaQuestion}\nAnswer: ${qaAnswer}`;

    const source: TrainingSource = {
      id: tempId,
      type: "qa",
      title: title,
      content: content,
      question: qaQuestion,
      answer: qaAnswer,
      status: "processing",
      vectorized: false,
      created_at: new Date().toISOString(),
    };
    setSources((prev) => [...prev, source]);

    try {
      // Training Q&A with explicit type "faq"
      await trainingAPI.trainWithText(workspaceId, title, content, "faq");
      setQaQuestion("");
      setQaAnswer("");
      toast.success("Q&A pair added");
      await loadDocuments();
    } catch (error) {
      console.error("Failed to add Q&A:", error);
      setSources((prev) =>
        prev.map((s) => (s.id === tempId ? { ...s, status: "error" } : s))
      );
      toast.error("Failed to add Q&A pair");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteSource = async (id: string) => {
    // Optimistic delete
    setSources((prev) => prev.filter((s) => s.id !== id));
    try {
      await trainingAPI.deleteTrainingData(workspaceId, id);
      toast.success("Source deleted");
    } catch (error) {
      console.error("Failed to delete source:", error);
      toast.error("Failed to delete source");
      // Could revert state here
      loadDocuments();
    }
  };

  const handleRetrainSource = async (id: string) => {
    // Not implemented in API yet easily (would be update/migrate).
    // For now we just reload.
    loadDocuments();
    toast.info("Retraining not available yet, refreshing list");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "processing":
        return "bg-yellow-100 text-yellow-800";
      case "error":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "document":
        return <DocumentIcon className="h-5 w-5" />;
      case "website":
        return <LinkIcon className="h-5 w-5" />;
      case "text":
        return <DocumentTextIcon className="h-5 w-5" />;
      case "qa":
        return <QuestionMarkCircleIcon className="h-5 w-5" />;
      default:
        return <DocumentIcon className="h-5 w-5" />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Knowledge Base</h2>
        <p className="text-sm text-gray-600">
          Teach your agent by adding data sources.
        </p>
      </div>

      {/* Tabs */}
      <div className="bg-gray-50/50 p-1 rounded-xl border border-gray-100 flex space-x-1">
        {[
          { key: "document", label: "Documents", icon: DocumentIcon },
          { key: "website", label: "Websites", icon: GlobeAltIcon },
          { key: "text", label: "Text", icon: DocumentTextIcon },
          { key: "qa", label: "Q&A", icon: ChatBubbleLeftRightIcon },
        ].map(({ key, label, icon: Icon }) => {
          const isActive = activeTab === key;
          return (
            <button
              key={key}
              onClick={() => setActiveTab(key as ActiveTab)}
              className={`
                flex-1 flex items-center justify-center space-x-2 py-2.5 px-3 rounded-lg text-sm font-medium transition-all duration-200
                ${
                  isActive
                    ? "bg-white text-primary-700 shadow-sm ring-1 ring-black/5"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-100/50"
                }
              `}
            >
              <Icon
                className={`h-4 w-4 ${isActive ? "text-primary-500" : "text-gray-400"}`}
              />
              <span>{label}</span>
            </button>
          );
        })}
      </div>

      {/* Upload Forms */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        {activeTab === "document" && (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center space-y-2">
              <h3 className="text-base font-semibold text-gray-900">
                Upload Documents
              </h3>
              <p className="text-sm text-gray-500 max-w-sm mx-auto">
                Upload PDF, DOC, or TXT files to train your agent on your
                existing knowledge base.
              </p>
            </div>

            <div
              className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-primary-500/50 hover:bg-primary-50/30 transition-all cursor-pointer group"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="w-12 h-12 bg-primary-50 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <CloudArrowUpIcon className="h-6 w-6" />
              </div>
              <p className="text-sm font-medium text-gray-900 mb-1">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-gray-500">
                Supported: TXT, PDF, DOC, DOCX (Max 10MB)
              </p>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".txt,.pdf,.doc,.docx"
              onChange={(e) => setDocumentFiles(e.target.files)}
              className="hidden"
            />

            {documentFiles && documentFiles.length > 0 && (
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Selected files:
                </p>
                <ul className="space-y-1">
                  {Array.from(documentFiles).map((f, i) => (
                    <li
                      key={i}
                      className="text-xs text-gray-500 flex items-center gap-2"
                    >
                      <DocumentIcon className="w-3 h-3" /> {f.name}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <button
              onClick={handleDocumentUpload}
              disabled={!documentFiles || isProcessing}
              className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-xl shadow-sm text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isProcessing ? "Processing..." : "Upload & Process"}
            </button>
          </div>
        )}

        {activeTab === "website" && (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center space-y-2">
              <h3 className="text-base font-semibold text-gray-900">
                Add Website
              </h3>
              <p className="text-sm text-gray-500 max-w-sm mx-auto">
                Crawl a website to extract content. We'll follow links to find
                more pages.
              </p>
            </div>

            <div className="space-y-4 bg-gray-50/50 p-4 rounded-xl border border-gray-100">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">
                  Website URL
                </label>
                <input
                  type="url"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="block w-full border-gray-200 rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500 text-sm py-2.5"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">
                    Max Pages
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={50}
                    value={maxPages}
                    onChange={(e) => setMaxPages(parseInt(e.target.value) || 1)}
                    className="block w-full border-gray-200 rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500 text-sm py-2.5"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">
                    Exclude Patterns
                  </label>
                  <input
                    type="text"
                    value={excludePatterns}
                    onChange={(e) => setExcludePatterns(e.target.value)}
                    placeholder="login, signup"
                    className="block w-full border-gray-200 rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500 text-sm py-2.5"
                  />
                </div>
              </div>
              <div className="flex items-center pt-1">
                <input
                  id="trace"
                  type="checkbox"
                  checked={trace}
                  onChange={(e) => setTrace(e.target.checked)}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded cursor-pointer"
                />
                <label
                  htmlFor="trace"
                  className="ml-2 block text-sm text-gray-700 cursor-pointer select-none"
                >
                  Follow links recursively (Trace)
                </label>
              </div>
            </div>

            <button
              onClick={handleWebsiteAdd}
              disabled={!websiteUrl.trim() || isProcessing}
              className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-xl shadow-sm text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <GlobeAltIcon className="h-4 w-4 mr-2" />
              {isProcessing ? "Processing..." : "Start Deep Search"}
            </button>
          </div>
        )}

        {activeTab === "text" && (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center space-y-2">
              <h3 className="text-base font-semibold text-gray-900">
                Add Text Content
              </h3>
              <p className="text-sm text-gray-500 max-w-sm mx-auto">
                Paste raw text directly. Useful for internal policies, notes, or
                data not in files.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">
                  Title
                </label>
                <input
                  type="text"
                  value={textTitle}
                  onChange={(e) => setTextTitle(e.target.value)}
                  placeholder="e.g. Return Policy 2024"
                  className="block w-full border-gray-200 rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500 text-sm py-2.5"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">
                  Content
                </label>
                <textarea
                  rows={8}
                  value={textContent}
                  onChange={(e) => setTextContent(e.target.value)}
                  placeholder="Paste your text content here..."
                  className="block w-full border-gray-200 rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500 text-sm py-2.5 resize-none"
                />
              </div>
            </div>

            <button
              onClick={handleTextAdd}
              disabled={
                !textContent.trim() || !textTitle.trim() || isProcessing
              }
              className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-xl shadow-sm text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <DocumentTextIcon className="h-4 w-4 mr-2" />
              {isProcessing ? "Processing..." : "Add Text Content"}
            </button>
          </div>
        )}

        {activeTab === "qa" && (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center space-y-2">
              <h3 className="text-base font-semibold text-gray-900">
                Add Q&A Pair
              </h3>
              <p className="text-sm text-gray-500 max-w-sm mx-auto">
                Teach your agent specific answers to common questions.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">
                  Question
                </label>
                <input
                  type="text"
                  value={qaQuestion}
                  onChange={(e) => setQaQuestion(e.target.value)}
                  placeholder="e.g. How do I reset my password?"
                  className="block w-full border-gray-200 rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500 text-sm py-2.5"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">
                  Answer
                </label>
                <textarea
                  rows={4}
                  value={qaAnswer}
                  onChange={(e) => setQaAnswer(e.target.value)}
                  placeholder="e.g. You can reset your password by clicking 'Forgot Password' on the login screen."
                  className="block w-full border-gray-200 rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500 text-sm py-2.5 resize-none"
                />
              </div>
            </div>

            <button
              onClick={handleQAAdd}
              disabled={!qaQuestion.trim() || !qaAnswer.trim() || isProcessing}
              className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-xl shadow-sm text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <ChatBubbleLeftRightIcon className="h-4 w-4 mr-2" />
              {isProcessing ? "Processing..." : "Add Q&A Pair"}
            </button>
          </div>
        )}
      </div>

      {/* Sources List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-sm font-semibold text-gray-900">
            Training Materials ({sources.length})
          </h3>
          <span className="text-xs text-gray-500">
            {sources.length === 0 ? "No sources" : "Managed sources"}
          </span>
        </div>

        <div className="space-y-2">
          {sources.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
              <DocumentIcon className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-sm font-medium text-gray-900">
                No content yet
              </p>
              <p className="text-xs text-gray-500 max-w-xs mx-auto mt-1">
                Upload documents or add text to start training your agent.
              </p>
            </div>
          ) : (
            sources.map((source) => (
              <div
                key={source.id}
                className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-xl hover:shadow-sm transition-all hover:border-gray-200"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center shrink-0 border border-gray-100">
                    <div className="text-gray-500">
                      {getTypeIcon(source.type)}
                    </div>
                  </div>

                  <div className="min-w-0">
                    <h4 className="text-sm font-medium text-gray-900 truncate pr-4">
                      {source.title}
                    </h4>
                    <div className="flex items-center gap-3 mt-1">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wide border ${
                          source.status === "completed"
                            ? "bg-green-50 text-green-700 border-green-100"
                            : source.status === "error"
                              ? "bg-red-50 text-red-700 border-red-100"
                              : "bg-yellow-50 text-yellow-700 border-yellow-100"
                        }`}
                      >
                        {source.status}
                      </span>

                      {source.vectorized && (
                        <div className="flex items-center text-[10px] text-green-600 font-medium">
                          <span className="w-1 h-1 rounded-full bg-green-500 mr-1.5" />
                          {/* Vectorized */}
                        </div>
                      )}

                      {source.chunksCount !== undefined &&
                        source.chunksCount > 0 && (
                          <div className="block text-[10px] text-gray-400">
                            {source.chunksCount} chunks
                          </div>
                        )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleRetrainSource(source.id)}
                    disabled={isProcessing}
                    className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                    title="Retrain"
                  >
                    <CloudArrowUpIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteSource(source.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
