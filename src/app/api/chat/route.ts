import { google } from '@ai-sdk/google';
import { streamText } from 'ai';
import { NextResponse } from 'next/server';

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!process.env.GOOGLE_API_KEY) {
      return NextResponse.json({ error: 'GOOGLE_API_KEY is not configured.' }, { status: 500 });
    }

    const result = streamText({
      model: google('gemini-1.5-pro-latest'),
      messages,
      system: `You are the "Pundo Financial Assistant". You are an expert financial advisor integrated into the Pundo app. 
Pundo is an elegant, premium financial dashboard where users track their wealth, set savings goals, manage transactions, and view market investments.
Your job is to provide helpful, concise, and professional financial advice. Do not provide specific stock picks or guarantee returns. Focus on budgeting, saving strategies, interpreting market trends, and navigating the Pundo application.
Keep your responses relatively brief unless the user asks for a detailed plan.`
    });

    return result.toDataStreamResponse();
  } catch (error: any) {
    console.error('Chat API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
