import { NextRequest, NextResponse } from "next/server";
import fs from 'fs';
import path from 'path';

// Mock data loader and saver
function loadMockData() {
  const dbPath = path.join(process.cwd(), 'mock-data', 'db.json');
  const data = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
  return data;
}

function saveMockData(data: any) {
  const dbPath = path.join(process.cwd(), 'mock-data', 'db.json');
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; actionId: string }> }
) {
  const { id, actionId } = await params;

  try {
    const mockData = loadMockData();
    let actionFound = false;
    
    // Check in custom_actions
    if (mockData.custom_actions) {
      const actionIndex = mockData.custom_actions.findIndex(
        (action: any) => action.id === actionId && action.agentId === id
      );
      if (actionIndex !== -1) {
        mockData.custom_actions[actionIndex].status = 
          mockData.custom_actions[actionIndex].status === 'active' ? 'inactive' : 'active';
        mockData.custom_actions[actionIndex].updated_at = new Date().toISOString();
        actionFound = true;
      }
    }
    
    // Check in system_actions
    if (!actionFound && mockData.system_actions) {
      const actionIndex = mockData.system_actions.findIndex(
        (action: any) => action.id === actionId
      );
      if (actionIndex !== -1) {
        mockData.system_actions[actionIndex].status = 
          mockData.system_actions[actionIndex].status === 'active' ? 'inactive' : 'active';
        mockData.system_actions[actionIndex].updated_at = new Date().toISOString();
        actionFound = true;
      }
    }
    
    if (!actionFound) {
      return NextResponse.json({ error: "Action not found" }, { status: 404 });
    }
    
    saveMockData(mockData);
    
    return NextResponse.json({
      success: true,
      message: "Action status toggled successfully"
    });
  } catch (error) {
    console.error('Error toggling action:', error);
    return NextResponse.json({ error: "Failed to toggle action" }, { status: 500 });
  }
}