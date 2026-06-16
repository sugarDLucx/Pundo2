import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export async function POST(req: Request) {
  try {
    const { email, subject, message } = await req.json();
    
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
      throw new Error('Gmail credentials are not configured in environment variables');
    }

    const mailOptions = {
      from: `"Pundo App" <${process.env.GMAIL_USER}>`,
      to: email,
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
    };

    const data = await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true, messageId: data.messageId });
  } catch (error: any) {
    console.error('Email error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
