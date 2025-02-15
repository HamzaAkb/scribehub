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
}

export default function CommentsSection({
  initialComments,
  postId,
}: CommentsSectionProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments)

  // Function to refresh comments after a new comment is added
  const refreshComments = async () => {
    const res = await fetch(`/api/posts/${postId}/comments`)
    if (res.ok) {
      const updatedComments = await res.json()
      setComments(updatedComments)
    }
  }

  return (
    <div>
      <h2 className='text-xl mb-4'>Comments</h2>
      {comments.length === 0 ? (
        <p>No comments yet.</p>
      ) : (
        comments.map((comment) => (
          <div key={comment.id} className='mb-4 p-4 border rounded'>
            <p>{comment.content}</p>
            <p className='text-sm text-gray-500'>
              — {comment.author.name || comment.author.email}
            </p>
          </div>
        ))
      )}
      <CommentForm postId={postId} onCommentAdded={refreshComments} />
    </div>
  )
}
