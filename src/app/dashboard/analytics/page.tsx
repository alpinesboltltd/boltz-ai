"use client";

import { useState, useEffect } from "react";
import { format, subDays } from "date-fns";
import { Spinner } from "@/components/common/Spinner";
import {
  ChatBubbleLeftRightIcon,
  UserIcon,
  ClockIcon,
  QuestionMarkCircleIcon,
  StarIcon,
} from "@heroicons/react/24/outline";
import AnalyticsInsights from "@/components/dashboard/AnalyticsInsights";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import { TrendingUpIcon } from "lucide-react";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

// Chart options with performance optimizations
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    intersect: false,
    mode: 'index' as const,
  },
  plugins: {
    legend: {
      position: "top" as const,
    },
    tooltip: {
      enabled: true,
      mode: 'index' as const,
      intersect: false,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        display: true,
        color: 'rgba(0, 0, 0, 0.1)',
      },
    },
    x: {
      grid: {
        display: false,
      },
    },
  },
  elements: {
    point: {
      radius: 3,
      hoverRadius: 6,
    },
  },
};

const doughnutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "right" as const,
    },
    tooltip: {
      enabled: true,
      callbacks: {
        label: function(context: any) {
          const label = context.label || '';
          const value = context.parsed || 0;
          const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
          const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : '0';
          return `${label}: ${value} (${percentage}%)`;
        },
      },
    },
  },
};

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState("30d");
  const [selectedChatbot, setSelectedChatbot] = useState("all");
  const [chatagents, setChatbots] = useState<{ id: string; name: string }[]>(
    []
  );
  const [analytics, setAnalytics] = useState({
    totalConversations: 0,
    totalMessages: 0,
    uniqueUsers: 0,
    avgConversationLength: 0,
    avgResponseTime: 0,
    avgRating: 0,
    responseRate: 0,
    conversionsCount: 0,
    topQuestions: [] as { question: string; count: number; category: string }[],
    conversationsByDay: [] as number[],
    conversationsByHour: [] as number[],
    messagesByDay: [] as number[],
    usersByDay: [] as number[],
    userSatisfaction: { satisfied: 0, neutral: 0, unsatisfied: 0 },
    platformDistribution: [] as { platform: string; percentage: number }[],
    sentimentAnalysis: [] as {
      date: string;
      positive: number;
      neutral: number;
      negative: number;
    }[],
    escalationRate: 0,
    avgSessionDuration: 0,
  });

  useEffect(() => {
    async function loadAnalytics() {
      try {
        const response = await fetch(
          `/api/analytics?timeRange=${timeRange}&agentId=${selectedChatbot}`
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to load analytics");
        }

        const processedAnalytics = {
          totalConversations: data.timeline.reduce(
            (sum: number, t: any) => sum + t.conversations,
            0
          ),
          totalMessages: data.metrics.totalMessages,
          uniqueUsers: data.metrics.uniqueUsers,
          avgConversationLength:
            data.metrics.totalMessages > 0 &&
            data.timeline.reduce(
              (sum: number, t: any) => sum + t.conversations,
              0
            ) > 0
              ? +(
                  data.metrics.totalMessages /
                  data.timeline.reduce(
                    (sum: number, t: any) => sum + t.conversations,
                    0
                  )
                ).toFixed(1)
              : 0,
          avgResponseTime: data.metrics.avgResponseTime,
          avgRating: data.metrics.avgRating,
          responseRate: data.metrics.responseRate,
          conversionsCount: data.metrics.conversionsCount,
          escalationRate: data.metrics.escalationRate,
          avgSessionDuration: data.metrics.avgSessionDuration,
          topQuestions: data.topQuestions,
          conversationsByDay: data.timeline.map((t: any) => t.conversations),
          conversationsByHour: data.conversationsByHour,
          messagesByDay: data.timeline.map((t: any) => t.messages),
          usersByDay: data.timeline.map((t: any) => t.users),
          userSatisfaction: data.userSatisfaction,
          platformDistribution: data.platformDistribution,
          sentimentAnalysis: data.sentimentAnalysis,
        };

        setChatbots(data.agents || []);
        setAnalytics(processedAnalytics);
        setError(null);
      } catch (error) {
        console.error("Failed to load analytics:", error);
        setError(error instanceof Error ? error.message : "Failed to load analytics data");
      } finally {
        setLoading(false);
      }
    }

    loadAnalytics();
  }, [timeRange, selectedChatbot]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-lg font-medium mb-2">Error Loading Analytics</div>
          <div className="text-gray-600 mb-4">{error}</div>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">
            Analytics Dashboard
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            View performance metrics and insights for your chatagents.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
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
              htmlFor="time-range"
              className="block text-sm font-medium text-gray-700"
            >
              Time Range
            </label>
            <select
              id="time-range"
              name="time-range"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
            </select>
          </div>
        </div>

        <div className="flex space-x-3">
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50"
            onClick={async () => {
              const { AnalyticsExporter } = await import(
                "@/lib/analytics-export"
              );
              const agentName =
                selectedChatbot === "all"
                  ? "All Agents"
                  : chatagents.find((c) => c.id === selectedChatbot)?.name ||
                    "Unknown Agent";
              const exportData = {
                metrics: {
                  totalMessages: analytics.totalMessages,
                  uniqueUsers: analytics.uniqueUsers,
                  avgRating: analytics.avgRating,
                  responseRate: analytics.responseRate,
                  conversionsCount: analytics.conversionsCount,
                  escalationRate: analytics.escalationRate,
                  avgSessionDuration: analytics.avgSessionDuration,
                  avgResponseTime: analytics.avgResponseTime,
                },
                timeline: analytics.messagesByDay.map(
                  (messages: number, index: number) => ({
                    date: format(
                      subDays(
                        new Date(),
                        analytics.messagesByDay.length - 1 - index
                      ),
                      "yyyy-MM-dd"
                    ),
                    messages,
                    users: analytics.usersByDay[index],
                    conversations: analytics.conversationsByDay[index],
                  })
                ),
                topQuestions: analytics.topQuestions,
                userSatisfaction: analytics.userSatisfaction,
                platformDistribution: analytics.platformDistribution,
                sentimentAnalysis: analytics.sentimentAnalysis,
                conversationsByHour: analytics.conversationsByHour,
              };
              AnalyticsExporter.exportToCSV(exportData, timeRange, agentName);
            }}
          >
            Export CSV
          </button>
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
            onClick={async () => {
              const { AnalyticsExporter } = await import(
                "@/lib/analytics-export"
              );
              const agentName =
                selectedChatbot === "all"
                  ? "All Agents"
                  : chatagents.find((c) => c.id === selectedChatbot)?.name ||
                    "Unknown Agent";
              const exportData = {
                metrics: {
                  totalMessages: analytics.totalMessages,
                  uniqueUsers: analytics.uniqueUsers,
                  avgRating: analytics.avgRating,
                  responseRate: analytics.responseRate,
                  conversionsCount: analytics.conversionsCount,
                  escalationRate: analytics.escalationRate,
                  avgSessionDuration: analytics.avgSessionDuration,
                  avgResponseTime: analytics.avgResponseTime,
                },
                timeline: analytics.messagesByDay.map(
                  (messages: number, index: number) => ({
                    date: format(
                      subDays(
                        new Date(),
                        analytics.messagesByDay.length - 1 - index
                      ),
                      "yyyy-MM-dd"
                    ),
                    messages,
                    users: analytics.usersByDay[index],
                    conversations: analytics.conversationsByDay[index],
                  })
                ),
                topQuestions: analytics.topQuestions,
                userSatisfaction: analytics.userSatisfaction,
                platformDistribution: analytics.platformDistribution,
                sentimentAnalysis: analytics.sentimentAnalysis,
                conversationsByHour: analytics.conversationsByHour,
              };
              AnalyticsExporter.generatePDFReport(
                exportData,
                timeRange,
                agentName
              );
            }}
          >
            Export Report
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                <ChatBubbleLeftRightIcon
                  className="h-6 w-6 text-blue-600"
                  aria-hidden="true"
                />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Messages
                  </dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">
                      {analytics.totalMessages.toLocaleString()}
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
                <UserIcon
                  className="h-6 w-6 text-green-600"
                  aria-hidden="true"
                />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Unique Users
                  </dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">
                      {analytics.uniqueUsers.toLocaleString()}
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
              <div className="flex-shrink-0 bg-yellow-100 rounded-md p-3">
                <StarIcon
                  className="h-6 w-6 text-yellow-600"
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
                      {analytics.avgRating}/5.0
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
              <div className="flex-shrink-0 bg-purple-100 rounded-md p-3">
                <TrendingUpIcon
                  className="h-6 w-6 text-purple-600"
                  aria-hidden="true"
                />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Response Rate
                  </dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">
                      {(analytics.responseRate * 100).toFixed(1)}%
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Stats Row */}
      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-indigo-100 rounded-md p-3">
                <ClockIcon
                  className="h-6 w-6 text-indigo-600"
                  aria-hidden="true"
                />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Avg. Response Time
                  </dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">
                      {analytics.avgResponseTime}s
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
                <QuestionMarkCircleIcon
                  className="h-6 w-6 text-red-600"
                  aria-hidden="true"
                />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Escalation Rate
                  </dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">
                      {(analytics.escalationRate * 100).toFixed(1)}%
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
              <div className="flex-shrink-0 bg-teal-100 rounded-md p-3">
                <TrendingUpIcon
                  className="h-6 w-6 text-teal-600"
                  aria-hidden="true"
                />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Conversions
                  </dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">
                      {analytics.conversionsCount.toLocaleString()}
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
              <div className="flex-shrink-0 bg-orange-100 rounded-md p-3">
                <ClockIcon
                  className="h-6 w-6 text-orange-600"
                  aria-hidden="true"
                />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Avg. Session Duration
                  </dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">
                      {analytics.avgSessionDuration}m
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Messages and Users Over Time */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Messages & Users Over Time
          </h2>
          <div className="h-80">
            <Line
              data={{
                labels: Array.from(
                  { length: analytics.messagesByDay.length },
                  (_, i) =>
                    format(
                      subDays(
                        new Date(),
                        analytics.messagesByDay.length - 1 - i
                      ),
                      "MMM d"
                    )
                ),
                datasets: [
                  {
                    label: "Messages",
                    data: analytics.messagesByDay,
                    borderColor: "rgb(59, 130, 246)",
                    backgroundColor: "rgba(59, 130, 246, 0.1)",
                    tension: 0.4,
                  },
                  {
                    label: "Users",
                    data: analytics.usersByDay,
                    borderColor: "rgb(16, 185, 129)",
                    backgroundColor: "rgba(16, 185, 129, 0.1)",
                    tension: 0.4,
                  },
                ],
              }}
              options={chartOptions}
            />
          </div>
        </div>

        {/* User Satisfaction */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            User Satisfaction
          </h2>
          <div className="h-80">
            <Doughnut
              data={{
                labels: ["Satisfied", "Neutral", "Unsatisfied"],
                datasets: [
                  {
                    data: [
                      analytics.userSatisfaction.satisfied,
                      analytics.userSatisfaction.neutral,
                      analytics.userSatisfaction.unsatisfied,
                    ],
                    backgroundColor: [
                      "rgb(34, 197, 94)",
                      "rgb(234, 179, 8)",
                      "rgb(239, 68, 68)",
                    ],
                    borderWidth: 2,
                    borderColor: "#fff",
                  },
                ],
              }}
              options={doughnutOptions}
            />
          </div>
        </div>

        {/* Conversations by Hour */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Activity by Hour
          </h2>
          <div className="h-80">
            <Bar
              data={{
                labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
                datasets: [
                  {
                    label: "Conversations",
                    data: analytics.conversationsByHour,
                    backgroundColor: "rgba(147, 51, 234, 0.8)",
                    borderColor: "rgb(147, 51, 234)",
                    borderWidth: 1,
                  },
                ],
              }}
              options={chartOptions}
            />
          </div>
        </div>

        {/* Platform Distribution */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Platform Distribution
          </h2>
          <div className="h-80">
            <Doughnut
              data={{
                labels: analytics.platformDistribution.map((p) => p.platform),
                datasets: [
                  {
                    data: analytics.platformDistribution.map(
                      (p) => p.percentage
                    ),
                    backgroundColor: [
                      "rgb(59, 130, 246)",
                      "rgb(16, 185, 129)",
                      "rgb(245, 158, 11)",
                      "rgb(239, 68, 68)",
                    ],
                    borderWidth: 2,
                    borderColor: "#fff",
                  },
                ],
              }}
              options={doughnutOptions}
            />
          </div>
        </div>
      </div>

      {/* Sentiment Analysis Chart */}
      <div className="mt-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Sentiment Analysis Over Time
          </h2>
          <div className="h-80">
            <Line
              data={{
                labels: analytics.sentimentAnalysis.map((s) =>
                  format(new Date(s.date), "MMM d")
                ),
                datasets: [
                  {
                    label: "Positive",
                    data: analytics.sentimentAnalysis.map((s) => s.positive),
                    borderColor: "rgb(34, 197, 94)",
                    backgroundColor: "rgba(34, 197, 94, 0.1)",
                    tension: 0.4,
                  },
                  {
                    label: "Neutral",
                    data: analytics.sentimentAnalysis.map((s) => s.neutral),
                    borderColor: "rgb(234, 179, 8)",
                    backgroundColor: "rgba(234, 179, 8, 0.1)",
                    tension: 0.4,
                  },
                  {
                    label: "Negative",
                    data: analytics.sentimentAnalysis.map((s) => s.negative),
                    borderColor: "rgb(239, 68, 68)",
                    backgroundColor: "rgba(239, 68, 68, 0.1)",
                    tension: 0.4,
                  },
                ],
              }}
              options={{
                ...chartOptions,
                scales: {
                  y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                      callback: function (value) {
                        return value + "%";
                      },
                    },
                  },
                },
              }}
            />
          </div>
        </div>
      </div>

      {/* Top Questions */}
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Top Questions
        </h2>
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          {analytics.topQuestions.length > 0 ? (
            <ul role="list" className="divide-y divide-gray-200">
              {analytics.topQuestions.map((item, index) => (
                <li key={`${item.question}-${index}`}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-primary-600 truncate">
                          {item.question}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Category: {item.category}
                        </p>
                      </div>
                      <div className="ml-2 flex-shrink-0 flex">
                        <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {item.count} times
                        </p>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-4 py-8 text-center text-gray-500">
              No questions data available for the selected time range.
            </div>
          )}
        </div>
      </div>

      {/* Analytics Insights */}
      <AnalyticsInsights analytics={analytics} timeRange={timeRange} />
    </div>
  );
}
