import { createFileRoute } from '@tanstack/react-router'
import { ResetPasswordPage } from '../../features/login/pages/ResetPasswordPage'

export const Route = createFileRoute('/auth/reset-password/$token')({
  beforeLoad: ({ params }) => {
    const { token } = params;
    if (!token || token.length < 36) throw redirect({ to: "/404" });
    return;
  },
  component: ResetPasswordPage,
})