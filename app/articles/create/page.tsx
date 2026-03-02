"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import ArticleEditor from '@/components/articles/ArticleEditor'

export default function CreateArticlePage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
      return
    }
    
    // Check if user is admin
    if (status === 'authenticated' && (session?.user as { role?: string })?.role !== 'ADMIN') {
      router.push('/unauthorized')
    }
  }, [status, session, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  const handleSave = async (data: Record<string, unknown>) => {
    try {
      const response = await fetch('/api/articles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        const article = await response.json()
        router.push(`/articles/${article.slug}`)
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to create article')
      }
    } catch (error) {
      console.error('Error creating article:', error)
      alert('Failed to create article')
    }
  }

  const handleCancel = () => {
    router.push('/articles')
  }

  return (
    <div className="min-h-screen bg-background">
      <ArticleEditor
        onSave={handleSave}
        onCancel={handleCancel}
      />
    </div>
  )
}
