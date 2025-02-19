import prisma from '@/lib/prisma'
import Link from 'next/link'

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

  return (
    <div className='p-8'>
      {posts.length === 0 ? (
        <p className='text-center text-lg text-gray-600'>No posts available.</p>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {posts.map((post) => (
            <div
              key={post.id}
              className='border rounded-lg shadow-sm hover:shadow-lg transition-shadow bg-white dark:bg-gray-800 p-4'
            >
              <Link href={`/posts/${post.id}`}>
                <h2 className='text-xl font-bold text-blue-600 dark:text-blue-400 hover:underline'>
                  {post.title}
                </h2>
              </Link>
              <p className='text-sm text-gray-500'>
                By {post.author.name || post.author.email} on{' '}
                {new Date(post.createdAt).toLocaleDateString()}
              </p>
              <p className='mt-2 text-gray-700 dark:text-gray-300'>
                {post.description}
              </p>
              {post.tags && post.tags.length > 0 && (
                <div className='mt-2'>
                  {post.tags.map((tag: any) => (
                    <span
                      key={tag.id}
                      className='inline-block bg-gray-200 dark:bg-gray-600 px-2 py-1 text-sm rounded mr-2'
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      <div className='mt-8 flex justify-center space-x-4'>
        {currentPage > 1 && (
          <Link
            href={`/?query=${encodeURIComponent(query)}&page=${
              currentPage - 1
            }`}
            className='px-4 py-2 bg-gray-300 rounded'
          >
            Previous
          </Link>
        )}
        {currentPage < totalPages && (
          <Link
            href={`/?query=${encodeURIComponent(query)}&page=${
              currentPage + 1
            }`}
            className='px-4 py-2 bg-gray-300 rounded'
          >
            Next
          </Link>
        )}
      </div>
    </div>
  )
}
