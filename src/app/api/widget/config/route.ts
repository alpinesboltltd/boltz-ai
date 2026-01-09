import { NextResponse } from "next/server";

// CORS headers for widget endpoints (allows embedding on any domain)
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

// Handle preflight requests
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const agentId = searchParams.get("agentId");
  console.log("AGENT ID", agentId);

  if (!agentId) {
    return NextResponse.json(
      { error: "Agent ID is required" },
      { status: 400, headers: corsHeaders }
    );
  }

  const apiUrl = process.env.API_BASE_URL || "http://localhost:8080";

  try {
    // Call the public widget config endpoint on the Go service
    const response = await fetch(
      `${apiUrl}/api/v1/widget/config?agentId=${agentId}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log("requests,requests");

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Widget config error:", errorText);
      return NextResponse.json(
        { error: "Failed to fetch configuration" },
        { status: response.status, headers: corsHeaders }
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { headers: corsHeaders });
  } catch (error) {
    console.error("Config proxy error:", error);
    return NextResponse.json(
      { error: "Failed to fetch configuration" },
      { status: 500, headers: corsHeaders }
    );
  }
}
