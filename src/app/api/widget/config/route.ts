import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const agentId = searchParams.get("agentId");

  if (!agentId) {
    return NextResponse.json(
      { error: "Agent ID is required" },
      { status: 400 }
    );
  }

  const apiUrl = process.env.API_BASE_URL;

  try {
    // Parallel fetch for agent data and appearance
    const [agentRes, appearanceRes] = await Promise.all([
      fetch(`${apiUrl}/api/v1/agent/${agentId}`, {
        headers: {
          "Content-Type": "application/json",
          // Add any necessary internal auth headers here if needed
        },
      }),
      fetch(`${apiUrl}/api/v1/agent/${agentId}/appearance`, {
        headers: {
          "Content-Type": "application/json",
        },
      }),
    ]);

    // We expect both to succeed for a full config, but we can be resilient
    const agentData = await agentRes.json().catch(() => ({}));
    const appearanceData = await appearanceRes.json().catch(() => ({}));

    // Merge relevant data
    const config = {
      name: agentData.agent?.name || "Chat with us",
      ...appearanceData.appearance,
    };
    console.log(config, "aconfig");

    return NextResponse.json({ data: config });
  } catch (error) {
    console.error("Config proxy error:", error);
    return NextResponse.json(
      { error: "Failed to fetch configuration" },
      { status: 500 }
    );
  }
}
