import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'
import PaginationControls from '@/components/PaginationControls'
import PostCard from '@/components/PostCard'

interface TagPageProps {
  params: { tag: string }
  searchParams: { page?: string }
}

export default async function TagPage({ params, searchParams }: TagPageProps) {
  const resolvedParams = await Promise.resolve(params)
  const tagName = resolvedParams.tag

  const resolvedSearchParams = await Promise.resolve(searchParams)
  const currentPage = parseInt(resolvedSearchParams.page || '1', 10)
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
          <PostCard key={post.id} post={post} />
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
