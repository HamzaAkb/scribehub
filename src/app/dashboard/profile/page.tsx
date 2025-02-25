import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { redirect, notFound } from 'next/navigation'
import PostCard from '@/components/PostCard'

export default async function ProfilePage() {
  const session = await getServerSession(authOptions)
  if (!session || !session.user || !session.user.email) {
    redirect('/signin')
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      posts: { include: { author: true, tags: true } },
      comments: true,
    },
  })

  if (!user) {
    return notFound()
  }

  return (
    <div className='p-8'>
      <div className='flex items-center mb-8'>
        {user.imageUrl && (
          <img
            src={user.imageUrl}
            alt='Profile Picture'
            className='h-24 w-24 object-cover rounded-full mr-4'
          />
        )}
        <h1 className='text-3xl'>{user.name || user.email}'s Profile</h1>
      </div>
      <section className='mb-8'>
        <h2 className='text-2xl mb-2'>Your Posts</h2>
        {user.posts.length === 0 ? (
          <p>You have not created any posts yet.</p>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {user.posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </section>
      <section>
        <h2 className='text-2xl mb-2'>Your Comments</h2>
        {user.comments.length === 0 ? (
          <p>You have not commented on any posts yet.</p>
        ) : (
          user.comments.map((comment) => (
            <div key={comment.id} className='mb-4 p-4 border rounded'>
              <p>{comment.content}</p>
              <p className='text-sm text-gray-500'>
                {new Date(comment.createdAt).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </section>
    </div>
  )
}
