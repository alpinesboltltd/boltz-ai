import { ChatMessage } from "@/types/conversations";
import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  context: unknown
): Promise<
  NextResponse<{ success: boolean; data?: ChatMessage[]; error?: string }>
> {
  const { id: convo_id } = (context as { params: { id: string } }).params;
  try {
    // FIXME: Use api call to db
    const messages = await fetch("http://localhost:3001/messages", {
      method: "GET",
    }).then(async (res) => {
      if (!res.ok) throw new Error("Failed to fetch messages");
      return (await res.json()) as ChatMessage[];
    });
    const result = messages.filter((message) => message.convo_id === convo_id);
    return NextResponse.json({ success: true, data: result }, { status: 200 });
  } catch {
    return NextResponse.json(
      { success: false, error: "conversation not found" },
      { status: 404 }
    );
  }
}
