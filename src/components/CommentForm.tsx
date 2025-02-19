'use client'

import { useState } from 'react'

interface CommentFormProps {
  postId: number
  onCommentAdded: () => void
}

export default function CommentForm({
  postId,
  onCommentAdded,
}: CommentFormProps) {
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const res = await fetch('/api/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ postId, content }),
    })

    if (res.ok) {
      setContent('')
      onCommentAdded()
    } else {
      console.error('Failed to add comment')
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className='mt-6 space-y-4'>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className='w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors'
        placeholder='Write a comment...'
        required
        rows={4}
      />
      <button
        type='submit'
        disabled={loading}
        className='w-full px-4 py-3 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors'
      >
        {loading ? 'Submitting...' : 'Submit Comment'}
      </button>
    </form>
  )
}
