import Link from 'next/link'

interface Author {
  name?: string | null
  email: string
}
interface RelatedPost {
  id: number
  title: string
  createdAt: Date
  author: Author
  description: string | null
  tags?: { id: number; name: string }[]
}

interface RelatedPostsProps {
  relatedPosts: RelatedPost[]
}

export default function RelatedPosts({ relatedPosts }: RelatedPostsProps) {
  if (!relatedPosts || relatedPosts.length === 0) return null

  return (
    <div className='mt-12'>
      <h2 className='text-2xl font-bold mb-4'>Related Posts</h2>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        {relatedPosts.map((post) => (
          <div
            key={post.id}
            className='border rounded-lg shadow-sm hover:shadow-lg transition-shadow bg-white dark:bg-gray-800 p-4'
          >
            <Link href={`/posts/${post.id}`}>
              <h3 className='text-xl font-bold text-blue-600 dark:text-blue-400 hover:underline'>
                {post.title}
              </h3>
            </Link>
            <p className='text-sm text-gray-500'>
              {new Date(post.createdAt).toLocaleDateString()}
            </p>
            <p className='mt-2 text-gray-700 dark:text-gray-300'>
              {post.description ?? 'No description available.'}
            </p>
            {post.tags && post.tags.length > 0 && (
              <div className='mt-2'>
                {post.tags.map((tag) => (
                  <Link
                    href={`/tags/${tag.name}`}
                    key={tag.id}
                    className='inline-block bg-gray-200 dark:bg-gray-600 px-2 py-1 text-sm rounded mr-2'
                  >
                    {tag.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
