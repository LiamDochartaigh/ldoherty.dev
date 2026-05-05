import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_public/empty')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_public/empty"!</div>
}
