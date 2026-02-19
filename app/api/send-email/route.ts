import { NextRequest, NextResponse } from 'next/server';
import { sendPurchaseEmail } from '@/lib/brevo';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { to, customerName, productName, downloadLinks, price, compareAtPrice } = body;

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
