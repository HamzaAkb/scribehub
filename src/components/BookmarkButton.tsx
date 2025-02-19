'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Bookmark } from 'lucide-react'

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
      className='flex items-center space-x-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded transition-colors'
    >
      <Bookmark
        className={`w-5 h-5 ${bookmarked ? 'text-blue-500' : 'text-gray-500'}`}
      />
      <span>{loading ? '...' : bookmarked ? 'Bookmarked' : 'Bookmark'}</span>
    </button>
  )
}
