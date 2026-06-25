import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  // Vercel CRON_SECRET security check
  const authHeader = req.headers.get('authorization');
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseKey) {
      throw new Error('SUPABASE_SERVICE_ROLE_KEY is required to fetch user emails for the weekly summary.');
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch all profiles that have email_notifications = true
    const { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('email_notifications', true);

    if (profileError || !profiles) {
      throw new Error(`Error fetching profiles: ${profileError?.message}`);
    }

    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
      throw new Error('Gmail credentials are not configured');
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    const now = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    let sentCount = 0;

    for (const profile of profiles) {
      // Fetch user email using service role key
      const { data: { user }, error: userError } = await supabase.auth.admin.getUserById(profile.id);
      if (userError || !user?.email) continue;

      // Fetch transactions for the last 7 days for this profile
      const { data: transactions } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', profile.id)
        .gte('date', sevenDaysAgo.toISOString())
        .lte('date', now.toISOString());

      const txList = transactions || [];
      const totalIncome = txList.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
      const totalExpense = txList.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);

      // Only send if there was activity, to avoid spamming
      if (txList.length === 0) continue;

      const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e3e2e0; border-radius: 10px;">
          <h1 style="color: #420093; text-align: center;">Your Weekly Financial Summary</h1>
          <p>Hi ${profile.full_name || 'there'},</p>
          <p>Here is your financial activity for the last 7 days:</p>
          <div style="background-color: #faf9f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="margin-top: 0; color: #1a1c1a;">Summary</h2>
            <p style="font-size: 16px; color: #1a1c1a;"><strong>Income:</strong> ${profile.currency || '₱'}${totalIncome.toFixed(2)}</p>
            <p style="font-size: 16px; color: #1a1c1a;"><strong>Expenses:</strong> ${profile.currency || '₱'}${totalExpense.toFixed(2)}</p>
            <p style="font-size: 16px; color: #1a1c1a;"><strong>Net:</strong> ${profile.currency || '₱'}${(totalIncome - totalExpense).toFixed(2)}</p>
          </div>
          <p>Log in to Pundo to see more details.</p>
          <p style="text-align: center; color: #635c61; font-size: 12px; margin-top: 20px;">
            © ${new Date().getFullYear()} Pundo. Your Wealth, Curated.
          </p>
        </div>
      `;

      await transporter.sendMail({
        from: \`"Pundo Updates" <\${process.env.GMAIL_USER}>\`,
        to: user.email,
        subject: 'Your Pundo Weekly Summary',
        html: htmlContent
      });
      
      sentCount++;
    }

    return NextResponse.json({ success: true, sentCount });
  } catch (error: any) {
    console.error('Weekly summary error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
