"use client";
import { useState } from "react";
import {
  DocumentTextIcon,
  GlobeAltIcon,
  QuestionMarkCircleIcon,
  TrashIcon,
  ArrowUpTrayIcon,
  DocumentPlusIcon,
} from "@heroicons/react/24/outline";

// Mock data for knowledge sources
const knowledgeSources = [
  {
    id: 1,
    name: "Product Documentation.pdf",
    type: "document",
    size: "2.4 MB",
    status: "processed",
    dateAdded: "2 days ago",
  },
  {
    id: 2,
    name: "FAQ Database",
    type: "faq",
    size: "45 items",
    status: "processed",
    dateAdded: "1 week ago",
  },
  {
    id: 3,
    name: "https://example.com/support",
    type: "website",
    size: "156 pages",
    status: "processing",
    dateAdded: "3 hours ago",
  },
  {
    id: 4,
    name: "Company Handbook.docx",
    type: "document",
    size: "1.8 MB",
    status: "processed",
    dateAdded: "5 days ago",
  },
  {
    id: 5,
    name: "Technical Specifications.xlsx",
    type: "document",
    size: "950 KB",
    status: "failed",
    dateAdded: "1 day ago",
  },
];

// Mock data for FAQs
const faqs = [
  {
    id: 1,
    question: "How do I reset my password?",
    answer:
      'You can reset your password by clicking on the "Forgot Password" link on the login page and following the instructions sent to your email.',
  },
  {
    id: 2,
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit cards (Visa, Mastercard, American Express), PayPal, and bank transfers for annual plans.",
  },
  {
    id: 3,
    question: "How do I cancel my subscription?",
    answer:
      "You can cancel your subscription at any time by going to Settings > Billing > Cancel Subscription. Your service will continue until the end of your current billing period.",
  },
];

export default function KnowledgePage() {
  const [activeTab, setActiveTab] = useState("sources");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showAddFaqModal, setShowAddFaqModal] = useState(false);

  const getIconForType = (type: string) => {
    switch (type) {
      case "document":
        return <DocumentTextIcon className="h-5 w-5 text-gray-400" />;
      case "website":
        return <GlobeAltIcon className="h-5 w-5 text-gray-400" />;
      case "faq":
        return <QuestionMarkCircleIcon className="h-5 w-5 text-gray-400" />;
      default:
        return <DocumentTextIcon className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusBadge = (statu: string) => {
    switch (status) {
      case "processed":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Processed
          </span>
        );
      case "processing":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            Processing
          </span>
        );
      case "failed":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            Failed
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Knowledge Base
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage the knowledge sources that power your chatbots.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 space-x-3">
          <button
            type="button"
            onClick={() => setShowUploadModal(true)}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            <ArrowUpTrayIcon
              className="-ml-1 mr-2 h-5 w-5"
              aria-hidden="true"
            />
            Upload Files
          </button>
          <button
            type="button"
            onClick={() => setShowAddFaqModal(true)}
            className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            <DocumentPlusIcon
              className="-ml-1 mr-2 h-5 w-5"
              aria-hidden="true"
            />
            Add FAQ
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-8 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setActiveTab("sources")}
            className={`${
              activeTab === "sources"
                ? "border-primary-500 text-primary-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Knowledge Sources
          </button>
          <button
            onClick={() => setActiveTab("faqs")}
            className={`${
              activeTab === "faqs"
                ? "border-primary-500 text-primary-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            FAQs
          </button>
        </nav>
      </div>

      {/* Knowledge Sources Tab */}
      {activeTab === "sources" && (
        <div className="mt-8">
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
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
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Date Added
                  </th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {knowledgeSources.map((source) => (
                  <tr key={source.id}>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                      <div className="flex items-center">
                        {getIconForType(source.type)}
                        <span className="ml-2">{source.name}</span>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 capitalize">
                      {source.type}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {source.size}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {getStatusBadge(source.status)}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {source.dateAdded}
                    </td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                      <button className="text-red-600 hover:text-red-900">
                        <TrashIcon className="h-5 w-5" aria-hidden="true" />
                        <span className="sr-only">Delete {source.name}</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* FAQs Tab */}
      {activeTab === "faqs" && (
        <div className="mt-8">
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
            <div className="bg-white">
              <ul className="divide-y divide-gray-200">
                {faqs.map((faq) => (
                  <li key={faq.id} className="p-4 hover:bg-gray-50">
                    <div className="flex justify-between">
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-gray-900">
                          {faq.question}
                        </h3>
                        <p className="mt-2 text-sm text-gray-500">
                          {faq.answer}
                        </p>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        <button className="text-red-600 hover:text-red-900">
                          <TrashIcon className="h-5 w-5" aria-hidden="true" />
                          <span className="sr-only">Delete FAQ</span>
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal Placeholder */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900">
              Upload Knowledge Source
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              Upload documents (PDF, DOCX, TXT) or enter a website URL to add to
              your knowledge base.
            </p>
            <div className="mt-4">
              {/* File upload form would go here */}
              <div className="mt-4 flex justify-end">
                <button
                  type="button"
                  className="mr-2 inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                  onClick={() => setShowUploadModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="inline-flex justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                  onClick={() => setShowUploadModal(false)}
                >
                  Upload
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add FAQ Modal Placeholder */}
      {showAddFaqModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900">Add FAQ</h3>
            <p className="mt-2 text-sm text-gray-500">
              Add a new question and answer to your FAQ knowledge base.
            </p>
            <div className="mt-4">
              {/* FAQ form would go here */}
              <div className="mt-4 flex justify-end">
                <button
                  type="button"
                  className="mr-2 inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                  onClick={() => setShowAddFaqModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="inline-flex justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                  onClick={() => setShowAddFaqModal(false)}
                >
                  Add FAQ
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
