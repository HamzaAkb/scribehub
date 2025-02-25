import prisma from '@/lib/prisma'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import PaginationControls from '@/components/PaginationControls'

interface TagPageProps {
  params: { tag: string }
  searchParams: { page?: string }
}

export default async function TagPage({ params, searchParams }: TagPageProps) {
  const tagName = params.tag
  const currentPage = parseInt(searchParams.page || '1', 10)
  const postsPerPage = 5
  const skip = (currentPage - 1) * postsPerPage

  const totalPosts = await prisma.post.count({
    where: {
      published: true,
      tags: { some: { name: { equals: tagName, mode: 'insensitive' } } },
    },
  })

  if (totalPosts === 0) {
    notFound()
  }

  const posts = await prisma.post.findMany({
    where: {
      published: true,
      tags: { some: { name: { equals: tagName, mode: 'insensitive' } } },
    },
    include: { author: true, tags: true },
    orderBy: { createdAt: 'desc' },
    skip,
    take: postsPerPage,
  })

  const totalPages = Math.ceil(totalPosts / postsPerPage)

  return (
    <div className='p-8'>
      <h1 className='text-3xl mb-8'>Posts tagged with &quot;{tagName}&quot;</h1>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {posts.map((post) => (
          <div
            key={post.id}
            className='border rounded-lg shadow-sm hover:shadow-lg transition-shadow bg-white dark:bg-gray-800 p-4'
          >
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
        ))}
      </div>
      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        baseUrl={`/tags/${tagName}`}
        queryParam='page'
      />
    </div>
  )
}
