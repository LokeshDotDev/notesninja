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
    // Use the same logic as the API to generate accessible URLs
    let downloadUrl = file.fileUrl;
    
    // Check if this is a raw file (ZIP, PDF, etc.) and generate proper URL
    const imageTypes = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'];
    const videoTypes = ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm'];
    const fileExtension = file.fileName.split('.').pop()?.toLowerCase() || '';
    
    if (!imageTypes.includes(fileExtension) && !videoTypes.includes(fileExtension)) {
      // This is a raw file, ensure the URL has the correct format
      if (file.fileUrl.includes('/image/upload/')) {
        downloadUrl = file.fileUrl.replace('/image/upload/', '/raw/upload/');
        console.log('Email: Converted image URL to raw URL:', { original: file.fileUrl, converted: downloadUrl });
      } else if (file.fileUrl.includes('/raw/upload/')) {
        // Already correct, use as-is
        downloadUrl = file.fileUrl;
        console.log('Email: Using existing raw URL:', downloadUrl);
      }
    }
    
    console.log('Email final download URL:', { fileName: file.fileName, downloadUrl });
    
    return `
    <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin-bottom: 12px;">
      <div style="display: flex; align-items: center; justify-content: space-between;">
        <div style="display: flex; align-items: center; gap: 12px;">
          <div style="width: 48px; height: 48px; background: linear-gradient(135deg, #3b82f6, #8b5cf6); border-radius: 8px; display: flex; align-items: center; justify-content: center;">
            <svg width="24" height="24" fill="white" viewBox="0 0 24 24">
              <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20M12,19L8,15H10.5V12H13.5V15H16L12,19Z"/>
            </svg>
          </div>
          <div>
            <h4 style="margin: 0; color: #1e293b; font-size: 16px; font-weight: 600;">${file.fileName}</h4>
            <p style="margin: 4px 0 0 0; color: #64748b; font-size: 14px;">
              ${file.fileType.toUpperCase()} • ${(file.fileSize / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
        </div>
        <a href="${downloadUrl}" 
           style="background: linear-gradient(135deg, #3b82f6, #8b5cf6); color: white; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-weight: 500; font-size: 14px; display: inline-flex; align-items: center; gap: 6px;"
           download="${file.fileName}"
           target="_blank">
          <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
            <path d="M5,20H19V18H5M19,9H15V3H9V9H5L12,16L19,9Z"/>
          </svg>
          Download
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
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f1f5f9;">
      <div style="max-width: 600px; margin: 0 auto; background: white;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #1e293b, #334155); padding: 40px 30px; text-align: center;">
          <div style="width: 60px; height: 60px; background: linear-gradient(135deg, #3b82f6, #8b5cf6); border-radius: 12px; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px;">
            <svg width="32" height="32" fill="white" viewBox="0 0 24 24">
              <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20M12,19L8,15H10.5V12H13.5V15H16L12,19Z"/>
            </svg>
          </div>
          <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">
            Thank You for Your Purchase! 🎉
          </h1>
          <p style="color: #cbd5e1; margin: 12px 0 0 0; font-size: 16px;">
            Your order has been confirmed and your files are ready for download
          </p>
        </div>

        <!-- Content -->
        <div style="padding: 40px 30px;">
          <div style="background: #f0f9ff; border: 1px solid #bae6fd; border-radius: 8px; padding: 20px; margin-bottom: 30px;">
            <h2 style="color: #0c4a6e; margin: 0 0 8px 0; font-size: 18px; font-weight: 600;">
              Order Confirmed
            </h2>
            <p style="color: #075985; margin: 0; font-size: 14px; line-height: 1.5;">
              Hi ${data.customerName || 'there'}, thank you for purchasing <strong>${data.productName || 'our digital product'}</strong>. 
              Your payment was successful and your digital files are now available for immediate download.
            </p>
          </div>

          <h3 style="color: #1e293b; margin: 0 0 20px 0; font-size: 20px; font-weight: 600;">
            Your Downloads
          </h3>
          
          ${downloadItems}

          <!-- Important Notice -->
          <div style="background: #fef3c7; border: 1px solid #fbbf24; border-radius: 8px; padding: 20px; margin: 30px 0;">
            <div style="display: flex; align-items: flex-start; gap: 12px;">
              <svg width="20" height="20" fill="#f59e0b" viewBox="0 0 24 24">
                <path d="M12,2L13.09,8.26L22,9L13.09,9.74L12,16L10.91,9.74L2,9L10.91,8.26L12,2Z"/>
              </svg>
              <div>
                <h4 style="color: #92400e; margin: 0 0 8px 0; font-size: 16px; font-weight: 600;">
                  Important Notice
                </h4>
                <p style="color: #78350f; margin: 0; font-size: 14px; line-height: 1.5;">
                  Please download your files within 30 days. Download links will expire after this period for security reasons. 
                  If you need assistance, don't hesitate to contact our support team.
                </p>
              </div>
            </div>
          </div>

          <!-- Support -->
          <div style="text-align: center; margin-top: 40px; padding-top: 30px; border-top: 1px solid #e2e8f0;">
            <p style="color: #64748b; margin: 0 0 16px 0; font-size: 14px;">
              Need help? We're here for you!
            </p>
            <a href="mailto:support@notesninja.com" 
               style="background: linear-gradient(135deg, #3b82f6, #8b5cf6); color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 500; display: inline-block;">
              Contact Support
            </a>
          </div>
        </div>

        <!-- Footer -->
        <div style="background: #f8fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
          <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #3b82f6, #8b5cf6); border-radius: 8px; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px;">
            <svg width="24" height="24" fill="white" viewBox="0 0 24 24">
              <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20M12,19L8,15H10.5V12H13.5V15H16L12,19Z"/>
            </svg>
          </div>
          <h3 style="color: #1e293b; margin: 0 0 8px 0; font-size: 18px; font-weight: 600;">
            NotesNinja
          </h3>
          <p style="color: #64748b; margin: 0; font-size: 14px;">
            Your trusted source for premium digital content
          </p>
          <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
            <p style="color: #94a3b8; margin: 0; font-size: 12px;">
              © 2024 NotesNinja. All rights reserved.
            </p>
            <p style="color: #94a3b8; margin: 8px 0 0 0; font-size: 12px;">
              You received this email because you made a purchase on our website.
            </p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}
