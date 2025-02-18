'use client'

import dynamic from 'next/dynamic'
import { useState } from 'react'
import * as ReactDOM from 'react-dom'
import 'react-quill/dist/quill.snow.css'

// Workaround: Ensure findDOMNode is defined (ReactQuill uses it internally)
if (!ReactDOM.findDOMNode) {
  ReactDOM.findDOMNode = (element: any) => element
}

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false })

interface PostEditorProps {
  initialContent?: string
  onChange: (content: string) => void
}

export default function PostEditor({
  initialContent = '',
  onChange,
}: PostEditorProps) {
  const [content, setContent] = useState(initialContent)

  const handleChange = (value: string) => {
    setContent(value)
    onChange(value)
  }

  return <ReactQuill value={content} onChange={handleChange} theme='snow' />
}
