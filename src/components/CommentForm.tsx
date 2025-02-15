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
    <form onSubmit={handleSubmit} className='mt-4'>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className='w-full p-2 border rounded'
        placeholder='Write a comment...'
        required
      />
      <button
        type='submit'
        disabled={loading}
        className='mt-2 px-4 py-2 bg-blue-500 text-white rounded'
      >
        {loading ? 'Submitting...' : 'Submit Comment'}
      </button>
    </form>
  )
}
