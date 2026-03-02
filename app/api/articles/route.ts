import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { 
  getArticles, 
  createArticle, 
  generateUniqueSlug 
} from '@/lib/articles'
import prisma from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const publishedParam = searchParams.get('published')
    const published = publishedParam === null ? true : publishedParam !== 'false'
    const featured = searchParams.get('featured') === 'true'
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')
    const sortBy = searchParams.get('sort') as 'latest' | 'popular' | 'oldest' || 'latest'
    const filter = searchParams.get('filter') || 'all'
    const search = searchParams.get('search') || undefined

    let filterFeatured = featured
    const filterPublished = published

    // Handle filter parameter
    if (filter === 'featured') {
      filterFeatured = true
    } else if (filter === 'recent') {
      // Recent articles from the last 7 days
      const sevenDaysAgo = new Date()
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
      
      const articles = await prisma.article.findMany({
        where: {
          published: true,
          publishedAt: {
            gte: sevenDaysAgo
          }
        },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: { publishedAt: 'desc' },
        take: limit,
        skip: offset,
      })

      const formattedArticles = articles.map(article => ({
        ...article,
        createdAt: article.createdAt.toISOString(),
        updatedAt: article.updatedAt.toISOString(),
        publishedAt: article.publishedAt?.toISOString(),
      }))

      return NextResponse.json(formattedArticles)
    }

    const articles = await getArticles({
      published: filterPublished,
      featured: filterFeatured,
      limit,
      offset,
      sortBy,
      search,
    })

    return NextResponse.json(articles)
  } catch (error) {
    console.error('Error fetching articles:', error)
    return NextResponse.json(
      { error: 'Failed to fetch articles' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, role: true }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Check if user is admin
    if (user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden: Only admins can create articles' },
        { status: 403 }
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

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      )
    }

    // Generate unique slug
    const slug = await generateUniqueSlug(title)

    const article = await createArticle({
      title,
      slug,
      excerpt: excerpt || '',
      content,
      coverImage,
      coverImagePublicId,
      published: published || false,
      featured: featured || false,
      tags: tags || [],
      metaTitle,
      metaDescription,
      authorId: user.id,
    })

    return NextResponse.json(article, { status: 201 })
  } catch (error) {
    console.error('Error creating article:', error)
    return NextResponse.json(
      { error: 'Failed to create article' },
      { status: 500 }
    )
  }
}
