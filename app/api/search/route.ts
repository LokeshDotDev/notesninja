import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query || query.trim().length < 2) {
      return NextResponse.json([]);
    }

    const searchQuery = query.trim().toLowerCase();

    // Search for posts that match the query
    const posts = await prisma.post.findMany({
      where: {
        OR: [
          {
            title: {
              contains: searchQuery,
              mode: 'insensitive'
            }
          },
          {
            description: {
              contains: searchQuery,
              mode: 'insensitive'
            }
          },
          {
            slug: {
              contains: searchQuery,
              mode: 'insensitive'
            }
          }
        ]
      },
      include: {
        images: {
          where: {
            isCover: true
          },
          take: 1
        },
        category: {
          select: {
            name: true,
            slug: true,
            path: true
          }
        }
      },
      orderBy: [
        {
          createdAt: 'desc'
        }
      ],
      take: 20
    });

    // Transform the results to match the expected format
    const transformedPosts = posts.map((post) => ({
      id: post.id,
      title: post.title,
      description: post.description,
      slug: post.slug,
      price: post.price,
      compareAtPrice: post.compareAtPrice,
      imageUrl: post.images[0]?.imageUrl || null,
      category: post.category,
      createdAt: post.createdAt
    }));

    return NextResponse.json(transformedPosts);
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
