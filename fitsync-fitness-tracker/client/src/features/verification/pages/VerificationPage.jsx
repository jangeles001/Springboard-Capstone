import { useVerification } from "../hooks/useVerification";
import { useParams } from "@tanstack/react-router";

export function VerificationPage() {
    const { token } = useParams({ from: "/auth/verify/$token" });
    const { isLoading, isSuccess, errorMessage } = useVerification(token);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center shadow-xl bg-gradient-to-r from-blue-500 to-indigo-600">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-md text-center">
                {isLoading && <p className="text-lg text-black">Verifying your email...</p>}
                {errorMessage && <p className="text-lg text-red-600">Error verifying email: {errorMessage}</p>}
                {isSuccess && <p className="text-lg text-green-600">Email verified successfully!</p>}
            </div>
            <a href="/auth/login/" className="text-white hover:underline">&lt; Back to Login</a>
        </div>
    );
}