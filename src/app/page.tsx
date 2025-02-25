import prisma from '@/lib/prisma'
import PostCard from '@/components/PostCard'
import PaginationControls from '@/components/PaginationControls'

interface HomePageProps {
  searchParams: { query?: string; page?: string }
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const resolvedSearchParams = await Promise.resolve(searchParams)
  const query = resolvedSearchParams.query || ''
  const currentPage = parseInt(resolvedSearchParams.page || '1', 10)
  const postsPerPage = 5
  const skip = (currentPage - 1) * postsPerPage

  const totalPosts = await prisma.post.count({
    where: {
      published: true,
      title: { contains: query, mode: 'insensitive' },
    },
  })

  const posts = await prisma.post.findMany({
    where: {
      AND: [
        {
          OR: [
            { published: true },
            { scheduledAt: { lte: new Date() } } as any,
          ],
        },
        { title: { contains: query, mode: 'insensitive' } },
      ],
    },
    include: { author: true, tags: true },
    orderBy: { createdAt: 'desc' },
    skip,
    take: postsPerPage,
  })

  const totalPages = Math.ceil(totalPosts / postsPerPage)

  const baseUrl = `/?query=${encodeURIComponent(query)}`

  return (
    <div className='p-8'>
      {posts.length === 0 ? (
        <p className='text-center text-lg text-gray-600'>No posts available.</p>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        baseUrl={baseUrl}
        queryParam='page'
      />
    </div>
  )
}
