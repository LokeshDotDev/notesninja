"use client"

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import ArticleEditor from '@/components/articles/ArticleEditor'

interface Article {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string
  coverImage?: string | null
  coverImagePublicId?: string | null
  published: boolean
  featured: boolean
  tags: string[]
  metaTitle?: string | null
  metaDescription?: string | null
}

export default function EditArticlePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  const [article, setArticle] = useState<Article | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchArticle = useCallback(async () => {
    try {
      const response = await fetch(`/api/articles/${params.slug}`)
      if (response.ok) {
        const data = await response.json()
        setArticle(data)
      } else {
        router.push('/articles')
      }
    } catch (error) {
      console.error('Error fetching article:', error)
      router.push('/articles')
    } finally {
      setIsLoading(false)
    }
  }, [params.slug, router])

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
      return
    }
    
    // Check if user is admin
    if (status === 'authenticated' && (session?.user as { role?: string })?.role !== 'ADMIN') {
      router.push('/unauthorized')
      return
    }

    if (status === 'authenticated' && params.slug) {
      fetchArticle()
    }
  }, [status, session, params.slug, router, fetchArticle])

  const handleSave = async (data: Partial<Article>) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/articles/${params.slug}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        const updatedArticle = await response.json()
        router.push(`/articles/${updatedArticle.slug}`)
      } else {
        const error = await response.json()
        throw new Error(error.error || 'Failed to update article')
      }
    } catch (error) {
      console.error('Error updating article:', error)
      // Error is already handled in the component, but we log it for debugging
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    router.push(`/articles/${params.slug}`)
  }

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Article not found</h1>
          <button
            onClick={() => router.push('/articles')}
            className="text-blue-600 hover:text-blue-800"
          >
            Back to Articles
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <ArticleEditor
        initialData={{
          title: article.title,
          slug: article.slug,
          excerpt: article.excerpt || '',
          content: article.content,
          coverImage: article.coverImage || '',
          coverImagePublicId: article.coverImagePublicId || '',
          published: article.published,
          featured: article.featured,
          tags: article.tags,
          metaTitle: article.metaTitle || '',
          metaDescription: article.metaDescription || '',
        }}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    </div>
  )
}
