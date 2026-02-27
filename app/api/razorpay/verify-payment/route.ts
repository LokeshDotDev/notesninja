import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import prisma from "@/lib/prisma";
import { sendPurchaseEmail } from "@/lib/brevo";

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  
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

    console.log('🔍 Starting payment verification:', {
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      productId,
      customerEmail,
      hasSignature: !!razorpay_signature,
      timestamp: new Date().toISOString()
    });

    // Validate required fields
    const requiredFields = {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      productId,
      customerEmail
    };
    
    const missingFields = Object.keys(requiredFields).filter(key => {
      const value = requiredFields[key as keyof typeof requiredFields];
      return !value;
    });
    
    if (missingFields.length > 0) {
      console.error('❌ Missing required parameters:', missingFields);
      return NextResponse.json(
        { 
          error: `Missing required parameters: ${missingFields.join(', ')}`,
          code: 'MISSING_FIELDS'
        },
        { status: 400 }
      );
    }

    // Validate environment variables
    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
      console.error('❌ RAZORPAY_KEY_SECRET not configured');
      return NextResponse.json(
        { 
          error: "Server configuration error",
          code: 'CONFIG_ERROR'
        },
        { status: 500 }
      );
    }

    // Verify Razorpay signature using HMAC SHA256
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    // Check if signatures have same length before comparing
    if (!razorpay_signature || expectedSignature.length !== razorpay_signature.length) {
      console.error('❌ Signature length mismatch');
      return NextResponse.json(
        { 
          error: "Invalid payment signature",
          code: 'INVALID_SIGNATURE'
        },
        { status: 400 }
      );
    }

    const isSignatureValid = crypto.timingSafeEqual(
      Buffer.from(expectedSignature),
      Buffer.from(razorpay_signature)
    );

    console.log('🔐 Signature validation result:', {
      isValid: isSignatureValid,
      expectedLength: expectedSignature.length,
      receivedLength: razorpay_signature.length
    });

    if (!isSignatureValid) {
      console.error('❌ Invalid payment signature - possible tampering detected');
      return NextResponse.json(
        { 
          error: "Invalid payment signature",
          code: 'INVALID_SIGNATURE'
        },
        { status: 400 }
      );
    }

    // Prevent duplicate purchases - check if payment ID already exists
    console.log('🔍 Checking for duplicate payment:', razorpay_payment_id);
    const existingPurchase = await prisma.purchase.findFirst({
      where: { paymentId: razorpay_payment_id },
      select: { id: true, status: true, emailSent: true, createdAt: true }
    });

    if (existingPurchase) {
      console.log('⚠️ Duplicate payment detected:', {
        purchaseId: existingPurchase.id,
        status: existingPurchase.status,
        emailSent: existingPurchase.emailSent,
        createdAt: existingPurchase.createdAt
      });
      
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
    console.log('📦 Fetching product:', productId);
    const product = await prisma.post.findFirst({
      where: {
        OR: [{ id: productId }, { slug: productId }]
      },
      include: {
        digitalFiles: true
      }
    });

    if (!product) {
      console.error('❌ Product not found:', productId);
      return NextResponse.json(
        { 
          error: "Product not found",
          code: 'PRODUCT_NOT_FOUND'
        },
        { status: 404 }
      );
    }

    console.log('✅ Product found:', {
      id: product.id,
      title: product.title,
      isDigital: product.isDigital,
      filesCount: product.digitalFiles.length,
      price: product.price
    });

    // Create purchase record with emailSent = false
    console.log('💾 Creating purchase record...');
    const purchase = await prisma.purchase.create({
      data: {
        postId: product.id,
        userEmail: customerEmail,
        userId: userId || null,
        paymentId: razorpay_payment_id,
        amount: product.price || 0,
        currency: "INR",
        status: "completed",
        emailSent: false // Explicitly set to false
      },
      include: {
        post: {
          include: {
            digitalFiles: true
          }
        }
      }
    });

    console.log('✅ Purchase created:', {
      purchaseId: purchase.id,
      userEmail: purchase.userEmail,
      amount: purchase.amount,
      status: purchase.status,
      emailSent: purchase.emailSent
    });

    // Send confirmation email for digital products
    let emailSent = false;
    let emailError: string | undefined;
    
    if (purchase.post.isDigital && purchase.post.digitalFiles.length > 0) {
      console.log('📧 Sending confirmation email for digital product');
      
      try {
        const downloadLinks = purchase.post.digitalFiles.map(file => ({
          fileName: file.fileName,
          fileUrl: file.fileUrl,
          fileSize: file.fileSize,
          fileType: file.fileType,
          publicId: file.publicId
        }));

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
          console.log('✅ Email sent successfully:', {
            to: customerEmail,
            messageId: emailResult.messageId
          });
          emailSent = true;
          
          // Update purchase record with email confirmation
          await prisma.purchase.update({
            where: { id: purchase.id },
            data: {
              emailSent: true,
              emailSentAt: new Date()
            }
          });
          
          console.log('✅ Purchase record updated with email confirmation');
        } else {
          emailError = emailResult.error;
          console.error('❌ Email failed to send:', emailError);
        }
      } catch (emailError) {
        emailError = emailError instanceof Error ? emailError.message : String(emailError);
        console.error('❌ Email sending error:', emailError);
      }
    } else {
      console.log('⏭️ Skipping email - not a digital product or no files');
    }

    const processingTime = Date.now() - startTime;
    console.log('✅ Payment verification completed:', {
      purchaseId: purchase.id,
      paymentId: razorpay_payment_id,
      emailSent,
      processingTimeMs: processingTime
    });

    return NextResponse.json({
      success: true,
      message: "Payment verified and processed successfully",
      purchaseId: purchase.id,
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      status: purchase.status,
      emailSent,
      emailError: emailError || undefined,
      processingTimeMs: processingTime
    });
  } catch (error) {
    const processingTime = Date.now() - startTime;
    console.error('❌ Payment verification failed:', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      processingTimeMs: processingTime
    });
    
    return NextResponse.json(
      {
        error: "Payment verification failed",
        details: error instanceof Error ? error.message : "Unknown error",
        code: 'VERIFICATION_ERROR',
        processingTimeMs: processingTime
      },
      { status: 500 },
    );
  }
}
