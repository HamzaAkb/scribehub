'use client'

import { useEffect, useState } from 'react'

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
      className='px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded'
    >
      {enabled ? 'Light Mode' : 'Dark Mode'}
    </button>
  )
}
