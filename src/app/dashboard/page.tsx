import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import PostCard from '@/components/PostCard'

interface DashboardProps {
  searchParams: { postPage?: string }
}

export default async function Dashboard({ searchParams }: DashboardProps) {
  const session = await getServerSession(authOptions)
  if (!session || !session.user || !session.user.email) {
    redirect('/signin')
  }

  const currentUser = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  })

  if (!currentUser) {
    redirect('/signin')
  }

  const postsCount = await prisma.post.count({
    where: { authorId: currentUser.id },
  })

  const metrics = await prisma.post.aggregate({
    where: { authorId: currentUser.id },
    _sum: { likes: true },
    _avg: { likes: true },
  })

  const commentsCount = await prisma.comment.count({
    where: { post: { authorId: currentUser.id } },
  })

  const postPage = parseInt(searchParams.postPage || '1', 10)
  const postsPerPage = 5
  const skip = (postPage - 1) * postsPerPage

  const userPosts = await prisma.post.findMany({
    where: { authorId: currentUser.id },
    include: { author: true, tags: true },
    orderBy: { createdAt: 'desc' },
    skip,
    take: postsPerPage,
  })

  const totalUserPosts = await prisma.post.count({
    where: { authorId: currentUser.id },
  })
  const totalPages = Math.ceil(totalUserPosts / postsPerPage)

  return (
    <div className='max-w-4xl mx-auto p-8'>
      <h1 className='text-3xl font-bold mb-8'>Dashboard Analytics</h1>
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8'>
        <div className='bg-white dark:bg-gray-800 p-6 rounded-lg shadow'>
          <h2 className='text-xl font-semibold mb-2'>Total Posts</h2>
          <p className='text-3xl'>{postsCount}</p>
        </div>
        <div className='bg-white dark:bg-gray-800 p-6 rounded-lg shadow'>
          <h2 className='text-xl font-semibold mb-2'>Total Likes</h2>
          <p className='text-3xl'>{metrics._sum?.likes || 0}</p>
        </div>
        <div className='bg-white dark:bg-gray-800 p-6 rounded-lg shadow'>
          <h2 className='text-xl font-semibold mb-2'>Total Comments</h2>
          <p className='text-3xl'>{commentsCount}</p>
        </div>
      </div>

      <div className='mt-12'>
        <h2 className='text-2xl font-bold mb-4'>Your Latest Posts</h2>
        {userPosts.length === 0 ? (
          <p>You haven't written any posts yet.</p>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {userPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
        <div className='mt-4 flex justify-center space-x-4'>
          {postPage > 1 && (
            <Link
              href={`/dashboard?postPage=${postPage - 1}`}
              className='px-4 py-2 bg-gray-300 rounded hover:bg-gray-400'
            >
              &larr; Previous
            </Link>
          )}
          {postPage < totalPages && (
            <Link
              href={`/dashboard?postPage=${postPage + 1}`}
              className='px-4 py-2 bg-gray-300 rounded hover:bg-gray-400'
            >
              Next &rarr;
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
