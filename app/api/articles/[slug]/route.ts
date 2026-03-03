import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getArticleBySlug, updateArticle, deleteArticle } from '@/lib/articles'
import prisma from '@/lib/prisma-optimized' // Use optimized version for better performance
import { unstable_cache } from 'next/cache'

// Cache article data for 1 hour to reduce cross-region round trips
const getCachedArticle = unstable_cache(
  async (slug: string) => {
    return getArticleBySlug(slug)
  },
  ['article'], // Remove slug from cache key to avoid scoping issues
  { revalidate: 3600, tags: ['articles'] }
)

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const article = await getCachedArticle(slug)
    
    if (!article) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(article)
  } catch (error) {
    console.error('Error fetching article:', error)
    return NextResponse.json(
      { error: 'Failed to fetch article' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Batch user lookup and article fetch to reduce round trips
    const [user, existingArticle] = await Promise.all([
      prisma.user.findUnique({
        where: { email: session.user.email },
        select: { id: true, role: true }
      }),
      prisma.article.findUnique({
        where: { slug },
        select: { authorId: true, id: true }
      })
    ])

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Check if user is admin
    if (user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden: Only admins can edit articles' },
        { status: 403 }
      )
    }

    if (!existingArticle) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      )
    }

    const data = await request.json()
    const {
      title,
      excerpt,
      content,
      coverImage,
      coverImagePublicId,
      published,
      featured,
      tags,
      metaTitle,
      metaDescription,
    } = data

    const article = await updateArticle(existingArticle.id, {
      title,
      excerpt,
      content,
      coverImage,
      coverImagePublicId,
      published,
      featured,
      tags,
      metaTitle,
      metaDescription,
    })

    return NextResponse.json(article)
  } catch (error) {
    console.error('Error updating article:', error)
    return NextResponse.json(
      { error: 'Failed to update article' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Batch user lookup and article fetch to reduce round trips
    const [user, existingArticle] = await Promise.all([
      prisma.user.findUnique({
        where: { email: session.user.email },
        select: { id: true, role: true }
      }),
      prisma.article.findUnique({
        where: { slug },
        select: { authorId: true, id: true }
      })
    ])

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Check if user is admin
    if (user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden: Only admins can delete articles' },
        { status: 403 }
      )
    }

    if (!existingArticle) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      )
    }

    await deleteArticle(existingArticle.id)

    return NextResponse.json({ message: 'Article deleted successfully' })
  } catch (error) {
    console.error('Error deleting article:', error)
    return NextResponse.json(
      { error: 'Failed to delete article' },
      { status: 500 }
    )
  }
}
