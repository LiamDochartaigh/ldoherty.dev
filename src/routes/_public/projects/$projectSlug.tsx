import { createFileRoute } from '@tanstack/react-router'
import { projectsMeta } from '@/content.gen'
import { lazy, Suspense } from 'react';

const componentCache = new Map<string, React.LazyExoticComponent<any>>()

export const Route = createFileRoute('/_public/projects/$projectSlug')({
  component: RouteComponent,
})

function RouteComponent() {
  const { projectSlug } = Route.useParams()
  const content = projectsMeta.find(meta => meta.slug === projectSlug)
  if (!content) throw new Error("Project Not Found")

  if (!componentCache.has(projectSlug)) {
    componentCache.set(projectSlug, lazy(content.component))
  }
  const ContentComp = componentCache.get(projectSlug)!

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <article className="prose">
        <h1>{content.title}</h1>
        <ContentComp />
      </article>
    </Suspense>
  )
}
