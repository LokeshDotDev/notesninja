import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, firstName, lastName, phone, productId, productName, productPrice } = body;

    // Get user agent and IP address
    const userAgent = request.headers.get('user-agent') || undefined;
    const ipAddress = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     undefined;

    // Validate required fields
    if (!email || !productId || !productName) {
      return NextResponse.json(
        { error: 'Missing required fields: email, productId, productName' },
        { status: 400 }
      );
    }

    // Create or update user log
    const userLog = await prisma.userLog.create({
      data: {
        email: email.toLowerCase(),
        firstName: firstName?.trim() || null,
        lastName: lastName?.trim() || null,
        phone: phone?.trim() || null,
        productId,
        productName,
        productPrice: productPrice || null,
        userAgent,
        ipAddress,
      },
    });

    return NextResponse.json({ 
      success: true, 
      message: 'User data stored successfully',
      data: userLog 
    });

  } catch (error) {
    console.error('Error storing user log:', error);
    return NextResponse.json(
      { error: 'Failed to store user data' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { error: 'Email parameter is required' },
        { status: 400 }
      );
    }

    const userLogs = await prisma.userLog.findMany({
      where: {
        email: email.toLowerCase()
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 50 // Limit to last 50 records
    });

    return NextResponse.json({
      success: true,
      data: userLogs
    });

  } catch (error) {
    console.error('Error fetching user logs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user logs' },
      { status: 500 }
    );
  }
}
