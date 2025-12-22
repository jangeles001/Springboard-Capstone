import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

export const Route = createRootRoute({
  component: () => (
    <div className="min-h-screen grid grid-rows-[1fr_auto] bg-gray-100">
      <Outlet />
      <TanStackRouterDevtools initialIsOpen={false} />
    </div>
  ),
})