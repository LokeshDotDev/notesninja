import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Search,
  MessageSquare,
  Star,
  Eye,
  TrendingUp,
  HelpCircle,
  Filter,
  ChevronRight,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'FAQ - Notes Ninja',
  description: 'Find answers to frequently asked questions about Notes Ninja. Get help with your account, courses, and more.',
  keywords: 'FAQ, help, support, questions, answers, notes ninja',
  openGraph: {
    title: 'FAQ - Notes Ninja',
    description: 'Find answers to frequently asked questions',
    type: 'website',
  },
};

async function getFaqs({
  page = 1,
  limit = 20,
  search = '',
  categoryId = '',
  featured = false,
}: {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  featured?: boolean;
}) {
  const skip = (page - 1) * limit;

  const where: any = {
    isActive: true,
  };

  if (search) {
    where.OR = [
      { question: { contains: search, mode: 'insensitive' } },
      { answer: { contains: search, mode: 'insensitive' } },
    ];
  }

  if (categoryId && categoryId !== 'all') {
    where.categoryId = categoryId;
  }

  if (featured) {
    where.isFeatured = true;
  }

  const [faqs, total] = await Promise.all([
    prisma.faq.findMany({
      where,
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
            icon: true,
          },
        },
        author: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: [
        { isFeatured: 'desc' },
        { order: 'asc' },
        { views: 'desc' },
        { createdAt: 'desc' },
      ],
      skip,
      take: limit,
    }),
    prisma.faq.count({ where }),
  ]);

  return {
    faqs,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
}

async function getCategories() {
  return prisma.faqCategory.findMany({
    where: {
      isActive: true,
    },
    include: {
      _count: {
        select: {
          faqs: {
            where: {
              isActive: true,
            },
          },
        },
      },
    },
    orderBy: { order: 'asc' },
  });
}

async function getFeaturedFaqs() {
  return prisma.faq.findMany({
    where: {
      isActive: true,
      isFeatured: true,
    },
    include: {
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
          icon: true,
        },
      },
    },
    orderBy: [
      { order: 'asc' },
      { views: 'desc' },
    ],
    take: 6,
  });
}

export default async function FaqPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    search?: string;
    category?: string;
    featured?: string;
  }>;
}) {
  const resolvedSearchParams = await searchParams;
  const page = parseInt(resolvedSearchParams.page || '1');
  const search = resolvedSearchParams.search || '';
  const category = resolvedSearchParams.category || '';
  const featured = resolvedSearchParams.featured === 'true';

  const [faqsData, categories, featuredFaqs] = await Promise.all([
    getFaqs({ page, search, categoryId: category, featured }),
    getCategories(),
    getFeaturedFaqs(),
  ]);

  if (!faqsData) {
    notFound();
  }

  const { faqs, pagination } = faqsData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <HelpCircle className="h-16 w-16" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8">
              Find answers to common questions about Notes Ninja
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <form>
                <Input
                  type="search"
                  placeholder="Search for answers..."
                  className="pl-12 pr-4 py-3 text-lg bg-white text-gray-900 placeholder-gray-500 border-0 rounded-full shadow-lg focus:ring-4 focus:ring-blue-300"
                  name="search"
                  defaultValue={search}
                />
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1">
            {/* Featured FAQs */}
            {featuredFaqs.length > 0 && !search && !category && !featured && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <Star className="h-6 w-6 text-yellow-500" />
                  Featured FAQs
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {featuredFaqs.map((faq) => (
                    <Card key={faq.id} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-3">
                          <div className="flex-1">
                            <h3 className="font-semibold mb-2 line-clamp-2">
                              {faq.question}
                            </h3>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <Badge variant="outline" className="text-xs">
                                {faq.category.icon && <span className="mr-1">{faq.category.icon}</span>}
                                {faq.category.name}
                              </Badge>
                              <span className="flex items-center gap-1">
                                <Eye className="h-3 w-3" />
                                {faq.views}
                              </span>
                            </div>
                          </div>
                          <ChevronRight className="h-5 w-5 text-gray-400 mt-1" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <form>
                    <Select defaultValue={category} name="category">
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Filter by category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.icon && <span className="mr-2">{cat.icon}</span>}
                            {cat.name} ({cat._count.faqs})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </form>
                </div>
                
                <div className="flex items-center gap-4">
                  <Button
                    variant={featured ? 'default' : 'outline'}
                    asChild
                  >
                    <Link href={featured ? '/faq' : '/faq?featured=true'}>
                      <Star className="h-4 w-4 mr-2" />
                      Featured Only
                    </Link>
                  </Button>
                </div>
              </div>
            </div>

            {/* FAQ List */}
            {faqs.length > 0 ? (
              <>
                <div className="mb-4 text-sm text-gray-600">
                  Showing {faqs.length} of {pagination.total} FAQs
                </div>
                
                <Accordion type="single" collapsible className="space-y-4">
                  {faqs.map((faq) => (
                    <AccordionItem
                      key={faq.id}
                      value={faq.id}
                      className="border rounded-lg overflow-hidden"
                    >
                      <AccordionTrigger className="px-6 py-4 text-left hover:bg-gray-50">
                        <div className="flex items-center gap-3 flex-1">
                          {faq.isFeatured && (
                            <Star className="h-4 w-4 text-yellow-500 flex-shrink-0" />
                          )}
                          <span className="font-medium">{faq.question}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-6 pb-4">
                        <div className="space-y-4">
                          <div className="prose prose-sm max-w-none">
                            <div dangerouslySetInnerHTML={{ __html: faq.answer }} />
                          </div>
                          
                          <div className="flex items-center justify-between pt-4 border-t text-sm text-gray-500">
                            <div className="flex items-center gap-4">
                              <Badge variant="outline" className="text-xs">
                                {faq.category.icon && <span className="mr-1">{faq.category.icon}</span>}
                                {faq.category.name}
                              </Badge>
                              <span className="flex items-center gap-1">
                                <Eye className="h-3 w-3" />
                                {faq.views} views
                              </span>
                              {faq.author && <span>By {faq.author.name}</span>}
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm">
                                <TrendingUp className="h-3 w-3 mr-1" />
                                Helpful ({faq.helpfulCount})
                              </Button>
                            </div>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </>
            ) : (
              <div className="text-center py-12">
                <HelpCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No FAQs found
                </h3>
                <p className="text-gray-600">
                  {search || category || featured
                    ? 'Try adjusting your search or filters to find what you\'re looking for.'
                    : 'No FAQs are available at the moment.'}
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
                  <Link href={`/faq?page=${page - 1}&search=${search}&category=${category}&featured=${featured}`}>
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
                      <Link href={`/faq?page=${pageNum}&search=${search}&category=${category}&featured=${featured}`}>
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
                  <Link href={`/faq?page=${page + 1}&search=${search}&category=${category}&featured=${featured}`}>
                    Next
                  </Link>
                </Button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:w-80">
            {/* Categories */}
            <Card className="mb-8">
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
                        href={`/faq?category=${cat.id}`}
                        className="flex items-center gap-2 flex-1 text-sm font-medium"
                      >
                        {cat.icon && <span>{cat.icon}</span>}
                        {cat.name}
                      </Link>
                      <Badge variant="outline" className="text-xs">
                        {cat._count.faqs}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Quick Stats
                </h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total FAQs</span>
                    <span className="font-semibold">{pagination.total}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Categories</span>
                    <span className="font-semibold">{categories.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Featured</span>
                    <span className="font-semibold">{featuredFaqs.length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
