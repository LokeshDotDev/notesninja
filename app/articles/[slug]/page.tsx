import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, Clock, ArrowLeft } from 'lucide-react'
import { getArticleBySlug, getRelatedArticles } from '@/lib/articles'
import ArticleEditButton from '@/components/articles/ArticleEditButton'

interface ArticlePageProps {
  params: Promise<{
    slug: string
  }>
}

// Helper function to extract headings and inject IDs for scroll navigation
function processArticleContent(html: string) {
  const headings: { level: number; text: string; id: string }[] = []
  
  if (!html) return { processedHtml: '', headings: [] }

  // Find all h1, h2, h3 tags
  const processedHtml = html.replace(/<h([1-3])([^>]*)>(.*?)<\/h\1>/gi, (match, level, attributes, innerHtml) => {
    // Strip out any nested tags (like <strong>) to get plain text for the ToC
    const text = innerHtml.replace(/<[^>]+>/g, '').trim()
    
    // Create a URL-friendly slug (e.g., "Hello World" -> "hello-world")
    // Added a fallback just in case the heading is empty or only special characters
    const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `heading-${Math.random().toString(36).substring(2, 9)}`
    
    // Add to our headings array
    headings.push({ level: parseInt(level), text, id })
    
    // Return the new heading with the ID injected
    return `<h${level}${attributes} id="${id}">${innerHtml}</h${level}>`
  })

  return { processedHtml, headings }
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params
  const article = await getArticleBySlug(slug)
  
  if (!article) {
    return {
      title: 'Article Not Found',
    }
  }

  return {
    title: article.metaTitle || article.title || undefined,
    description: article.metaDescription || article.excerpt || undefined,
    openGraph: {
      title: article.metaTitle || article.title || undefined,
      description: article.metaDescription || article.excerpt || undefined,
      images: article.coverImage ? [article.coverImage] : [],
      type: 'article',
      publishedTime: article.publishedAt || article.createdAt,
      authors: [article.author.name || 'Anonymous'],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.metaTitle || article.title || undefined,
      description: article.metaDescription || article.excerpt || undefined,
      images: article.coverImage ? [article.coverImage] : [],
    },
  }
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params
  const article = await getArticleBySlug(slug)
  
  if (!article || !article.published) {
    notFound()
  }

  const relatedArticles = await getRelatedArticles(article.id, article.tags)

  // PROCESS THE CONTENT HERE TO GET IDs AND THE HEADINGS LIST
  const { processedHtml } = processArticleContent(article.content)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Article Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <Button variant="ghost" asChild className="mb-6 hover:bg-muted">
              <Link href="/articles">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Articles
              </Link>
            </Button>
            
            {/* Article Meta */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(article.publishedAt || article.createdAt)}</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                <span>{article.readingTime} min read</span>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight tracking-tight">
              {article.title}
            </h1>

            {/* Excerpt */}
            {article.excerpt && (
              <p className="text-xl text-muted-foreground leading-relaxed mb-6">
                {article.excerpt}
              </p>
            )}

            {/* Tags & Actions */}
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex flex-wrap gap-2">
                {article.featured && (
                  <Badge className="bg-primary text-primary-foreground">
                    ⭐ Featured
                  </Badge>
                )}
                {article.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                <ArticleEditButton articleSlug={article.slug} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cover Image */}
      {article.coverImage && (
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-5xl mx-auto">
            <div className="relative h-[400px] md:h-[500px] lg:h-[600px] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src={article.coverImage}
                alt={article.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      )}

      {/* Article Content */}
      <div className="container mx-auto px-4 py-8 pb-20">
        <div className="max-w-4xl mx-auto">
          <article 
            className="prose prose-lg md:prose-xl prose-slate dark:prose-invert max-w-none
              prose-headings:font-bold prose-headings:tracking-tight
              prose-h1:text-4xl prose-h1:mb-6 prose-h1:mt-12
              prose-h2:text-3xl prose-h2:mb-4 prose-h2:mt-10
              prose-h3:text-2xl prose-h3:mb-3 prose-h3:mt-8
              prose-p:text-lg prose-p:leading-relaxed prose-p:mb-6
              prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-a:font-medium
              prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-muted-foreground
              prose-code:bg-muted prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm prose-code:before:content-none prose-code:after:content-none
              prose-pre:bg-slate-900 prose-pre:text-slate-100 prose-pre:rounded-xl prose-pre:p-6
              prose-img:rounded-xl prose-img:shadow-lg prose-img:my-8
              prose-ul:my-6 prose-ol:my-6
              prose-li:my-2
              prose-strong:font-bold prose-strong:text-foreground
              prose-table:border prose-table:border-border
              prose-th:border prose-th:border-border prose-th:bg-muted prose-th:p-3
              prose-td:border prose-td:border-border prose-td:p-3
              prose-hr:border-border prose-hr:my-12"
            dangerouslySetInnerHTML={{ __html: processedHtml }}
          />
        </div>
      </div>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <div className="border-t bg-muted/30">
          <div className="container mx-auto px-4 py-16">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold mb-8">Related Articles</h2>
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {relatedArticles.map((relatedArticle) => (
                  <Link 
                    key={relatedArticle.id} 
                    href={`/articles/${relatedArticle.slug}`}
                    className="group"
                  >
                    <article className="h-full bg-card border rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
                      {relatedArticle.coverImage && (
                        <div className="relative h-48 w-full overflow-hidden bg-muted">
                          <Image
                            src={relatedArticle.coverImage}
                            alt={relatedArticle.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                        </div>
                      )}
                      <div className="p-6 space-y-3">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Calendar className="h-3.5 w-3.5" />
                          <span>{formatDate(relatedArticle.publishedAt || relatedArticle.createdAt)}</span>
                          <span>•</span>
                          <Clock className="h-3.5 w-3.5" />
                          <span>{relatedArticle.readingTime} min</span>
                        </div>
                        
                        <h3 className="font-bold text-lg group-hover:text-primary transition-colors line-clamp-2">
                          {relatedArticle.title}
                        </h3>
                        
                        <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed">
                          {relatedArticle.excerpt}
                        </p>
                        
                        <div className="flex flex-wrap gap-2 pt-2">
                          {relatedArticle.tags.slice(0, 2).map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}