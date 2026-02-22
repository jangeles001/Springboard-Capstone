import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { Toaster } from 'react-hot-toast'
import NotFoundPage from '../components/__not-found'

export const Route = createRootRoute({
  component: () => (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Toaster />
      <Outlet />
      { import.meta.env.VITE_APP_ENV === 'development' &&
        <TanStackRouterDevtools initialIsOpen={false} />
      }
    </div>
  ),
  notFoundComponent: NotFoundPage,
})