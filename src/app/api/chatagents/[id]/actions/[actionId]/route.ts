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
  const url = new URL(request.url);
  const operation = url.pathname.split('/').pop();

  try {
    const mockData = loadMockData();
    
    if (operation === 'toggle') {
      // Toggle action status
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
    }
    
    return NextResponse.json({ error: "Invalid operation" }, { status: 400 });
  } catch (error) {
    console.error('Error updating action:', error);
    return NextResponse.json({ error: "Failed to update action" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; actionId: string }> }
) {
  const { id, actionId } = await params;

  try {
    const mockData = loadMockData();
    
    // Delete from custom_actions
    if (mockData.custom_actions) {
      const actionIndex = mockData.custom_actions.findIndex(
        (action: any) => action.id === actionId && action.agentId === id
      );
      
      if (actionIndex !== -1) {
        mockData.custom_actions.splice(actionIndex, 1);
        saveMockData(mockData);
        
        return NextResponse.json({
          success: true,
          message: "Action deleted successfully"
        });
      }
    }
    
    return NextResponse.json({ error: "Action not found" }, { status: 404 });
  } catch (error) {
    console.error('Error deleting action:', error);
    return NextResponse.json({ error: "Failed to delete action" }, { status: 500 });
  }
}