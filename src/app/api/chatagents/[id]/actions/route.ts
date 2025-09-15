import { NextRequest, NextResponse } from "next/server";
import { AgentActions, CoreAction, SystemAction, CustomAction } from "@/types/actions";
import fs from 'fs';
import path from 'path';

// Mock data loader - replace with real DB in production
function loadMockData() {
  const dbPath = path.join(process.cwd(), 'mock-data', 'db.json');
  const data = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
  return data;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const mockData = loadMockData();
    
    // Get actions for the specific agent
    const coreActions: CoreAction[] = mockData.core_actions || [];
    const systemActions: SystemAction[] = mockData.system_actions || [];
    const customActions: CustomAction[] = mockData.custom_actions?.filter(
      (action: CustomAction) => action.agentId === id
    ) || [];
    const apiFunctions = mockData.api_functions?.filter(
      (func: any) => func.agentId === id
    ) || [];
    const integrationProviders = mockData.integration_providers || [];

    const actions: AgentActions = {
      coreActions,
      systemActions,
      customActions,
      apiFunctions,
      integrationProviders,
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

  try {
    // TODO: Update actions in database
    return NextResponse.json({
      success: true,
      message: `Updated actions for agent ${id}`,
      data: body,
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update actions" }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();

  try {
    // TODO: Create new custom action in database
    const newAction = {
      id: `custom_${Date.now()}`,
      agentId: id,
      ...body,
      category: "custom",
      isBuiltIn: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      message: "Custom action created successfully",
      data: newAction,
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create action" }, { status: 500 });
  }
}