"use client";

import { useState, useRef } from "react";
import { useTrainingData } from "@/store/agentDetailStore";
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

interface TrainingSource {
  id: string;
  type: "document" | "website" | "text" | "qa";
  title: string;
  content: string;
  url?: string;
  file?: File;
  question?: string;
  answer?: string;
  status: "processing" | "completed" | "error";
  vectorized: boolean;
  chunks?: string[];
  embeddings?: number[][];
  created_at: string;
}

interface VectorStore {
  [sourceId: string]: {
    chunks: string[];
    embeddings: number[][];
  };
}

enum ActiveTab {
  document = "document",
  website = "website",
  text = "text",
  qa = "qa",
}

export function Sources() {
  const trainingData = useTrainingData();
  const [sources, setSources] = useState<TrainingSource[]>([]);
  const [vectorStore, setVectorStore] = useState<VectorStore>({});
  const [activeTab, setActiveTab] = useState<ActiveTab>(ActiveTab.document);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form states
  const [documentFiles, setDocumentFiles] = useState<FileList | null>(null);
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [textContent, setTextContent] = useState("");
  const [textTitle, setTextTitle] = useState("");
  const [qaQuestion, setQaQuestion] = useState("");
  const [qaAnswer, setQaAnswer] = useState("");

  const generateEmbeddings = async (text: string): Promise<number[]> => {
    try {
      const response = await fetch("/api/embeddings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await response.json();
      return data.embedding || [];
    } catch (error) {
      console.error("Error generating embeddings:", error);
      return [];
    }
  };

  const chunkText = (text: string, maxChunkSize: number = 1000): string[] => {
    const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);
    const chunks: string[] = [];
    let currentChunk = "";

    for (const sentence of sentences) {
      if (
        currentChunk.length + sentence.length > maxChunkSize &&
        currentChunk.length > 0
      ) {
        chunks.push(currentChunk.trim());
        currentChunk = sentence;
      } else {
        currentChunk += (currentChunk ? ". " : "") + sentence;
      }
    }

    if (currentChunk.trim()) {
      chunks.push(currentChunk.trim());
    }

    return chunks;
  };

  const processAndVectorize = async (source: TrainingSource) => {
    setIsProcessing(true);

    try {
      let textToProcess = "";

      if (source.type === "document" && source.file) {
        textToProcess = await extractTextFromFile(source.file);
      } else if (source.type === "website" && source.url) {
        textToProcess = await crawlWebsite(source.url);
      } else if (source.type === "text") {
        textToProcess = source.content;
      } else if (source.type === "qa") {
        textToProcess = `Q: ${source.question}\nA: ${source.answer}`;
      }

      const chunks = chunkText(textToProcess);
      const embeddings: number[][] = [];

      for (const chunk of chunks) {
        const embedding = await generateEmbeddings(chunk);
        embeddings.push(embedding);
      }

      // Store in memory vector store
      const newVectorStore = {
        ...vectorStore,
        [source.id]: { chunks, embeddings },
      };
      setVectorStore(newVectorStore);

      // Send vector data to chat API for storage
      await fetch("/api/chat", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agentId: agentId,
          vectorStore: newVectorStore,
        }),
      });

      // Update source status
      setSources((prev) =>
        prev.map((s) =>
          s.id === source.id
            ? {
                ...s,
                status: "completed",
                vectorized: true,
                chunks,
                embeddings,
              }
            : s
        )
      );
    } catch (error) {
      console.error("Error processing source:", error);
      setSources((prev) =>
        prev.map((s) => (s.id === source.id ? { ...s, status: "error" } : s))
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const extractTextFromFile = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        resolve(text);
      };
      reader.onerror = reject;

      if (file.type === "text/plain") {
        reader.readAsText(file);
      } else if (file.type === "application/pdf") {
        // For PDF, you'd need a PDF parser library
        reader.readAsText(file); // Simplified for now
      } else {
        reader.readAsText(file);
      }
    });
  };

  const crawlWebsite = async (url: string): Promise<string> => {
    try {
      const response = await fetch("/api/crawl", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await response.json();
      return data.content || "";
    } catch (error) {
      console.error("Error crawling website:", error);
      return "";
    }
  };

  const handleDocumentUpload = async () => {
    if (!documentFiles) return;

    for (let i = 0; i < documentFiles.length; i++) {
      const file = documentFiles[i];
      const source: TrainingSource = {
        id: Date.now().toString() + i,
        type: "document",
        title: file.name,
        content: "",
        file,
        status: "processing",
        vectorized: false,
        created_at: new Date().toISOString(),
      };

      setSources((prev) => [...prev, source]);
      await processAndVectorize(source);
    }

    setDocumentFiles(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleWebsiteAdd = async () => {
    if (!websiteUrl.trim()) return;

    const source: TrainingSource = {
      id: Date.now().toString(),
      type: "website",
      title: `Website: ${websiteUrl}`,
      content: "",
      url: websiteUrl,
      status: "processing",
      vectorized: false,
      created_at: new Date().toISOString(),
    };

    setSources((prev) => [...prev, source]);
    await processAndVectorize(source);
    setWebsiteUrl("");
  };

  const handleTextAdd = async () => {
    if (!textContent.trim() || !textTitle.trim()) return;

    const source: TrainingSource = {
      id: Date.now().toString(),
      type: "text",
      title: textTitle,
      content: textContent,
      status: "processing",
      vectorized: false,
      created_at: new Date().toISOString(),
    };

    setSources((prev) => [...prev, source]);
    await processAndVectorize(source);
    setTextContent("");
    setTextTitle("");
  };

  const handleQAAdd = async () => {
    if (!qaQuestion.trim() || !qaAnswer.trim()) return;

    const source: TrainingSource = {
      id: Date.now().toString(),
      type: "qa",
      title: `Q&A: ${qaQuestion.substring(0, 50)}...`,
      content: "",
      question: qaQuestion,
      answer: qaAnswer,
      status: "processing",
      vectorized: false,
      created_at: new Date().toISOString(),
    };

    setSources((prev) => [...prev, source]);
    await processAndVectorize(source);
    setQaQuestion("");
    setQaAnswer("");
  };

  const handleDeleteSource = (id: string) => {
    setSources((prev) => prev.filter((s) => s.id !== id));
    setVectorStore((prev) => {
      const newStore = { ...prev };
      delete newStore[id];
      return newStore;
    });
  };

  const handleRetrainSource = async (id: string) => {
    const source = sources.find((s) => s.id === id);
    if (source) {
      setSources((prev) =>
        prev.map((s) =>
          s.id === id ? { ...s, status: "processing", vectorized: false } : s
        )
      );
      await processAndVectorize(source);
    }
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
        <h2 className="text-xl font-semibold text-gray-900">
          Training Sources
        </h2>
        <p className="text-sm text-gray-600">
          Upload and manage training materials for your AI agent
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { key: "document", label: "Documents", icon: DocumentIcon },
            { key: "website", label: "Websites", icon: GlobeAltIcon },
            { key: "text", label: "Text", icon: DocumentTextIcon },
            { key: "qa", label: "Q&A", icon: ChatBubbleLeftRightIcon },
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key as ActiveTab)}
              className={`${
                activeTab === key
                  ? "border-primary-500 text-primary-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2`}
            >
              <Icon className="h-4 w-4" />
              <span>{label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Upload Forms */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        {activeTab === "document" && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Upload Documents</h3>
            <div>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".txt,.pdf,.doc,.docx"
                onChange={(e) => setDocumentFiles(e.target.files)}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
              />
              <p className="text-xs text-gray-500 mt-1">
                Supported: TXT, PDF, DOC, DOCX
              </p>
            </div>
            <button
              onClick={handleDocumentUpload}
              disabled={!documentFiles || isProcessing}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50"
            >
              <CloudArrowUpIcon className="h-4 w-4 mr-2" />
              Upload & Process
            </button>
          </div>
        )}

        {activeTab === "website" && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Add Website</h3>
            <div>
              <input
                type="url"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                placeholder="https://example.com"
                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <button
              onClick={handleWebsiteAdd}
              disabled={!websiteUrl.trim() || isProcessing}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50"
            >
              <GlobeAltIcon className="h-4 w-4 mr-2" />
              Crawl & Process
            </button>
          </div>
        )}

        {activeTab === "text" && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Add Text Content</h3>
            <div>
              <input
                type="text"
                value={textTitle}
                onChange={(e) => setTextTitle(e.target.value)}
                placeholder="Content title"
                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 mb-3"
              />
              <textarea
                rows={6}
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                placeholder="Paste your text content here..."
                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <button
              onClick={handleTextAdd}
              disabled={
                !textContent.trim() || !textTitle.trim() || isProcessing
              }
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50"
            >
              <DocumentTextIcon className="h-4 w-4 mr-2" />
              Add & Process
            </button>
          </div>
        )}

        {activeTab === "qa" && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Add Q&A Pair</h3>
            <div>
              <input
                type="text"
                value={qaQuestion}
                onChange={(e) => setQaQuestion(e.target.value)}
                placeholder="Question"
                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 mb-3"
              />
              <textarea
                rows={4}
                value={qaAnswer}
                onChange={(e) => setQaAnswer(e.target.value)}
                placeholder="Answer"
                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <button
              onClick={handleQAAdd}
              disabled={!qaQuestion.trim() || !qaAnswer.trim() || isProcessing}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50"
            >
              <ChatBubbleLeftRightIcon className="h-4 w-4 mr-2" />
              Add Q&A
            </button>
          </div>
        )}
      </div>

      {/* Sources List */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium">
            Training Materials ({sources.length})
          </h3>
        </div>
        <div className="divide-y divide-gray-200">
          {sources.length === 0 ? (
            <div className="px-6 py-8 text-center">
              <p className="text-gray-500">
                No training materials added yet. Start by uploading documents or
                adding content above.
              </p>
            </div>
          ) : (
            sources.map((source) => (
              <div
                key={source.id}
                className="px-6 py-4 flex items-center justify-between"
              >
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0 text-gray-400">
                    {getTypeIcon(source.type)}
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">
                      {source.title}
                    </h4>
                    <div className="flex items-center space-x-4 mt-1">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(source.status)}`}
                      >
                        {source.status}
                      </span>
                      {source.vectorized && (
                        <span className="text-xs text-green-600">
                          ✓ Vectorized
                        </span>
                      )}
                      {source.chunks && (
                        <span className="text-xs text-gray-500">
                          {source.chunks.length} chunks
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Added: {new Date(source.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleRetrainSource(source.id)}
                    disabled={isProcessing}
                    className="text-primary-600 hover:text-primary-800 text-sm font-medium disabled:opacity-50"
                  >
                    Retrain
                  </button>
                  <button
                    onClick={() => handleDeleteSource(source.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Vector Store Info */}
      {Object.keys(vectorStore).length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-blue-900 mb-2">
            Vector Store Status
          </h4>
          <p className="text-sm text-blue-700">
            {Object.keys(vectorStore).length} sources vectorized with{" "}
            {Object.values(vectorStore).reduce(
              (total, store) => total + store.chunks.length,
              0
            )}{" "}
            total chunks in memory.
          </p>
        </div>
      )}
    </div>
  );
}
