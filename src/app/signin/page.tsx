'use client'

import { signIn } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'
import { useState } from 'react'

export default function SignInPage() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')
  const [email, setEmail] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await signIn('email', { email, redirect: true, callbackUrl: '/' })
  }

  return (
    <div className='min-h-screen flex items-center justify-center'>
      <div className='bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full'>
        <h1 className='text-2xl font-bold mb-4 text-center text-gray-800 dark:text-gray-100'>
          Sign In
        </h1>
        {error && (
          <p className='mb-4 text-center text-red-500'>
            There was an error signing in. Please try again.
          </p>
        )}
        <form onSubmit={handleSubmit}>
          <input
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder='Enter your email'
            className='w-full p-3 border rounded mb-4 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500'
            required
          />
          <button
            type='submit'
            className='w-full px-4 py-3 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors'
          >
            Sign in with Email
          </button>
        </form>
      </div>
    </div>
  )
}
