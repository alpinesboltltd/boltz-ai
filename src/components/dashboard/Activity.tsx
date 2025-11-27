"use client";

import { useState, useEffect } from "react";
import {
  ChatBubbleLeftRightIcon,
  UserIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import { useAgentData } from "@/store/agentDetailStore";
import { agentsAPI } from "@/lib/api";

interface ActivityItem {
  id: string;
  type: "conversation" | "training" | "integration" | "error";
  title: string;
  description: string;
  timestamp: string;
  user?: string;
  platform?: string;
  status?: "success" | "error" | "pending";
}

export function Activity() {
  const agent = useAgentData();
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    const fetchActivity = async () => {
      if (!agent?.id) return;
      try {
        const { data } = await agentsAPI.getActivity(agent.id);
        setActivities(data);
      } catch (error) {
        console.error("Failed to fetch activity:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchActivity();
  }, [agent?.id]);

  const filteredActivities = activities.filter(
    (activity) => filter === "all" || activity.type === filter
  );

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "conversation":
        return <ChatBubbleLeftRightIcon className="h-5 w-5" />;
      case "training":
        return <UserIcon className="h-5 w-5" />;
      default:
        return <ClockIcon className="h-5 w-5" />;
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "success":
        return "text-green-600 bg-green-100";
      case "error":
        return "text-red-600 bg-red-100";
      case "pending":
        return "text-yellow-600 bg-yellow-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Agent Activity
          </h2>
          <p className="text-sm text-gray-600">
            Recent activity and events for this agent
          </p>
        </div>
        <div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
          >
            <option value="all">All Activities</option>
            <option value="conversation">Conversations</option>
            <option value="training">Training</option>
            <option value="integration">Integrations</option>
            <option value="error">Errors</option>
          </select>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium">Activity Log</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {filteredActivities.length === 0 ? (
            <div className="px-6 py-8 text-center">
              <p className="text-gray-500">
                No activities found for the selected filter.
              </p>
            </div>
          ) : (
            filteredActivities.map((activity) => (
              <div key={activity.id} className="px-6 py-4">
                <div className="flex items-start space-x-4">
                  <div
                    className={`flex-shrink-0 p-2 rounded-full ${getStatusColor(activity.status)}`}
                  >
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-gray-900">
                        {activity.title}
                      </h4>
                      <span className="text-xs text-gray-500">
                        {formatTimestamp(activity.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {activity.description}
                    </p>
                    {(activity.user || activity.platform) && (
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                        {activity.user && <span>User: {activity.user}</span>}
                        {activity.platform && (
                          <span>Platform: {activity.platform}</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
