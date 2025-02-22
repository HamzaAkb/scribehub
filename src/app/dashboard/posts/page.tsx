import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { redirect } from 'next/navigation'
import PostCard from '@/components/PostCard'

interface DashboardProps {
  searchParams: { postPage?: string }
}

export default async function PostsPage({ searchParams }: DashboardProps) {
  const session = await getServerSession(authOptions)

  if (!session || !session.user || !session.user.email) {
    redirect('/signin')
  }

  const resolvedSearchParams = await Promise.resolve(searchParams)
  const postPage = parseInt(resolvedSearchParams.postPage || '1', 10)
  const postsPerPage = 5
  const skip = (postPage - 1) * postsPerPage

  const posts = await prisma.post.findMany({
    where: {
      author: { email: session.user.email },
    },
    include: { author: true, tags: true },
    orderBy: { createdAt: 'desc' },
    skip,
    take: postsPerPage,
  })

  return (
    <div className='p-8'>
      <h1 className='text-2xl font-bold mb-4'>Your Posts</h1>
      {posts.length === 0 ? (
        <p>No posts found. Create your first post!</p>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
      <div className='mt-8 flex justify-center space-x-4'>
        {postPage > 1 && (
          <a
            href={`/dashboard/posts?postPage=${postPage - 1}`}
            className='px-4 py-2 bg-gray-300 rounded hover:bg-gray-400'
          >
            &larr; Previous
          </a>
        )}
        <a
          href={`/dashboard/posts?postPage=${postPage + 1}`}
          className='px-4 py-2 bg-gray-300 rounded hover:bg-gray-400'
        >
          Next &rarr;
        </a>
      </div>
    </div>
  )
}
