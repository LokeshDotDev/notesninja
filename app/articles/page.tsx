import { Suspense } from 'react'
import ArticleList from '@/components/articles/ArticleList'
import { Skeleton } from '@/components/ui/skeleton'

interface ArticlesPageProps {
  searchParams?: {
    sort?: string
    filter?: string
    search?: string
  }
}

export default function ArticlesPage({ searchParams }: ArticlesPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      {/* Hero Section */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
              Articles
            </h1>
            <p className="text-xl text-muted-foreground">
              Insights, tutorials, and stories from our community
            </p>
          </div>
        </div>
      </div>

      {/* Articles Content */}
      <div className="container mx-auto px-4 py-12">
        <Suspense fallback={<ArticlesLoading />}>
          <ArticleList searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  )
}

function ArticlesLoading() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-4">
            <Skeleton className="h-56 w-full rounded-xl" />
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <div className="flex gap-2">
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}