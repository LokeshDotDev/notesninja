import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Helper to convert data to CSV
function convertToCSV(data: Array<Record<string, unknown>>): string {
  if (data.length === 0) return '';
  
  const headers = Object.keys(data[0]);
  const csvRows = [];
  
  // Add headers
  csvRows.push(headers.join(','));
  
  // Add rows
  for (const row of data) {
    const values = headers.map(header => {
      const value = row[header];
      // Handle null/undefined
      if (value === null || value === undefined) return '';
      // Handle strings with commas or quotes
      const stringValue = String(value);
      if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
        return `"${stringValue.replace(/"/g, '""')}"`;
      }
      return stringValue;
    });
    csvRows.push(values.join(','));
  }
  
  return csvRows.join('\n');
}

export async function GET(request: NextRequest) {
  try {
    // Check admin authentication
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const format = searchParams.get('format') || 'csv';

    // Build where clause for search
    const where = search ? {
      OR: [
        { email: { contains: search, mode: 'insensitive' as const } },
        { firstName: { contains: search, mode: 'insensitive' as const } },
        { lastName: { contains: search, mode: 'insensitive' as const } },
        { productName: { contains: search, mode: 'insensitive' as const } },
        { ipAddress: { contains: search, mode: 'insensitive' as const } },
      ],
    } : {};

    // Get all logs for export (no pagination)
    const logs = await prisma.userLog.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Format data for export
    const exportData = logs.map(log => ({
      ID: log.id,
      Email: log.email,
      FirstName: log.firstName || '',
      LastName: log.lastName || '',
      Phone: log.phone || '',
      ProductID: log.productId,
      ProductName: log.productName,
      ProductPrice: log.productPrice || '',
      IPAddress: log.ipAddress || '',
      UserAgent: log.userAgent || '',
      CreatedAt: log.createdAt.toISOString(),
      UpdatedAt: log.updatedAt.toISOString(),
    }));

    if (format === 'json') {
      // Return as JSON
      return NextResponse.json({
        success: true,
        data: exportData,
        count: exportData.length,
      });
    }

    // Generate CSV
    const csv = convertToCSV(exportData);
    
    // Add BOM for Excel compatibility
    const csvWithBOM = '\uFEFF' + csv;
    
    // Return CSV as downloadable file
    return new NextResponse(csvWithBOM, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="user-logs-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    });

  } catch (error) {
    console.error('Error exporting user logs:', error);
    return NextResponse.json(
      { error: 'Failed to export user logs' },
      { status: 500 }
    );
  }
}
