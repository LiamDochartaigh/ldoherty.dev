import { createFileRoute } from '@tanstack/react-router'
import { ContentCard } from '#components/ContentCard'
import { projectsMeta } from '@/content.gen'

export const Route = createFileRoute('/_public/')({
  component: RouteComponent,
})

const projects = projectsMeta.filter(
  (project): project is Required<typeof project> =>
    !!project.description && !!project.title
);

function RouteComponent() {
  return (
    <div className="max-w-5xl mx-auto">
      <section className="pb-16">
        <h1 className="font-display text-4xl text-primary">Liam Doherty</h1>
        <p className="text-muted mt-4 max-w-xl">
          Full stack developer with a background in building tools for content creators
          and streamers, payment integrations, and indie game development
          — with a title shipped on Steam.
        </p>
        <p className='text-muted'>
          Here are some of the projects he has worked on:
        </p>
      </section>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {projects.map((project) => (
          <ContentCard key={project.title}
            linkProps={{ to: '/projects/$projectSlug', params: { projectSlug: project.slug } }}
            btnLabel='see project'
            {...project} />
        ))}
      </div>
    </div>
  )
}
