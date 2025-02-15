import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { redirect } from 'next/navigation'

export default async function PostsPage() {
  // Get the server session
  const session = await getServerSession(authOptions)

  // Redirect if the session or user/email is missing
  if (!session || !session.user || !session.user.email) {
    redirect('/signin')
  }

  // Now TypeScript knows session.user.email is defined
  const posts = await prisma.post.findMany({
    where: {
      author: {
        email: session.user.email,
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return (
    <div className='p-8'>
      <h1 className='text-2xl mb-4'>Your Posts</h1>
      {posts.length === 0 ? (
        <p>No posts found. Create your first post!</p>
      ) : (
        posts.map((post) => (
          <div key={post.id} className='mb-4 p-4 border rounded'>
            <h2 className='text-xl font-bold'>{post.title}</h2>
            <p>{post.content}</p>
            <p className='text-sm text-gray-500'>
              {new Date(post.createdAt).toLocaleString()}
            </p>
          </div>
        ))
      )}
    </div>
  )
}
