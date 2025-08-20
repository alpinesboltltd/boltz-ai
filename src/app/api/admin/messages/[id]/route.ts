import { ChatMessage, Conversation } from "@/types/conversations";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id: convo_id } = await params;
  try {
    // FIXME: Use api call to db
    const messages = await fetch("http://localhost:3001/messages", {
      method: "GET",
    }).then((res) => res.json() as unknown as ChatMessage[]);
    let result = messages.filter((message) => message.convo_id === convo_id);
    return NextResponse.json({ success: true, data: result }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "conversation not found" },
      { status: 404 }
    );
  }
}
