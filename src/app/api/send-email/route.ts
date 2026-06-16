import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { email, subject, message } = await req.json();
    
    if (!process.env.RESEND_API_KEY) {
      throw new Error('Resend API key is not configured');
    }

    const data = await resend.emails.send({
      from: 'Pundo App <onboarding@resend.dev>',
      to: [email],
      subject: subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e3e2e0; border-radius: 10px;">
          <h1 style="color: #420093; text-align: center;">Pundo Updates</h1>
          <div style="background-color: #faf9f6; padding: 20px; border-radius: 8px;">
            <p style="font-size: 16px; color: #1a1c1a; line-height: 1.6;">${message}</p>
          </div>
          <p style="text-align: center; color: #635c61; font-size: 12px; margin-top: 20px;">
            © ${new Date().getFullYear()} Pundo. Your Wealth, Curated.
          </p>
        </div>
      `
    });

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
