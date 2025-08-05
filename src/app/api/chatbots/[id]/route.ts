import { integrations } from "@/mock-data/integrations";
import {
  ChatbotAppearance,
  ChatbotBehavior,
  ChatbotIntegration,
  ChatbotStats,
  TrainingData,
} from "@/types/chatbot";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // FIXME: BUG WITH NOT AWAITING BEFORE ASSESSING ID
  const id = params.id;
  try {
    // FIXME: use api call to db
    const [stats, training, appearance, behavior, integration] =
      await Promise.all([
        await fetch("http://localhost:3001/chatbot_stats", {
          method: "GET",
        }).then((res) => res.json() as unknown as ChatbotStats[]),
        await fetch("http://localhost:3001/training_data", {
          method: "GET",
        }).then((res) => res.json() as unknown as TrainingData[]),
        await fetch("http://localhost:3001/chatbot_appearance", {
          method: "GET",
        }).then((res) => res.json() as unknown as ChatbotAppearance[]),
        await fetch("http://localhost:3001/chatbot_behavior", {
          method: "GET",
        }).then((res) => res.json() as unknown as ChatbotBehavior[]),
        fetch("http://localhost:3001/chatbot_integrations", {
          method: "GET",
        }).then((res) => res.json() as unknown as ChatbotIntegration[]),
      ]);

    const chatbotData = stats.map((stat) => {
      const id = stat.chatbot_id;
      return {
        stats: stat,
        training_data: training.find((t) => t.chatbot_id === id),
        appearance: appearance.find((a) => a.chatbot_id === id),
        chatbot_behavior: behavior.find((b) => b.chatbot_id === id),
        integrations: integration.find((i) => i.chatbot_id === id),
      };
    });

    // TODO: filter to just the one ID
    const result = chatbotData.find((bot) => bot.stats.chatbot_id === id);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    return NextResponse.json({ error: "Item not found" }, { status: 404 });
  }
}

// You can also add other HTTP methods
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  const body = await request.json();

  // Update logic here

  return NextResponse.json({
    message: `Updated item ${id}`,
    data: body,
  });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  // Delete logic here

  return NextResponse.json({
    message: `Deleted item ${id}`,
  });
}
