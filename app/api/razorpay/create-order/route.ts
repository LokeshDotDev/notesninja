import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";

// Get environment variables at runtime with enhanced security
const getRazorpayCredentials = () => {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

  // Enhanced security logging without exposing secrets
  console.log("Environment check:", {
    hasKeyId: !!keyId,
    hasKeySecret: !!keySecret,
    hasWebhookSecret: !!webhookSecret,
    nodeEnv: process.env.NODE_ENV,
    isProduction: process.env.NODE_ENV === "production",
  });

  return { keyId, keySecret, webhookSecret };
};

export async function POST(req: NextRequest) {
  try {
    // Get environment variables
    const { keyId, keySecret } = getRazorpayCredentials();

    // Enhanced validation with production checks
    if (!keyId || !keySecret) {
      console.error("❌ Razorpay credentials missing");

      // In production, this is a critical error
      if (process.env.NODE_ENV === "production") {
        console.error(
          "🚨 PRODUCTION ERROR: Razorpay credentials not configured",
        );
      }

      return NextResponse.json(
        {
          error:
            process.env.NODE_ENV === "production"
              ? "Payment service temporarily unavailable"
              : "Server configuration error: Razorpay credentials not found",
          debug:
            process.env.NODE_ENV !== "production"
              ? {
                  hasKeyId: !!keyId,
                  hasKeySecret: !!keySecret,
                }
              : undefined,
        },
        { status: 500 },
      );
    }

    console.log("🔐 Razorpay credentials available");

    // Initialize Razorpay instance
    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    const { amount, currency = "INR", receipt, notes } = await req.json();

    console.log("📝 Creating order:", { amount, currency, receipt });

    if (!amount || amount <= 0) {
      console.error("❌ Invalid amount:", amount);
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    // Convert amount to paise (Razorpay expects amount in smallest currency unit)
    const amountInPaise = Math.round(amount * 100);

    const options = {
      amount: amountInPaise,
      currency,
      receipt:
        receipt ||
        `rcpt_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      notes: notes || {},
    };

    console.log("🚀 Sending to Razorpay:", {
      ...options,
      amount: amountInPaise,
    });
    const order = await razorpay.orders.create(options);

    console.log("✅ Order created:", {
      orderId: (order as { id: string }).id,
      amount: (order as { amount: number }).amount,
    });

    return NextResponse.json({
      success: true,
      order,
      keyId: process.env.RAZORPAY_KEY_ID,
      // Add webhook info for frontend
      webhookConfigured: !!process.env.RAZORPAY_WEBHOOK_SECRET,
      environment: process.env.NODE_ENV,
    });
  } catch (error) {
    console.error("❌ Razorpay order creation error:", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    return NextResponse.json(
      {
        error: "Failed to create order",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
