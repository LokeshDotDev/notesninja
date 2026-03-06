import Link from 'next/link'
import Image from 'next/image'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getArticlePreviews, type ArticlePreview } from '@/lib/articles'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, Clock, Search, Plus } from 'lucide-react'

interface ArticleListProps {
  searchParams?: {
    sort?: string
    filter?: string
    search?: string
  }
}

export default async function ArticleList({ searchParams }: ArticleListProps) {
  const sessionPromise = getServerSession(authOptions)

  const sortParam = searchParams?.sort
  const filterParam = searchParams?.filter
  const searchTerm = (searchParams?.search || '').trim()

  const sortBy: 'latest' | 'popular' | 'oldest' =
    sortParam === 'popular' || sortParam === 'oldest' ? sortParam : 'latest'
  const filterBy: 'all' | 'featured' | 'recent' =
    filterParam === 'featured' || filterParam === 'recent' ? filterParam : 'all'

  let articlesPromise: Promise<ArticlePreview[]>

  if (filterBy === 'recent') {
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    articlesPromise = getArticlePreviews({
      published: true,
      sortBy: 'latest',
      search: searchTerm || undefined,
      publishedAfter: sevenDaysAgo,
      limit: 50,
    })
  } else {
    articlesPromise = getArticlePreviews({
      published: true,
      featured: filterBy === 'featured' ? true : undefined,
      sortBy,
      search: searchTerm || undefined,
      limit: 50,
    })
  }

  const [session, articles] = await Promise.all([sessionPromise, articlesPromise])
  const isAdmin = (session?.user as { role?: string } | undefined)?.role === 'ADMIN'

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {isAdmin && (
        <div className="flex justify-end">
          <Button asChild size="lg" className="shadow-lg">
            <Link href="/articles/create">
              <Plus className="h-5 w-5 mr-2" />
              Create New Article
            </Link>
          </Button>
        </div>
      )}

      <form className="bg-card border rounded-xl p-6 shadow-sm space-y-4" method="GET" action="/articles">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <input
              type="text"
              name="search"
              defaultValue={searchTerm}
              placeholder="Search articles by title, content, or tags..."
              className="h-11 w-full rounded-md border bg-background pl-10 pr-3 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
          </div>
          <div className="flex gap-2">
            <select
              name="sort"
              defaultValue={sortBy}
              className="h-11 w-[160px] rounded-md border bg-background px-3 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="latest">Latest First</option>
              <option value="popular">Most Popular</option>
              <option value="oldest">Oldest First</option>
            </select>
            <select
              name="filter"
              defaultValue={filterBy}
              className="h-11 w-[140px] rounded-md border bg-background px-3 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="all">All Articles</option>
              <option value="featured">Featured</option>
              <option value="recent">Recent</option>
            </select>
            <Button type="submit" size="lg" className="h-11">
              Apply
            </Button>
          </div>
        </div>

        {searchTerm && (
          <div className="text-sm text-muted-foreground">
            Found {articles.length} {articles.length === 1 ? 'article' : 'articles'}
          </div>
        )}
      </form>

      {articles.length === 0 ? (
        <div className="text-center py-20">
          <div className="inline-block p-6 bg-muted/50 rounded-2xl mb-4">
            <Search className="h-12 w-12 text-muted-foreground" />
          </div>
          <h3 className="text-2xl font-semibold mb-2">No articles found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </div>
  )
}

function ArticleCard({ article }: { article: ArticlePreview }) {
  return (
    <Link href={`/articles/${article.slug}`} className="group">
      <article className="h-full bg-card border rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
        {article.coverImage && (
          <div className="relative h-56 w-full overflow-hidden bg-muted">
            <Image
              src={article.coverImage}
              alt={article.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
            {article.featured && (
              <Badge className="absolute top-4 right-4 bg-primary text-primary-foreground shadow-lg">
                Featured
              </Badge>
            )}
          </div>
        )}

        <div className="p-6 space-y-4">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              <span>{new Date(article.publishedAt || article.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            </div>
            <span>|</span>
            <div className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              <span>{article.readingTime} min read</span>
            </div>
          </div>

          <h2 className="text-xl font-bold line-clamp-2 group-hover:text-primary transition-colors">
            {article.title}
          </h2>

          <p className="text-muted-foreground line-clamp-3 text-sm leading-relaxed">
            {article.excerpt || 'No excerpt available'}
          </p>

          <div className="flex flex-wrap gap-2">
            {article.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs font-normal">
                {tag}
              </Badge>
            ))}
            {article.tags.length > 3 && (
              <Badge variant="secondary" className="text-xs font-normal">
                +{article.tags.length - 3}
              </Badge>
            )}
          </div>

          <div className="flex justify-end pt-4 border-t">
            <span className="text-sm text-primary font-medium group-hover:underline">
              Read more →
            </span>
          </div>
        </div>
      </article>
    </Link>
  )
}
