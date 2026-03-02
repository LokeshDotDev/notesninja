"use client"

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar, Clock, Search, Plus } from 'lucide-react'

interface Article {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string
  coverImage?: string | null
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
}

export default function ArticleList() {
  const { data: session } = useSession()
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('latest')
  const [filterBy, setFilterBy] = useState('all')

  const isAdmin = (session?.user as { role?: string })?.role === 'ADMIN'

  const fetchArticles = useCallback(async () => {
    try {
      const params = new URLSearchParams({
        sort: sortBy,
        filter: filterBy,
      })
      
      const response = await fetch(`/api/articles?${params}`)
      if (response.ok) {
        const data = await response.json()
        setArticles(data)
      }
    } catch (error) {
      console.error('Failed to fetch articles:', error)
    } finally {
      setLoading(false)
    }
  }, [sortBy, filterBy])

  useEffect(() => {
    fetchArticles()
  }, [fetchArticles])

  const filteredArticles = articles.filter(article =>
    article.published &&
    (article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
     (article.excerpt && article.excerpt.toLowerCase().includes(searchTerm.toLowerCase())) ||
     article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
  )

  if (loading) {
    return <div>Loading articles...</div>
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Admin Create Button */}
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

      {/* Search and Filter Bar */}
      <div className="bg-card border rounded-xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input
              placeholder="Search articles by title, content, or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-11"
            />
          </div>
          <div className="flex gap-2">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[160px] h-11">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="z-[100] bg-white text-black border border-border shadow-xl dark:bg-zinc-950 dark:text-zinc-100">
                <SelectItem value="latest">Latest First</SelectItem>
                <SelectItem value="popular">Most Popular</SelectItem>
                <SelectItem value="featured">Featured Only</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterBy} onValueChange={setFilterBy}>
              <SelectTrigger className="w-[140px] h-11">
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent className="z-[100] bg-white text-black border border-border shadow-xl dark:bg-zinc-950 dark:text-zinc-100">
                <SelectItem value="all">All Articles</SelectItem>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="recent">Recent</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {searchTerm && (
          <div className="text-sm text-muted-foreground">
            Found {filteredArticles.length} {filteredArticles.length === 1 ? 'article' : 'articles'}
          </div>
        )}
      </div>

      {/* Articles Grid */}
      {filteredArticles.length === 0 ? (
        <div className="text-center py-20">
          <div className="inline-block p-6 bg-muted/50 rounded-2xl mb-4">
            <Search className="h-12 w-12 text-muted-foreground" />
          </div>
          <h3 className="text-2xl font-semibold mb-2">No articles found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredArticles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </div>
  )
}

function ArticleCard({ article }: { article: Article }) {
  return (
    <Link href={`/articles/${article.slug}`} className="group">
      <article className="h-full bg-card border rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
        {/* Cover Image */}
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
                ⭐ Featured
              </Badge>
            )}
          </div>
        )}
        
        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Meta Info */}
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              <span>{new Date(article.publishedAt || article.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              <span>{article.readingTime} min read</span>
            </div>
          </div>
          
          {/* Title */}
          <h2 className="text-xl font-bold line-clamp-2 group-hover:text-primary transition-colors">
            {article.title}
          </h2>
          
          {/* Excerpt */}
          <p className="text-muted-foreground line-clamp-3 text-sm leading-relaxed">
            {article.excerpt || 'No excerpt available'}
          </p>
          
          {/* Tags */}
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
          
          {/* Read More Link */}
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
