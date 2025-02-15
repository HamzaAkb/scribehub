'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface DeletePostButtonProps {
  postId: number
}

export default function DeletePostButton({ postId }: DeletePostButtonProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this post?')) return

    setLoading(true)

    const res = await fetch(`/api/posts/${postId}`, {
      method: 'DELETE',
    })

    if (res.ok) {
      // After deletion, redirect to the posts listing page
      router.push('/dashboard/posts')
    } else {
      console.error('Failed to delete post')
    }
    setLoading(false)
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className='px-4 py-2 bg-red-500 text-white rounded'
    >
      {loading ? 'Deleting...' : 'Delete Post'}
    </button>
  )
}
