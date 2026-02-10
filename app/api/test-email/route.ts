import { NextRequest, NextResponse } from 'next/server';
import { sendPurchaseEmail } from '@/lib/brevo';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    console.log('Testing email to:', email);
    console.log('API Key available:', !!process.env.BREVO_API_KEY);

    const emailData = {
      to: email,
      subject: 'Test Email from NotesNinja',
      customerName: 'Test User',
      productName: 'Test Product',
      downloadLinks: [
        {
          fileName: 'test-file.pdf',
          fileUrl: 'https://example.com/test.pdf',
          fileSize: 1024000,
          fileType: 'pdf'
        }
      ]
    };

    const result = await sendPurchaseEmail(emailData);
    console.log('Email sent successfully:', result);

    return NextResponse.json(
      { success: true, message: 'Test email sent successfully', result },
      { status: 200 }
    );
  } catch (error) {
    console.error('Test email error:', error);
    return NextResponse.json(
      { error: (error as Error).message || 'Failed to send test email' },
      { status: 500 }
    );
  }
}
