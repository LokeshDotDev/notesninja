import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const fileName = searchParams.get('file');

  if (!fileName || fileName !== 'udfqcfua9mzrfa6zp5jath0qx5skal.html') {
    return NextResponse.json({ error: 'File not found' }, { status: 404 });
  }

  try {
    const filePath = join(process.cwd(), fileName);
    const fileContents = await readFile(filePath, 'utf-8');
    
    return new NextResponse(fileContents, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      },
    });
  } catch (error) {
    console.error('Error serving HTML file:', error);
    return NextResponse.json({ error: 'File not found' }, { status: 404 });
  }
}
