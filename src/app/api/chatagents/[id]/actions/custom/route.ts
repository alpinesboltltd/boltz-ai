/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Mock data loader and saver
function loadMockData() {
  const dbPath = path.join(process.cwd(), "mock-data", "db.json");
  const data = JSON.parse(fs.readFileSync(dbPath, "utf8"));
  return data;
}

function saveMockData(data: any) {
  const dbPath = path.join(process.cwd(), "mock-data", "db.json");
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();

  try {
    const mockData = loadMockData();

    // Create new custom action
    const newAction = {
      id: `custom_${Date.now()}`,
      agentId: id,
      ...body,
      category: "custom",
      isBuiltIn: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Add to custom_actions array
    if (!mockData.custom_actions) {
      mockData.custom_actions = [];
    }
    mockData.custom_actions.push(newAction);

    // Save updated data
    saveMockData(mockData);

    return NextResponse.json({
      success: true,
      message: "Custom action created successfully",
      data: newAction,
    });
  } catch (error) {
    console.error("Error creating custom action:", error);
    return NextResponse.json(
      { error: "Failed to create custom action" },
      { status: 500 }
    );
  }
}
