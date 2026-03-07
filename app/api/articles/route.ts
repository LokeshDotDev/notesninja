import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { 
  getArticles, 
  createArticle, 
  generateUniqueSlug 
} from '@/lib/articles'
import prisma from '@/lib/prisma-optimized' // Use optimized version for better performance

// No caching - fetch articles fresh from database every time for instant deletions
async function getCachedArticles(params: {
  published: boolean
  featured?: boolean
  limit?: number
  offset?: number
  sortBy?: string
  search?: string
}) {
  return getArticles({
    published: params.published,
    featured: params.featured,
    limit: params.limit || 20,
    offset: params.offset || 0,
    sortBy: params.sortBy as 'latest' | 'popular' | 'oldest' || 'latest',
    search: params.search,
  })
}

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
      // Recent articles from last 7 days - use cached version
      const sevenDaysAgo = new Date()
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
      
      const articles = await getCachedArticles({
        published: true,
        limit,
        offset,
        sortBy: 'latest'
      })
      
      // Filter recent articles locally (faster than DB query)
      const recentArticles = articles.filter(article => 
        article.publishedAt && new Date(article.publishedAt) >= sevenDaysAgo
      )

      return NextResponse.json(recentArticles)
    }

    // Use cached articles for all other queries
    const articles = await getCachedArticles({
      published: filterPublished,
      featured: filterFeatured,
      limit,
      offset,
      sortBy,
      search
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

    const data = await request.json()
    const {
      title,
      slug,
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

    // Batch user lookup and slug generation to reduce round trips
    const [user, finalSlug] = await Promise.all([
      prisma.user.findUnique({
        where: { email: session.user.email },
        select: { id: true, role: true }
      }),
      slug ? Promise.resolve(slug) : generateUniqueSlug(title)
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
        { error: 'Forbidden: Only admins can create articles' },
        { status: 403 }
      )
    }

    // Create article in single transaction
    const article = await createArticle({
      title,
      slug: finalSlug,
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
