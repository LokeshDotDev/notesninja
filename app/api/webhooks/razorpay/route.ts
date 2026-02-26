import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import prisma from "@/lib/prisma";
import { sendPurchaseEmail } from "@/lib/brevo";

export function GET() {
  return NextResponse.json(
    { message: "GET request not supported" },
    { status: 200 },
  );
}

// Webhook event IDs we've processed to prevent duplicates
const processedWebhookEvents = new Set<string>();

export async function POST(req: NextRequest) {
  try {
    // Get the raw body for signature verification
    const body = await req.text();
    const signature = req.headers.get("x-razorpay-signature");
    const eventId = req.headers.get("x-razorpay-event-id");

    console.log("🔔 Webhook received:", {
      hasSignature: !!signature,
      eventId,
      bodyLength: body.length,
    });

    // Validate webhook signature
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error("❌ RAZORPAY_WEBHOOK_SECRET not configured");
      return NextResponse.json(
        { error: "Webhook secret not configured" },
        { status: 500 },
      );
    }

    if (!signature) {
      console.error("❌ Missing webhook signature");
      return NextResponse.json({ error: "Missing signature" }, { status: 400 });
    }

    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(body)
      .digest("hex");

    const isSignatureValid = crypto.timingSafeEqual(
      Buffer.from(expectedSignature),
      Buffer.from(signature),
    );

    if (!isSignatureValid) {
      console.error("❌ Invalid webhook signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    // Check for duplicate events (idempotency)
    if (eventId && processedWebhookEvents.has(eventId)) {
      console.log("⚠️ Duplicate webhook event, skipping:", eventId);
      return NextResponse.json({ message: "Duplicate event ignored" });
    }

    // Parse the webhook payload
    const webhookData = JSON.parse(body);
    const { event, payload } = webhookData;

    console.log("📝 Processing webhook event:", event);

    // Mark event as processed
    if (eventId) {
      processedWebhookEvents.add(eventId);
    }

    // Handle different webhook events
    switch (event) {
      case "payment.authorized":
        await handlePaymentAuthorized(payload);
        break;

      case "payment.captured":
        await handlePaymentCaptured(payload);
        break;

      case "payment.failed":
        await handlePaymentFailed(payload);
        break;

      case "order.paid":
        await handleOrderPaid(payload);
        break;

      default:
        console.log("ℹ️ Unhandled webhook event:", event);
    }

    console.log("✅ Webhook processed successfully:", event);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ Webhook processing error:", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });

    return NextResponse.json(
      {
        error: "Webhook processing failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

async function handlePaymentAuthorized(payload: any) {
  console.log("💳 Payment authorized:", {
    paymentId: payload.payment?.id,
    orderId: payload.order?.id,
    amount: payload.payment?.amount,
    status: payload.payment?.status,
  });

  // For authorized payments, you might want to:
  // 1. Log the authorization
  // 2. Decide whether to auto-capture or manual capture
  // 3. Update order status to 'authorized'

  try {
    // Update payment status in database if you track it
    // This is where you could implement manual capture logic
    console.log("✅ Payment authorization handled");
  } catch (error) {
    console.error("❌ Error handling payment authorization:", error);
  }
}

async function handlePaymentCaptured(payload: any) {
  console.log("💰 Payment captured:", {
    paymentId: payload.payment?.id,
    orderId: payload.order?.id,
    amount: payload.payment?.amount,
    currency: payload.payment?.currency,
  });

  try {
    // Find the purchase record by payment ID
    const purchase = await prisma.purchase.findFirst({
      where: {
        paymentId: payload.payment?.id,
      },
      include: {
        post: {
          include: {
            digitalFiles: true,
          },
        },
        user: true,
      },
    });

    if (!purchase) {
      console.error("❌ Purchase not found for payment:", payload.payment?.id);
      return;
    }

    // Update purchase status to completed
    const updatedPurchase = await prisma.purchase.update({
      where: { id: purchase.id },
      data: {
        status: "completed",
        // Update currency if needed
        currency: payload.payment?.currency || purchase.currency,
      },
      include: {
        post: {
          include: {
            digitalFiles: true,
          },
        },
      },
    });

    console.log("✅ Purchase updated:", {
      purchaseId: purchase.id,
      status: "completed",
      userEmail: purchase.userEmail,
      isDigital: purchase.post.isDigital,
      digitalFilesCount: purchase.post.digitalFiles.length,
      willSendEmail:
        purchase.post.isDigital && purchase.post.digitalFiles.length > 0,
    });

    // Send confirmation email if not already sent
    if (
      updatedPurchase.post.isDigital &&
      updatedPurchase.post.digitalFiles.length > 0
    ) {
      try {
        const downloadLinks = updatedPurchase.post.digitalFiles.map((file) => ({
          fileName: file.fileName,
          fileUrl: file.fileUrl,
          fileSize: file.fileSize,
          fileType: file.fileType,
          publicId: file.publicId,
        }));

        await sendPurchaseEmail({
          to: purchase.userEmail,
          subject: `Thank You for Your Purchase - ${updatedPurchase.post.title}`,
          customerName: purchase.user?.name || "Customer",
          productName: updatedPurchase.post.title,
          price: updatedPurchase.post.price ?? undefined,
          compareAtPrice: updatedPurchase.post.compareAtPrice ?? undefined,
          downloadLinks: downloadLinks,
        });

        console.log("📧 Confirmation email sent via webhook");
      } catch (emailError) {
        console.error("❌ Failed to send webhook email:", emailError);
      }
    }
  } catch (error) {
    console.error("❌ Error handling payment captured:", error);
  }
}

async function handlePaymentFailed(payload: any) {
  console.log("❌ Payment failed:", {
    paymentId: payload.payment?.id,
    orderId: payload.order?.id,
    amount: payload.payment?.amount,
    errorCode: payload.payment?.error_code,
    errorDescription: payload.payment?.error_description,
  });

  try {
    // Find and update any pending purchase records
    const purchase = await prisma.purchase.findFirst({
      where: {
        paymentId: payload.payment?.id,
        status: "pending",
      },
    });

    if (purchase) {
      await prisma.purchase.update({
        where: { id: purchase.id },
        data: {
          status: "failed",
        },
      });

      console.log("✅ Purchase marked as failed:", purchase.id);
    }

    // You could also send failure notification emails here
  } catch (error) {
    console.error("❌ Error handling payment failed:", error);
  }
}

async function handleOrderPaid(payload: any) {
  console.log("📦 Order paid:", {
    orderId: payload.order?.id,
    amount: payload.order?.amount,
    status: payload.order?.status,
  });

  // This event is useful when you have multiple payments per order
  // or when you want to track order-level completion
}

// Helper function to clean up old event IDs (prevent memory leak)
export function cleanupProcessedEvents() {
  // Keep only last 1000 events to prevent memory issues
  if (processedWebhookEvents.size > 1000) {
    const eventsArray = Array.from(processedWebhookEvents);
    const toKeep = eventsArray.slice(-500); // Keep last 500
    processedWebhookEvents.clear();
    toKeep.forEach((event) => processedWebhookEvents.add(event));
  }
}
