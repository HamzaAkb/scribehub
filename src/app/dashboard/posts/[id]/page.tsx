import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { redirect } from 'next/navigation'
import CommentsSection from '@/components/CommentsSection.tsxCommentsSection'
import DeletePostButton from '@/components/DeletePostButton'

interface PostPageProps {
  params: { id: string }
}

export default async function PostPage({ params }: PostPageProps) {
  const session = await getServerSession(authOptions)
  if (!session || !session.user || !session.user.email) {
    redirect('/signin')
  }

  const post = await prisma.post.findUnique({
    where: { id: Number(params.id) },
    include: {
      author: true,
      comments: { include: { author: true } },
    },
  })

  if (!post) {
    return <div>Post not found</div>
  }

  const postWithComments = post as typeof post & {
    comments: Array<{
      id: number
      content: string
      author: { name: string | null; email: string }
    }>
  }

  const isAuthor = postWithComments.author.email === session.user.email

  return (
    <div className='p-8'>
      <h1 className='text-2xl mb-4'>{postWithComments.title}</h1>
      <p className='mb-2'>{postWithComments.content}</p>
      <p className='text-sm text-gray-500'>
        {new Date(postWithComments.createdAt).toLocaleString()}
      </p>
      {isAuthor && (
        <div className='mt-4'>
          <button className='px-4 py-2 bg-blue-500 text-white rounded mr-2'>
            Edit
          </button>
          <DeletePostButton postId={post.id} />
        </div>
      )}
      <hr className='my-6' />
      <CommentsSection
        initialComments={postWithComments.comments}
        postId={postWithComments.id}
      />
    </div>
  )
}
