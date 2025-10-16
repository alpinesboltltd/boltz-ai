import { AgentAppearance } from "@/types/agent";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const response = await fetch("http://localhost:3001/agent_appearance");
    const appearances = (await response.json()) as AgentAppearance[];
    const appearance = appearances.find((a) => a.agent_id === id);
    console.log(appearance);

    if (!appearance) {
      return NextResponse.json(
        { error: "Appearance not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: appearance });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to fetch appearance" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();

  // TODO: Update appearance in database
  return NextResponse.json({
    success: true,
    message: `Updated appearance for agent ${id}`,
    data: body,
  });
}
