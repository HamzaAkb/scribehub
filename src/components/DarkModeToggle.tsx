'use client'

import { useEffect, useState } from 'react'
import { Sun, Moon } from 'lucide-react'

export default function DarkModeToggle() {
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const storedPreference = localStorage.getItem('dark-mode')
    if (storedPreference === 'true') {
      setEnabled(true)
      document.documentElement.classList.add('dark')
    } else {
      setEnabled(false)
      document.documentElement.classList.remove('dark')
    }
  }, [])

  const toggleDarkMode = () => {
    if (enabled) {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('dark-mode', 'false')
      setEnabled(false)
    } else {
      document.documentElement.classList.add('dark')
      localStorage.setItem('dark-mode', 'true')
      setEnabled(true)
    }
  }

  return (
    <button
      onClick={toggleDarkMode}
      className='p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors'
    >
      {enabled ? (
        <Sun className='w-6 h-6 text-yellow-500' />
      ) : (
        <Moon className='w-6 h-6 text-white-800' />
      )}
    </button>
  )
}
