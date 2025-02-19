import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'
import ShareButtons from '@/components/ShareButtons'
import CommentsSection from '@/components/CommentsSection'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import BookmarkButton from '@/components/BookmarkButton'
import RelatedPosts from '@/components/RelatedPost'

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

  let initialBookmarked = false
  if (session && session.user && session.user.email) {
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    })
    if (currentUser) {
      const bookmark = await prisma.bookmark.findUnique({
        where: {
          userId_postId: {
            userId: currentUser.id,
            postId: post.id,
          },
        },
      })
      initialBookmarked = !!bookmark
    }
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const postUrl = `${siteUrl}/posts/${post.id}`

  return (
    <div className='max-w-4xl mx-auto p-8'>
      <h1 className='text-4xl font-extrabold mb-4'>{post.title}</h1>
      <div className='flex items-center space-x-4 mb-6'>
        <p className='text-sm text-gray-500'>
          By {post.author.name || post.author.email}
        </p>
        <p className='text-sm text-gray-500'>
          {new Date(post.createdAt).toLocaleDateString()}
        </p>
        {session && session.user && (
          <BookmarkButton
            postId={post.id}
            initialBookmarked={initialBookmarked}
          />
        )}
      </div>
      <div className='prose dark:prose-dark max-w-full mb-8'>
        <p>{post.content}</p>
      </div>
      <ShareButtons url={postUrl} title={post.title} />
      <div className='mt-12'>
        <CommentsSection
          initialComments={post.comments}
          postId={post.id}
          currentUserEmail={session?.user?.email || ''}
        />
      </div>
      {relatedPosts.length > 0 && <RelatedPosts relatedPosts={relatedPosts} />}
    </div>
  )
}
