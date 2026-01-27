import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import NotFoundPage from '../components/__not-found'

export const Route = createRootRoute({
  component: () => (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Outlet />
      <TanStackRouterDevtools initialIsOpen={false} />
    </div>
  ),
  notFoundComponent: NotFoundPage,
})