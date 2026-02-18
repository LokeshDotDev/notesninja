import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/auth';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Calendar,
  Clock,
  Eye,
  User,
  Search,
  Filter,
  Tag,
  ArrowRight,
  BookOpen,
  TrendingUp,
  Star,
} from 'lucide-react';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Articles - Notes Ninja',
  description: 'Discover high-quality, SEO-optimized articles on various topics. Expert insights, tutorials, and in-depth analysis.',
  keywords: 'articles, blog, tutorials, insights, analysis, notes ninja',
  openGraph: {
    title: 'Articles - Notes Ninja',
    description: 'Discover high-quality, SEO-optimized articles on various topics',
    type: 'website',
  },
};

async function getArticles({
  page = 1,
  limit = 12,
  search = '',
  category = '',
  tag = '',
  sort = 'latest',
}: {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  tag?: string;
  sort?: string;
}) {
  const skip = (page - 1) * limit;

  const where: any = {
    status: 'PUBLISHED',
  };

  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { content: { contains: search, mode: 'insensitive' } },
      { excerpt: { contains: search, mode: 'insensitive' } },
      { metaDescription: { contains: search, mode: 'insensitive' } },
    ];
  }

  if (category && category !== 'all') {
    where.category = {
      slug: category,
    };
  }

  if (tag && tag !== 'all') {
    where.tagRelations = {
      some: {
        tag: {
          slug: tag,
        },
      },
    };
  }

  const orderBy: any = {};
  switch (sort) {
    case 'popular':
      orderBy.views = 'desc';
      break;
    case 'trending':
      orderBy.shares = 'desc';
      break;
    case 'oldest':
      orderBy.createdAt = 'asc';
      break;
    default:
      orderBy.createdAt = 'desc';
  }

  const [articles, total] = await Promise.all([
    prisma.article.findMany({
      where,
      include: {
        author: {
          select: { id: true, name: true, image: true },
        },
        category: {
          select: { id: true, name: true, slug: true },
        },
        tagRelations: {
          include: {
            tag: true,
          },
        },
      },
      orderBy,
      skip,
      take: limit,
    }),
    prisma.article.count({ where }),
  ]);

  return {
    articles,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
}

async function getCategories() {
  return prisma.category.findMany({
    where: {
      articles: {
        some: {
          status: 'PUBLISHED',
        },
      },
    },
    select: {
      id: true,
      name: true,
      slug: true,
      _count: {
        select: {
          articles: {
            where: {
              status: 'PUBLISHED',
            },
          },
        },
      },
    },
    orderBy: { name: 'asc' },
  });
}

async function getPopularTags() {
  return prisma.articleTag.findMany({
    include: {
      _count: {
        select: {
          relations: {
            where: {
              article: {
                status: 'PUBLISHED',
              },
            },
          },
        },
      },
    },
    orderBy: {
      relations: {
        _count: 'desc',
      },
    },
    take: 20,
  });
}

export default async function ArticlesPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    search?: string;
    category?: string;
    tag?: string;
    sort?: string;
  }>;
}) {
  const params = await searchParams;
  const page = parseInt(params.page || '1');
  const search = params.search || '';
  const category = params.category || '';
  const tag = params.tag || '';
  const sort = params.sort || 'latest';

  const [articlesData, categories, popularTags] = await Promise.all([
    getArticles({ page, search, category, tag, sort }),
    getCategories(),
    getPopularTags(),
  ]);

  if (!articlesData) {
    notFound();
  }

  const { articles, pagination } = articlesData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Discover Amazing Articles
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8">
              Expert insights, tutorials, and in-depth analysis
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="search"
                placeholder="Search articles..."
                className="pl-12 pr-4 py-3 text-lg bg-white text-gray-900 placeholder-gray-500 border-0 rounded-full shadow-lg focus:ring-4 focus:ring-blue-300"
                name="search"
                defaultValue={search}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1">
            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Select defaultValue={category}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.slug}>
                          {cat.name} ({cat._count.articles})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex-1">
                  <Select defaultValue={sort}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="latest">Latest First</SelectItem>
                      <SelectItem value="popular">Most Popular</SelectItem>
                      <SelectItem value="trending">Trending</SelectItem>
                      <SelectItem value="oldest">Oldest First</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Articles Grid */}
            {articles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {articles.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No articles found
                </h3>
                <p className="text-gray-600">
                  Try adjusting your search or filters to find what you're looking for.
                </p>
              </div>
            )}

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-12">
                <Button
                  variant="outline"
                  disabled={page === 1}
                  asChild
                >
                  <Link href={`/articles?page=${page - 1}&search=${search}&category=${category}&tag=${tag}&sort=${sort}`}>
                    Previous
                  </Link>
                </Button>
                
                <div className="flex items-center gap-2">
                  {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((pageNum) => (
                    <Button
                      key={pageNum}
                      variant={pageNum === page ? 'default' : 'outline'}
                      size="sm"
                      asChild
                    >
                      <Link href={`/articles?page=${pageNum}&search=${search}&category=${category}&tag=${tag}&sort=${sort}`}>
                        {pageNum}
                      </Link>
                    </Button>
                  ))}
                </div>
                
                <Button
                  variant="outline"
                  disabled={page === pagination.pages}
                  asChild
                >
                  <Link href={`/articles?page=${page + 1}&search=${search}&category=${category}&tag=${tag}&sort=${sort}`}>
                    Next
                  </Link>
                </Button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:w-80">
            {/* Popular Tags */}
            <Card className="mb-8">
              <CardHeader>
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Popular Tags
                </h3>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {popularTags.map((tag) => (
                    <Badge
                      key={tag.id}
                      variant="secondary"
                      className="cursor-pointer hover:bg-blue-100"
                      asChild
                    >
                      <Link href={`/articles?tag=${tag.slug}`}>
                        {tag.name} ({tag._count.relations})
                      </Link>
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Categories */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Categories
                </h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {categories.map((cat) => (
                    <div
                      key={cat.id}
                      className="flex justify-between items-center p-2 rounded-lg hover:bg-gray-50 cursor-pointer"
                    >
                      <Link
                        href={`/articles?category=${cat.slug}`}
                        className="flex-1 text-sm font-medium"
                      >
                        {cat.name}
                      </Link>
                      <Badge variant="outline" className="text-xs">
                        {cat._count.articles}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

function ArticleCard({ article }: { article: any }) {
  const hasValidImage = article.featuredImage && article.featuredImage.startsWith('http');
  
  return (
    <Card className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
      {hasValidImage && (
        <div className="relative h-48 overflow-hidden">
          <Image
            src={article.featuredImage}
            alt={article.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        </div>
      )}
      
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-3">
          {article.category && (
            <Badge variant="secondary" className="text-xs">
              {article.category.name}
            </Badge>
          )}
          {article.readingTime && (
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Clock className="h-3 w-3" />
              {article.readingTime} min
            </div>
          )}
        </div>

        <h3 className="text-xl font-bold mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
          <Link href={`/articles/${article.slug}`}>
            {article.title}
          </Link>
        </h3>

        {article.excerpt && (
          <p className="text-gray-600 mb-4 line-clamp-3">
            {article.excerpt}
          </p>
        )}

        <div className="flex flex-wrap gap-1 mb-4">
          {article.tagRelations.slice(0, 3).map(({ tag }) => (
            <Badge key={tag.id} variant="outline" className="text-xs">
              <Tag className="h-3 w-3 mr-1" />
              {tag.name}
            </Badge>
          ))}
          {article.tagRelations.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{article.tagRelations.length - 3} more
            </Badge>
          )}
        </div>

        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <User className="h-4 w-4" />
              {article.author.name || 'Anonymous'}
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {new Date(article.createdAt).toLocaleDateString()}
            </div>
            <div className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              {article.views}
            </div>
          </div>
          
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/articles/${article.slug}`}>
              Read More
              <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
