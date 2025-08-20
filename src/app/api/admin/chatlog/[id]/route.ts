import { ChatMessage, Conversation } from "@/types/conversations";
import { NextResponse } from "next/server";
import { id } from "zod/v4/locales";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id: agent_id } = await params;
  try {
    // FIXME: Use api call to db
    const conversations = await fetch("http://localhost:3001/conversations", {
      method: "GET",
    }).then((res) => res.json() as unknown as Conversation[]);

    const result = conversations.filter((convo) => convo.agent_id === agent_id);

    console.log(result);
    return NextResponse.json({ success: true, data: result }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "conversation not found" },
      { status: 404 }
    );
  }
}
