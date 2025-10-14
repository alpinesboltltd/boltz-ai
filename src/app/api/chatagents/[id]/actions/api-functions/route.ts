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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const mockData = loadMockData();

    // Get API functions for the specific agent
    const apiFunctions =
      mockData.api_functions?.filter((func: any) => func.agentId === id) || [];

    return NextResponse.json({
      success: true,
      data: apiFunctions,
    });
  } catch (error) {
    console.error("Error fetching API functions:", error);
    return NextResponse.json(
      { error: "Failed to fetch API functions" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();

  try {
    const mockData = loadMockData();

    // Create new API function
    const newApiFunction = {
      id: `api_func_${Date.now()}`,
      agentId: id,
      ...body,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Add to api_functions array
    if (!mockData.api_functions) {
      mockData.api_functions = [];
    }
    mockData.api_functions.push(newApiFunction);

    // Save updated data
    saveMockData(mockData);

    return NextResponse.json({
      success: true,
      message: "API function created successfully",
      data: newApiFunction,
    });
  } catch (error) {
    console.error("Error creating API function:", error);
    return NextResponse.json(
      { error: "Failed to create API function" },
      { status: 500 }
    );
  }
}
