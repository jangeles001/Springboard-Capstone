import { createFileRoute } from '@tanstack/react-router'
import { ResetEmailSentPage } from '../../features/login/pages/ResetEmailSentPage'

export const Route = createFileRoute('/auth/reset-email-sent')({
  component: ResetEmailSentPage,
})
