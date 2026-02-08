import { createFileRoute, redirect } from '@tanstack/react-router'
import { VerificationPage } from '../../features/verification/pages/VerificationPage';

export const Route = createFileRoute('/auth/verify/$token')({
    beforeLoad: ({ params }) => {
        const { token } = params;
        if (!token || token.length < 36) throw redirect({ to: "/404" });
        return;
    },
    component: VerificationPage,
});
