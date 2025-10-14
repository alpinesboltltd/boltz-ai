"use client";

import { useState, useRef } from "react";
import { Spinner } from "@/components/common/Spinner";

// interface KnowledgeBaseManagerProps {
//   chatagentId: string;
// }

interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadedAt: Date;
  status: "processing" | "ready" | "error";
}

interface Website {
  id: string;
  url: string;
  addedAt: Date;
  status: "crawling" | "ready" | "error";
  pageCount: number;
}

interface FAQ {
  id: string;
  question: string;
  answer: string;
}

export default function KnowledgeBaseManager() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [websites, setWebsites] = useState<Website[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("documents");
  const [newWebsiteUrl, setNewWebsiteUrl] = useState("");
  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setLoading(true);

    // Create temporary document entries for UI feedback
    const newDocs: Document[] = Array.from(files).map((file, index) => ({
      id: `temp-${Date.now()}-${index}`,
      name: file.name,
      type: file.type,
      size: file.size,
      uploadedAt: new Date(),
      status: "processing",
    }));

    setDocuments((prev) => [...prev, ...newDocs]);

    try {
      // In production, this would upload files to the server
      // const formData = new FormData();
      // Array.from(files).forEach(file => {
      //   formData.append('files', file);
      // });
      //
      // const response = await fetch(`/api/chatagents/${chatagentId}/knowledge/documents`, {
      //   method: 'POST',
      //   body: formData
      // });
      //
      // const data = await response.json();

      // For development, simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Update document status to ready
      setDocuments((prev) =>
        prev.map((doc) =>
          newDocs.some((newDoc) => newDoc.id === doc.id)
            ? { ...doc, id: `real-${doc.id}`, status: "ready" }
            : doc
        )
      );
    } catch (error) {
      console.error("Failed to upload documents:", error);

      // Update document status to error
      setDocuments((prev) =>
        prev.map((doc) =>
          newDocs.some((newDoc) => newDoc.id === doc.id)
            ? { ...doc, status: "error" }
            : doc
        )
      );
    } finally {
      setLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleAddWebsite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWebsiteUrl.trim()) return;

    setLoading(true);

    // Create temporary website entry for UI feedback
    const newWebsite: Website = {
      id: `temp-${Date.now()}`,
      url: newWebsiteUrl,
      addedAt: new Date(),
      status: "crawling",
      pageCount: 0,
    };

    setWebsites((prev) => [...prev, newWebsite]);
    setNewWebsiteUrl("");

    try {
      // In production, this would call the real API
      // const response = await fetch(`/api/chatagents/${chatagentId}/knowledge/websites`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ url: newWebsiteUrl })
      // });
      //
      // const data = await response.json();

      // For development, simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Update website status to ready
      setWebsites((prev) =>
        prev.map((site) =>
          site.id === newWebsite.id
            ? {
                ...site,
                id: `real-${site.id}`,
                status: "ready",
                pageCount: Math.floor(Math.random() * 20) + 5,
              }
            : site
        )
      );
    } catch (error) {
      console.error("Failed to add website:", error);

      // Update website status to error
      setWebsites((prev) =>
        prev.map((site) =>
          site.id === newWebsite.id ? { ...site, status: "error" } : site
        )
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAddFAQ = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.trim() || !newAnswer.trim()) return;

    setLoading(true);

    // Create temporary FAQ entry for UI feedback
    const newFAQ: FAQ = {
      id: `temp-${Date.now()}`,
      question: newQuestion,
      answer: newAnswer,
    };

    setFaqs((prev) => [...prev, newFAQ]);
    setNewQuestion("");
    setNewAnswer("");

    try {
      // In production, this would call the real API
      // const response = await fetch(`/api/chatagents/${chatagentId}/knowledge/faqs`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ question: newQuestion, answer: newAnswer })
      // });
      //
      // const data = await response.json();

      // For development, simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Update FAQ with real ID
      setFaqs((prev) =>
        prev.map((faq) =>
          faq.id === newFAQ.id ? { ...faq, id: `real-${faq.id}` } : faq
        )
      );
    } catch (error) {
      console.error("Failed to add FAQ:", error);

      // Remove the FAQ if there was an error
      setFaqs((prev) => prev.filter((faq) => faq.id !== newFAQ.id));
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDocument = async (id: string) => {
    try {
      // In production, this would call the real API
      // await fetch(`/api/chatagents/${chatagentId}/knowledge/documents/${id}`, {
      //   method: 'DELETE'
      // });

      // For development, simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Remove document from state
      setDocuments((prev) => prev.filter((doc) => doc.id !== id));
    } catch (error) {
      console.error("Failed to delete document:", error);
    }
  };

  const handleDeleteWebsite = async (id: string) => {
    try {
      // In production, this would call the real API
      // await fetch(`/api/chatagents/${chatagentId}/knowledge/websites/${id}`, {
      //   method: 'DELETE'
      // });

      // For development, simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Remove website from state
      setWebsites((prev) => prev.filter((site) => site.id !== id));
    } catch (error) {
      console.error("Failed to delete website:", error);
    }
  };

  const handleDeleteFAQ = async (id: string) => {
    try {
      // In production, this would call the real API
      // await fetch(`/api/chatagents/${chatagentId}/knowledge/faqs/${id}`, {
      //   method: 'DELETE'
      // });

      // For development, simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Remove FAQ from state
      setFaqs((prev) => prev.filter((faq) => faq.id !== id));
    } catch (error) {
      console.error("Failed to delete FAQ:", error);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    else return (bytes / 1048576).toFixed(1) + " MB";
  };

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900">
          Knowledge Base
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Train your chatagent with your own data to make it more helpful for
          your users.
        </p>

        <div className="mt-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab("documents")}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "documents"
                    ? "border-primary-500 text-primary-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Documents
              </button>
              <button
                onClick={() => setActiveTab("websites")}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "websites"
                    ? "border-primary-500 text-primary-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Websites
              </button>
              <button
                onClick={() => setActiveTab("faqs")}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "faqs"
                    ? "border-primary-500 text-primary-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                FAQs
              </button>
            </nav>
          </div>

          <div className="mt-6">
            {activeTab === "documents" && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-medium text-gray-900">
                    Uploaded Documents
                  </h4>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={loading}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                  >
                    {loading ? (
                      <Spinner size="sm" color="white" />
                    ) : (
                      "Upload Documents"
                    )}
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    multiple
                    accept=".pdf,.docx,.txt,.md"
                    className="hidden"
                  />
                </div>

                {documents.length === 0 ? (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    <p className="mt-2 text-sm text-gray-500">
                      No documents uploaded yet
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      Upload PDF, DOCX, or TXT files to train your chatagent
                    </p>
                  </div>
                ) : (
                  <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-300">
                      <thead className="bg-gray-50">
                        <tr>
                          <th
                            scope="col"
                            className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                          >
                            Name
                          </th>
                          <th
                            scope="col"
                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                          >
                            Type
                          </th>
                          <th
                            scope="col"
                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                          >
                            Size
                          </th>
                          <th
                            scope="col"
                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                          >
                            Status
                          </th>
                          <th
                            scope="col"
                            className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                          >
                            <span className="sr-only">Actions</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 bg-white">
                        {documents.map((doc) => (
                          <tr key={doc.id}>
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                              {doc.name}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {doc.type}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {formatFileSize(doc.size)}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm">
                              {doc.status === "processing" ? (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                  Processing
                                </span>
                              ) : doc.status === "ready" ? (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  Ready
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                  Error
                                </span>
                              )}
                            </td>
                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                              <button
                                onClick={() => handleDeleteDocument(doc.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {activeTab === "websites" && (
              <div>
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">
                    Add Website
                  </h4>
                  <form onSubmit={handleAddWebsite} className="flex">
                    <input
                      type="url"
                      value={newWebsiteUrl}
                      onChange={(e) => setNewWebsiteUrl(e.target.value)}
                      placeholder="https://example.com"
                      className="flex-1 shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      required
                    />
                    <button
                      type="submit"
                      disabled={loading || !newWebsiteUrl.trim()}
                      className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                    >
                      {loading ? <Spinner size="sm" color="white" /> : "Add"}
                    </button>
                  </form>
                  <p className="mt-1 text-xs text-gray-500">
                    Add website URLs to train your chatagent on web content
                  </p>
                </div>

                {websites.length === 0 ? (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                      />
                    </svg>
                    <p className="mt-2 text-sm text-gray-500">
                      No websites added yet
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      Add website URLs to train your chatagent on web content
                    </p>
                  </div>
                ) : (
                  <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-300">
                      <thead className="bg-gray-50">
                        <tr>
                          <th
                            scope="col"
                            className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                          >
                            URL
                          </th>
                          <th
                            scope="col"
                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                          >
                            Pages
                          </th>
                          <th
                            scope="col"
                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                          >
                            Status
                          </th>
                          <th
                            scope="col"
                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                          >
                            Added
                          </th>
                          <th
                            scope="col"
                            className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                          >
                            <span className="sr-only">Actions</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 bg-white">
                        {websites.map((site) => (
                          <tr key={site.id}>
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                              {site.url}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {site.pageCount}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm">
                              {site.status === "crawling" ? (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                  Crawling
                                </span>
                              ) : site.status === "ready" ? (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  Ready
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                  Error
                                </span>
                              )}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {site.addedAt.toLocaleDateString()}
                            </td>
                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                              <button
                                onClick={() => handleDeleteWebsite(site.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {activeTab === "faqs" && (
              <div>
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">
                    Add FAQ
                  </h4>
                  <form onSubmit={handleAddFAQ} className="space-y-3">
                    <div>
                      <label
                        htmlFor="question"
                        className="block text-xs font-medium text-gray-700"
                      >
                        Question
                      </label>
                      <input
                        type="text"
                        id="question"
                        value={newQuestion}
                        onChange={(e) => setNewQuestion(e.target.value)}
                        placeholder="What is your return policy?"
                        className="mt-1 shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="answer"
                        className="block text-xs font-medium text-gray-700"
                      >
                        Answer
                      </label>
                      <textarea
                        id="answer"
                        value={newAnswer}
                        onChange={(e) => setNewAnswer(e.target.value)}
                        rows={3}
                        placeholder="Our return policy allows returns within 30 days of purchase..."
                        className="mt-1 shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        required
                      />
                    </div>
                    <div>
                      <button
                        type="submit"
                        disabled={
                          loading || !newQuestion.trim() || !newAnswer.trim()
                        }
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                      >
                        {loading ? (
                          <Spinner size="sm" color="white" />
                        ) : (
                          "Add FAQ"
                        )}
                      </button>
                    </div>
                  </form>
                </div>

                {faqs.length === 0 ? (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <p className="mt-2 text-sm text-gray-500">
                      No FAQs added yet
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      Add frequently asked questions and answers to train your
                      chatagent
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {faqs.map((faq) => (
                      <div
                        key={faq.id}
                        className="bg-white shadow overflow-hidden sm:rounded-lg border border-gray-200"
                      >
                        <div className="px-4 py-5 sm:px-6 flex justify-between items-start">
                          <div>
                            <h3 className="text-sm font-medium text-gray-900">
                              {faq.question}
                            </h3>
                            <p className="mt-1 max-w-2xl text-sm text-gray-500">
                              {faq.answer}
                            </p>
                          </div>
                          <button
                            onClick={() => handleDeleteFAQ(faq.id)}
                            className="text-red-600 hover:text-red-900 text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
