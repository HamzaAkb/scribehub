import prisma from '@/lib/prisma'
import Link from 'next/link'

interface HomePageProps {
  searchParams: { query?: string }
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const query = searchParams.query || ''

  const posts = await prisma.post.findMany({
    where: {
      published: true,
      title: {
        contains: query,
        mode: 'insensitive',
      },
    },
    include: { author: true },
    orderBy: { createdAt: 'desc' },
  })

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
          </div>
        ))
      )}
    </div>
  )
}
