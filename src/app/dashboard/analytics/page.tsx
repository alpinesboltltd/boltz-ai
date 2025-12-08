"use client";

import { useState, useEffect } from "react";
import { format, subDays } from "date-fns";
import { Spinner } from "@/components/common/Spinner";
import {
  MessageSquare,
  Users,
  Clock,
  AlertCircle,
  Star,
  TrendingUp,
  Download,
  FileText,
  Filter,
  BarChart3
} from "lucide-react";
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
import { cn } from "@/lib/utils";

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
    mode: "index" as const,
  },
  plugins: {
    legend: {
      position: "top" as const,
      labels: {
        usePointStyle: true,
        boxWidth: 6,
        font: {
          family: "'Inter', sans-serif",
          size: 11
        }
      }
    },
    tooltip: {
      enabled: true,
      mode: "index" as const,
      intersect: false,
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      titleColor: '#1f2937',
      bodyColor: '#4b5563',
      borderColor: '#e5e7eb',
      borderWidth: 1,
      padding: 10,
      cornerRadius: 8,
      displayColors: true,
      boxPadding: 4
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        display: true,
        color: "rgba(0, 0, 0, 0.05)",
        drawBorder: false,
      },
      ticks: {
        font: {
          family: "'Inter', sans-serif",
          size: 10
        },
        color: '#9ca3af'
      }
    },
    x: {
      grid: {
        display: false,
      },
      ticks: {
        font: {
          family: "'Inter', sans-serif",
          size: 10
        },
        color: '#9ca3af'
      }
    },
  },
  elements: {
    point: {
      radius: 0,
      hoverRadius: 4,
      hitRadius: 10,
    },
    line: {
      tension: 0.4,
      borderWidth: 2
    }
  },
};

const doughnutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '75%',
  plugins: {
    legend: {
      position: "right" as const,
      labels: {
        usePointStyle: true,
        boxWidth: 6,
        font: {
          family: "'Inter', sans-serif",
          size: 11
        }
      }
    },
    tooltip: {
      enabled: true,
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      titleColor: '#1f2937',
      bodyColor: '#4b5563',
      borderColor: '#e5e7eb',
      borderWidth: 1,
      padding: 10,
      cornerRadius: 8,
      callbacks: {
        label: function (context: any) {
          const label = context.label || "";
          const value = context.parsed || 0;
          const total = context.dataset.data.reduce(
            (a: number, b: number) => a + b,
            0
          );
          const percentage =
            total > 0 ? ((value / total) * 100).toFixed(1) : "0";
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
        // Mock data for now if API fails or is not ready
        // In a real scenario, this would be a robust fetch
        // const response = await fetch(
        //   `/api/analytics?timeRange=${timeRange}&agentId=${selectedChatbot}`
        // );

        // Simulating API call for UI development
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Mock data structure matching the expected API response
        const mockData = {
          metrics: {
            totalMessages: 12543,
            uniqueUsers: 3420,
            avgRating: 4.8,
            responseRate: 0.98,
            conversionsCount: 450,
            escalationRate: 0.05,
            avgSessionDuration: 4.2,
            avgResponseTime: 1.5,
          },
          timeline: Array.from({ length: 30 }, (_, i) => ({
            conversations: Math.floor(Math.random() * 100) + 50,
            messages: Math.floor(Math.random() * 500) + 200,
            users: Math.floor(Math.random() * 80) + 20,
          })),
          topQuestions: [
            { question: "How do I reset my password?", count: 120, category: "Support" },
            { question: "What are your pricing plans?", count: 95, category: "Sales" },
            { question: "Can I integrate with Slack?", count: 80, category: "Technical" },
          ],
          conversationsByHour: Array.from({ length: 24 }, () => Math.floor(Math.random() * 50)),
          userSatisfaction: { satisfied: 85, neutral: 10, unsatisfied: 5 },
          platformDistribution: [
            { platform: "Web", percentage: 60 },
            { platform: "Mobile", percentage: 30 },
            { platform: "Slack", percentage: 10 },
          ],
          sentimentAnalysis: Array.from({ length: 30 }, (_, i) => ({
            date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString(),
            positive: Math.floor(Math.random() * 60) + 20,
            neutral: Math.floor(Math.random() * 20) + 10,
            negative: Math.floor(Math.random() * 10),
          })),
          agents: [
            { id: "1", name: "Support Bot" },
            { id: "2", name: "Sales Assistant" },
          ]
        };

        const data = mockData; // Replace with await response.json() when API is ready

        const processedAnalytics = {
          totalConversations: data.timeline.reduce(
            (sum: number, t: any) => sum + t.conversations,
            0
          ),
          totalMessages: data.metrics.totalMessages,
          uniqueUsers: data.metrics.uniqueUsers,
          avgConversationLength: 0, // Simplified for mock
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
        setError(
          error instanceof Error
            ? error.message
            : "Failed to load analytics data"
        );
      } finally {
        setLoading(false);
      }
    }

    loadAnalytics();
  }, [timeRange, selectedChatbot]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Spinner size="lg" />
        <p className="mt-4 text-gray-500 font-medium animate-pulse">Gathering insights...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center max-w-md mx-auto p-8 bg-red-50 rounded-2xl border border-red-100">
          <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-900 mb-2">Failed to load analytics</h3>
          <p className="text-red-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="btn btn-primary"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 animate-fade-in max-w-7xl mx-auto">
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-primary-600" />
            Analytics
          </h1>
          <p className="mt-2 text-gray-500">
            Deep dive into your agent performance and user interactions.
          </p>
        </div>

        <div className="mt-4 sm:mt-0 flex gap-3">
          <button className="btn btn-secondary text-sm">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </button>
          <button className="btn btn-primary text-sm">
            <FileText className="w-4 h-4 mr-2" />
            Generate Report
          </button>
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
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {[
          { label: "Total Messages", value: analytics.totalMessages.toLocaleString(), icon: MessageSquare, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Unique Users", value: analytics.uniqueUsers.toLocaleString(), icon: Users, color: "text-green-600", bg: "bg-green-50" },
          { label: "Avg Rating", value: `${analytics.avgRating}/5.0`, icon: Star, color: "text-yellow-600", bg: "bg-yellow-50" },
          { label: "Response Rate", value: `${(analytics.responseRate * 100).toFixed(1)}%`, icon: TrendingUp, color: "text-purple-600", bg: "bg-purple-50" },
          { label: "Avg Response Time", value: `${analytics.avgResponseTime}s`, icon: Clock, color: "text-indigo-600", bg: "bg-indigo-50" },
          { label: "Escalation Rate", value: `${(analytics.escalationRate * 100).toFixed(1)}%`, icon: AlertCircle, color: "text-red-600", bg: "bg-red-50" },
          { label: "Conversions", value: analytics.conversionsCount.toLocaleString(), icon: TrendingUp, color: "text-teal-600", bg: "bg-teal-50" },
          { label: "Avg Session", value: `${analytics.avgSessionDuration}m`, icon: Clock, color: "text-orange-600", bg: "bg-orange-50" },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white overflow-hidden shadow-sm rounded-xl border border-gray-100 hover:shadow-md transition-shadow p-5">
            <div className="flex items-center">
              <div className={cn("shrink-0 rounded-lg p-3", stat.bg)}>
                <stat.icon className={cn("h-6 w-6", stat.color)} />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">{stat.label}</dt>
                  <dd className="text-xl font-bold text-gray-900 mt-1">{stat.value}</dd>
                </dl>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 mb-8">
        {/* Messages and Users Over Time */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Growth Trends</h2>
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
                    fill: true,
                  },
                  {
                    label: "Users",
                    data: analytics.usersByDay,
                    borderColor: "rgb(16, 185, 129)",
                    backgroundColor: "rgba(16, 185, 129, 0.1)",
                    fill: true,
                  },
                ],
              }}
              options={chartOptions}
            />
          </div>
        </div>

        {/* User Satisfaction */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">User Satisfaction</h2>
          <div className="h-80 flex items-center justify-center">
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
                    borderWidth: 0,
                  },
                ],
              }}
              options={doughnutOptions}
            />
          </div>
        </div>

        {/* Activity by Hour */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Peak Activity Hours</h2>
          <div className="h-80">
            <Bar
              data={{
                labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
                datasets: [
                  {
                    label: "Conversations",
                    data: analytics.conversationsByHour,
                    backgroundColor: "rgba(99, 102, 241, 0.8)",
                    borderRadius: 4,
                  },
                ],
              }}
              options={chartOptions}
            />
          </div>
        </div>

        {/* Platform Distribution */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Platform Distribution</h2>
          <div className="h-80 flex items-center justify-center">
            <Doughnut
              data={{
                labels: analytics.platformDistribution.map((p) => p.platform),
                datasets: [
                  {
                    data: analytics.platformDistribution.map((p) => p.percentage),
                    backgroundColor: [
                      "rgb(59, 130, 246)",
                      "rgb(16, 185, 129)",
                      "rgb(245, 158, 11)",
                      "rgb(239, 68, 68)",
                    ],
                    borderWidth: 0,
                  },
                ],
              }}
              options={doughnutOptions}
            />
          </div>
        </div>
      </div>

      {/* Sentiment Analysis */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Sentiment Analysis</h2>
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
                  backgroundColor: "rgba(34, 197, 94, 0.05)",
                  fill: true,
                },
                {
                  label: "Neutral",
                  data: analytics.sentimentAnalysis.map((s) => s.neutral),
                  borderColor: "rgb(234, 179, 8)",
                  backgroundColor: "rgba(234, 179, 8, 0.05)",
                  fill: true,
                },
                {
                  label: "Negative",
                  data: analytics.sentimentAnalysis.map((s) => s.negative),
                  borderColor: "rgb(239, 68, 68)",
                  backgroundColor: "rgba(239, 68, 68, 0.05)",
                  fill: true,
                },
              ],
            }}
            options={{
              ...chartOptions,
              scales: {
                ...chartOptions.scales,
                y: {
                  ...chartOptions.scales.y,
                  max: 100,
                  ticks: {
                    ...chartOptions.scales.y.ticks,
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

      {/* Top Questions */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Top User Questions</h2>
        </div>
        <div className="divide-y divide-gray-100">
          {analytics.topQuestions.map((item, index) => (
            <div key={index} className="p-4 hover:bg-gray-50 transition-colors flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="shrink-0 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-600">
                  {index + 1}
                </span>
                <div>
                  <p className="text-sm font-medium text-gray-900">{item.question}</p>
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 mt-1">
                    {item.category}
                  </span>
                </div>
              </div>
              <div className="text-sm text-gray-500 font-medium">
                {item.count} queries
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
