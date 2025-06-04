"use client";
import { useState } from "react";

// Mock chart components - in a real app, you'd use Chart.js with React-Chartjs-2
const LineChart = ({ data, options }) => (
  <div className="h-full w-full flex items-center justify-center bg-gray-50 rounded-md">
    <p className="text-gray-500 text-sm">
      Line Chart: {data.datasets[0].label}
    </p>
  </div>
);

const BarChart = ({ data, options }) => (
  <div className="h-full w-full flex items-center justify-center bg-gray-50 rounded-md">
    <p className="text-gray-500 text-sm">Bar Chart: {data.datasets[0].label}</p>
  </div>
);

const DoughnutChart = ({ data, options }) => (
  <div className="h-full w-full flex items-center justify-center bg-gray-50 rounded-md">
    <p className="text-gray-500 text-sm">
      Doughnut Chart: {data.datasets[0].label}
    </p>
  </div>
);

// Mock data for analytics
const messageData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  datasets: [
    {
      label: "Messages",
      data: [1200, 1900, 3000, 5000, 4200, 3800],
      borderColor: "rgb(53, 162, 235)",
      backgroundColor: "rgba(53, 162, 235, 0.5)",
    },
  ],
};

const userSatisfactionData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  datasets: [
    {
      label: "Satisfaction Rate (%)",
      data: [85, 87, 90, 89, 92, 95],
      borderColor: "rgb(75, 192, 192)",
      backgroundColor: "rgba(75, 192, 192, 0.5)",
    },
  ],
};

const platformDistributionData = {
  labels: ["Website", "WhatsApp", "Slack", "Facebook", "Other"],
  datasets: [
    {
      label: "Platform Distribution",
      data: [45, 25, 15, 10, 5],
      backgroundColor: [
        "rgba(54, 162, 235, 0.6)",
        "rgba(75, 192, 192, 0.6)",
        "rgba(153, 102, 255, 0.6)",
        "rgba(255, 159, 64, 0.6)",
        "rgba(201, 203, 207, 0.6)",
      ],
    },
  ],
};

const modelUsageData = {
  labels: ["Google Gemini", "GPT-4", "Claude", "Mistral", "Llama 3"],
  datasets: [
    {
      label: "Model Usage",
      data: [40, 30, 15, 10, 5],
      backgroundColor: [
        "rgba(255, 99, 132, 0.6)",
        "rgba(54, 162, 235, 0.6)",
        "rgba(255, 206, 86, 0.6)",
        "rgba(75, 192, 192, 0.6)",
        "rgba(153, 102, 255, 0.6)",
      ],
    },
  ],
};

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState("last30Days");

  const dateRangeOptions = [
    { value: "last7Days", label: "Last 7 Days" },
    { value: "last30Days", label: "Last 30 Days" },
    { value: "last90Days", label: "Last 90 Days" },
    { value: "lastYear", label: "Last Year" },
    { value: "custom", label: "Custom Range" },
  ];

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Analytics</h1>
          <p className="mt-2 text-sm text-gray-700">
            Track your chatbot performance, user engagement, and conversation
            metrics.
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <select
            id="dateRange"
            name="dateRange"
            className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
          >
            {dateRangeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-primary-100 rounded-md p-3">
                <svg
                  className="h-6 w-6 text-primary-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                  />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Messages
                  </dt>
                  <dd className="text-3xl font-semibold text-gray-900">
                    19,100
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                <svg
                  className="h-6 w-6 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Satisfaction Rate
                  </dt>
                  <dd className="text-3xl font-semibold text-gray-900">95%</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                <svg
                  className="h-6 w-6 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Active Users
                  </dt>
                  <dd className="text-3xl font-semibold text-gray-900">
                    3,842
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-yellow-100 rounded-md p-3">
                <svg
                  className="h-6 w-6 text-yellow-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Conversion Rate
                  </dt>
                  <dd className="text-3xl font-semibold text-gray-900">
                    12.5%
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="bg-white p-6 shadow rounded-lg">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Message Volume
          </h2>
          <div className="h-80">
            <LineChart
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                  },
                },
              }}
              data={messageData}
            />
          </div>
        </div>

        <div className="bg-white p-6 shadow rounded-lg">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            User Satisfaction
          </h2>
          <div className="h-80">
            <LineChart
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    min: 70,
                    max: 100,
                  },
                },
              }}
              data={userSatisfactionData}
            />
          </div>
        </div>

        <div className="bg-white p-6 shadow rounded-lg">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Platform Distribution
          </h2>
          <div className="h-80 flex items-center justify-center">
            <div style={{ width: "80%", height: "80%" }}>
              <DoughnutChart
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                }}
                data={platformDistributionData}
              />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 shadow rounded-lg">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            AI Model Usage
          </h2>
          <div className="h-80">
            <BarChart
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                  },
                },
              }}
              data={modelUsageData}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
