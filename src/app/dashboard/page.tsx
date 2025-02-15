'use client'

import { useEffect } from 'react'
import { useSession, signOut, signIn } from 'next-auth/react'

export default function Dashboard() {
  const { data: session, status } = useSession()

  useEffect(() => {
    if (status === 'unauthenticated') {
      // Redirect to sign in if the user is not authenticated
      signIn()
    }
  }, [status])

  if (status === 'loading') {
    return <div>Loading...</div>
  }

  return (
    <div className='p-8'>
      <h1 className='text-2xl mb-4'>Dashboard</h1>
      <p>Welcome, {session?.user?.name || session?.user?.email}</p>
      <button
        onClick={() => signOut()}
        className='mt-4 px-4 py-2 bg-red-500 text-white rounded'
      >
        Sign out
      </button>
    </div>
  )
}
