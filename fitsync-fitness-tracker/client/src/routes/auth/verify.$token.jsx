import { createFileRoute } from '@tanstack/react-router'
import { VerificationPage } from '../../features/verification/components/VerificationPage';

export const Route = createFileRoute('/auth/verify/$token')({
    beforeLoad: ({ params }) => {
        const { token } = params; // Debug log to check the token value
        if (!token) throw new Error("Verification token is missing");
        return token;
    },
    component: () => <VerificationPage/>,
});
