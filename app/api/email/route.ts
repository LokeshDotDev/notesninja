import { NextRequest, NextResponse } from "next/server";

interface EmailData {
  to: string;
  subject: string;
  html: string;
}

export async function POST(req: NextRequest) {
  try {
    const emailData: EmailData = await req.json();

    // For now, we'll just log the email data
    // In production, you would integrate with an email service like:
    // - Resend (recommended for Next.js)
    // - SendGrid
    // - AWS SES
    // - Nodemailer with SMTP
    
    console.log("Email would be sent:", {
      to: emailData.to,
      subject: emailData.subject,
      html: emailData.html,
      timestamp: new Date().toISOString()
    });

    // Mock successful email sending
    // In production, replace this with actual email service integration
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call

    return NextResponse.json({
      success: true,
      message: "Email sent successfully",
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to send email" 
      },
      { status: 500 }
    );
  }
}

// Helper function to send purchase confirmation emails
export async function sendPurchaseConfirmationEmail(
  userEmail: string,
  productTitle: string,
  purchaseId: string,
  downloadLinks: Array<{ fileName: string; fileUrl: string }>
) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Purchase Confirmation</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #10b981; color: white; padding: 20px; text-align: center; }
        .content { padding: 30px 20px; background: #f9fafb; }
        .product-info { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .download-btn { 
          display: inline-block; 
          background: #10b981; 
          color: white; 
          padding: 12px 24px; 
          text-decoration: none; 
          border-radius: 6px; 
          margin: 10px 0;
        }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 Purchase Confirmation!</h1>
        </div>
        
        <div class="content">
          <h2>Thank you for your purchase!</h2>
          <p>You have successfully purchased <strong>${productTitle}</strong>.</p>
          
          <div class="product-info">
            <h3>Your Digital Files:</h3>
            ${downloadLinks.map((file, index) => `
              <div style="margin: 10px 0; padding: 10px; background: #f3f4f6; border-radius: 4px;">
                <strong>${index + 1}. ${file.fileName}</strong>
              </div>
            `).join('')}
            
            <p><small>Purchase ID: ${purchaseId}</small></p>
          </div>
          
          <p>You can download your files anytime using the links above or by logging into your account.</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="#" class="download-btn">Download Your Files</a>
          </div>
        </div>
        
        <div class="footer">
          <p>If you have any questions, please contact our support team.</p>
          <p>This is an automated message. Please do not reply to this email.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: userEmail,
        subject: `Purchase Confirmation: ${productTitle}`,
        html
      })
    });

    if (!response.ok) {
      throw new Error('Failed to send purchase confirmation email');
    }

    return await response.json();
  } catch (error) {
    console.error('Error sending purchase confirmation email:', error);
    throw error;
  }
}
