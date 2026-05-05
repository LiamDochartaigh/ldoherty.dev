import { useState } from 'react'
import { ContentCard, Content} from './ContentCard'

interface Props {
  items: Content[],
  pageLimit: number
}

export function PagifiedContentsCards({ items, pageLimit }: Props) {
  const [page, setPage] = useState(0)

  const totalPages = Math.ceil(items.length / pageLimit)
  const start = page * pageLimit
  const visible = items.slice(start, start + pageLimit)

  if (items.length === 0) {
    return <p className="text-muted text-sm">No posts yet — check back soon.</p>
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-3 gap-8">
        {visible.map((item) => (
          <ContentCard {...item} />
        ))}
      </div>
      {totalPages > 1 && (
        <div className="flex gap-2 justify-center">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setPage(i)}
              className={`px-3 py-1 text-sm border transition-colors ${i === page
                  ? 'border-primary text-primary'
                  : 'border-primary/20 text-muted hover:border-primary/60 hover:text-text'
                }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
