import { Conversation } from "@/types/conversations";
import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  context: unknown
): Promise<
  NextResponse<{ success: boolean; data?: Conversation[]; error?: string }>
> {
  const { id: agent_id } = (context as { params: { id: string } }).params;
  try {
    // FIXME: Use api call to db
    const conversations = await fetch("http://localhost:3001/conversations", {
      method: "GET",
    }).then(async (res) => {
      if (!res.ok) throw new Error("Failed to fetch conversations");
      return (await res.json()) as Conversation[];
    });

    const result = conversations.filter((convo) => convo.agent_id === agent_id);
    return NextResponse.json({ success: true, data: result }, { status: 200 });
  } catch {
    return NextResponse.json(
      { success: false, error: "conversation not found" },
      { status: 404 }
    );
  }
}
