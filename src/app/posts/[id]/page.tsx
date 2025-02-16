import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'

interface PostPageProps {
  params: { id: string }
}

export default async function PostPage({ params }: PostPageProps) {
  const resolvedParams = await Promise.resolve(params)
  const { id } = resolvedParams

  const post = await prisma.post.findUnique({
    where: { id: Number(id) },
    include: { author: true },
  })

  if (!post || !post.published) {
    return notFound()
  }

  return (
    <div className='p-8'>
      <h1 className='text-3xl font-bold mb-2'>{post.title}</h1>
      <p className='text-sm text-gray-500 mb-4'>
        By {post.author.name || post.author.email} on{' '}
        {new Date(post.createdAt).toLocaleDateString()}
      </p>
      <div className='mt-4'>
        <p>{post.content}</p>
      </div>
    </div>
  )
}
