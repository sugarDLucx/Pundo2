import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { streamText } from 'ai';
import { NextResponse } from 'next/server';

export const maxDuration = 30;

import { checkBotId } from 'botid/server';

export async function POST(req: Request) {
  try {
    const verification = await checkBotId();
    if (verification.isBot) {
      return NextResponse.json({ error: 'Bot detected. Access denied.' }, { status: 403 });
    }
    const { messages } = await req.json();

    // Sanitize messages for Vercel AI SDK Core (it expects 'content', not 'parts')
    const sanitizedMessages = messages.map((m: any) => ({
      role: m.role,
      content: m.content || (m.parts ? m.parts.map((p: any) => p.text).join('') : ''),
    }));

    const apiKey = process.env.GOOGLE_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Google API key is not configured.' }, { status: 500 });
    }
    
    if (!apiKey.startsWith('AIza')) {
      return NextResponse.json({ error: 'Invalid Google Gemini API Key. It must start with "AIza". Please get a valid key from Google AI Studio.' }, { status: 500 });
    }

    const google = createGoogleGenerativeAI({
      apiKey,
    });

    const result = streamText({
      model: google('gemini-pro'),
      messages: sanitizedMessages,
      system: `You are the "Pundo Financial Assistant". You are an expert financial advisor integrated into the Pundo app. 
Pundo is an elegant, premium financial dashboard where users track their wealth, set savings goals, manage transactions, and view market investments.
Your job is to provide helpful, concise, and professional financial advice. Do not provide specific stock picks or guarantee returns. Focus on budgeting, saving strategies, interpreting market trends, and navigating the Pundo application.
Keep your responses relatively brief unless the user asks for a detailed plan.`
    });

    return result.toTextStreamResponse();
  } catch (error: any) {
    console.error('Chat API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
