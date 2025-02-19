'use client'

import { useState, useEffect, useRef } from 'react'
import { Bell } from 'lucide-react'

interface Notification {
  id: number
  type: string
  message: string
  read: boolean
  createdAt: string
}

export default function NotificationsDropdown() {
  const [open, setOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const fetchNotifications = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/notifications')
      if (res.ok) {
        const data = await res.json()
        setNotifications(data)
      } else {
        console.error('Failed to fetch notifications')
      }
    } catch (error) {
      console.error('Error fetching notifications', error)
    }
    setLoading(false)
  }

  const toggleDropdown = () => {
    if (!open) {
      fetchNotifications()
    }
    setOpen(!open)
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div className='relative' ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className='p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors'
      >
        <Bell className='w-6 h-6' />
      </button>
      {open && (
        <div className='absolute right-0 mt-2 w-80 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded shadow-lg z-50'>
          <div className='p-4'>
            <h3 className='text-lg font-bold mb-2 text-gray-800 dark:text-gray-200'>
              Notifications
            </h3>
            {loading ? (
              <p className='text-sm text-gray-600 dark:text-gray-300'>
                Loading...
              </p>
            ) : notifications.length === 0 ? (
              <p className='text-sm text-gray-600 dark:text-gray-300'>
                No notifications.
              </p>
            ) : (
              <ul className='max-h-60 overflow-y-auto'>
                {notifications.map((notif) => (
                  <li
                    key={notif.id}
                    className='mb-2 p-2 border-b border-gray-200 dark:border-gray-600'
                  >
                    <p className='text-sm text-gray-800 dark:text-gray-200'>
                      {notif.message}
                    </p>
                    <small className='text-xs text-gray-500 dark:text-gray-400'>
                      {new Date(notif.createdAt).toLocaleString()}
                    </small>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
