import { NextRequest, NextResponse } from "next/server";
import { sendPurchaseEmail } from "@/lib/brevo";

interface EmailData {
  to: string;
  subject: string;
  html: string;
}

export async function POST(req: NextRequest) {
  try {
    const emailData: EmailData = await req.json();

    console.log("Sending email via Brevo:", {
      to: emailData.to,
      subject: emailData.subject,
      timestamp: new Date().toISOString()
    });

    // Use Brevo service to send the email
    const result = await sendPurchaseEmail({
      to: emailData.to,
      subject: emailData.subject,
      customerName: 'Customer', // You can extract this from the email data if needed
      productName: 'Digital Product', // You can extract this from the email data if needed
      downloadLinks: [] // You can extract this from the email data if needed
    });

    console.log("Email sent successfully via Brevo:", result);

    return NextResponse.json({
      success: true,
      message: "Email sent successfully via Brevo",
      timestamp: new Date().toISOString(),
      brevoResponse: result
    });

  } catch (error) {
    console.error("Error sending email via Brevo:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to send email via Brevo",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
