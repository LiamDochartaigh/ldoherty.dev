import { createFileRoute } from '@tanstack/react-router'
import { PagifiedContentsCards } from '#components/PagifiedContentCards'
import { blogMeta } from '@/content.gen'
import { Content } from '#components/ContentCard'

const blogPosts = blogMeta.filter(
  (post): post is Required<typeof post> =>
    !!post.description && !!post.title
).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  .map(post => {
    return {
      ...post,
      linkProps: { to: '/blog/$blogSlug', params: { blogSlug: post.slug } },
      btnLabel: 'read'
    } as Content
  })

export const Route = createFileRoute('/_public/blog/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <PagifiedContentsCards
    pageLimit={12}
    items={blogPosts} />
}
