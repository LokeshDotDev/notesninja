import axios from 'axios';

const BREVO_API_KEY = process.env.BREVO_API_KEY;
const BREVO_API_URL = 'https://api.brevo.com/v3';

interface EmailData {
  to: string;
  subject: string;
  customerName?: string;
  productName?: string;
  downloadLinks?: Array<{
    fileName: string;
    fileUrl: string;
    fileSize: number;
    fileType: string;
    publicId?: string;
  }>;
}

export async function sendPurchaseEmail(emailData: EmailData) {
  if (!BREVO_API_KEY) {
    console.error('Brevo API key is not configured');
    throw new Error('Brevo API key is not configured');
  }

  console.log('Sending email to:', emailData.to);
  console.log('API Key exists:', !!BREVO_API_KEY);

  const emailHtml = generatePurchaseEmailTemplate(emailData);

  try {
    const response = await axios.post(
      `${BREVO_API_URL}/smtp/email`,
      {
        sender: {
          name: 'NotesNinja',
          email: 'contact@notesninja.in'
        },
        to: [{
          email: emailData.to,
          name: emailData.customerName || 'Customer'
        }],
        subject: emailData.subject,
        htmlContent: emailHtml
      },
      {
        headers: {
          'api-key': BREVO_API_KEY,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('Brevo response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Brevo email error details:', error);
    if (axios.isAxiosError(error)) {
      console.error('Axios error response:', error.response?.data);
      console.error('Axios error status:', error.response?.status);
      console.error('Axios error headers:', error.response?.headers);
    }
    throw new Error(`Failed to send email: ${(error as Error).message}`);
  }
}

function generatePurchaseEmailTemplate(data: EmailData): string {
  console.log('Email template data:', data);
  console.log('Download links:', data.downloadLinks);
  
  const downloadItems = data.downloadLinks?.map(file => {
    // Use new secure download endpoint with absolute URL
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const downloadUrl = `${baseUrl}/api/download?fileUrl=${encodeURIComponent(file.fileUrl)}&fileName=${encodeURIComponent(file.fileName)}`;
    
    console.log('Email: Using secure download URL:', { fileName: file.fileName, downloadUrl });
    
    return `
    <div style="background: rgba(255,255,255,0.05); backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 20px; margin-bottom: 16px; transition: all 0.3s ease;">
      <div style="display: flex; align-items: center; justify-content: space-between;">
        <div style="display: flex; align-items: center; gap: 16px;">
          <div style="width: 56px; height: 56px; background: linear-gradient(135deg, #10b981, #3b82f6, #8b5cf6); border-radius: 12px; display: flex; align-items: center; justify-content: center; box-shadow: 0 8px 32px rgba(16, 185, 129, 0.3);">
            <svg width="28" height="28" fill="white" viewBox="0 0 24 24">
              <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20M12,19L8,15H10.5V12H13.5V15H16L12,19Z"/>
            </svg>
          </div>
          <div>
            <h4 style="margin: 0; color: #ffffff; font-size: 18px; font-weight: 700; letter-spacing: -0.5px;">${file.fileName}</h4>
            <p style="margin: 6px 0 0 0; color: rgba(255,255,255,0.7); font-size: 14px; font-weight: 500;">
              ${file.fileType.toUpperCase()} • ${(file.fileSize / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
        </div>
        <a href="${downloadUrl}" 
           style="background: linear-gradient(135deg, #10b981, #3b82f6); color: white; padding: 14px 28px; border-radius: 12px; text-decoration: none; font-weight: 600; font-size: 15px; display: inline-flex; align-items: center; gap: 8px; box-shadow: 0 8px 32px rgba(16, 185, 129, 0.4); transition: all 0.3s ease; border: none;"
           download="${file.fileName}"
           target="_blank">
          <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
            <path d="M5,20H19V18H5M19,9H15V3H9V9H5L12,16L19,9Z"/>
          </svg>
          Download Now
        </a>
      </div>
    </div>
  `;
  }).join('') || '';

  console.log('Generated download items:', downloadItems);

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Thank You for Your Purchase!</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Inter', sans-serif; background: #000000; color: #ffffff;">
      <div style="max-width: 700px; margin: 0 auto; background: linear-gradient(135deg, #0f0f0f 0%, #1a1a2e 50%, #16213e 100%);">
        <!-- Premium Header -->
        <div style="background: linear-gradient(135deg, #0f0f0f 0%, #1a1a2e 100%); padding: 60px 40px; text-align: center; position: relative; overflow: hidden;">
          <!-- Background Effects -->
          <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: radial-gradient(ellipse at top, rgba(16, 185, 129, 0.1) 0%, transparent 50%);"></div>
          <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: url('data:image/svg+xml,<svg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"><g fill=\"none\" fill-rule=\"evenodd\"><g fill=\"%23ffffff\" fill-opacity=\"0.02\"><circle cx=\"7\" cy=\"7\" r=\"1\"/><circle cx=\"27\" cy=\"7\" r=\"1\"/><circle cx=\"47\" cy=\"7\" r=\"1\"/><circle cx=\"7\" cy=\"27\" r=\"1\"/><circle cx=\"27\" cy=\"27\" r=\"1\"/><circle cx=\"47\" cy=\"27\" r=\"1\"/><circle cx=\"7\" cy=\"47\" r=\"1\"/><circle cx=\"27\" cy=\"47\" r=\"1\"/><circle cx=\"47\" cy=\"47\" r=\"1\"/></g></g></svg>') repeat; opacity: 0.5;"></div>
          
          <div style="position: relative; z-index: 1;">
            <!-- Success Icon -->
            <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #10b981, #3b82f6, #8b5cf6); border-radius: 20px; display: flex; align-items: center; justify-content: center; margin: 0 auto 30px; box-shadow: 0 20px 40px rgba(16, 185, 129, 0.3); position: relative;">
              <div style="position: absolute; inset: -2px; background: linear-gradient(135deg, #10b981, #3b82f6, #8b5cf6); border-radius: 20px; z-index: -1; opacity: 0.5; filter: blur(10px);"></div>
              <svg width="40" height="40" fill="white" viewBox="0 0 24 24">
                <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2m-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            
            <h1 style="color: #ffffff; margin: 0; font-size: 36px; font-weight: 800; letter-spacing: -1px; line-height: 1.2;">
              Payment
              <span style="background: linear-gradient(135deg, #10b981, #3b82f6, #8b5cf6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
                Successful!
              </span>
            </h1>
            <p style="color: rgba(255,255,255,0.8); margin: 16px 0 0 0; font-size: 18px; font-weight: 400; line-height: 1.5;">
              Your order has been confirmed and your files are ready for download
            </p>
          </div>
        </div>

        <!-- Premium Content -->
        <div style="padding: 50px 40px; position: relative;">
          <!-- Order Confirmation Card -->
          <div style="background: rgba(255,255,255,0.05); backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.1); border-radius: 20px; padding: 30px; margin-bottom: 40px; box-shadow: 0 20px 40px rgba(0,0,0,0.3);">
            <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 20px;">
              <div style="width: 12px; height: 12px; background: #10b981; border-radius: 50%; box-shadow: 0 0 20px rgba(16, 185, 129, 0.6);"></div>
              <h2 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 700; letter-spacing: -0.5px;">
                Order Confirmed
              </h2>
            </div>
            <p style="color: rgba(255,255,255,0.8); margin: 0; font-size: 16px; line-height: 1.6; font-weight: 400;">
              Hi <strong style="color: #10b981; font-weight: 600;">${data.customerName || 'there'}</strong>, thank you for purchasing 
              <strong style="color: #3b82f6; font-weight: 600;">${data.productName || 'our digital product'}</strong>. 
              Your payment was successful and your digital files are now available for immediate download.
            </p>
          </div>

          <!-- Downloads Section -->
          <div style="margin-bottom: 40px;">
            <h3 style="color: #ffffff; margin: 0 0 30px 0; font-size: 24px; font-weight: 700; letter-spacing: -0.5px; text-align: center;">
              Your Downloads
            </h3>
            
            ${downloadItems}
          </div>

          <!-- Premium Notice -->
          <div style="background: linear-gradient(135deg, rgba(251, 191, 36, 0.1), rgba(245, 158, 11, 0.05)); backdrop-filter: blur(10px); border: 1px solid rgba(251, 191, 36, 0.2); border-radius: 16px; padding: 25px; margin: 40px 0;">
            <div style="display: flex; align-items: flex-start; gap: 16px;">
              <div style="width: 24px; height: 24px; background: linear-gradient(135deg, #fbbf24, #f59e0b); border-radius: 6px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                <svg width="16" height="16" fill="white" viewBox="0 0 24 24">
                  <path d="M12,2L13.09,8.26L22,9L13.09,9.74L12,16L10.91,9.74L2,9L10.91,8.26L12,2Z"/>
                </svg>
              </div>
              <div>
                <h4 style="color: #fbbf24; margin: 0 0 12px 0; font-size: 18px; font-weight: 600; letter-spacing: -0.5px;">
                  Important Notice
                </h4>
                <p style="color: rgba(255,255,255,0.8); margin: 0; font-size: 15px; line-height: 1.6; font-weight: 400;">
                  Please download your files within 30 days. Download links will expire after this period for security reasons. 
                  If you need assistance, don't hesitate to contact our support team.
                </p>
              </div>
            </div>
          </div>

          <!-- Support Section -->
          <div style="text-align: center; margin-top: 50px; padding-top: 40px; border-top: 1px solid rgba(255,255,255,0.1);">
            <p style="color: rgba(255,255,255,0.8); margin: 0 0 24px 0; font-size: 16px; font-weight: 500;">
              Need help? We're here for you!
            </p>
            <a href="mailto:support@notesninja.com" 
               style="background: linear-gradient(135deg, #3b82f6, #8b5cf6); color: white; padding: 16px 32px; border-radius: 12px; text-decoration: none; font-weight: 600; font-size: 16px; display: inline-block; box-shadow: 0 8px 32px rgba(59, 130, 246, 0.4); transition: all 0.3s ease; border: none;">
              Contact Support
            </a>
          </div>
        </div>

        <!-- Premium Footer -->
        <div style="background: linear-gradient(135deg, #0f0f0f 0%, #1a1a2e 100%); padding: 40px; text-align: center; border-top: 1px solid rgba(255,255,255,0.1);">
          <div style="width: 48px; height: 48px; background: linear-gradient(135deg, #10b981, #3b82f6, #8b5cf6); border-radius: 12px; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; box-shadow: 0 8px 24px rgba(16, 185, 129, 0.3);">
            <svg width="24" height="24" fill="white" viewBox="0 0 24 24">
              <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20M12,19L8,15H10.5V12H13.5V15H16L12,19Z"/>
            </svg>
          </div>
          <h3 style="color: #ffffff; margin: 0 0 12px 0; font-size: 20px; font-weight: 700; letter-spacing: -0.5px;">
            NotesNinja
          </h3>
          <p style="color: rgba(255,255,255,0.7); margin: 0; font-size: 15px; font-weight: 400;">
            Your trusted source for premium digital content
          </p>
          <div style="margin-top: 24px; padding-top: 24px; border-top: 1px solid rgba(255,255,255,0.1);">
            <p style="color: rgba(255,255,255,0.5); margin: 0; font-size: 13px; font-weight: 400;">
              © 2024 NotesNinja. All rights reserved.
            </p>
            <p style="color: rgba(255,255,255,0.5); margin: 8px 0 0 0; font-size: 13px; font-weight: 400;">
              You received this email because you made a purchase on our website.
            </p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}
