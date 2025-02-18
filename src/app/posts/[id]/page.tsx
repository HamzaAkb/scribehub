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
    include: {
      author: true,
      comments: { include: { author: true } },
      tags: true,
    },
  })

  if (
    !post ||
    (!post.published && (!post.scheduledAt || post.scheduledAt > new Date()))
  ) {
    return notFound()
  }

  const relatedPosts = await prisma.post.findMany({
    where: {
      published: true,
      id: { not: post.id },
      tags: {
        some: {
          id: { in: post.tags.map((tag) => tag.id) },
        },
      },
    },
    take: 3,
    orderBy: { createdAt: 'desc' },
    include: { author: true },
  })

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

      {relatedPosts.length > 0 && (
        <div className='mt-8'>
          <h2 className='text-2xl font-bold mb-4'>Related Posts</h2>
          {relatedPosts.map((related) => (
            <div key={related.id} className='mb-4 p-4 border rounded'>
              <h3 className='text-xl font-bold'>
                <a
                  href={`/posts/${related.id}`}
                  className='text-blue-600 hover:underline'
                >
                  {related.title}
                </a>
              </h3>
              <p className='text-sm text-gray-500'>
                By {related.author.name || related.author.email} on{' '}
                {new Date(related.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
