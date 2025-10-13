/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  console.log(id);

  try {
    // Mock activity data - replace with real DB query
    const activities = [
      {
        id: "1",
        type: "conversation",
        title: "New conversation started",
        description: "User asked about product pricing",
        timestamp: new Date().toISOString(),
        user: "Anonymous User",
        platform: "Website",
        status: "success",
      },
      {
        id: "2",
        type: "training",
        title: "Knowledge base updated",
        description: "Added new FAQ about shipping policies",
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        status: "success",
      },
    ];

    return NextResponse.json({ success: true, data: activities });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to fetch activity" },
      { status: 500 }
    );
  }
}
