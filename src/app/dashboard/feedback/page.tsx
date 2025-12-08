"use client";

import { useState, useEffect } from "react";
import { Spinner } from "@/components/common/Spinner";
import {
  Star,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Filter,
  Search,
  User,
  Calendar,
  MessageCircle,
  ArrowUpRight
} from "lucide-react";
import { toast } from "@/store/toastStore";
import { cn } from "@/lib/utils";

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
        // Mock data for development
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
      <Star
        key={i}
        className={cn(
          "h-4 w-4",
          i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-200"
        )}
      />
    ));
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Spinner size="lg" />
        <p className="mt-4 text-gray-500 font-medium animate-pulse">Loading feedback...</p>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 animate-fade-in max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
          <MessageSquare className="w-8 h-8 text-primary-600" />
          User Feedback
        </h1>
        <p className="mt-2 text-gray-500">
          Review and analyze user sentiment across your agents.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-8">
        <div className="bg-white overflow-hidden shadow-sm rounded-xl border border-gray-100 p-5">
          <div className="flex items-center">
            <div className="shrink-0 bg-yellow-50 rounded-lg p-3">
              <Star className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Average Rating</dt>
                <dd className="text-2xl font-bold text-gray-900 mt-1">{averageRating}/5.0</dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow-sm rounded-xl border border-gray-100 p-5">
          <div className="flex items-center">
            <div className="shrink-0 bg-green-50 rounded-lg p-3">
              <ThumbsUp className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Positive Feedback</dt>
                <dd className="text-2xl font-bold text-gray-900 mt-1">{positivePercentage}%</dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow-sm rounded-xl border border-gray-100 p-5">
          <div className="flex items-center">
            <div className="shrink-0 bg-red-50 rounded-lg p-3">
              <ThumbsDown className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Negative Feedback</dt>
                <dd className="text-2xl font-bold text-gray-900 mt-1">{negativePercentage}%</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-8 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Filter className="w-4 h-4" />
          <span className="font-medium">Filters:</span>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <select
            className="input py-2 text-sm bg-gray-50 border-gray-200"
            value={selectedChatbot}
            onChange={(e) => setSelectedChatbot(e.target.value)}
          >
            <option value="all">All Agents</option>
            {chatagents.map((bot) => (
              <option key={bot.id} value={bot.id}>
                {bot.name}
              </option>
            ))}
          </select>

          <select
            className="input py-2 text-sm bg-gray-50 border-gray-200"
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
          >
            <option value="all">All Ratings</option>
            <option value="positive">Positive (4-5)</option>
            <option value="negative">Negative (1-2)</option>
          </select>
        </div>
      </div>

      {/* Feedback List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">Recent Feedback</h2>
          <span className="text-sm text-gray-500">
            Showing {filteredFeedback.length} of {feedback.length} items
          </span>
        </div>

        <div className="divide-y divide-gray-100">
          {filteredFeedback.length > 0 ? (
            filteredFeedback.map((item) => (
              <div key={item.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
                      <MessageCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">{item.chatagentName}</h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <div className="flex">{renderStars(item.rating)}</div>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(item.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => toast.info("Navigation", `View conversation ${item.conversationId}`)}
                    className="btn btn-ghost btn-sm text-primary-600 hover:text-primary-700 hover:bg-primary-50"
                  >
                    View Context <ArrowUpRight className="w-4 h-4 ml-1" />
                  </button>
                </div>

                <div className="pl-4 ml-13 border-l-2 border-gray-100">
                  <p className="text-gray-600 text-sm leading-relaxed">
                    "{item.comment}"
                  </p>
                  {item.userIdentifier && (
                    <div className="mt-3 flex items-center gap-2 text-xs text-gray-400">
                      <User className="w-3 h-3" />
                      <span>{item.userIdentifier}</span>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">No feedback found</h3>
              <p className="text-gray-500 mt-1">Try adjusting your filters to see more results.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
