import { ChatHistoryItem, MessageRoles } from "@/types/agent";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

interface VectorStore {
  [sourceId: string]: {
    chunks: string[];
    embeddings: number[][];
  };
}

// Import the vector store directly from embeddings module
import { getVectorStore as getGlobalVectorStore } from "../embeddings/route";

// Get vector store from embeddings route
function getVectorStore(agentId: string): VectorStore {
  try {
    const globalStore = getGlobalVectorStore();
    return globalStore[agentId] || {};
  } catch (error) {
    console.error("Error accessing vector store:", error);
    return {};
  }
}

function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) return 0;

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
    const model = genAI.getGenerativeModel({ model: "text-embedding-004" });
    const result = await model.embedContent(text);
    return result.embedding.values || [];
  } catch (error) {
    console.error("Error generating embedding:", error);
    return [];
  }
}

async function retrieveRelevantContext(
  query: string,
  agentId: string,
  topK: number = 3
): Promise<string[]> {
  const queryEmbedding = await generateEmbedding(query);
  if (queryEmbedding.length === 0) return [];

  const agentVectorStore = getVectorStore(agentId);
  if (!agentVectorStore || Object.keys(agentVectorStore).length === 0)
    return [];

  const similarities: { chunk: string; similarity: number }[] = [];

  // Calculate similarities for all chunks across all sources
  Object.values(agentVectorStore).forEach(
    (source: { chunks: string[]; embeddings: number[][] }) => {
      source.chunks.forEach((chunk: string, index: number) => {
        if (source.embeddings[index]) {
          const similarity = cosineSimilarity(
            queryEmbedding,
            source.embeddings[index]
          );
          similarities.push({ chunk, similarity });
        }
      });
    }
  );

  // Sort by similarity and return top K chunks
  return similarities
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, topK)
    .filter((item) => item.similarity > 0.3) // Minimum similarity threshold
    .map((item) => item.chunk);
}

export async function POST(request: Request) {
  const { message, history, agentId } = await request.json();

  if (!message) {
    return NextResponse.json({ error: "Message is required" }, { status: 400 });
  }

  // Fetch agent behavior config from db.json
  let temperature = 0.7;
  let maxTokens = 500;
  let systemInstruction = "You are a helpful AI assistant.";

  try {
    const behaviorResponse = await fetch(
      `http://localhost:3001/agent_behavior?agent_id=${agentId}`
    );
    const behaviorData = await behaviorResponse.json();
    if (behaviorData.length > 0) {
      const behavior = behaviorData[0];
      temperature = behavior.temperature || 0.7;
      maxTokens = behavior.max_tokens || 500;
      systemInstruction =
        behavior.system_instruction || "You are a helpful AI assistant.";
    }
  } catch (error) {
    console.error("Failed to fetch agent behavior:", error);
  }

  // Limit history length
  if (history.length > 10) {
    history.splice(0, history.length - 10);
  }

  const geminiApiKey = process.env.GEMINI_API_KEY;

  if (!geminiApiKey) {
    console.error("GEMINI_API_KEY is not set in environment variables.");
    return NextResponse.json(
      { error: "Server configuration error: API key missing." },
      { status: 500 }
    );
  }

  try {
    // Retrieve relevant context from vector store
    const relevantContext = await retrieveRelevantContext(message, agentId);

    // Build context-aware prompt
    let contextPrompt = message;
    if (relevantContext.length > 0) {
      const contextText = relevantContext.join("\n\n");
      console.log(contextText);
      contextPrompt = `Context information:
${contextText}

Based on the above context, please answer the following question. If the context doesn't contain relevant information, answer based on your general knowledge but mention that you don't have specific information about this topic in your knowledge base.

Question: ${message}`;
    }

    const genAI = new GoogleGenerativeAI(geminiApiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Filter and prepare chat history
    const chatHistory = history.filter((item: any) => item.role !== "system");

    // Ensure first message is from user
    while (
      chatHistory.length > 0 &&
      chatHistory[0].role !== MessageRoles.USER
    ) {
      chatHistory.shift();
    }

    const chat = model.startChat({
      history: (chatHistory as ChatHistoryItem[]).map((item) => ({
        role:
          item.role === MessageRoles.USER
            ? MessageRoles.USER
            : MessageRoles.MODEL,
        parts: [{ text: item.parts }],
      })),
      systemInstruction:
        systemInstruction !== "You are a helpful AI assistant."
          ? systemInstruction
          : undefined,
      generationConfig: {
        maxOutputTokens: maxTokens,
        temperature: temperature,
      },
    });

    const result = await chat.sendMessage(contextPrompt);
    const responseText = result.response.text();

    return NextResponse.json({ reply: responseText }, { status: 200 });
  } catch (error) {
    console.error("Error communicating with Gemini API:", error);
    return NextResponse.json(
      { error: "Failed to get a response from the AI." },
      { status: 500 }
    );
  }
}
