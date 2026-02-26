require('dotenv').config();
const axios = require('axios');

const BREVO_API_KEY = process.env.BREVO_API_KEY;
const BREVO_API_URL = 'https://api.brevo.com/v3';

// Custom email template for direct messages
function generateDirectEmailTemplate(data) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Message from NotesNinja</title>
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
                            <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">${data.subject || 'Message from NotesNinja'}</h1>
                        </td>
                    </tr>
                    
                    <!-- Greeting -->
                    <tr>
                        <td style="padding: 30px 30px 10px;">
                            <p style="margin: 0; font-size: 16px; color: #333333; line-height: 1.6;">Hi <strong>${data.customerName || 'There'}</strong>,</p>
                        </td>
                    </tr>
                    
                    <!-- Message -->
                    <tr>
                        <td style="padding: 10px 30px 20px;">
                            <p style="margin: 0; font-size: 15px; color: #666666; line-height: 1.6;">
                                ${data.message}
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Call to Action -->
                    ${data.ctaUrl ? `
                    <tr>
                        <td style="padding: 20px 30px; text-align: center;">
                            <a href="${data.ctaUrl}" style="display: inline-block; background: linear-gradient(135deg, #00d9a3, #00b386); color: #ffffff; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-size: 16px; font-weight: 700;" target="_blank">
                                ${data.ctaText || 'Visit NotesNinja'}
                            </a>
                        </td>
                    </tr>
                    ` : ''}
                    
                    <!-- Footer -->
                    <tr>
                        <td style="padding: 30px; text-align: center; background-color: #f8f8f8; border-top: 1px solid #e5e5e5;">
                            <p style="margin: 0 0 10px; font-size: 14px; color: #666666;">
                                Thanks for using <a href="https://notesninja.in" style="color: #00b386; text-decoration: underline; font-weight: 600;">NotesNinja.in</a>!
                            </p>
                            <p style="margin: 0 0 15px; font-size: 13px; color: #999999;">
                                NotesNinja - Your Partner in Academic Excellence
                            </p>
                            <p style="margin: 10px 0 0; font-size: 12px; color: #999999;">
                                NotesNinja, Jaipur, Rajasthan, India<br>
                                © 2026 NotesNinja.in - All Rights Reserved
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

async function sendCustomEmail(emailData) {
  if (!BREVO_API_KEY) {
    throw new Error('Brevo API key is not configured');
  }

  console.log('� Sending custom email to:', emailData.to);

  const emailHtml = generateDirectEmailTemplate(emailData);

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
        subject: emailData.subject || 'Message from NotesNinja',
        htmlContent: emailHtml
      },
      {
        headers: {
          'api-key': BREVO_API_KEY,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('✅ Email sent successfully!');
    console.log('📧 Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Failed to send email:', error.message);
    if (axios.isAxiosError(error)) {
      console.error('Axios error response:', error.response?.data);
    }
    throw error;
  }
}

// Command line interface
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log(`
📧 NotesNinja Direct Email Sender

Usage:
  node send-direct-email.js <email> <message> [subject] [customer-name] [cta-url] [cta-text]

Examples:
  node send-direct-email.js purohitlokesh46@gmail.com "Hello! This is a test message."
  node send-direct-email.js purohitlokesh46@gmail.com "Check out our new products!" "New Products Available" "Lokesh" "https://notesninja.in" "Shop Now"

Arguments:
  email         - Target email address
  message       - Email message content
  subject       - Email subject (optional)
  customer-name - Recipient name (optional)
  cta-url       - Call-to-action URL (optional)
  cta-text      - Call-to-action button text (optional)
    `);
    process.exit(0);
  }

  const [email, message, subject, customerName, ctaUrl, ctaText] = args;

  const emailData = {
    to: email,
    message: message,
    subject: subject || 'Message from NotesNinja',
    customerName: customerName,
    ctaUrl: ctaUrl,
    ctaText: ctaText
  };

  try {
    await sendCustomEmail(emailData);
    console.log(`🎉 Email successfully sent to ${email}`);
  } catch (error) {
    console.error('💥 Email sending failed:', error.message);
    process.exit(1);
  }
}

// Run the script
main();
