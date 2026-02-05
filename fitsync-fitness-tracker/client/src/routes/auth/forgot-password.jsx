import { createFileRoute } from '@tanstack/react-router'
import ForgotPasswordPage from '../../features/login/pages/ForgotPassword'

export const Route = createFileRoute('/auth/forgot-password')({
  component: ForgotPasswordPage,
})
