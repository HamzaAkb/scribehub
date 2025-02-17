import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'
import ShareButtons from '@/components/ShareButtons'
import CommentsSection from '@/components/CommentsSection'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

interface PostPageProps {
  params: { id: string }
}

export default async function PostPage({ params }: PostPageProps) {
  const resolvedParams = await Promise.resolve(params)
  const { id } = resolvedParams

  const session = await getServerSession(authOptions)

  const post = await prisma.post.findUnique({
    where: {
      id: Number(id),
      OR: [{ published: true }, { scheduledAt: { lte: new Date() } } as any],
    },
    include: { author: true, comments: { include: { author: true } } },
  })

  if (
    !post ||
    (!post.published && (!post.scheduledAt || post.scheduledAt > new Date()))
  ) {
    return notFound()
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const postUrl = `${siteUrl}/posts/${post.id}`

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
      <ShareButtons url={postUrl} title={post.title} />
      <CommentsSection
        initialComments={post.comments}
        postId={post.id}
        currentUserEmail={session?.user?.email || ''}
      />
    </div>
  )
}
