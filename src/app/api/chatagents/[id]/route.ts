import { integrations } from "@/mock-data/integrations";
import {
  AgentAppearance,
  AgentBehavior,
  AgentIntegration,
  AgentStats,
  TrainingData,
} from "@/types/agent";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    // FIXME: use api call to db
    const [stats, training, appearance, behavior, integration] =
      await Promise.all([
        await fetch("http://localhost:3001/agent_stats", {
          method: "GET",
        }).then((res) => res.json() as unknown as AgentStats[]),
        await fetch("http://localhost:3001/training_data", {
          method: "GET",
        }).then((res) => res.json() as unknown as TrainingData[]),
        await fetch("http://localhost:3001/agent_appearance", {
          method: "GET",
        }).then((res) => res.json() as unknown as AgentAppearance[]),
        await fetch("http://localhost:3001/agent_behavior", {
          method: "GET",
        }).then((res) => res.json() as unknown as AgentBehavior[]),
        fetch("http://localhost:3001/agent_integrations", {
          method: "GET",
        }).then((res) => res.json() as unknown as AgentIntegration[]),
      ]);

    const agentStats = stats.find((stat) => stat.agent_id === id);

    if (!agentStats) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 });
    }

    const chatagentData = {
      stats: agentStats,
      training_data: training.find((t) => t.agent_id === id),
      appearance: appearance.find((a) => a.agent_id === id),
      behavior: behavior.find((b) => b.agent_id === id),
      integrations: integration.find((i) => i.agent_id === id),
    };
    return NextResponse.json({
      success: true,
      data: chatagentData,
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
