"use client";

import { useState, useMemo } from 'react';
import {
  TrendingUpIcon,
  TrendingDownIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  ChatBubbleLeftRightIcon,
} from '@heroicons/react/24/outline';

interface InsightCard {
  id: string;
  title: string;
  description: string;
  type: 'positive' | 'negative' | 'warning' | 'info';
  metric?: string;
  change?: number;
  recommendation?: string;
}

interface AnalyticsData {
  responseRate: number;
  userSatisfaction: {
    satisfied: number;
    neutral: number;
    unsatisfied: number;
  };
  escalationRate: number;
  conversationsByHour: number[];
  conversionsCount: number;
  uniqueUsers: number;
  avgResponseTime: number;
  avgSessionDuration: number;
}

interface AnalyticsInsightsProps {
  analytics: AnalyticsData;
  timeRange: string;
}

export default function AnalyticsInsights({ analytics, timeRange }: AnalyticsInsightsProps) {
  const [selectedInsight, setSelectedInsight] = useState<string | null>(null);

  // Generate insights based on analytics data with memoization for performance
  const insights = useMemo((): InsightCard[] => {
    if (!analytics) return [];
    const insights: InsightCard[] = [];

    // Response rate insight
    if (analytics.responseRate < 0.8) {
      insights.push({
        id: 'low-response-rate',
        title: 'Low Response Rate',
        description: `Your chatbot is only responding to ${(analytics.responseRate * 100).toFixed(1)}% of user messages.`,
        type: 'warning',
        metric: `${(analytics.responseRate * 100).toFixed(1)}%`,
        recommendation: 'Consider expanding your knowledge base or improving intent recognition.',
      });
    } else {
      insights.push({
        id: 'good-response-rate',
        title: 'Excellent Response Rate',
        description: `Your chatbot is successfully responding to ${(analytics.responseRate * 100).toFixed(1)}% of user messages.`,
        type: 'positive',
        metric: `${(analytics.responseRate * 100).toFixed(1)}%`,
      });
    }

    // User satisfaction insight with safe division
    const totalSatisfactionResponses = analytics.userSatisfaction.satisfied + 
      analytics.userSatisfaction.neutral + analytics.userSatisfaction.unsatisfied;
    const satisfactionRate = totalSatisfactionResponses > 0 
      ? analytics.userSatisfaction.satisfied / totalSatisfactionResponses 
      : 0;
    
    if (satisfactionRate < 0.7) {
      insights.push({
        id: 'low-satisfaction',
        title: 'User Satisfaction Needs Attention',
        description: `Only ${(satisfactionRate * 100).toFixed(1)}% of users are satisfied with their experience.`,
        type: 'negative',
        metric: `${(satisfactionRate * 100).toFixed(1)}%`,
        recommendation: 'Review conversation logs to identify common pain points and improve responses.',
      });
    } else {
      insights.push({
        id: 'good-satisfaction',
        title: 'High User Satisfaction',
        description: `${(satisfactionRate * 100).toFixed(1)}% of users are satisfied with their chatbot experience.`,
        type: 'positive',
        metric: `${(satisfactionRate * 100).toFixed(1)}%`,
      });
    }

    // Escalation rate insight
    if (analytics.escalationRate > 0.15) {
      insights.push({
        id: 'high-escalation',
        title: 'High Escalation Rate',
        description: `${(analytics.escalationRate * 100).toFixed(1)}% of conversations are being escalated to human agents.`,
        type: 'warning',
        metric: `${(analytics.escalationRate * 100).toFixed(1)}%`,
        recommendation: 'Analyze escalated conversations to identify knowledge gaps and improve automation.',
      });
    }

    // Peak hours insight with safe array operations
    if (analytics.conversationsByHour && analytics.conversationsByHour.length > 0) {
      const peakHour = analytics.conversationsByHour.indexOf(Math.max(...analytics.conversationsByHour));
      insights.push({
        id: 'peak-hours',
        title: 'Peak Activity Hours',
        description: `Most conversations happen at ${peakHour}:00. Consider optimizing for this time.`,
        type: 'info',
        metric: `${peakHour}:00`,
        recommendation: 'Ensure your chatbot is well-prepared for high-volume periods.',
      });
    }

    // Conversion insight with safe division
    if (analytics.conversionsCount > 0 && analytics.uniqueUsers > 0) {
      const conversionRate = (analytics.conversionsCount / analytics.uniqueUsers) * 100;
      insights.push({
        id: 'conversions',
        title: 'Conversion Performance',
        description: `Your chatbot has generated ${analytics.conversionsCount} conversions.`,
        type: conversionRate > 5 ? 'positive' : 'info',
        metric: `${conversionRate.toFixed(1)}%`,
        recommendation: conversionRate < 5 ? 'Consider adding more conversion-focused interactions.' : undefined,
      });
    }

    // Performance insights based on response time and session duration
    if (analytics.avgResponseTime > 10) {
      insights.push({
        id: 'slow-response',
        title: 'Response Time Optimization',
        description: `Average response time is ${analytics.avgResponseTime.toFixed(1)} seconds.`,
        type: 'warning',
        metric: `${analytics.avgResponseTime.toFixed(1)}s`,
        recommendation: 'Consider optimizing your AI model or reducing processing complexity.',
      });
    }

    if (analytics.avgSessionDuration > 0 && analytics.avgSessionDuration < 2) {
      insights.push({
        id: 'short-sessions',
        title: 'Short Session Duration',
        description: `Average session duration is ${analytics.avgSessionDuration.toFixed(1)} minutes.`,
        type: 'warning',
        metric: `${analytics.avgSessionDuration.toFixed(1)}m`,
        recommendation: 'Users may not be finding what they need. Consider improving engagement.',
      });
    }

    return insights;
  }, [analytics, timeRange]);

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'positive':
        return <CheckCircleIcon className="h-6 w-6 text-green-600" />;
      case 'negative':
        return <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />;
      case 'warning':
        return <ExclamationTriangleIcon className="h-6 w-6 text-yellow-600" />;
      default:
        return <ChatBubbleLeftRightIcon className="h-6 w-6 text-blue-600" />;
    }
  };

  const getInsightBorderColor = (type: string) => {
    switch (type) {
      case 'positive':
        return 'border-l-green-500';
      case 'negative':
        return 'border-l-red-500';
      case 'warning':
        return 'border-l-yellow-500';
      default:
        return 'border-l-blue-500';
    }
  };

  return (
    <div className="mt-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h2 className="text-lg font-medium text-gray-900">Analytics Insights</h2>
          <p className="mt-1 text-sm text-gray-700">
            AI-powered insights and recommendations based on your chatbot performance.
          </p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {insights.map((insight) => (
          <div
            key={insight.id}
            className={`bg-white border-l-4 ${getInsightBorderColor(insight.type)} shadow rounded-lg p-6 cursor-pointer transition-all hover:shadow-md`}
            onClick={() => setSelectedInsight(selectedInsight === insight.id ? null : insight.id)}
          >
            <div className="flex items-start">
              <div className="flex-shrink-0">
                {getInsightIcon(insight.type)}
              </div>
              <div className="ml-4 flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-900">
                    {insight.title}
                  </h3>
                  {insight.metric && (
                    <span className="text-lg font-semibold text-gray-900">
                      {insight.metric}
                    </span>
                  )}
                </div>
                <p className="mt-1 text-sm text-gray-600">
                  {insight.description}
                </p>
                
                {selectedInsight === insight.id && insight.recommendation && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-md">
                    <h4 className="text-xs font-medium text-gray-900 uppercase tracking-wide">
                      Recommendation
                    </h4>
                    <p className="mt-1 text-sm text-gray-700">
                      {insight.recommendation}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Performance Summary */}
      <div className="mt-8 bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Performance Summary</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {insights.filter(i => i.type === 'positive').length}
            </div>
            <div className="text-sm text-gray-500">Strengths</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {insights.filter(i => i.type === 'warning').length}
            </div>
            <div className="text-sm text-gray-500">Areas to Improve</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">
              {insights.filter(i => i.type === 'negative').length}
            </div>
            <div className="text-sm text-gray-500">Critical Issues</div>
          </div>
        </div>
      </div>
    </div>
  );
}