import { createFileRoute } from '@tanstack/react-router'
import Dashboard from '../../features/dashboard/components/Dashboard.jsx'

export const Route = createFileRoute('/dashboard/')({
  component: Dashboard,
})

