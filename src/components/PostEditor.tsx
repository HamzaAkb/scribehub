'use client'

import dynamic from 'next/dynamic'
import { useState } from 'react'
import * as ReactDOM from 'react-dom'
import 'react-quill/dist/quill.snow.css'

if (!(ReactDOM as any).findDOMNode) {
  ;(ReactDOM as any).findDOMNode = (element: any) => element
}

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false })

interface PostEditorProps {
  initialContent?: string
  onChange: (content: string) => void
}

const modules = {
  toolbar: [
    [{ header: [1, 2, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['link', 'image'],
    ['clean'],
  ],
}

const formats = [
  'header',
  'bold',
  'italic',
  'underline',
  'strike',
  'list',
  'bullet',
  'link',
  'image',
]

export default function PostEditor({
  initialContent = '',
  onChange,
}: PostEditorProps) {
  const [content, setContent] = useState(initialContent)

  const handleChange = (value: string) => {
    setContent(value)
    onChange(value)
  }

  return (
    <ReactQuill
      value={content}
      onChange={handleChange}
      modules={modules}
      formats={formats}
      theme='snow'
    />
  )
}
