import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";

// Get environment variables at runtime
const getRazorpayCredentials = () => {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  
  console.log("Environment check:", {
    allEnv: Object.keys(process.env).filter(key => key.includes('RAZORPAY')),
    keyId: keyId || 'undefined',
    keySecret: keySecret || 'undefined',
    nodeEnv: process.env.NODE_ENV
  });
  
  return { keyId, keySecret };
};

export async function POST(req: NextRequest) {
  try {
    // Get environment variables
    const { keyId, keySecret } = getRazorpayCredentials();
    
    // Check environment variables
    if (!keyId || !keySecret) {
      return NextResponse.json(
        { 
          error: "Server configuration error: Razorpay credentials not found",
          debug: {
            hasKeyId: !!keyId,
            hasKeySecret: !!keySecret
          }
        },
        { status: 500 }
      );
    }

    // Initialize Razorpay instance
    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    const { amount, currency = "INR", receipt, notes } = await req.json();

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: "Invalid amount" },
        { status: 400 }
      );
    }

    // Convert amount to paise (Razorpay expects amount in smallest currency unit)
    const amountInPaise = Math.round(amount * 100);

    const options = {
      amount: amountInPaise,
      currency,
      receipt: receipt || `rcpt_${Math.random().toString(36).substr(2, 9)}`,
      notes: notes || {},
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json({
      success: true,
      order,
      keyId: process.env.RAZORPAY_KEY_ID,
    });

  } catch (error) {
    console.error("Razorpay order creation error:", error);
    return NextResponse.json(
      { 
        error: "Failed to create order",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
