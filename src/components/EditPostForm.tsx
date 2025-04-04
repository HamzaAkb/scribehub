'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import PostEditor from '@/components/PostEditor'

interface EditPostFormProps {
  post: {
    id: number
    title: string
    description: string
    content: string
    tags: string
    imageUrl?: string | null
    scheduledAt?: string | null
    published: boolean
  }
}

export default function EditPostForm({ post }: EditPostFormProps) {
  const [title, setTitle] = useState(post.title)
  const [description, setDescription] = useState(post.description)
  const [content, setContent] = useState(post.content)
  const [tags, setTags] = useState(post.tags)
  const [imageFile, setImageFile] = useState<File | null>(null)

  const formattedScheduledAt = post.scheduledAt
    ? post.scheduledAt.slice(0, 16)
    : ''
  const [scheduledAt, setScheduledAt] = useState(formattedScheduledAt)
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

    let imageUrl = post.imageUrl || ''
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

    const res = await fetch(`/api/posts/${post.id}`, {
      method: 'PATCH',
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
      router.push(`/dashboard/posts/${post.id}`)
    } else {
      console.error('Failed to update post')
    }
    setLoading(false)
  }

  return (
    <div className='max-w-7xl mx-auto p-8'>
      <h1 className='text-3xl font-bold mb-8'>Edit Post</h1>
      <form onSubmit={handleSubmit}>
        <div className='grid grid-cols-1 md:grid-cols-12 gap-6'>
          {/* Left Column: Title, Description, Content */}
          <div className='md:col-span-8 space-y-6'>
            <div>
              <label className='block mb-1 text-lg font-medium text-gray-700 dark:text-gray-200'>
                Title
              </label>
              <input
                type='text'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className='w-full p-3 border border-gray-300 dark:border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
                required
              />
            </div>
            <div>
              <label className='block mb-1 text-lg font-medium text-gray-700 dark:text-gray-200'>
                Description
              </label>
              <input
                type='text'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder='A short summary of your post'
                className='w-full p-3 border border-gray-300 dark:border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
                required
              />
            </div>
            <div>
              <label className='block mb-1 text-lg font-medium text-gray-700 dark:text-gray-200'>
                Content
              </label>
              <div className='border border-gray-300 dark:border-gray-700 rounded'>
                <PostEditor initialContent={content} onChange={setContent} />
              </div>
            </div>
          </div>
          {/* Right Column: Featured Image, Tags, Scheduled Publication Date */}
          <div className='md:col-span-4 space-y-6'>
            <div>
              <label className='block mb-1 text-lg font-medium text-gray-700 dark:text-gray-200'>
                Featured Image
              </label>
              <input
                type='file'
                onChange={handleFileChange}
                className='w-full'
              />
              {imageFile ? (
                <div className='mt-2'>
                  <img
                    src={URL.createObjectURL(imageFile)}
                    alt='Preview'
                    className='h-40 w-full object-cover rounded'
                  />
                </div>
              ) : post.imageUrl ? (
                <div className='mt-2'>
                  <img
                    src={post.imageUrl}
                    alt='Featured'
                    className='h-40 w-full object-cover rounded'
                  />
                </div>
              ) : null}
            </div>
            <div>
              <label className='block mb-1 text-lg font-medium text-gray-700 dark:text-gray-200'>
                Tags (comma-separated)
              </label>
              <input
                type='text'
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder='e.g. JavaScript, Next.js, Prisma'
                className='w-full p-3 border border-gray-300 dark:border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
              />
            </div>
            <div>
              <label className='block mb-1 text-lg font-medium text-gray-700 dark:text-gray-200'>
                Scheduled Publication Date (optional)
              </label>
              <input
                type='datetime-local'
                value={scheduledAt}
                onChange={(e) => setScheduledAt(e.target.value)}
                className='w-full p-3 border border-gray-300 dark:border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
              />
              <p className='text-xs text-gray-500 dark:text-gray-400'>
                Leave empty to publish immediately.
              </p>
            </div>
          </div>
        </div>
        <div className='mt-8'>
          <button
            type='submit'
            disabled={loading}
            className='w-full py-3 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors'
          >
            {loading ? 'Updating...' : 'Update Post'}
          </button>
        </div>
      </form>
    </div>
  )
}
