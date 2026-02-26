import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import prisma from "@/lib/prisma";

export function GET() {
  return NextResponse.json(
    { message: "GET request not supported" },
    { status: 200 },
  );
}

export async function POST(req: NextRequest) {
  try {
    const { paymentId, amount } = await req.json();

    console.log("💳 Capturing payment:", { paymentId, amount });

    if (!paymentId) {
      return NextResponse.json(
        { error: "Payment ID is required" },
        { status: 400 },
      );
    }

    // Get Razorpay credentials
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      console.error("❌ Razorpay credentials missing");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 },
      );
    }

    // Initialize Razorpay
    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    // Capture the payment
    const capturedPayment = await razorpay.payments.capture(
      paymentId,
      amount,
      "INR"
    );

    console.log("✅ Payment captured successfully:", {
      paymentId: capturedPayment.id,
      amount: capturedPayment.amount,
      status: capturedPayment.status,
    });

    // Update purchase record if exists
    try {
      const purchase = await prisma.purchase.findFirst({
        where: { paymentId: paymentId },
      });

      if (purchase) {
        await prisma.purchase.update({
          where: { id: purchase.id },
          data: {
            status: "completed",
            amount: Number(capturedPayment.amount) / 100, // Convert back to rupees
            currency: capturedPayment.currency,
          },
        });

        console.log("✅ Purchase record updated:", purchase.id);
      }
    } catch (dbError) {
      console.error("❌ Error updating purchase record:", dbError);
      // Don't fail the capture if DB update fails
    }

    return NextResponse.json({
      success: true,
      payment: capturedPayment,
    });
  } catch (error) {
    console.error("❌ Payment capture error:", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });

    return NextResponse.json(
      {
        error: "Failed to capture payment",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
