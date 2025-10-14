import { NextRequest, NextResponse } from "next/server";
import { readFileSync } from "fs";
import { join } from "path";
import { AnalyticsProcessor } from "@/lib/analytics";
import type { Agent } from "@/types/agent";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get("timeRange") || "30d";
    const agentId = searchParams.get("agentId") || "all";

    // Read data from mock database
    const dbPath = join(process.cwd(), "mock-data", "db.json");
    const dbData = JSON.parse(readFileSync(dbPath, "utf8"));

    // Process analytics data
    const analyticsData = AnalyticsProcessor.processDbData(
      dbData,
      agentId,
      timeRange
    );

    // Format response
    const response = {
      metrics: analyticsData.metrics,
      timeline: analyticsData.timeline,
      topQuestions: analyticsData.topQuestions,
      userSatisfaction: analyticsData.userSatisfaction,
      platformDistribution: analyticsData.platformDistribution,
      sentimentAnalysis: analyticsData.sentimentAnalysis,
      conversationsByHour: analyticsData.conversationsByHour,
      agents: (dbData.agents as Agent[]).map((agent) => ({
        id: agent.id,
        name: agent.name,
      })),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Analytics API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics data" },
      { status: 500 }
    );
  }
}
