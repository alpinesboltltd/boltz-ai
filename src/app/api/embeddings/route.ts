import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { vectorStore } from "./vectorStore";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// Global vector store
// Using shared vectorStore from helper module

function chunkText(text: string, chunkSize: number = 500): string[] {
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);
  const chunks: string[] = [];
  let currentChunk = "";

  for (const sentence of sentences) {
    if (currentChunk.length + sentence.length > chunkSize && currentChunk) {
      chunks.push(currentChunk.trim());
      currentChunk = sentence;
    } else {
      currentChunk += (currentChunk ? ". " : "") + sentence;
    }
  }

  if (currentChunk) chunks.push(currentChunk.trim());
  return chunks;
}

interface EmbeddingPostResponse {
  success?: boolean;
  chunksProcessed?: number;
  error?: string;
}
export async function POST(
  request: Request
): Promise<NextResponse<EmbeddingPostResponse>> {
  try {
    const { text, agentId, sourceId } = await request.json();

    if (!text || !agentId || !sourceId) {
      return NextResponse.json(
        { error: "Text, agentId, and sourceId are required" },
        { status: 400 }
      );
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "API key not configured" },
        { status: 500 }
      );
    }

    const model = genAI.getGenerativeModel({ model: "text-embedding-004" });
    const chunks = chunkText(text);
    const embeddings: number[][] = [];

    // Generate embeddings for each chunk
    for (const chunk of chunks) {
      const result = await model.embedContent(chunk);
      embeddings.push(result.embedding.values || []);
    }

    // Store in global vector store
    if (!vectorStore[agentId]) {
      vectorStore[agentId] = {};
    }
    vectorStore[agentId][sourceId] = { chunks, embeddings };

    return NextResponse.json({ success: true, chunksProcessed: chunks.length });
  } catch (error) {
    console.error("Error generating embeddings:", error);
    return NextResponse.json(
      { error: "Failed to generate embeddings" },
      { status: 500 }
    );
  }
}

// GET endpoint to retrieve vector store data
interface EmbeddingGetResponse {
  success: boolean;
  vectorStore?: unknown;
  error?: string;
}
export async function GET(
  request: Request
): Promise<NextResponse<EmbeddingGetResponse>> {
  const url = new URL(request.url);
  const agentId = url.searchParams.get("agentId");

  if (!agentId) {
    return NextResponse.json(
      { success: false, error: "Agent ID is required" },
      { status: 400 }
    );
  }

  return NextResponse.json({
    success: true,
    vectorStore: vectorStore[agentId] || {},
  });
}

// Do not export additional helpers from this route file to satisfy Next.js route type constraints.
