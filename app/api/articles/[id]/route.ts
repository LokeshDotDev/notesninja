import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const article = await prisma.article.findUnique({
      where: { id },
      include: {
        author: {
          select: { id: true, name: true, email: true }
        },
        category: {
          select: { id: true, name: true, slug: true }
        },
        tagRelations: {
          include: {
            tag: true
          }
        }
      }
    });

    if (!article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    return NextResponse.json(article);
  } catch (error) {
    console.error('Error fetching article:', error);
    return NextResponse.json(
      { error: 'Failed to fetch article' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      title,
      content,
      excerpt,
      featuredImage,
      featuredImagePublicId,
      status,
      categoryId,
      tagIds,
      metaTitle,
      metaDescription,
      metaKeywords,
      ogImage,
      ogTitle,
      ogDescription,
      canonicalUrl,
      schemaMarkup,
      focusKeyword,
    } = body;

    // Get current article
    const currentArticle = await prisma.article.findUnique({
      where: { id }
    });

    if (!currentArticle) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    let slug = currentArticle.slug;
    
    // If title changed, regenerate slug
    if (title && title !== currentArticle.title) {
      let baseSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      // Ensure slug is unique (excluding current article)
      slug = baseSlug;
      let counter = 1;
      while (true) {
        const existing = await prisma.article.findUnique({ where: { slug } });
        if (!existing || existing.id === id) break;
        slug = `${baseSlug}-${counter}`;
        counter++;
      }
    }

    // Calculate word count and reading time if content changed
    let wordCount = currentArticle.wordCount;
    let readingTime = currentArticle.readingTime;
    
    if (content) {
      wordCount = content.replace(/<[^>]*>/g, '').split(/\s+/).filter((word: string) => word.length > 0).length;
      readingTime = Math.ceil(wordCount / 200);
    }

    // Update article
    const article = await prisma.article.update({
      where: { id },
      data: {
        title: title || currentArticle.title,
        slug,
        content: content || currentArticle.content,
        excerpt: excerpt !== undefined ? excerpt : currentArticle.excerpt,
        featuredImage: featuredImage !== undefined ? featuredImage : currentArticle.featuredImage,
        featuredImagePublicId: featuredImagePublicId !== undefined ? featuredImagePublicId : currentArticle.featuredImagePublicId,
        status: status || currentArticle.status,
        publishedAt: status === 'PUBLISHED' && !currentArticle.publishedAt ? new Date() : currentArticle.publishedAt,
        categoryId: categoryId !== undefined ? (categoryId || null) : currentArticle.categoryId,
        metaTitle: metaTitle !== undefined ? metaTitle : currentArticle.metaTitle,
        metaDescription: metaDescription !== undefined ? metaDescription : currentArticle.metaDescription,
        metaKeywords: metaKeywords !== undefined ? metaKeywords : currentArticle.metaKeywords,
        ogImage: ogImage !== undefined ? ogImage : currentArticle.ogImage,
        ogTitle: ogTitle !== undefined ? ogTitle : currentArticle.ogTitle,
        ogDescription: ogDescription !== undefined ? ogDescription : currentArticle.ogDescription,
        canonicalUrl: canonicalUrl !== undefined ? canonicalUrl : currentArticle.canonicalUrl,
        schemaMarkup: schemaMarkup !== undefined ? schemaMarkup : currentArticle.schemaMarkup,
        focusKeyword: focusKeyword !== undefined ? focusKeyword : currentArticle.focusKeyword,
        readingTime,
        wordCount,
        tagRelations: tagIds !== undefined ? {
          deleteMany: {},
          create: tagIds.map((tagId: string) => ({
            tag: { connect: { id: tagId } }
          }))
        } : undefined
      },
      include: {
        author: {
          select: { id: true, name: true, email: true }
        },
        category: {
          select: { id: true, name: true, slug: true }
        },
        tagRelations: {
          include: {
            tag: true
          }
        }
      }
    });

    return NextResponse.json(article);
  } catch (error) {
    console.error('Error updating article:', error);
    return NextResponse.json(
      { error: 'Failed to update article' },
      { status: 500 }
    );
  }
}

// Alias PUT to PATCH for compatibility
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  return PATCH(request, context);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await prisma.article.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting article:', error);
    return NextResponse.json(
      { error: 'Failed to delete article' },
      { status: 500 }
    );
  }
}
