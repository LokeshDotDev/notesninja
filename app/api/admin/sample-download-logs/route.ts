import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Prisma } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const search = searchParams.get('search') || '';
    const offset = (page - 1) * limit;

    // Build where clause for search
    const where: Prisma.SampleDownloadWhereInput = search ? {
      OR: [
        { name: { contains: search, mode: Prisma.QueryMode.insensitive } },
        { email: { contains: search, mode: Prisma.QueryMode.insensitive } },
        { phone: { contains: search, mode: Prisma.QueryMode.insensitive } },
        { post: { title: { contains: search, mode: Prisma.QueryMode.insensitive } } },
        { ipAddress: { contains: search, mode: Prisma.QueryMode.insensitive } },
      ],
    } : {};

    const [downloads, totalCount] = await Promise.all([
      prisma.sampleDownload.findMany({
        where,
        include: {
          post: {
            select: {
              title: true,
            },
          },
          sampleFile: {
            select: {
              fileName: true,
              fileType: true,
            },
          },
        },
        orderBy: {
          downloadedAt: 'desc',
        },
        skip: offset,
        take: limit,
      }),
      prisma.sampleDownload.count({ where }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      data: downloads,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
      },
    });

  } catch (error) {
    console.error('Error fetching sample download logs:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { format, search } = await request.json();

    const where: Prisma.SampleDownloadWhereInput = search ? {
      OR: [
        { name: { contains: search, mode: Prisma.QueryMode.insensitive } },
        { email: { contains: search, mode: Prisma.QueryMode.insensitive } },
        { phone: { contains: search, mode: Prisma.QueryMode.insensitive } },
        { post: { title: { contains: search, mode: Prisma.QueryMode.insensitive } } },
        { ipAddress: { contains: search, mode: Prisma.QueryMode.insensitive } },
      ],
    } : {};

    const downloads = await prisma.sampleDownload.findMany({
      where,
      include: {
        post: {
          select: {
            title: true,
          },
        },
        sampleFile: {
          select: {
            fileName: true,
            fileType: true,
          },
        },
      },
      orderBy: {
        downloadedAt: 'desc',
      },
    });

    if (format === 'csv') {
      const headers = [
        'Date',
        'Name',
        'Email',
        'Phone',
        'Product',
        'File Name',
        'File Type',
        'IP Address',
        'User Agent'
      ];

      const csvData = downloads.map(download => [
        download.downloadedAt.toISOString(),
        download.name,
        download.email,
        download.phone,
        download.post.title,
        download.sampleFile.fileName,
        download.sampleFile.fileType,
        download.ipAddress || '',
        download.userAgent || ''
      ]);

      const csvContent = [headers, ...csvData]
        .map(row => row.map(cell => `"${cell}"`).join(','))
        .join('\n');

      return new NextResponse(csvContent, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="sample-download-logs-${new Date().toISOString().split('T')[0]}.csv"`,
        },
      });
    } else {
      return NextResponse.json({
        data: downloads,
      });
    }

  } catch (error) {
    console.error('Error exporting sample download logs:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
