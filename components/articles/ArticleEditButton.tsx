"use client"

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Edit, Trash2 } from 'lucide-react'
import { useState } from 'react'

interface ArticleEditButtonProps {
  articleSlug: string
}

export default function ArticleEditButton({ articleSlug }: ArticleEditButtonProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)
  
  // Only show edit button if user is logged in and is an admin
  if (!session?.user || (session.user as { role?: string }).role !== 'ADMIN') {
    return null
  }

  const handleDelete = async () => {
    const confirmed = window.confirm('Are you sure you want to delete this article? This action cannot be undone.')
    if (!confirmed) return

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/articles/${articleSlug}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to delete article')
      }

      router.push('/articles')
      router.refresh()
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to delete article')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button variant="outline" size="sm" asChild>
        <Link href={`/articles/${articleSlug}/edit`}>
          <Edit className="h-4 w-4 mr-2" />
          Edit Article
        </Link>
      </Button>

      <Button
        variant="outline"
        size="sm"
        className="border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950"
        onClick={handleDelete}
        disabled={isDeleting}
      >
        <Trash2 className="h-4 w-4 mr-2" />
        {isDeleting ? 'Deleting...' : 'Delete'}
      </Button>
    </div>
  )
}
