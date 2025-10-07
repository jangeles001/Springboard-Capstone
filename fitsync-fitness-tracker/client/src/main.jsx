import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import NotFoundPage from './routes/__not-found'
import "./styles/__root.css"

// Import generated route tree
import { routeTree } from './routeTree.gen'

// Create new router instance
const router = createRouter({ routeTree, defaultNotFoundComponent: NotFoundPage })

// Render app
const rootElement = document.getElementById('root')
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
        <RouterProvider router={router} />
    </StrictMode>,
  )
}