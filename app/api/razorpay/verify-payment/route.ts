import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import prisma from "@/lib/prisma";
import { sendPurchaseConfirmationEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      productId,
      customerEmail,
      customerName,
      userId
    } = await req.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { error: "Missing payment verification parameters" },
        { status: 400 }
      );
    }

    // Verify the payment signature
    const secret = process.env.RAZORPAY_KEY_SECRET!;
    const generated_signature = crypto
      .createHmac('sha256', secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    const isSignatureValid = generated_signature === razorpay_signature;

    if (!isSignatureValid) {
      return NextResponse.json(
        { error: "Invalid payment signature" },
        { status: 400 }
      );
    }

    // Here you would typically:
    // 1. Save the purchase record to your database
    // 2. Send confirmation email
    // 3. Grant access to the digital files
    
    // Save purchase to database
    try {
      // Get product details
      const product = await prisma.post.findUnique({
        where: { id: productId },
        select: { price: true }
      });

      if (!product) {
        return NextResponse.json(
          { error: "Product not found" },
          { status: 404 }
        );
      }

      // Create purchase record
      const purchase = await prisma.purchase.create({
        data: {
          postId: productId,
          userEmail: customerEmail,
          userId: userId || null, // Include userId if authenticated
          paymentId: razorpay_payment_id,
          amount: product.price || 0,
          currency: "INR",
          status: "completed",
        },
        include: {
          post: {
            include: {
              digitalFiles: true
            }
          }
        }
      });

      console.log('Purchase saved successfully:', purchase);

      // Send purchase confirmation email for digital products
      if (purchase.post.isDigital && purchase.post.digitalFiles.length > 0) {
        try {
          const downloadLinks = purchase.post.digitalFiles.map(file => ({
            fileName: file.fileName,
            fileUrl: file.fileUrl
          }));

          await sendPurchaseConfirmationEmail(
            customerEmail,
            purchase.post.title,
            purchase.id,
            downloadLinks,
            purchase.post.price || undefined,
            purchase.post.compareAtPrice || undefined
          );
          
          console.log(`Purchase confirmation email sent to ${customerEmail}`);
        } catch (emailError) {
          console.error("Failed to send purchase confirmation email:", emailError);
          // Don't fail the purchase if email fails
        }
      }

    } catch (dbError) {
      console.error("Failed to save purchase:", dbError);
      // Continue with payment verification even if DB save fails
    }
    
    console.log('Payment verified successfully:', {
      razorpay_order_id,
      razorpay_payment_id,
      productId,
      customerEmail,
      customerName
    });

    return NextResponse.json({
      success: true,
      message: "Payment verified successfully",
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
    });

  } catch (error) {
    console.error("Payment verification error:", error);
    return NextResponse.json(
      { 
        error: "Payment verification failed",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
