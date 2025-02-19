'use client'

import React from 'react'
import { Twitter, Facebook } from 'lucide-react'

interface ShareButtonsProps {
  url: string
  title: string
}

export default function ShareButtons({ url, title }: ShareButtonsProps) {
  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)

  return (
    <div className='mt-8'>
      <h2 className='text-xl font-bold mb-2'>Share this post</h2>
      <div className='flex space-x-4'>
        <a
          href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
          target='_blank'
          rel='noopener noreferrer'
          className='flex items-center space-x-2 px-4 py-2 bg-blue-400 hover:bg-blue-500 text-white rounded transition-colors'
        >
          <Twitter className='w-5 h-5' />
          <span>Tweet</span>
        </a>
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
          target='_blank'
          rel='noopener noreferrer'
          className='flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors'
        >
          <Facebook className='w-5 h-5' />
          <span>Share</span>
        </a>
      </div>
    </div>
  )
}
