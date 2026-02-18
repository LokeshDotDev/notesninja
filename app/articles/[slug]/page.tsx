import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/auth';
import { ArticleActions } from '@/components/custom/ArticleActions';
import Image from 'next/image';
import {
  Calendar,
  Clock,
  Eye,
  User,
  ArrowLeft,
  Tag,
} from 'lucide-react';

interface ArticlePageProps {
  params: Promise<{
    slug: string;
  }>;
}

async function getArticle(slug: string) {
  const article = await prisma.article.findFirst({
    where: {
      slug,
      status: 'PUBLISHED',
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          image: true,
          email: true,
        },
      },
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
      tagRelations: {
        include: {
          tag: true,
        },
      },
    },
  });

  if (!article) {
    return null;
  }

  // Increment view count
  await prisma.article.update({
    where: { id: article.id },
    data: {
      views: {
        increment: 1,
      },
    },
  });

  return article;
}

async function getRelatedArticles(articleId: string, categoryId?: string) {
  return prisma.article.findMany({
    where: {
      status: 'PUBLISHED',
      id: {
        not: articleId,
      },
      ...(categoryId && {
        categoryId,
      }),
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
        },
      },
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
      tagRelations: {
        include: {
          tag: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 4,
  });
}

export async function generateMetadata(
  { params }: ArticlePageProps
): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) {
    return {
      title: 'Article Not Found',
    };
  }

  const title = article.metaTitle || article.title;
  const description = article.metaDescription || article.excerpt || '';
  const keywords = article.metaKeywords || '';

  return {
    title,
    description,
    keywords,
    authors: [{ name: article.author.name || 'Anonymous' }],
    openGraph: {
      title: article.ogTitle || title,
      description: article.ogDescription || description,
      type: 'article',
      publishedTime: article.publishedAt?.toISOString(),
      modifiedTime: article.updatedAt.toISOString(),
      authors: [article.author.name || 'Anonymous'],
      images: article.featuredImage
        ? [
            {
              url: article.featuredImage,
              width: 1200,
              height: 630,
              alt: article.title,
            },
          ]
        : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.ogTitle || title,
      description: article.ogDescription || description,
      images: article.featuredImage ? [article.featuredImage] : [],
    },
    alternates: {
      canonical: article.canonicalUrl || `https://notesninja.com/articles/${article.slug}`,
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) {
    notFound();
  }

  const relatedArticles = await getRelatedArticles(article.id, article.category?.id);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt || '',
    image: article.featuredImage,
    datePublished: article.publishedAt?.toISOString(),
    dateModified: article.updatedAt.toISOString(),
    author: {
      '@type': 'Person',
      name: article.author.name || 'Anonymous',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Notes Ninja',
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://notesninja.com/articles/${article.slug}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Article Header */}
        <div className="bg-white border-b">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center gap-4 mb-6">
              <Link 
                href="/articles"
                className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-100 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Articles
              </Link>
            </div>

            <div className="text-center">
              {article.category && (
                <Link 
                  href={`/articles?category=${article.category.slug}`}
                  className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold mb-4 border-transparent bg-primary text-primary-foreground hover:bg-primary/80"
                >
                  {article.category.name}
                </Link>
              )}

              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                {article.title}
              </h1>

              {article.excerpt && (
                <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                  {article.excerpt}
                </p>
              )}

              <div className="flex flex-wrap items-center justify-center gap-6 text-gray-500 mb-8">
                <div className="flex items-center gap-2">
                  {article.author.image ? (
                    <Image
                      src={article.author.image}
                      alt={article.author.name || 'Author'}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-gray-600" />
                    </div>
                  )}
                  <div>
                    <div className="font-medium text-gray-900">
                      {article.author.name || 'Anonymous'}
                    </div>
                    <div className="text-sm">{article.author.email}</div>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {new Date(article.publishedAt || article.createdAt).toLocaleDateString()}
                </div>

                {article.readingTime && (
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {article.readingTime} min read
                  </div>
                )}

                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  {article.views} views
                </div>
              </div>

              {/* Social Share */}
              <ArticleActions />
            </div>
          </div>
        </div>

        {/* Featured Image */}
        {article.featuredImage && article.featuredImage.startsWith('http') && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="relative h-96 md:h-[500px] rounded-2xl overflow-hidden">
              <Image
                src={article.featuredImage}
                alt={article.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        )}

        {/* Article Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="prose prose-lg max-w-none">
            <div
              dangerouslySetInnerHTML={{ __html: article.content }}
              className="article-content"
            />
          </div>

          {/* Tags */}
          {article.tagRelations.length > 0 && (
            <div className="mt-12 pt-8 border-t">
              <h3 className="text-lg font-semibold mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {article.tagRelations.map(({ tag }) => (
                  <Link 
                    key={tag.id}
                    href={`/articles?tag=${tag.slug}`}
                    className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  >
                    <Tag className="h-3 w-3 mr-1" />
                    {tag.name}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Author Bio */}
          <div className="mt-12 bg-white rounded-xl border p-6 shadow-sm">
            <div className="flex items-start gap-4">
              {article.author.image ? (
                <Image
                  src={article.author.image}
                  alt={article.author.name || 'Author'}
                  width={60}
                  height={60}
                  className="rounded-full"
                />
              ) : (
                <div className="w-15 h-15 bg-gray-300 rounded-full flex items-center justify-center">
                  <User className="h-8 w-8 text-gray-600" />
                </div>
              )}
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-2">
                  {article.author.name || 'Anonymous'}
                </h3>
                <p className="text-gray-600">
                  Passionate writer and expert in various topics. Sharing knowledge and insights to help others learn and grow.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h2 className="text-2xl font-bold mb-8">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedArticles.map((relatedArticle) => (
                <div key={relatedArticle.id} className="group hover:shadow-lg transition-shadow bg-white rounded-xl border p-6 shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    {relatedArticle.category && (
                      <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold border-transparent bg-secondary text-secondary-foreground">
                        {relatedArticle.category.name}
                      </span>
                    )}
                    {relatedArticle.readingTime && (
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock className="h-3 w-3" />
                        {relatedArticle.readingTime} min
                      </div>
                    )}
                  </div>

                  <h3 className="text-lg font-semibold mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    <Link href={`/articles/${relatedArticle.slug}`}>
                      {relatedArticle.title}
                    </Link>
                  </h3>

                  {relatedArticle.excerpt && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {relatedArticle.excerpt}
                    </p>
                  )}

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      {relatedArticle.author.name || 'Anonymous'}
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      {relatedArticle.views}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
