'use client'
import { useState } from 'react'

export default function LikeButton({
  postId,
  initialLikes,
}: {
  postId: number
  initialLikes: number
}) {
  const [likes, setLikes] = useState(initialLikes)
  const [loading, setLoading] = useState(false)

  const handleLike = async () => {
    setLoading(true)
    const res = await fetch(`/api/posts/${postId}/like`, {
      method: 'PATCH',
    })
    if (res.ok) {
      const updatedPost = await res.json()
      setLikes(updatedPost.likes)
    } else {
      console.error('Failed to like post')
    }
    setLoading(false)
  }

  return (
    <div className='mt-4'>
      <button
        onClick={handleLike}
        disabled={loading}
        className='px-4 py-2 bg-green-500 text-white rounded'
      >
        {loading ? 'Liking...' : 'Like'}
      </button>
      <p className='mt-2'>Likes: {likes}</p>
    </div>
  )
}
