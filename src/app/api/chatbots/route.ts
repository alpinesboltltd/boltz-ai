import { Chatbot } from "@/types/chatbot";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { userId } = await request.json();
  if (!userId) {
    return NextResponse.json(
      { success: false, message: "user id is required", data: null },
      { status: 400 }
    );
  }

  try {
    // TODO: Replace with supabase data fetch

    const response = await fetch("http://localhost:3001/chatbots", {
      method: "GET",
    });
    const chatbot = (await response.json()) as Chatbot[];
    const data = chatbot.filter((cb) => cb.user_id === userId);
    return NextResponse.json(
      { success: true, message: "Request successful", data },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { success: true, message: "Request failed", data: null },
      { status: 500 }
    );
  }
}
