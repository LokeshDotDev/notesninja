import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';

export async function GET() {
  try {
    const filePath = join(process.cwd(), 'udfqcfua9mzrfa6zp5jath0qx5skal.html');
    const fileContents = await readFile(filePath, 'utf-8');
    
    return new NextResponse(fileContents, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error('Error serving HTML file:', error);
    return NextResponse.json({ error: 'File not found' }, { status: 404 });
  }
}
