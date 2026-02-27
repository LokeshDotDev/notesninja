import axios from 'axios';
import { formatPrice } from './pricing';

const BREVO_API_KEY = process.env.BREVO_API_KEY;
const BREVO_API_URL = 'https://api.brevo.com/v3';

interface EmailData {
  to: string;
  subject: string;
  customerName?: string;
  productName?: string;
  price?: number;
  compareAtPrice?: number;
  downloadLinks?: Array<{
    fileName: string;
    fileUrl: string;
    fileSize: number;
    fileType: string;
    publicId?: string;
  }>;
}

interface EmailLog {
  id: string;
  to: string;
  subject: string;
  status: 'pending' | 'sent' | 'failed';
  attempts: number;
  lastAttempt: Date;
  errorMessage?: string;
  messageId?: string;
}

// In-memory email queue (in production, use Redis or database)
const emailQueue: Map<string, EmailLog> = new Map();
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 2000; // 2 seconds

export async function sendPurchaseEmail(emailData: EmailData): Promise<{ success: boolean; messageId?: string; error?: string }> {
  if (!BREVO_API_KEY) {
    console.error('Brevo API key is not configured');
    return { success: false, error: 'Brevo API key is not configured' };
  }

  const emailId = `${emailData.to}-${Date.now()}`;
  let attempts = 0;

  console.log('📧 Sending email to:', emailData.to);
  console.log('API Key exists:', !!BREVO_API_KEY);

  // Add to queue
  emailQueue.set(emailId, {
    id: emailId,
    to: emailData.to,
    subject: emailData.subject,
    status: 'pending',
    attempts: 0,
    lastAttempt: new Date()
  });

  const emailHtml = generatePurchaseEmailTemplate(emailData);

  while (attempts < MAX_RETRIES) {
    attempts++;
    
    try {
      // Update queue
      const logEntry = emailQueue.get(emailId);
      if (logEntry) {
        logEntry.attempts = attempts;
        logEntry.lastAttempt = new Date();
        logEntry.status = 'pending';
      }

      console.log(`📤 Attempt ${attempts}/${MAX_RETRIES} to send email to ${emailData.to}`);

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
          },
          timeout: 10000 // 10 second timeout
        }
      );

      console.log('✅ Email sent successfully!');
      console.log('📧 Brevo response:', response.data);

      // Update queue with success
      if (logEntry) {
        logEntry.status = 'sent';
        logEntry.messageId = response.data.messageId;
      }

      return { success: true, messageId: response.data.messageId };

    } catch (error) {
      console.error(`❌ Attempt ${attempts} failed:`, error instanceof Error ? error.message : String(error));
      
      const logEntry = emailQueue.get(emailId);
      if (logEntry) {
        logEntry.errorMessage = error instanceof Error ? error.message : String(error);
      }

      if (attempts < MAX_RETRIES) {
        console.log(`⏳ Retrying in ${RETRY_DELAY_MS}ms...`);
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS));
      } else {
        console.error(`💥 All ${MAX_RETRIES} attempts failed for ${emailData.to}`);
        
        // Update queue with failure
        if (logEntry) {
          logEntry.status = 'failed';
        }

        return { 
          success: false, 
          error: `Failed after ${MAX_RETRIES} attempts: ${error instanceof Error ? error.message : String(error)}` 
        };
      }
    }
  }

  return { success: false, error: 'Unknown error' };
}

// Utility functions for email monitoring
export function getEmailQueue(): EmailLog[] {
  return Array.from(emailQueue.values());
}

export function getEmailStats(): {
  total: number;
  sent: number;
  failed: number;
  pending: number;
} {
  const emails = getEmailQueue();
  return {
    total: emails.length,
    sent: emails.filter(e => e.status === 'sent').length,
    failed: emails.filter(e => e.status === 'failed').length,
    pending: emails.filter(e => e.status === 'pending').length
  };
}

export function clearOldEmailLogs(olderThanHours: number = 24): void {
  const cutoff = new Date(Date.now() - olderThanHours * 60 * 60 * 1000);
  for (const [id, log] of emailQueue.entries()) {
    if (log.lastAttempt < cutoff) {
      emailQueue.delete(id);
    }
  }
}

function generatePurchaseEmailTemplate(data: EmailData): string {
  console.log('Email template data:', data);
  console.log('Download links:', data.downloadLinks);
  
  // Get pricing information
  const formattedPrice = formatPrice(data.price || 0);
  
  const downloadItems = data.downloadLinks?.map((file, index) => {
    // Use new secure download endpoint with absolute URL
    // For production emails, we need to use the actual domain
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://notesninja.in';
    const downloadUrl = `${baseUrl}/api/download?fileUrl=${encodeURIComponent(file.fileUrl)}&fileName=${encodeURIComponent(file.fileName)}`;
    
    console.log('Email: Using secure download URL:', { fileName: file.fileName, downloadUrl });
    
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 30); // 30 days from now
    const formattedExpiry = expiryDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    
    return `
        <!-- Product Row ${index + 1} -->
        <tr>
            <td style="padding: 15px; font-size: 14px; color: #333333; border-bottom: 1px solid #e5e5e5;">
                <a href="${downloadUrl}" style="color: #00b386; text-decoration: underline;" target="_blank">${file.fileName}</a>
            </td>
            <td style="padding: 15px; font-size: 14px; color: #666666; border-bottom: 1px solid #e5e5e5;">
                ${formattedExpiry}
            </td>
            <td style="padding: 15px; border-bottom: 1px solid #e5e5e5;">
                <a href="${downloadUrl}" style="display: inline-block; background: linear-gradient(135deg, #00d9a3, #00b386); color: #ffffff; padding: 8px 20px; text-decoration: none; border-radius: 5px; font-size: 13px; font-weight: 700;" download="${file.fileName}" target="_blank">Download</a>
            </td>
        </tr>
    `;
  }).join('') || '';

  console.log('Generated download items:', downloadItems);

  const orderDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const orderNumber = Math.random().toString(36).substr(2, 9).toUpperCase();
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + 30);
  const formattedExpiry = expiryDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Confirmation - NotesNinja</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Arial', sans-serif; background-color: #f4f4f4;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px 0;">
        <tr>
            <td align="center">
                <!-- Main Container -->
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                    
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #00d9a3, #00b386); padding: 40px 30px; text-align: center;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">Thank you for your order!</h1>
                        </td>
                    </tr>
                    
                    <!-- Greeting -->
                    <tr>
                        <td style="padding: 30px 30px 10px;">
                            <p style="margin: 0; font-size: 16px; color: #333333; line-height: 1.6;">Hi <strong>${data.customerName || 'Customer'}</strong>,</p>
                        </td>
                    </tr>
                    
                    <!-- Order Message -->
                    <tr>
                        <td style="padding: 10px 30px 20px;">
                            <p style="margin: 0; font-size: 15px; color: #666666; line-height: 1.6;">
                                Just to let you know — we've received your order <strong>#${orderNumber}</strong>, and it is now being processed. Your study materials are ready for download!
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Downloads Section -->
                    <tr>
                        <td style="padding: 20px 30px;">
                            <h2 style="margin: 0 0 20px; font-size: 20px; color: #00b386; font-weight: 700;">📥 Downloads</h2>
                            
                            <!-- Downloads Table -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #e5e5e5; border-radius: 6px; overflow: hidden;">
                                <!-- Table Header -->
                                <tr style="background-color: #f8f8f8;">
                                    <th style="padding: 12px 15px; text-align: left; font-size: 14px; color: #333333; font-weight: 700; border-bottom: 1px solid #e5e5e5;">Product</th>
                                    <th style="padding: 12px 15px; text-align: left; font-size: 14px; color: #333333; font-weight: 700; border-bottom: 1px solid #e5e5e5;">Expires</th>
                                    <th style="padding: 12px 15px; text-align: left; font-size: 14px; color: #333333; font-weight: 700; border-bottom: 1px solid #e5e5e5;">Download</th>
                                </tr>
                                
                                ${downloadItems}
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Order Details -->
                    <tr>
                        <td style="padding: 20px 30px;">
                            <h2 style="margin: 0 0 20px; font-size: 20px; color: #00b386; font-weight: 700;">Order #${orderNumber} (${orderDate})</h2>
                            
                            <!-- Order Items Table -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #e5e5e5; border-radius: 6px; overflow: hidden; margin-bottom: 20px;">
                                <!-- Table Header -->
                                <tr style="background-color: #f8f8f8;">
                                    <th style="padding: 12px 15px; text-align: left; font-size: 14px; color: #333333; font-weight: 700; border-bottom: 1px solid #e5e5e5;">Product</th>
                                    <th style="padding: 12px 15px; text-align: center; font-size: 14px; color: #333333; font-weight: 700; border-bottom: 1px solid #e5e5e5;">Quantity</th>
                                    <th style="padding: 12px 15px; text-align: right; font-size: 14px; color: #333333; font-weight: 700; border-bottom: 1px solid #e5e5e5;">Price</th>
                                </tr>
                                
                                <!-- Product Row -->
                                <tr>
                                    <td style="padding: 15px; font-size: 14px; color: #333333; border-bottom: 1px solid #e5e5e5;">${data.productName || 'Digital Product'}</td>
                                    <td style="padding: 15px; font-size: 14px; color: #333333; text-align: center; border-bottom: 1px solid #e5e5e5;">1</td>
                                    <td style="padding: 15px; font-size: 14px; color: #333333; text-align: right; border-bottom: 1px solid #e5e5e5;">${formattedPrice}</td>
                                </tr>
                                
                                <!-- Subtotal -->
                                <tr style="background-color: #f8f8f8;">
                                    <td colspan="2" style="padding: 12px 15px; font-size: 14px; color: #333333; font-weight: 700;">Subtotal:</td>
                                    <td style="padding: 12px 15px; font-size: 14px; color: #333333; text-align: right; font-weight: 700;">${formattedPrice}</td>
                                </tr>
                                
                                <!-- Shipping -->
                                <tr style="background-color: #f8f8f8;">
                                    <td colspan="2" style="padding: 12px 15px; font-size: 14px; color: #666666;">Shipping:</td>
                                    <td style="padding: 12px 15px; font-size: 14px; color: #333333; text-align: right;">₹0.00 <span style="font-size: 12px; color: #999;">(Digital Product)</span></td>
                                </tr>
                                
                                <!-- Payment Method -->
                                <tr style="background-color: #f8f8f8;">
                                    <td colspan="2" style="padding: 12px 15px; font-size: 14px; color: #666666;">Payment method:</td>
                                    <td style="padding: 12px 15px; font-size: 14px; color: #333333; text-align: right;">Online Payment</td>
                                </tr>
                                
                                <!-- Total -->
                                <tr style="background: linear-gradient(135deg, #e6faf5, #f0fdf9);">
                                    <td colspan="2" style="padding: 15px; font-size: 16px; color: #00b386; font-weight: 700;">Total:</td>
                                    <td style="padding: 15px; font-size: 18px; color: #00b386; text-align: right; font-weight: 800;">${formattedPrice}</td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Important Notes -->
                    <tr>
                        <td style="padding: 20px 30px;">
                            <div style="background-color: #e6faf5; border: 1px solid #b3f0e0; border-radius: 6px; padding: 20px;">
                                <h3 style="margin: 0 0 12px; font-size: 16px; color: #00b386; font-weight: 700;">📌 Important Information</h3>
                                <ul style="margin: 0; padding-left: 20px; font-size: 14px; color: #333333; line-height: 1.8;">
                                    <li>Your download links will expire on <strong>${formattedExpiry}</strong></li>
                                    <li>Download all files immediately to avoid losing access</li>
                                    <li>Save the files to your device for future reference</li>
                                    <li>If you face any issues downloading, please contact our support team</li>
                                    <li>These are digital products - no physical items will be shipped</li>
                                </ul>
                            </div>
                        </td>
                    </tr>
                    
                    <!-- Support Section -->
                    <tr>
                        <td style="padding: 20px 30px;">
                            <div style="text-align: center; background-color: #f8f8f8; border-radius: 6px; padding: 25px;">
                                <h3 style="margin: 0 0 12px; font-size: 16px; color: #333333; font-weight: 700;">Need Help?</h3>
                                <p style="margin: 0 0 15px; font-size: 14px; color: #666666; line-height: 1.6;">
                                    If you have any questions or need assistance, we're here to help!
                                </p>
                                <p style="margin: 0; font-size: 14px; color: #333333;">
                                    📧 <a href="mailto:support@notesninja.in" style="color: #00b386; text-decoration: underline; font-weight: 600;">support@notesninja.in</a><br>
                                    📱 <a href="tel:+919876543210" style="color: #00b386; text-decoration: underline; font-weight: 600;">+916378990158</a>
                                </p>
                            </div>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="padding: 30px; text-align: center; background-color: #f8f8f8; border-top: 1px solid #e5e5e5;">
                            <p style="margin: 0 0 10px; font-size: 14px; color: #666666;">
                                Thanks for using <a href="https://notesninja.in" style="color: #00b386; text-decoration: underline; font-weight: 600;">NotesNinja.in</a>!
                            </p>
                            <p style="margin: 0 0 15px; font-size: 13px; color: #999999;">
                                NotesNinja - Your Partner in Academic Excellence
                            </p>
                            <div style="margin: 15px 0;">
                                <a href="https://www.facebook.com/notesninja" style="display: inline-block; margin: 0 8px; color: #00b386; text-decoration: none; font-size: 20px;">📘</a>
                                <a href="https://www.instagram.com/notesninja" style="display: inline-block; margin: 0 8px; color: #00b386; text-decoration: none; font-size: 20px;">📷</a>
                                <a href="https://twitter.com/notesninja" style="display: inline-block; margin: 0 8px; color: #00b386; text-decoration: none; font-size: 20px;">🐦</a>
                                <a href="https://www.youtube.com/notesninja" style="display: inline-block; margin: 0 8px; color: #00b386; text-decoration: none; font-size: 20px;">📺</a>
                            </div>
                            <p style="margin: 15px 0 0; font-size: 12px; color: #999999;">
                                NotesNinja, Jaipur, Rajasthan, India<br>
                                © 2026 NotesNinja.in - All Rights Reserved
                            </p>
                            <p style="margin: 10px 0 0; font-size: 11px; color: #999999;">
                                <a href="https://notesninja.in/privacy-policy/" style="color: #999999; text-decoration: underline;">Privacy Policy</a> | 
                                <a href="https://notesninja.in/terms/" style="color: #999999; text-decoration: underline;">Terms & Conditions</a> | 
                                <a href="https://notesninja.in/refund-policy/" style="color: #999999; text-decoration: underline;">Refund Policy</a>
                            </p>
                        </td>
                    </tr>
                    
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
  `;
}
