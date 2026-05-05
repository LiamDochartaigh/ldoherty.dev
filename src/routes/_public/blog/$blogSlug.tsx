import { createFileRoute } from '@tanstack/react-router'
import { blogMeta } from '@/content.gen'
import { lazy } from 'react';
import LoadingSuspense from '#components/LoadingSuspense';

const componentCache = new Map<string, React.LazyExoticComponent<any>>()

export const Route = createFileRoute('/_public/blog/$blogSlug')({
  component: RouteComponent,
})

function RouteComponent() {
  const { blogSlug } = Route.useParams()

  if (!blogMeta.length) return;

  const content = blogMeta.find(meta => meta.slug === blogSlug)
  if (!content) throw new Error("Project Not Found")

  if (!componentCache.has(blogSlug)) {
    componentCache.set(blogSlug, lazy(content.component))
  }
  const ContentComp = componentCache.get(blogSlug)!

  return (
    <LoadingSuspense>
      <article className="prose">
        <h1>{content.title}</h1>
        <ContentComp />
      </article>
    </LoadingSuspense>
  )
}
