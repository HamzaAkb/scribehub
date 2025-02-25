import Link from 'next/link'

interface PaginationControlsProps {
  currentPage: number
  totalPages: number
  baseUrl: string
  queryParam?: string
}

export default function PaginationControls({
  currentPage,
  totalPages,
  baseUrl,
  queryParam = 'postPage',
}: PaginationControlsProps) {
  if (totalPages <= 1) return null

  const separator = baseUrl.includes('?') ? '&' : '?'

  return (
    <div className='mt-8 flex justify-center space-x-4'>
      {currentPage > 1 && (
        <Link
          href={`${baseUrl}${separator}${queryParam}=${currentPage - 1}`}
          className='px-4 py-2 bg-gray-300 rounded hover:bg-gray-400'
        >
          &larr; Previous
        </Link>
      )}
      {currentPage < totalPages && (
        <Link
          href={`${baseUrl}${separator}${queryParam}=${currentPage + 1}`}
          className='px-4 py-2 bg-gray-300 rounded hover:bg-gray-400'
        >
          Next &rarr;
        </Link>
      )}
    </div>
  )
}
