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
    <div className='max-w-md mx-auto p-8'>
      <h1 className='text-2xl mb-4'>Edit Profile</h1>
      <form onSubmit={handleSubmit}>
        <div className='mb-4'>
          <label className='block mb-1'>Name</label>
          <input
            type='text'
            value={name}
            onChange={(e) => setName(e.target.value)}
            className='w-full p-2 border rounded'
            required
          />
        </div>
        <div className='mb-4'>
          <label className='block mb-1'>Profile Image</label>
          <input type='file' onChange={handleFileChange} />
          {previewUrl && (
            <img
              src={previewUrl}
              alt='Profile Preview'
              className='mt-2 h-24 w-24 object-cover rounded-full'
            />
          )}
        </div>
        <button
          type='submit'
          disabled={loading}
          className='px-4 py-2 bg-blue-500 text-white rounded'
        >
          {loading ? 'Updating...' : 'Update Profile'}
        </button>
      </form>
    </div>
  )
}
