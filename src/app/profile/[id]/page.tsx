import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'
import PostCard from '@/components/PostCard'
import PaginationControls from '@/components/PaginationControls'

interface ProfilePageProps {
  params: { id: string }
  searchParams: { postPage?: string }
}

export default async function ProfilePage({
  params,
  searchParams,
}: ProfilePageProps) {
  const { id } = params

  const author = await prisma.user.findUnique({
    where: { id: Number(id) },
  })

  if (!author) {
    return notFound()
  }

  const postPage = parseInt(searchParams.postPage || '1', 10)
  const postsPerPage = 5
  const skip = (postPage - 1) * postsPerPage

  const posts = await prisma.post.findMany({
    where: {
      authorId: author.id,
      AND: [
        {
          OR: [
            { published: true },
            { scheduledAt: { lte: new Date() } } as any,
          ],
        },
      ],
    },
    orderBy: { createdAt: 'desc' },
    skip,
    take: postsPerPage,
    include: { author: true, tags: true },
  })

  const totalUserPosts = await prisma.post.count({
    where: {
      authorId: author.id,
      AND: [
        {
          OR: [
            { published: true },
            { scheduledAt: { lte: new Date() } } as any,
          ],
        },
      ],
    },
  })
  const totalPages = Math.ceil(totalUserPosts / postsPerPage)

  return (
    <div className='container mx-auto p-8'>
      <div className='flex items-center space-x-4 mb-8'>
        {author.imageUrl && (
          <img
            src={author.imageUrl}
            alt={author.name || author.email}
            className='w-24 h-24 rounded-full object-cover'
          />
        )}
        <div>
          <h1 className='text-3xl font-bold'>{author.name || author.email}</h1>
          <p className='text-gray-500'>{author.email}</p>
        </div>
      </div>

      <h2 className='text-2xl font-bold mb-4'>
        Posts by {author.name || author.email}
      </h2>
      {posts.length === 0 ? (
        <p>No posts published yet.</p>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}

      <PaginationControls
        currentPage={postPage}
        totalPages={totalPages}
        baseUrl={`/profile/${author.id}`}
      />
    </div>
  )
}
