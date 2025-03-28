import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import '@/utils/scheduler'
import DarkModeToggle from '@/components/DarkModeToggle'
import NotificationsDropdown from '@/components/NotificationsDropdown'
import { authOptions } from './api/auth/[...nextauth]/route'
import { getServerSession } from 'next-auth'
import Link from 'next/link'
import SearchBar from '@/components/Searchbar'
import { LogIn, LogOut, LucideLayoutDashboard } from 'lucide-react'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Scribehub',
  description: 'A place to write and share your thoughts.',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await getServerSession(authOptions)

  return (
    <html lang='en'>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100`}
      >
        <header className='bg-blue-500 dark:bg-blue-700 text-white'>
          <div className='container mx-auto flex items-center p-4'>
            <div className='flex-1'>
              <Link href='/' className='text-xl font-bold'>
                Scribe Hub
              </Link>
            </div>
            <div className='flex-1 flex justify-center'>
              <SearchBar />
            </div>
            <div className='flex-1 flex justify-end items-center space-x-4'>
              <DarkModeToggle />
              {session ? (
                <>
                  <NotificationsDropdown />
                  <Link
                    href='/dashboard'
                    className='p-2 hover:bg-blue-600 rounded-full transition-colors'
                  >
                    <LucideLayoutDashboard size={24} />
                  </Link>
                  <Link
                    href='/api/auth/signout'
                    className='p-2 hover:bg-blue-600 rounded-full transition-colors'
                  >
                    <LogOut size={24} />
                  </Link>
                </>
              ) : (
                <Link
                  href='/api/auth/signin'
                  className='p-2 hover:bg-blue-600 rounded-full transition-colors'
                >
                  <LogIn size={24} />
                </Link>
              )}
            </div>
          </div>
        </header>
        <main className='container mx-auto p-4'>
          <Providers>{children}</Providers>
        </main>
        <footer className='bg-gray-200 dark:bg-gray-800 text-center p-4 mt-8'>
          <div className='container mx-auto'>
            <p>
              &copy; {new Date().getFullYear()} Scribe Hub. All rights reserved.
            </p>
          </div>
        </footer>
      </body>
    </html>
  )
}
