import { NextResponse } from 'next/server';

export const revalidate = 3600; // Cache for 1 hour

export async function GET() {
  try {
    const response = await fetch('https://zenquotes.io/api/random');
    if (!response.ok) {
      throw new Error('Failed to fetch quote');
    }
    const data = await response.json();
    return NextResponse.json({
      quote: data[0].q,
      author: data[0].a
    });
  } catch (error) {
    // Fallback quote if API fails
    return NextResponse.json({
      quote: "Do not save what is left after spending, but spend what is left after saving.",
      author: "Warren Buffett"
    });
  }
}
