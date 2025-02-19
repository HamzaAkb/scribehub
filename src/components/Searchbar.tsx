'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'

interface SearchBarProps {
  initialQuery?: string
}

export default function SearchBar({ initialQuery = '' }: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery)
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    router.push(`/?query=${encodeURIComponent(query)}`)
  }

  return (
    <form onSubmit={handleSubmit} className='relative w-full max-w-md'>
      <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500' />
      <input
        type='text'
        name='query'
        placeholder='Search posts...'
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className='w-full pl-10 pr-4 py-2 border rounded-lg text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500'
      />
    </form>
  )
}
