'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface BookmarkButtonProps {
  postId: number
  initialBookmarked: boolean
}

export default function BookmarkButton({
  postId,
  initialBookmarked,
}: BookmarkButtonProps) {
  const [bookmarked, setBookmarked] = useState(initialBookmarked)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleToggleBookmark = async () => {
    setLoading(true)
    if (bookmarked) {
      const res = await fetch('/api/bookmarks', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId }),
      })
      if (res.ok) {
        setBookmarked(false)
      } else {
        console.error('Failed to remove bookmark')
      }
    } else {
      const res = await fetch('/api/bookmarks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId }),
      })
      if (res.ok) {
        setBookmarked(true)
      } else {
        console.error('Failed to add bookmark')
      }
    }
    setLoading(false)
  }

  return (
    <button
      onClick={handleToggleBookmark}
      disabled={loading}
      className='px-4 py-2 bg-gray-200 rounded'
    >
      {loading ? '...' : bookmarked ? 'Remove Bookmark' : 'Bookmark'}
    </button>
  )
}
