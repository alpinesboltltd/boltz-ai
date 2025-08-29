import { NextRequest, NextResponse } from "next/server";
import { AgentActions } from "@/types/actions";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    // Mock actions/integrations data - replace with real DB query
    const actions: AgentActions = {
      integrations: [
        {
          id: "slack",
          name: "Slack",
          platform: "slack",
          status: "disconnected",
          enabled: false
        },
        {
          id: "whatsapp",
          name: "WhatsApp",
          platform: "whatsapp",
          status: "disconnected",
          enabled: false
        },
        {
          id: "messenger",
          name: "Messenger",
          platform: "messenger",
          status: "disconnected",
          enabled: false
        }
      ],
      embedSettings: {
        isPublic: false,
        embedCode: `<script src="/embed/${id}.js"></script>`,
        allowedDomains: [],
        customization: {
          theme: "light",
          position: "bottom-right",
          showBranding: true
        }
      },
      shareSettings: {
        isPublic: false,
        shareUrl: `https://chat.example.com/${id}`
      }
    };

    return NextResponse.json({ success: true, data: actions });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch actions" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();

  // TODO: Update actions/integrations in database
  return NextResponse.json({
    success: true,
    message: `Updated actions for agent ${id}`,
    data: body,
  });
}