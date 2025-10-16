import { NextRequest, NextResponse } from "next/server";
import { AgentSources } from "@/types/sources";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    // Mock sources data - replace with real DB query
    const sources: AgentSources = {
      files: [
        {
          id: "1",
          agent_id: id,
          name: "FAQ.pdf",
          size: 1024000,
          type: "pdf",
          status: "processed",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: "2",
          agent_id: id,
          name: "policies.txt",
          size: 512000,
          type: "txt",
          status: "processed",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ],
      websites: [
        {
          id: "1",
          agent_id: id,
          url: "https://example.com",
          title: "Example Website",
          pages_crawled: 5,
          status: "crawled",
          crawl_type: "recursive",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ],
      texts: [
        {
          id: "1",
          agent_id: id,
          title: "Company Policies",
          content: "Our company policies...",
          status: "active",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ],
      qaItems: [
        {
          id: "1",
          agent_id: id,
          question: "What are your hours?",
          answer: "9 AM to 5 PM",
          status: "active",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ],
      totalSize: 1536000,
      maxSize: 400000000, // 400MB
    };

    return NextResponse.json({ success: true, data: sources });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to fetch sources" },
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

  // TODO: Add source to database
  return NextResponse.json({
    success: true,
    message: `Added source for agent ${id}`,
    data: body,
  });
}
