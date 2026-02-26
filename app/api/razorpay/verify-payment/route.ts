import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendPurchaseEmail } from "@/lib/brevo";
import { createRazorpaySecurity } from "@/lib/razorpay-security";

export async function POST(req: NextRequest) {
  const razorpaySecurity = createRazorpaySecurity();

  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      productId,
      customerEmail,
      customerName,
      userId,
    } = await req.json();

    razorpaySecurity.logSecurityEvent("payment_verification_started", {
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      productId,
      customerEmail,
      hasSignature: !!razorpay_signature,
    });

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      const missingFields = [];
      if (!razorpay_order_id) missingFields.push("razorpay_order_id");
      if (!razorpay_payment_id) missingFields.push("razorpay_payment_id");
      if (!razorpay_signature) missingFields.push("razorpay_signature");
      console.error("❌ Missing parameters:", missingFields);
      return NextResponse.json(
        { error: `Missing parameters: ${missingFields.join(", ")}` },
        { status: 400 },
      );
    }

    // Enhanced signature verification using security utility
    try {
      const isSignatureValid = razorpaySecurity.verifyPaymentSignature(
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
      );

      razorpaySecurity.logSecurityEvent("signature_verification", {
        isValid: isSignatureValid,
        orderId: razorpay_order_id,
      });

      if (!isSignatureValid) {
        console.error("❌ Invalid payment signature");
        return NextResponse.json(
          {
            error: razorpaySecurity.getErrorMessage(
              "Invalid payment signature",
            ),
          },
          { status: 400 },
        );
      }
    } catch (error) {
      console.error("❌ Signature verification error:", error);
      return NextResponse.json(
        {
          error: razorpaySecurity.getErrorMessage(
            "Signature verification failed",
          ),
        },
        { status: 500 },
      );
    }

    // Here you would typically:
    // 1. Save the purchase record to your database
    // 2. Send confirmation email
    // 3. Grant access to the digital files

    // Save purchase to database
    try {
      // Get product details (including isDigital and digitalFiles for email trigger)
      console.log("📦 Fetching product:", productId);
      const product = await prisma.post.findFirst({
        where: {
          OR: [{ id: productId }, { slug: productId }],
        },
        include: {
          digitalFiles: true,
        },
      });

      if (!product) {
        console.error("❌ Product not found:", productId);
        return NextResponse.json(
          { error: "Product not found" },
          { status: 404 },
        );
      }

      console.log("✅ Product found:", {
        id: product.id,
        slug: product.slug,
        title: product.title,
        isDigital: product.isDigital,
        filesCount: product.digitalFiles.length,
        price: product.price,
      });

      // Create purchase record
      console.log("💾 Creating purchase record...");
      const purchase = await prisma.purchase.create({
        data: {
          postId: product.id,
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
              digitalFiles: true,
            },
          },
        },
      });

      console.log("✅ Purchase created:", {
        purchaseId: purchase.id,
        userId: purchase.userId,
        userEmail: purchase.userEmail,
        productId: purchase.postId,
        amount: purchase.amount,
        status: purchase.status,
      });

      console.log("📧 Email eligibility check:", {
        isDigital: purchase.post.isDigital,
        digitalFilesCount: purchase.post.digitalFiles.length,
        willSendEmail:
          purchase.post.isDigital && purchase.post.digitalFiles.length > 0,
      });

      // Send purchase confirmation email for digital products
      if (purchase.post.isDigital && purchase.post.digitalFiles.length > 0) {
        try {
          console.log("📤 Preparing email for:", customerEmail);
          const downloadLinks = purchase.post.digitalFiles.map((file) => ({
            fileName: file.fileName,
            fileUrl: file.fileUrl,
            fileSize: file.fileSize,
            fileType: file.fileType,
            publicId: file.publicId,
          }));

          console.log('📬 Sending email via Brevo with retry mechanism...');
          const emailResult = await sendPurchaseEmail({
            to: customerEmail,
            subject: `Thank You for Your Purchase - ${purchase.post.title}`,
            customerName: customerName,
            productName: purchase.post.title,
            price: purchase.post.price ?? undefined,
            compareAtPrice: purchase.post.compareAtPrice ?? undefined,
            downloadLinks: downloadLinks,
          });
          
          if (emailResult.success) {
            console.log(`✅ Email sent successfully to ${customerEmail}`);
            console.log(`📧 Message ID: ${emailResult.messageId}`);
          } else {
            console.error(`❌ Email failed to send to ${customerEmail}:`, emailResult.error);
          }
        } catch (emailError) {
          console.error("❌ Failed to send email:", {
            error:
              emailError instanceof Error
                ? emailError.message
                : String(emailError),
            to: customerEmail,
          });
          // Don't fail the purchase if email fails - it can be retried via webhook
        }
      } else {
        console.log("⏭️ Skipping email - not a digital product or no files");
      }
    } catch (dbError) {
      console.error("❌ Database error:", {
        error: dbError instanceof Error ? dbError.message : String(dbError),
      });
      // Still return success if payment was verified - purchase might have been created
      // but we need to know about this in logs
      return NextResponse.json({
        success: true,
        message: "Payment verified (database error occurred)",
        paymentId: razorpay_payment_id,
        warning: "Purchase may not have been recorded",
      });
    }

    console.log("✅ Payment verified successfully!", {
      razorpay_order_id,
      razorpay_payment_id,
      productId,
      customerEmail,
      customerName,
    });

    return NextResponse.json({
      success: true,
      message: "Payment verified successfully",
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
    });
  } catch (error) {
    console.error("❌ Payment verification error:", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    return NextResponse.json(
      {
        error: "Payment verification failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
