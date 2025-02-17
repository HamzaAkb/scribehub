'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function NewPostForm() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [tags, setTags] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0])
    }
  }

  console.log(
    'process.env.CLOUDINARY_CLOUD_NAME: ',
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    let imageUrl = ''

    if (imageFile) {
      const formData = new FormData()
      formData.append('file', imageFile)
      formData.append('upload_preset', 'scribehub')

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`,
        {
          method: 'POST',
          body: formData,
        }
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
      body: JSON.stringify({ title, content, tags, imageUrl }),
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
