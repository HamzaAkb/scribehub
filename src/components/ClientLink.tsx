'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import React from 'react'

interface ClientLinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string
  children: React.ReactNode
}

export default function ClientLink({
  href,
  children,
  ...props
}: ClientLinkProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault()
    startTransition(() => {
      router.push(href)
    })
  }

  return (
    <a href={href} onClick={handleClick} {...props}>
      {children}
      {isPending && (
        <Loader2 className='w-4 h-4 inline-block ml-2 animate-spin' />
      )}
    </a>
  )
}
