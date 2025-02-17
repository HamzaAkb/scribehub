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
      published: true,
      title: { contains: query, mode: 'insensitive' },
    },
    include: { author: true, tags: true },
    orderBy: { createdAt: 'desc' },
    skip,
    take: postsPerPage,
  })

  const totalPages = Math.ceil(totalPosts / postsPerPage)

  return (
    <div className='p-8'>
      <h1 className='text-3xl mb-8'>Public Blog Posts</h1>
      <form method='GET' className='mb-8'>
        <input
          type='text'
          name='query'
          placeholder='Search posts...'
          defaultValue={query}
          className='p-2 border rounded'
        />
        <button
          type='submit'
          className='ml-2 px-4 py-2 bg-blue-500 text-white rounded'
        >
          Search
        </button>
      </form>
      {posts.length === 0 ? (
        <p>No posts available.</p>
      ) : (
        posts.map((post) => (
          <div key={post.id} className='mb-4 p-4 border rounded'>
            <Link href={`/posts/${post.id}`}>
              <h2 className='text-2xl font-bold text-blue-600 hover:underline'>
                {post.title}
              </h2>
            </Link>
            <p className='text-sm text-gray-500'>
              By {post.author.name || post.author.email} on{' '}
              {new Date(post.createdAt).toLocaleDateString()}
            </p>
            <p className='mt-2'>{post.content.substring(0, 100)}...</p>
            {post.tags && post.tags.length > 0 && (
              <div className='mt-2'>
                {post.tags.map((tag: any) => (
                  <span
                    key={tag.id}
                    className='inline-block bg-gray-200 px-2 py-1 text-sm rounded mr-2'
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))
      )}
      <div className='mt-8 flex justify-center space-x-4'>
        {currentPage > 1 && (
          <Link
            href={`/?query=${query}&page=${currentPage - 1}`}
            className='px-4 py-2 bg-gray-300 rounded'
          >
            Previous
          </Link>
        )}
        {currentPage < totalPages && (
          <Link
            href={`/?query=${query}&page=${currentPage + 1}`}
            className='px-4 py-2 bg-gray-300 rounded'
          >
            Next
          </Link>
        )}
      </div>
    </div>
  )
}
