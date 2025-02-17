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
    <div>
      <h2 className='text-xl mb-4'>Comments</h2>
      {comments.length === 0 ? (
        <p>No comments yet.</p>
      ) : (
        comments.map((comment: Comment) => (
          <div key={comment.id} className='mb-4 p-4 border rounded'>
            <p>{comment.content}</p>
            <p className='text-sm text-gray-500'>
              — {comment.author.name || comment.author.email}
            </p>
            {comment.author.email === currentUserEmail && (
              <button
                onClick={() => handleDelete(comment.id)}
                className='mt-2 px-3 py-1 bg-red-500 text-white rounded'
              >
                Delete Comment
              </button>
            )}
          </div>
        ))
      )}
      <CommentForm postId={postId} onCommentAdded={refreshComments} />
    </div>
  )
}
