import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Schema matching db.json structure
const createAgentSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  agent_type: z.enum(["text", "voice", "multimodal"]),
  ai_model: z.string().min(1),
  ai_provider: z.string().min(1),
  credits_per_1k: z.number(),
  status: z.enum(["active", "draft", "inactive"]).default("draft"),
  primary_color: z.string().default("#0ea5e9"),
  font_family: z.string().default("Inter"),
  chat_icon: z.string().default("chat-bubble"),
  welcome_message: z.string().min(1),
  position: z.enum(["bottom-right", "bottom-left"]).default("bottom-right"),
  icon_size: z.enum(["small", "medium", "large"]).default("medium"),
  bubble_style: z.enum(["round", "square"]).default("round"),
});

// Mock database - replace with real DB
let nextId = 9; // Starting after existing agents in db.json

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = createAgentSchema.parse(body);
    
    const agentId = nextId.toString();
    const now = new Date().toISOString();

    // Create agent record
    const agent = {
      id: agentId,
      user_id: "1", // Get from auth in production
      name: data.name,
      description: data.description,
      agent_type: data.agent_type,
      ai_model: data.ai_model,
      ai_provider: data.ai_provider,
      credits_per_1k: data.credits_per_1k,
      status: data.status,
      created_at: now,
      updated_at: now,
    };

    // Create appearance record
    const appearance = {
      id: nextId.toString(),
      agent_id: agentId,
      primary_color: data.primary_color,
      font_family: data.font_family,
      chat_icon: data.chat_icon,
      welcome_message: data.welcome_message,
      position: data.position,
      icon_size: data.icon_size,
      bubble_style: data.bubble_style,
      created_at: now,
      updated_at: now,
    };

    // Create behavior record
    const behavior = {
      id: nextId.toString(),
      agent_id: agentId,
      initial_messages: JSON.stringify([data.welcome_message]),
      fallback_message: "I'm sorry, I don't understand that question. Could you rephrase it?",
      enable_human_handoff: false,
      offline_message: "Our support team is currently offline. Please leave a message and we'll get back to you.",
      created_at: now,
      updated_at: now,
    };

    // Create stats record
    const stats = {
      id: nextId.toString(),
      agent_id: agentId,
      total_messages: 0,
      unique_users: 0,
      average_rating: 0,
      response_rate: 0,
      conversions_count: 0,
      last_calculated_at: now,
    };

    nextId++;

    // In production, save to database
    console.log("Created agent:", { agent, appearance, behavior, stats });

    return NextResponse.json({
      success: true,
      data: {
        agent,
        appearance,
        behavior,
        stats,
      },
    }, { status: 201 });

  } catch (error) {
    console.error("Error creating agent:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: "Validation error",
        details: error.errors,
      }, { status: 400 });
    }

    return NextResponse.json({
      success: false,
      error: "Internal server error",
    }, { status: 500 });
  }
}

export async function GET() {
  // In production, fetch from database
  return NextResponse.json({
    success: true,
    data: [], // Return agents from database
  });
}