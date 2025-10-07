import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

export const Route = createRootRoute({
  component: () => (
    <div className="bg-gray-100">
      <Outlet />
      <TanStackRouterDevtools initialIsOpen={false} />
    </div>
  ),
})