'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface EditProfileFormProps {
  currentName: string | null
  currentImageUrl?: string | null
}

export default function EditProfileForm({
  currentName,
  currentImageUrl,
}: EditProfileFormProps) {
  const [name, setName] = useState(currentName || '')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState(currentImageUrl || '')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0])
      setPreviewUrl(URL.createObjectURL(e.target.files[0]))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    let imageUrl = currentImageUrl || ''
    if (imageFile) {
      const formData = new FormData()
      formData.append('file', imageFile)
      formData.append(
        'upload_preset',
        process.env.NEXT_PUBLIC_COUDINARY_PRESET as string
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

    const res = await fetch('/api/user', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageUrl, name }),
    })
    if (res.ok) {
      router.push('/dashboard/profile')
    } else {
      console.error('Failed to update profile')
    }
    setLoading(false)
  }

  return (
    <div className='max-w-2xl mx-auto p-8'>
      <h1 className='text-3xl font-bold mb-8 text-center'>Edit Profile</h1>
      <form
        onSubmit={handleSubmit}
        className='grid grid-cols-1 md:grid-cols-12 gap-6'
      >
        <div className='md:col-span-8 space-y-6'>
          <div>
            <label className='block mb-1 text-lg font-medium text-gray-700 dark:text-gray-200'>
              Name
            </label>
            <input
              type='text'
              value={name}
              onChange={(e) => setName(e.target.value)}
              className='w-full p-3 border border-gray-300 dark:border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
              required
            />
          </div>
        </div>
        <div className='md:col-span-4 space-y-6'>
          <div>
            <label className='block mb-1 text-lg font-medium text-gray-700 dark:text-gray-200'>
              Profile Image
            </label>
            <input type='file' onChange={handleFileChange} className='w-full' />
            {previewUrl && (
              <div className='mt-2'>
                <img
                  src={previewUrl}
                  alt='Profile Preview'
                  className='h-32 w-32 object-cover rounded-full mx-auto'
                />
              </div>
            )}
          </div>
        </div>
        <div className='md:col-span-12'>
          <button
            type='submit'
            disabled={loading}
            className='w-full py-3 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors'
          >
            {loading ? 'Updating...' : 'Update Profile'}
          </button>
        </div>
      </form>
    </div>
  )
}
