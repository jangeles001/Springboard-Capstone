import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/auth/')({
    beforeLoad: () => {
    throw redirect({ to: '/auth/signup'})
  },
  component: RouteComponent,
})

function RouteComponent() {
  return null;
}
