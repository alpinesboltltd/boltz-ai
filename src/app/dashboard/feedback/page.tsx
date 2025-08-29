"use client";

import { useState, useEffect } from "react";
import { Spinner } from "@/components/common/Spinner";
import {
  StarIcon,
  FaceSmileIcon,
  FaceFrownIcon,
} from "@heroicons/react/24/solid";
import { ChatBubbleLeftRightIcon } from "@heroicons/react/24/outline";

interface Feedback {
  id: string;
  chatagentId: string;
  chatagentName: string;
  rating: number;
  comment: string;
  conversationId: string;
  createdAt: string;
  userIdentifier?: string;
}

export default function FeedbackPage() {
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "positive" | "negative">("all");
  const [selectedChatbot, setSelectedChatbot] = useState<string>("all");
  const [chatagents, setChatbots] = useState<{ id: string; name: string }[]>(
    []
  );

  useEffect(() => {
    async function loadFeedback() {
      try {
        // In production, this would call the real API
        // const response = await fetch('/api/feedback');
        // const data = await response.json();

        // For development, use mock data
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const mockChatbots = [
          { id: "bot1", name: "Customer Support Bot" },
          { id: "bot2", name: "Sales Assistant" },
          { id: "bot3", name: "Product Recommender" },
        ];

        const mockFeedback = Array.from({ length: 20 }, (_, i) => {
          const botIndex = i % 3;
          const rating = Math.floor(Math.random() * 5) + 1;
          return {
            id: `feedback_${i}`,
            chatagentId: mockChatbots[botIndex].id,
            chatagentName: mockChatbots[botIndex].name,
            rating,
            comment:
              rating >= 4
                ? "Very helpful and quick responses. I got exactly what I needed."
                : rating >= 3
                  ? "It was okay, but could be more accurate with responses."
                  : "Could not understand my question and gave irrelevant answers.",
            conversationId: `conv_${i}`,
            createdAt: new Date(
              Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000
            ).toISOString(),
            userIdentifier: `user_${Math.floor(Math.random() * 100)}`,
          };
        });

        setChatbots(mockChatbots);
        setFeedback(mockFeedback);
      } catch (error) {
        console.error("Failed to load feedback:", error);
      } finally {
        setLoading(false);
      }
    }

    loadFeedback();
  }, []);

  const filteredFeedback = feedback.filter((item) => {
    const matchesChatbot =
      selectedChatbot === "all" || item.chatagentId === selectedChatbot;
    const matchesRating =
      filter === "all" ||
      (filter === "positive" && item.rating >= 4) ||
      (filter === "negative" && item.rating <= 2);

    return matchesChatbot && matchesRating;
  });

  const averageRating =
    feedback.length > 0
      ? (
          feedback.reduce((sum, item) => sum + item.rating, 0) / feedback.length
        ).toFixed(1)
      : "0.0";

  const positivePercentage =
    feedback.length > 0
      ? Math.round(
          (feedback.filter((item) => item.rating >= 4).length /
            feedback.length) *
            100
        )
      : 0;

  const negativePercentage =
    feedback.length > 0
      ? Math.round(
          (feedback.filter((item) => item.rating <= 2).length /
            feedback.length) *
            100
        )
      : 0;

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <StarIcon
        key={i}
        className={`h-5 w-5 ${i < rating ? "text-yellow-400" : "text-gray-300"}`}
        aria-hidden="true"
      />
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">
            User Feedback
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            Review feedback from users who have interacted with your chatagents.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-primary-100 rounded-md p-3">
                <StarIcon
                  className="h-6 w-6 text-primary-600"
                  aria-hidden="true"
                />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Average Rating
                  </dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">
                      {averageRating}/5.0
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                <FaceSmileIcon
                  className="h-6 w-6 text-green-600"
                  aria-hidden="true"
                />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Positive Feedback
                  </dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">
                      {positivePercentage}%
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-red-100 rounded-md p-3">
                <FaceFrownIcon
                  className="h-6 w-6 text-red-600"
                  aria-hidden="true"
                />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Negative Feedback
                  </dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">
                      {negativePercentage}%
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-4">
          <div>
            <label
              htmlFor="chatagent-filter"
              className="block text-sm font-medium text-gray-700"
            >
              Chatbot
            </label>
            <select
              id="chatagent-filter"
              name="chatagent-filter"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
              value={selectedChatbot}
              onChange={(e) => setSelectedChatbot(e.target.value)}
            >
              <option value="all">All Chatbots</option>
              {chatagents.map((bot) => (
                <option key={bot.id} value={bot.id}>
                  {bot.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="rating-filter"
              className="block text-sm font-medium text-gray-700"
            >
              Rating
            </label>
            <select
              id="rating-filter"
              name="rating-filter"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
            >
              <option value="all">All Ratings</option>
              <option value="positive">Positive (4-5)</option>
              <option value="negative">Negative (1-2)</option>
            </select>
          </div>
        </div>

        <div className="text-sm text-gray-500">
          Showing {filteredFeedback.length} of {feedback.length} feedback items
        </div>
      </div>

      {/* Feedback List */}
      <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-md">
        <ul role="list" className="divide-y divide-gray-200">
          {filteredFeedback.length > 0 ? (
            filteredFeedback.map((item) => (
              <li key={item.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <ChatBubbleLeftRightIcon
                          className="h-6 w-6 text-gray-400"
                          aria-hidden="true"
                        />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-primary-600">
                          {item.chatagentName}
                        </p>
                        <div className="flex items-center mt-1">
                          {renderStars(item.rating)}
                          <span className="ml-2 text-sm text-gray-500">
                            {new Date(item.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="ml-2 flex-shrink-0 flex">
                      <button
                        type="button"
                        className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
                        onClick={() => {
                          // In a real app, this would navigate to the conversation
                          alert(`View conversation ${item.conversationId}`);
                        }}
                      >
                        View Conversation
                      </button>
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <p className="text-sm text-gray-500">{item.comment}</p>
                    </div>
                    {item.userIdentifier && (
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        <p>User: {item.userIdentifier}</p>
                      </div>
                    )}
                  </div>
                </div>
              </li>
            ))
          ) : (
            <li className="px-4 py-6 sm:px-6 text-center text-gray-500">
              No feedback found matching your filters.
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
