'use client'

import { useEffect, useState } from 'react'

interface Notification {
  id: number
  type: string
  message: string
  read: boolean
  createdAt: string
}

export default function NotificationsPanel() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchNotifications = async () => {
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
    fetchNotifications()
  }, [])

  if (loading) return <p>Loading notifications...</p>

  return (
    <div className='p-4 border rounded bg-gray-100 dark:bg-gray-800'>
      <h2 className='text-lg font-bold mb-2'>Notifications</h2>
      {notifications.length === 0 ? (
        <p>No notifications.</p>
      ) : (
        <ul>
          {notifications.map((notif) => (
            <li
              key={notif.id}
              className={`mb-2 p-2 ${notif.read ? 'opacity-50' : ''}`}
            >
              <p>{notif.message}</p>
              <small className='text-gray-600'>
                {new Date(notif.createdAt).toLocaleString()}
              </small>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
