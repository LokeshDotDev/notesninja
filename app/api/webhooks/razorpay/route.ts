import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json(
    { 
      message: "Razorpay webhook endpoint has been deprecated",
      deprecated: true,
      info: "Payment verification is now handled directly via /api/razorpay/verify-payment"
    },
    { status: 410 } // HTTP 410 Gone
  );
}

export async function POST() {
  console.log("🔔 Razorpay webhook received - DEPRECATED");
  
  return NextResponse.json(
    { 
      message: "Razorpay webhook endpoint has been deprecated",
      deprecated: true,
      info: "Payment verification is now handled directly via /api/razorpay/verify-payment",
      timestamp: new Date().toISOString()
    },
    { status: 410 } // HTTP 410 Gone
  );
}
