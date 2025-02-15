import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { redirect } from 'next/navigation'
import EditPostForm from '@/components/EditPostForm'

interface PageProps {
  params: { id: string }
}

export default async function EditPostPage({ params }: PageProps) {
  const session = await getServerSession(authOptions)
  if (!session || !session.user || !session.user.email) {
    redirect('/signin')
  }

  const post = await prisma.post.findUnique({
    where: { id: Number(params.id) },
    include: { author: true },
  })

  if (!post) {
    return <div>Post not found</div>
  }

  if (post.author.email !== session.user.email) {
    redirect('/dashboard/posts')
  }

  return <EditPostForm post={post} />
}
