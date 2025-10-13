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

    // Create new sequential workflow as a custom action
    const newWorkflow = {
      id: `workflow_${Date.now()}`,
      agentId: id,
      name: body.name,
      description: body.description,
      category: "custom",
      type: "workflow",
      status: "active",
      triggers: [body.trigger],
      steps: body.steps.map((step: any, index: number) => ({
        id: step.id || `step_${index + 1}`,
        type: step.type,
        config: {
          name: step.name,
          ...step,
        },
        nextStep: step.onSuccess || null,
      })),
      isBuiltIn: false,
      workflowConfig: {
        nodes: body.steps.map((step: any, index: number) => ({
          id: step.id || `step_${index + 1}`,
          type: step.type,
          position: { x: index * 200, y: 100 },
          data: {
            label: step.name,
            config: step,
          },
        })),
        connections: body.steps
          .map((step: any, index: number) => {
            if (step.onSuccess && index < body.steps.length - 1) {
              return {
                id: `conn_${index}`,
                source: step.id || `step_${index + 1}`,
                target: step.onSuccess,
              };
            }
            return null;
          })
          .filter(Boolean),
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Add to custom_actions array
    if (!mockData.custom_actions) {
      mockData.custom_actions = [];
    }
    mockData.custom_actions.push(newWorkflow);

    // Save updated data
    saveMockData(mockData);

    return NextResponse.json({
      success: true,
      message: "Sequential workflow created successfully",
      data: newWorkflow,
    });
  } catch (error) {
    console.error("Error creating workflow:", error);
    return NextResponse.json(
      { error: "Failed to create workflow" },
      { status: 500 }
    );
  }
}
