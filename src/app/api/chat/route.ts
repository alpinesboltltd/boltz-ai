import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';


interface ChatHistoryItem {
  role: 'user' | 'model';
  parts: string; 
}

export async function POST(request: Request) {
  const { message, history } = await request.json();

  if (!message) {
    return NextResponse.json({ error: 'Message is required' }, { status: 400 });
  }

  const geminiApiKey = process.env.GEMINI_API_KEY;

  if (!geminiApiKey) {
    console.error('GEMINI_API_KEY is not set in environment variables.');
    return NextResponse.json({ error: 'Server configuration error: API key missing.' }, { status: 500 });
  }

  try {
    const genAI = new GoogleGenerativeAI(geminiApiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const chat = model.startChat({
      history: (history as ChatHistoryItem[]).map(item => ({
        role: item.role,
        parts: [{ text: item.parts }]
      })),
      generationConfig: {
        maxOutputTokens: 500,
      },
    });

    const result = await chat.sendMessage(message);
    const responseText = result.response.text();

    return NextResponse.json({ reply: responseText }, { status: 200 });

  } catch (error) {
    console.error('Error communicating with Gemini API:', error);
    return NextResponse.json({ error: 'Failed to get a response from the AI.' }, { status: 500 });
  }
}
