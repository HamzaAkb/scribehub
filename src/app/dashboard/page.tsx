import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { redirect } from 'next/navigation'

export default async function Dashboard() {
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
    _sum: {
      likes: true,
    },
    _avg: {
      likes: true,
    },
  })

  const commentsCount = await prisma.comment.count({
    where: { post: { authorId: currentUser.id } },
  })

  return (
    <div className='max-w-4xl mx-auto p-8'>
      <h1 className='text-3xl font-bold mb-8'>Dashboard Analytics</h1>
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
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
    </div>
  )
}
