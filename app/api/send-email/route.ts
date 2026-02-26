import { NextRequest, NextResponse } from 'next/server';
import { sendPurchaseEmail } from '@/lib/brevo';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { to, customerName, productName, downloadLinks, price, compareAtPrice } = body;

    // Diagnostic logging to help debug delivery issues
    console.log('Incoming /api/send-email payload:', {
      to,
      customerName,
      productName,
      downloadLinksCount: Array.isArray(downloadLinks) ? downloadLinks.length : 0,
      hasPrice: typeof price !== 'undefined' && price !== null,
      hasCompareAtPrice: typeof compareAtPrice !== 'undefined' && compareAtPrice !== null,
    });
    console.log('Env flags:', {
      NEXT_PUBLIC_BASE_URL: !!process.env.NEXT_PUBLIC_BASE_URL,
      NEXT_PUBLIC_APP_URL: !!process.env.NEXT_PUBLIC_APP_URL,
      BREVO_API_KEY: !!process.env.BREVO_API_KEY
    });

    if (!to || !productName || !downloadLinks) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const emailData = {
      to,
      subject: `Thank You for Your Purchase - ${productName}`,
      customerName,
      productName,
      price,
      compareAtPrice,
      downloadLinks
    };

    await sendPurchaseEmail(emailData);

    return NextResponse.json(
      { success: true, message: 'Email sent successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Email sending error:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}
