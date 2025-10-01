import { format, subDays } from "date-fns";

export interface AnalyticsMetrics {
  totalMessages: number;
  uniqueUsers: number;
  avgRating: number;
  responseRate: number;
  conversionsCount: number;
  escalationRate: number;
  avgSessionDuration: number;
  avgResponseTime: number;
}

export interface TimeSeriesData {
  date: string;
  messages: number;
  users: number;
  conversations: number;
}

export interface SentimentData {
  date: string;
  positive: number;
  neutral: number;
  negative: number;
}

export interface PlatformData {
  platform: string;
  percentage: number;
  count: number;
}

export interface TopQuestion {
  question: string;
  count: number;
  category: string;
}

export interface UserSatisfaction {
  satisfied: number;
  neutral: number;
  unsatisfied: number;
}

export interface AnalyticsData {
  metrics: AnalyticsMetrics;
  timeline: TimeSeriesData[];
  sentimentAnalysis: SentimentData[];
  platformDistribution: PlatformData[];
  topQuestions: TopQuestion[];
  userSatisfaction: UserSatisfaction;
  conversationsByHour: number[];
}

export class AnalyticsProcessor {
  static processDbData(
    dbData: {
      conversations: Array<{
        id: string;
        agent_id: string;
        platform: string;
        client_id: string | null;
        escalated_to_human: boolean;
        created_at: string;
      }>;
      messages: Array<{
        id: string;
        convo_id: string;
        role: string;
        timestamp: string;
      }>;
      agent_stats: Array<{
        total_messages: number;
        unique_users: number;
        average_rating: number;
        response_rate: number;
        conversions_count: number;
      }>;
      message_metadata: Array<{ msg_id: string; sentiment?: string }>;
      training_data?: Array<{
        agent_id: string;
        content_type: string;
        title?: string;
        category?: string;
      }>;
      analytics_questions?: Array<{
        agent_id: string;
        question: string;
        count: number;
        category?: string;
      }>;
    },
    selectedAgentId: string = "all",
    timeRange: string = "30d"
  ): AnalyticsData {
    const {
      conversations,
      messages,
      agent_stats,
      message_metadata,
      training_data = [],
      analytics_questions = [],
    } = dbData;

    // Filter data based on selected agent
    const filteredConversations =
      selectedAgentId === "all"
        ? conversations
        : conversations.filter((c) => c.agent_id === selectedAgentId);

    const filteredMessages =
      selectedAgentId === "all"
        ? messages
        : messages.filter((m) =>
            filteredConversations.some((c) => c.id === m.convo_id)
          );

    // agent_stats may not include agent_id depending on source; keep all if missing
    type StatRecord = {
      total_messages: number;
      unique_users: number;
      average_rating: number;
      response_rate: number;
      conversions_count: number;
    } & { agent_id?: string };
    const statsWithPossibleId = agent_stats as StatRecord[];
    const filteredStats =
      selectedAgentId === "all"
        ? statsWithPossibleId
        : statsWithPossibleId.filter((s) => s.agent_id === selectedAgentId);

    const filteredMetadata =
      selectedAgentId === "all"
        ? message_metadata
        : message_metadata.filter((m) =>
            filteredMessages.some((msg) => msg.id === m.msg_id)
          );

    // Calculate metrics from real data
    const metrics = this.calculateMetrics(
      filteredStats,
      filteredConversations,
      filteredMessages
    );

    // Process time series data from actual messages
    const timeline = this.processTimeSeriesData(
      filteredMessages,
      filteredConversations,
      timeRange
    );

    // Process sentiment from message metadata
    const sentimentAnalysis = this.processSentimentData(
      filteredMetadata,
      timeRange
    );

    // Calculate platform distribution from conversations
    const platformDistribution = this.calculatePlatformDistribution(
      filteredConversations
    );

    // Get top questions from analytics_questions data
    const topQuestions = this.getTopQuestions(
      analytics_questions || training_data,
      selectedAgentId
    );

    // Calculate user satisfaction from stats
    const userSatisfaction = this.calculateUserSatisfaction(filteredStats);

    // Calculate hourly data from actual conversations
    const conversationsByHour = this.calculateHourlyData(filteredConversations);

    return {
      metrics,
      timeline,
      sentimentAnalysis,
      platformDistribution,
      topQuestions,
      userSatisfaction,
      conversationsByHour,
    };
  }

  private static calculateMetrics(
    stats: Array<{
      total_messages: number;
      unique_users: number;
      average_rating: number;
      response_rate: number;
      conversions_count: number;
    }>,
    conversations: Array<{
      client_id: string | null;
      escalated_to_human: boolean;
      created_at: string;
    }>,
    messages: Array<{ timestamp: string; role: string }>
  ): AnalyticsMetrics {
    const totalMessages =
      stats.length > 0
        ? stats.reduce((sum, stat) => sum + stat.total_messages, 0)
        : messages.length;

    const uniqueUsers =
      stats.length > 0
        ? stats.reduce((sum, stat) => sum + stat.unique_users, 0)
        : new Set(conversations.map((c) => c.client_id).filter(Boolean)).size;

    const avgRating =
      stats.length > 0
        ? stats.reduce((sum, stat) => sum + stat.average_rating, 0) /
          stats.length
        : 0;

    const responseRate =
      stats.length > 0
        ? stats.reduce((sum, stat) => sum + stat.response_rate, 0) /
          stats.length
        : 0;

    const conversionsCount = stats.reduce(
      (sum, stat) => sum + stat.conversions_count,
      0
    );

    // Calculate escalation rate from actual conversations
    const escalatedConversations = conversations.filter(
      (c) => c.escalated_to_human
    ).length;
    const escalationRate =
      conversations.length > 0
        ? escalatedConversations / conversations.length
        : 0;

    // Calculate average session duration from conversation timestamps
    // conversations array provided to calculateAvgSessionDuration needs id
    const conversationsWithId = conversations as Array<{
      id: string;
      created_at: string;
      client_id: string | null;
      escalated_to_human: boolean;
    }>;
    const messagesWithConvo = messages as Array<{
      id: string;
      convo_id: string;
      timestamp: string;
      role: string;
    }>;
    const avgSessionDuration = this.calculateAvgSessionDuration(
      conversationsWithId,
      messagesWithConvo
    );

    // Calculate average response time from message timestamps
    const avgResponseTime = this.calculateAvgResponseTime(messages);

    return {
      totalMessages,
      uniqueUsers,
      avgRating: Number(avgRating.toFixed(1)),
      responseRate: Number(responseRate.toFixed(2)),
      conversionsCount,
      escalationRate: Number(escalationRate.toFixed(2)),
      avgSessionDuration: Number(avgSessionDuration.toFixed(1)),
      avgResponseTime: Number(avgResponseTime.toFixed(1)),
    };
  }

  private static processTimeSeriesData(
    messages: Array<{ timestamp: string }>,
    conversations: Array<{ client_id: string | null; created_at: string }>,
    timeRange: string
  ): TimeSeriesData[] {
    const days = this.getDaysFromTimeRange(timeRange);
    const result: TimeSeriesData[] = [];

    for (let i = 0; i < days; i++) {
      const date = format(subDays(new Date(), days - 1 - i), "yyyy-MM-dd");

      // Count actual messages for this date
      const dayMessages = messages.filter((m) => {
        const msgDate = new Date(m.timestamp).toISOString().split("T")[0];
        return msgDate === date;
      }).length;

      // Count actual conversations for this date
      const dayConversations = conversations.filter((c) => {
        const convDate = new Date(c.created_at).toISOString().split("T")[0];
        return convDate === date;
      }).length;

      // Count unique users for this date
      const dayUsers = new Set(
        conversations
          .filter((c) => {
            const convDate = new Date(c.created_at).toISOString().split("T")[0];
            return convDate === date;
          })
          .map((c) => c.client_id)
          .filter(Boolean)
      ).size;

      result.push({
        date,
        messages: dayMessages,
        users: dayUsers,
        conversations: dayConversations,
      });
    }

    return result;
  }

  private static processSentimentData(
    messageMetadata: Array<{ sentiment?: string }>,
    timeRange: string
  ): SentimentData[] {
    const days = this.getDaysFromTimeRange(timeRange);
    const result: SentimentData[] = [];

    for (let i = 0; i < days; i++) {
      const date = format(subDays(new Date(), days - 1 - i), "yyyy-MM-dd");

      // Get sentiment data for this date from message metadata
      const dayMetadata = messageMetadata; // evenly distributed; no timestamp filtering available

      if (dayMetadata.length === 0) {
        result.push({ date, positive: 0, neutral: 0, negative: 0 });
        continue;
      }

      // Count sentiments from actual data
      const sentimentCounts = dayMetadata.reduce<Record<string, number>>(
        (acc, m) => {
          const sentiment = m.sentiment || "neutral";
          acc[sentiment] = (acc[sentiment] || 0) + 1;
          return acc;
        },
        {}
      );

      const total = dayMetadata.length;
      const positive = Math.round(
        ((sentimentCounts.positive || 0) / total) * 100
      );
      const negative = Math.round(
        ((sentimentCounts.negative ||
          sentimentCounts.frustrated ||
          sentimentCounts.dissatisfied ||
          0) /
          total) *
          100
      );
      const neutral = 100 - positive - negative;

      result.push({
        date,
        positive: Math.max(0, positive),
        neutral: Math.max(0, neutral),
        negative: Math.max(0, negative),
      });
    }

    return result;
  }

  private static calculatePlatformDistribution(
    conversations: Array<{ platform?: string }>
  ): PlatformData[] {
    if (conversations.length === 0) {
      return [];
    }

    const platformCounts = conversations.reduce<Record<string, number>>(
      (acc, conv) => {
        const platform = conv.platform || "Website";
        acc[platform] = (acc[platform] || 0) + 1;
        return acc;
      },
      {}
    );

    const total = conversations.length;

    return Object.entries(platformCounts).map(([platform, count]) => ({
      platform,
      percentage: Number(((count / total) * 100).toFixed(1)),
      count,
    }));
  }

  private static getTopQuestions(
    questionsData: Array<{
      agent_id: string;
      question?: string;
      count?: number;
      category?: string;
      content_type?: string;
      title?: string;
    }>,
    selectedAgentId: string
  ): TopQuestion[] {
    if (!questionsData || questionsData.length === 0) {
      return [];
    }

    // Check if this is analytics_questions data (has count field) or training_data
    const isAnalyticsQuestions = questionsData.some((item) => "count" in item);

    if (isAnalyticsQuestions) {
      // Handle analytics_questions data
      const filteredData =
        selectedAgentId === "all"
          ? questionsData
          : questionsData.filter((q) => q.agent_id === selectedAgentId);

      return filteredData
        .filter(
          (
            item
          ): item is {
            agent_id: string;
            question: string;
            count: number;
            category?: string;
          } =>
            typeof item.question === "string" && typeof item.count === "number"
        )
        .map((item) => ({
          question: item.question,
          count: item.count,
          category: item.category || "General",
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);
    } else {
      // Handle training_data (legacy)
      const filteredData =
        selectedAgentId === "all"
          ? questionsData
          : questionsData.filter((t) => t.agent_id === selectedAgentId);

      // Extract questions from training data
      const questionCounts: {
        [key: string]: { count: number; category: string };
      } = {};

      filteredData.forEach((item) => {
        if (item.content_type === "faq" && item.title) {
          const question = item.title;
          const category = item.category || "General";

          if (!questionCounts[question]) {
            questionCounts[question] = { count: 0, category };
          }
          questionCounts[question].count += 1;
        }
      });

      // Convert to array and sort by count
      return Object.entries(questionCounts)
        .map(([question, data]) => ({
          question,
          count: data.count,
          category: data.category,
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);
    }
  }

  private static calculateUserSatisfaction(
    stats: Array<{ unique_users: number; average_rating: number }>
  ): UserSatisfaction {
    if (stats.length === 0) {
      return {
        satisfied: 0,
        neutral: 0,
        unsatisfied: 0,
      };
    }

    // Calculate based on actual ratings from stats
    const totalUsers = stats.reduce((sum, stat) => sum + stat.unique_users, 0);
    const avgRating =
      stats.reduce((sum, stat) => sum + stat.average_rating, 0) / stats.length;

    if (totalUsers === 0) {
      return { satisfied: 0, neutral: 0, unsatisfied: 0 };
    }

    // Distribute users based on actual average rating
    const satisfied = Math.floor(
      totalUsers * (avgRating >= 4 ? 0.7 : avgRating >= 3 ? 0.5 : 0.3)
    );
    const unsatisfied = Math.floor(
      totalUsers * (avgRating <= 2 ? 0.4 : avgRating <= 3 ? 0.2 : 0.1)
    );
    const neutral = totalUsers - satisfied - unsatisfied;

    return {
      satisfied: Math.max(0, satisfied),
      neutral: Math.max(0, neutral),
      unsatisfied: Math.max(0, unsatisfied),
    };
  }

  private static calculateHourlyData(
    conversations: Array<{ created_at: string }>
  ): number[] {
    const hourlyData = new Array(24).fill(0);

    conversations.forEach((conv) => {
      const hour = new Date(conv.created_at).getHours();
      hourlyData[hour]++;
    });

    return hourlyData;
  }

  private static calculateAvgSessionDuration(
    conversations: Array<{ id: string; created_at: string }>,
    messages: Array<{ convo_id: string; timestamp: string }>
  ): number {
    if (conversations.length === 0) return 0;

    let totalDuration = 0;
    let validSessions = 0;

    conversations.forEach((conv) => {
      const convMessages = messages.filter((m) => m.convo_id === conv.id);
      if (convMessages.length > 1) {
        const firstMsg = new Date(convMessages[0].timestamp);
        const lastMsg = new Date(
          convMessages[convMessages.length - 1].timestamp
        );
        const duration = (lastMsg.getTime() - firstMsg.getTime()) / (1000 * 60); // minutes
        if (duration > 0 && duration < 1440) {
          // Less than 24 hours
          totalDuration += duration;
          validSessions++;
        }
      }
    });

    return validSessions > 0 ? totalDuration / validSessions : 0;
  }

  private static calculateAvgResponseTime(
    messages: Array<{ role: string; timestamp: string }>
  ): number {
    if (messages.length < 2) return 0;

    let totalResponseTime = 0;
    let responseCount = 0;

    for (let i = 1; i < messages.length; i++) {
      const prevMsg = messages[i - 1];
      const currentMsg = messages[i];

      if (prevMsg.role === "user" && currentMsg.role === "assistant") {
        const responseTime =
          (new Date(currentMsg.timestamp).getTime() -
            new Date(prevMsg.timestamp).getTime()) /
          1000;
        if (responseTime > 0 && responseTime < 300) {
          // Less than 5 minutes
          totalResponseTime += responseTime;
          responseCount++;
        }
      }
    }

    return responseCount > 0 ? totalResponseTime / responseCount : 0;
  }

  private static getDaysFromTimeRange(timeRange: string): number {
    switch (timeRange) {
      case "7d":
        return 7;
      case "30d":
        return 30;
      case "90d":
        return 90;
      default:
        return 30;
    }
  }
}
