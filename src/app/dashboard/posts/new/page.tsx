'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import PostEditor from '@/components/PostEditor'

export default function NewPostForm() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [content, setContent] = useState('')
  const [tags, setTags] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [scheduledAt, setScheduledAt] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    let imageUrl = ''
    if (imageFile) {
      const formData = new FormData()
      formData.append('file', imageFile)
      formData.append(
        'upload_preset',
        process.env.NEXT_PUBLIC_COUDINARY_PRESET || 'defaultPreset'
      )

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`,
        { method: 'POST', body: formData }
      )

      if (res.ok) {
        const data = await res.json()
        imageUrl = data.secure_url
      } else {
        console.error('Image upload failed')
      }
    }

    const res = await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        description,
        content,
        tags,
        imageUrl,
        scheduledAt,
      }),
    })

    if (res.ok) {
      router.push('/dashboard/posts')
    } else {
      console.error('Error creating post')
    }

    setLoading(false)
  }

  return (
    <div className='max-w-md mx-auto p-8'>
      <h1 className='text-2xl mb-4'>Create New Post</h1>
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
          <label className='block mb-1'>Description</label>
          <input
            type='text'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className='w-full p-2 border rounded'
            placeholder='A short summary of your post'
            required
          />
        </div>
        <div className='mb-4'>
          <label className='block mb-1'>Content</label>
          <PostEditor initialContent={content} onChange={setContent} />
        </div>
        <div className='mb-4'>
          <label className='block mb-1'>Tags (comma-separated)</label>
          <input
            type='text'
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className='w-full p-2 border rounded'
            placeholder='e.g. JavaScript, Next.js, Prisma'
          />
        </div>
        <div className='mb-4'>
          <label className='block mb-1'>Featured Image</label>
          <input type='file' onChange={handleFileChange} />
        </div>
        <div className='mb-4'>
          <label className='block mb-1'>
            Scheduled Publication Date (optional)
          </label>
          <input
            type='datetime-local'
            value={scheduledAt}
            onChange={(e) => setScheduledAt(e.target.value)}
            className='w-full p-2 border rounded'
          />
          <p className='text-xs text-gray-500'>
            Leave empty to publish immediately.
          </p>
        </div>
        <button
          type='submit'
          disabled={loading}
          className='px-4 py-2 bg-blue-500 text-white rounded'
        >
          {loading ? 'Creating...' : 'Create Post'}
        </button>
      </form>
    </div>
  )
}
