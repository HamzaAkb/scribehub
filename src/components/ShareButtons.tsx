'use client'

import React from 'react'

interface ShareButtonsProps {
  url: string
  title: string
}

export default function ShareButtons({ url, title }: ShareButtonsProps) {
  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)

  return (
    <div className='mt-8'>
      <h2 className='text-xl font-bold'>Share this post</h2>
      <div className='flex space-x-4 mt-2'>
        <a
          href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
          target='_blank'
          rel='noopener noreferrer'
          className='px-4 py-2 bg-blue-400 text-white rounded'
        >
          Tweet
        </a>
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
          target='_blank'
          rel='noopener noreferrer'
          className='px-4 py-2 bg-blue-600 text-white rounded'
        >
          Share
        </a>
      </div>
    </div>
  )
}
