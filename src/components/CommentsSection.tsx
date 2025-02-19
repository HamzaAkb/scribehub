'use client'

import { useState } from 'react'
import CommentForm from './CommentForm'

interface Comment {
  id: number
  content: string
  author: { name?: string | null; email: string }
}

interface CommentsSectionProps {
  initialComments: Comment[]
  postId: number
  currentUserEmail: string
}

export default function CommentsSection({
  initialComments,
  postId,
  currentUserEmail,
}: CommentsSectionProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments)

  const refreshComments = async () => {
    const res = await fetch(`/api/posts/${postId}/comments`)
    if (res.ok) {
      const updatedComments = await res.json()
      setComments(updatedComments)
    }
  }

  const handleDelete = async (commentId: number) => {
    if (!confirm('Are you sure you want to delete this comment?')) return
    const res = await fetch(`/api/comments/${commentId}`, {
      method: 'DELETE',
    })
    if (res.ok) {
      refreshComments()
    } else {
      console.error('Failed to delete comment')
    }
  }

  return (
    <div className='space-y-6'>
      <h2 className='text-2xl font-semibold'>Comments</h2>
      {comments.length === 0 ? (
        <p className='text-gray-600'>
          No comments yet. Be the first to comment!
        </p>
      ) : (
        <div className='space-y-4'>
          {comments.map((comment) => (
            <div
              key={comment.id}
              className='p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded shadow-sm'
            >
              <p className='text-gray-800 dark:text-gray-100'>
                {comment.content}
              </p>
              <div className='flex justify-between items-center mt-2'>
                <p className='text-xs text-gray-500'>
                  — {comment.author.name || comment.author.email}
                </p>
                {comment.author.email === currentUserEmail && (
                  <button
                    onClick={() => handleDelete(comment.id)}
                    className='text-sm text-red-500 hover:underline'
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      <div className='pt-4 border-t border-gray-300 dark:border-gray-600'>
        <CommentForm postId={postId} onCommentAdded={refreshComments} />
      </div>
    </div>
  )
}
