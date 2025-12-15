import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import NotFoundPage from './routes/__not-found'
import "./styles/__root.css"

// Import generated route tree
import { routeTree } from './routeTree.gen'
import { AuthBootstrap } from './features/login/components/AuthBootstrap'

// Create new router instance
const router = createRouter({ routeTree, defaultNotFoundComponent: NotFoundPage })
const queryClient = new QueryClient();

// Render app
const rootElement = document.getElementById('root')
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <AuthBootstrap />
        <RouterProvider router={router} />
      </QueryClientProvider>
    </StrictMode>,
  )
}