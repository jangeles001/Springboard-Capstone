import { useVerification } from "../hooks/useVerification";
import { useParams } from "@tanstack/react-router";

export function VerificationPage() {
    const { token } = useParams({ from: "/auth/verify/$token" });
    const { isLoading, isSuccess, errorMessage } = useVerification(token);

    return (
        <div className="mx-auto max-w-2xl bg-white px-6 py-10 text-center">
            {isLoading && <p className="text-lg text-black">Verifying your email...</p>}
            {errorMessage && <p className="text-lg text-red-600">Error verifying email: {errorMessage}</p>}
            {isSuccess && <p className="text-lg text-green-600">Email verified successfully!</p>}
        </div>
    );
}