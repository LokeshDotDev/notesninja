import { Prisma } from '@prisma/client'
import { deleteContent } from '@/lib/Cloudinary'
import prisma from '@/lib/prisma-optimized'

type CloudinaryResourceType = 'image' | 'video' | 'raw'

function extractCloudinaryPublicIdFromUrl(url?: string | null): string | null {
  if (!url || !url.includes('res.cloudinary.com')) return null

  try {
    const pathname = new URL(url).pathname
    const uploadSegment = '/upload/'
    const uploadIndex = pathname.indexOf(uploadSegment)
    if (uploadIndex === -1) return null

    let publicPath = pathname.slice(uploadIndex + uploadSegment.length)

    // Remove optional version segment like v1740912345/
    publicPath = publicPath.replace(/^v\d+\//, '')

    // Remove extension from final segment for Cloudinary public_id
    publicPath = publicPath.replace(/\.[a-zA-Z0-9]+$/, '')

    return decodeURIComponent(publicPath)
  } catch {
    return null
  }
}

function extractCloudinaryAssetsFromContent(content?: string | null): Array<{ publicId: string; resourceType: CloudinaryResourceType }> {
  if (!content) return []

  const assets: Array<{ publicId: string; resourceType: CloudinaryResourceType }> = []
  const seen = new Set<string>()

  // Capture Cloudinary URLs from src/href attributes in HTML content
  const cloudinaryUrlRegex = /https?:\/\/res\.cloudinary\.com\/[^"'\s)]+/g
  const matches = content.match(cloudinaryUrlRegex) || []

  for (const rawUrl of matches) {
    try {
      const url = new URL(rawUrl)
      const pathname = url.pathname

      let resourceType: CloudinaryResourceType = 'image'
      if (pathname.includes('/video/upload/')) {
        resourceType = 'video'
      } else if (pathname.includes('/raw/upload/')) {
        resourceType = 'raw'
      }

      const publicId = extractCloudinaryPublicIdFromUrl(rawUrl)
      if (!publicId) continue

      const dedupeKey = `${resourceType}:${publicId}`
      if (seen.has(dedupeKey)) continue

      seen.add(dedupeKey)
      assets.push({ publicId, resourceType })
    } catch {
      // ignore invalid URLs inside content
    }
  }

  return assets
}

export interface Article {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string
  coverImage?: string | null
  coverImagePublicId?: string | null
  published: boolean
  featured: boolean
  views: number
  readingTime: number
  tags: string[]
  metaTitle?: string | null
  metaDescription?: string | null
  createdAt: string
  updatedAt: string
  publishedAt?: string | null
  author: {
    id: string
    name: string | null
    email: string
  }
  authorId: string
}

export interface ArticlePreview {
  id: string
  title: string
  slug: string
  excerpt: string | null
  coverImage?: string | null
  published: boolean
  featured: boolean
  views: number
  readingTime: number
  tags: string[]
  createdAt: string
  publishedAt?: string | null
  author: {
    id: string
    name: string | null
    email: string
  }
}

function buildArticleWhere(options: {
  published: boolean
  featured?: boolean
  search?: string
  publishedAfter?: Date
  searchInContent?: boolean
}): Prisma.ArticleWhereInput {
  const { published, featured, search, publishedAfter, searchInContent = true } = options
  const where: Prisma.ArticleWhereInput = { published }

  if (featured !== undefined) {
    where.featured = featured
  }

  if (publishedAfter) {
    where.publishedAt = { gte: publishedAfter }
  }

  if (search) {
    const searchClauses: Prisma.ArticleWhereInput[] = [
      { title: { contains: search, mode: 'insensitive' } },
      { excerpt: { contains: search, mode: 'insensitive' } },
      { tags: { hasSome: [search] } },
    ]

    if (searchInContent) {
      searchClauses.push({ content: { contains: search, mode: 'insensitive' } })
    }

    where.OR = searchClauses
  }

  return where
}

function buildArticleOrderBy(sortBy: 'latest' | 'popular' | 'oldest'): Prisma.ArticleOrderByWithRelationInput {
  switch (sortBy) {
    case 'popular':
      return { views: 'desc' }
    case 'oldest':
      return { createdAt: 'asc' }
    case 'latest':
    default:
      return { publishedAt: 'desc' }
  }
}

export async function getArticles(options: {
  published?: boolean
  featured?: boolean
  limit?: number
  offset?: number
  sortBy?: 'latest' | 'popular' | 'oldest'
  search?: string
} = {}): Promise<Article[]> {
  const {
    published = true,
    featured,
    limit = 20,
    offset = 0,
    sortBy = 'latest',
    search
  } = options

  const where = buildArticleWhere({ published, featured, search, searchInContent: true })
  const orderBy = buildArticleOrderBy(sortBy)

  // Optimized query with specific fields only
  const articles = await prisma.article.findMany({
    where,
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy,
    take: limit,
    skip: offset,
  })

  return articles.map(article => ({
    ...article,
    createdAt: article.createdAt.toISOString(),
    updatedAt: article.updatedAt.toISOString(),
    publishedAt: article.publishedAt?.toISOString(),
  }))
}

export async function getArticlePreviews(options: {
  published?: boolean
  featured?: boolean
  limit?: number
  offset?: number
  sortBy?: 'latest' | 'popular' | 'oldest'
  search?: string
  publishedAfter?: Date
} = {}): Promise<ArticlePreview[]> {
  const {
    published = true,
    featured,
    limit = 20,
    offset = 0,
    sortBy = 'latest',
    search,
    publishedAfter,
  } = options

  const where = buildArticleWhere({
    published,
    featured,
    search,
    publishedAfter,
    searchInContent: false,
  })
  const orderBy = buildArticleOrderBy(sortBy)

  const articles = await prisma.article.findMany({
    where,
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      coverImage: true,
      published: true,
      featured: true,
      views: true,
      readingTime: true,
      tags: true,
      createdAt: true,
      publishedAt: true,
      author: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy,
    take: limit,
    skip: offset,
  })

  return articles.map(article => ({
    ...article,
    createdAt: article.createdAt.toISOString(),
    publishedAt: article.publishedAt?.toISOString(),
  }))
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const article = await prisma.article.findUnique({
    where: { slug },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  })

  if (!article) {
    return null
  }

  // Increment view count
  await prisma.article.update({
    where: { id: article.id },
    data: { views: { increment: 1 } },
  })

  return {
    ...article,
    createdAt: article.createdAt.toISOString(),
    updatedAt: article.updatedAt.toISOString(),
    publishedAt: article.publishedAt?.toISOString(),
  }
}

export async function getRelatedArticles(
  articleId: string,
  tags: string[],
  limit: number = 3
): Promise<Article[]> {
  // Find articles with similar tags
  const articles = await prisma.article.findMany({
    where: {
      id: { not: articleId },
      published: true,
      tags: { hasSome: tags },
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
    orderBy: { views: 'desc' },
    take: limit,
  })

  // If not enough articles with similar tags, get latest articles
  if (articles.length < limit) {
    const additionalArticles = await prisma.article.findMany({
      where: {
        id: { not: articleId, notIn: articles.map(a => a.id) },
        published: true,
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
      take: limit - articles.length,
    })

    articles.push(...additionalArticles)
  }

  return articles.map(article => ({
    ...article,
    createdAt: article.createdAt.toISOString(),
    updatedAt: article.updatedAt.toISOString(),
    publishedAt: article.publishedAt?.toISOString(),
  }))
}

export async function createArticle(data: {
  title: string
  slug: string
  excerpt: string
  content: string
  coverImage?: string
  coverImagePublicId?: string
  published: boolean
  featured: boolean
  tags: string[]
  metaTitle?: string
  metaDescription?: string
  authorId: string
}): Promise<Article> {
  // Calculate reading time (average 200 words per minute)
  const wordCount = data.content.split(/\s+/).length
  const readingTime = Math.ceil(wordCount / 200)

  const article = await prisma.article.create({
    data: {
      ...data,
      readingTime,
      publishedAt: data.published ? new Date() : null,
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
  })

  return {
    ...article,
    createdAt: article.createdAt.toISOString(),
    updatedAt: article.updatedAt.toISOString(),
    publishedAt: article.publishedAt?.toISOString(),
  }
}

export async function updateArticle(
  id: string,
  data: Partial<{
    title: string
    slug: string
    excerpt: string
    content: string
    coverImage?: string
    coverImagePublicId?: string
    published: boolean
    featured: boolean
    tags: string[]
    metaTitle?: string
    metaDescription?: string
  }>
): Promise<Article> {
  // Calculate reading time if content is updated
  let readingTime = undefined
  if (data.content) {
    const wordCount = data.content.split(/\s+/).length
    readingTime = Math.ceil(wordCount / 200)
  }

  // Set publishedAt if article is being published for the first time
  const updateData: typeof data & { readingTime?: number; publishedAt?: Date } = { ...data }
  if (data.published && readingTime !== undefined) {
    updateData.readingTime = readingTime
    updateData.publishedAt = new Date()
  } else if (data.content && readingTime !== undefined) {
    updateData.readingTime = readingTime
  }

  const article = await prisma.article.update({
    where: { id },
    data: updateData,
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  })

  return {
    ...article,
    createdAt: article.createdAt.toISOString(),
    updatedAt: article.updatedAt.toISOString(),
    publishedAt: article.publishedAt?.toISOString(),
  }
}

export async function deleteArticle(id: string): Promise<void> {
  const article = await prisma.article.findUnique({
    where: { id },
    select: {
      coverImage: true,
      coverImagePublicId: true,
      content: true,
    },
  })

  const coverPublicId = article?.coverImagePublicId || extractCloudinaryPublicIdFromUrl(article?.coverImage)
  const contentAssets = extractCloudinaryAssetsFromContent(article?.content)

  const assetsToDelete: Array<{ publicId: string; resourceType: CloudinaryResourceType }> = []

  if (coverPublicId) {
    assetsToDelete.push({ publicId: coverPublicId, resourceType: 'image' })
  }

  assetsToDelete.push(...contentAssets)

  const dedupedAssets = Array.from(
    new Map(assetsToDelete.map((asset) => [`${asset.resourceType}:${asset.publicId}`, asset])).values()
  )

  for (const asset of dedupedAssets) {
    try {
      await deleteContent(asset.publicId, asset.resourceType)
    } catch (error) {
      console.error(`Failed to delete Cloudinary asset (${asset.resourceType}) ${asset.publicId}:`, error)
    }
  }

  await prisma.article.delete({
    where: { id },
  })
}

export async function generateUniqueSlug(title: string, excludeId?: string): Promise<string> {
  let slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

  let isUnique = false
  let counter = 1

  while (!isUnique) {
    const existingArticle = await prisma.article.findFirst({
      where: {
        slug,
        ...(excludeId && { id: { not: excludeId } }),
      },
      select: { id: true },
    })

    if (!existingArticle) {
      isUnique = true
    } else {
      slug = `${slug}-${counter}`
      counter++
    }
  }

  return slug
}
