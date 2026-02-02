import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import NotFoundPage from '../src/components/__not-found'
import "./styles/__root.css"

// Import generated route tree
import { routeTree } from './routeTree.gen'
import { useUserStore } from './store/UserStore'

// Create new router and QueryClient instances
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 3,
    },
  },
});
const userStore = useUserStore.getState();
const router = createRouter({ routeTree, context: { queryClient, userStore }, defaultNotFoundComponent: NotFoundPage })

// Render app
const rootElement = document.getElementById('root')
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </StrictMode>,
  )
}