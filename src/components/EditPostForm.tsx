'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface EditPostFormProps {
  post: { id: number; title: string; content: string; published: boolean }
}

export default function EditPostForm({ post }: EditPostFormProps) {
  const [title, setTitle] = useState(post.title)
  const [content, setContent] = useState(post.content)
  const [published, setPublished] = useState(post.published)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const res = await fetch(`/api/posts/${post.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content, published }),
    })

    if (res.ok) {
      router.push(`/dashboard/posts/${post.id}`)
    } else {
      console.error('Failed to update post')
    }

    setLoading(false)
  }

  return (
    <div className='max-w-md mx-auto p-8'>
      <h1 className='text-2xl mb-4'>Edit Post</h1>
      <form onSubmit={handleSubmit}>
        <div className='mb-4'>
          <label className='block mb-1'>Title</label>
          <input
            type='text'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className='w-full p-2 border rounded'
            required
          />
        </div>
        <div className='mb-4'>
          <label className='block mb-1'>Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className='w-full p-2 border rounded'
            rows={5}
            required
          />
        </div>
        <div className='mb-4'>
          <label className='inline-flex items-center'>
            <input
              type='checkbox'
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              className='mr-2'
            />
            Published
          </label>
        </div>
        <button
          type='submit'
          disabled={loading}
          className='px-4 py-2 bg-blue-500 text-white rounded'
        >
          {loading ? 'Updating...' : 'Update Post'}
        </button>
      </form>
    </div>
  )
}
