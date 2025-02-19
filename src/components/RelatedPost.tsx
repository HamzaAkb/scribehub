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
          <div key={post.id} className='p-4 border rounded'>
            <h3 className='text-xl font-bold'>
              <Link href={`/posts/${post.id}`}>
                <span className='text-blue-600 hover:underline'>
                  {post.title}
                </span>
              </Link>
            </h3>
            <p className='text-sm text-gray-500'>
              By {post.author.name || post.author.email} on{' '}
              {new Date(post.createdAt).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
