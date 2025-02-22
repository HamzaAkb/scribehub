import Link from 'next/link'

interface PostCardProps {
  post: {
    id: number
    title: string
    createdAt: Date
    author: { name?: string | null; email: string }
    description: string | null
    tags?: { id: number; name: string }[]
  }
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <div className='border rounded-lg shadow-sm hover:shadow-lg transition-shadow bg-white dark:bg-gray-800 p-4'>
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
        {post.description ?? 'No description available.'}
      </p>
      {post.tags && post.tags.length > 0 && (
        <div className='mt-2'>
          {post.tags.map((tag) => (
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
  )
}
