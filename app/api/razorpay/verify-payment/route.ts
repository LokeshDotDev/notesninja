import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import prisma from "@/lib/prisma";
import { sendPurchaseEmail } from "@/lib/brevo";

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  
  try {
    const body = await req.json();
    
    // Validate required fields safely
    const requiredFields = ['razorpay_order_id', 'razorpay_payment_id', 'razorpay_signature', 'productId', 'customerEmail'];
    const missingFields = requiredFields.filter(field => !body[field]);
    
    if (missingFields.length > 0) {
      console.error('❌ Missing required parameters:', missingFields);
      return NextResponse.json(
        { error: `Missing required parameters: ${missingFields.join(', ')}`, code: 'MISSING_FIELDS' },
        { status: 400 }
      );
    }

    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      productId,
      customerEmail,
      customerName,
      userId
    } = body;

    // Type safety check for signature
    if (typeof razorpay_signature !== 'string') {
      return NextResponse.json({ error: "Invalid signature format", code: 'INVALID_FORMAT' }, { status: 400 });
    }

    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
      console.error('❌ RAZORPAY_KEY_SECRET not configured');
      return NextResponse.json({ error: "Server configuration error", code: 'CONFIG_ERROR' }, { status: 500 });
    }

    // Verify Razorpay signature
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (expectedSignature.length !== razorpay_signature.length) {
      console.error('❌ Signature length mismatch');
      return NextResponse.json({ error: "Invalid payment signature", code: 'INVALID_SIGNATURE' }, { status: 400 });
    }

    const isSignatureValid = crypto.timingSafeEqual(
      Buffer.from(expectedSignature),
      Buffer.from(razorpay_signature)
    );

    if (!isSignatureValid) {
      console.error('❌ Invalid payment signature - possible tampering detected');
      return NextResponse.json({ error: "Invalid payment signature", code: 'INVALID_SIGNATURE' }, { status: 400 });
    }

    // Prevent duplicate purchases
    const existingPurchase = await prisma.purchase.findFirst({
      where: { paymentId: razorpay_payment_id },
      select: { id: true, status: true, emailSent: true, createdAt: true }
    });

    if (existingPurchase) {
      return NextResponse.json({
        success: true,
        message: "Payment already processed",
        purchaseId: existingPurchase.id,
        status: existingPurchase.status,
        emailSent: existingPurchase.emailSent,
        isDuplicate: true
      });
    }

    // Fetch product details
    const product = await prisma.post.findFirst({
      where: { OR: [{ id: productId }, { slug: productId }] },
      include: { digitalFiles: true }
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found", code: 'PRODUCT_NOT_FOUND' }, { status: 404 });
    }

    // Create purchase record
    const purchase = await prisma.purchase.create({
      data: {
        postId: product.id,
        userEmail: customerEmail,
        userId: userId || null,
        paymentId: razorpay_payment_id,
        amount: product.price || 0,
        currency: "INR",
        status: "completed",
        emailSent: false
      },
      include: {
        post: { include: { digitalFiles: true } }
      }
    });

    // --- EMAIL SENDING LOGIC ---
    let emailSent = false;
    let emailError: string | undefined;
    
    try {
      console.log(`📧 Attempting to send confirmation email to ${customerEmail}`);
      
      // Prepare download links ONLY if files exist
      let downloadLinks = undefined;
      if (purchase.post.isDigital && purchase.post.digitalFiles && purchase.post.digitalFiles.length > 0) {
        downloadLinks = purchase.post.digitalFiles.map(file => ({
          fileName: file.fileName,
          fileUrl: file.fileUrl,
          fileSize: file.fileSize,
          fileType: file.fileType,
          publicId: file.publicId
        }));
      }

      // Send the email regardless of whether it's a digital or physical product
      const emailResult = await sendPurchaseEmail({
        to: customerEmail,
        subject: `Thank You for Your Purchase - ${purchase.post.title}`,
        customerName: customerName || "Customer",
        productName: purchase.post.title,
        price: purchase.post.price ?? undefined,
        compareAtPrice: purchase.post.compareAtPrice ?? undefined,
        downloadLinks: downloadLinks
      });
      
      if (emailResult.success) {
        console.log('✅ Email sent successfully');
        emailSent = true;
        await prisma.purchase.update({
          where: { id: purchase.id },
          data: { emailSent: true, emailSentAt: new Date() }
        });
      } else {
        emailError = emailResult.error;
        console.error('❌ Email failed to send through Brevo:', emailError);
      }
    } catch (err) {
      emailError = err instanceof Error ? err.message : String(err);
      console.error('❌ Email sending error caught:', emailError);
    }

    return NextResponse.json({
      success: true,
      message: "Payment verified and processed successfully",
      purchaseId: purchase.id,
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      status: purchase.status,
      emailSent,
      emailError,
      processingTimeMs: Date.now() - startTime
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Payment verification failed",
        details: error instanceof Error ? error.message : "Unknown error",
        code: 'VERIFICATION_ERROR',
        processingTimeMs: Date.now() - startTime
      },
      { status: 500 },
    );
  }
}
