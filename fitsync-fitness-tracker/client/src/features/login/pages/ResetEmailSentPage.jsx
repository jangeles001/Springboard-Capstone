export function ResetEmailSentPage() {
    return (
        <div className="min-h-screen flex items-center justify-center shadow-xl bg-gradient-to-r from-blue-500 to-indigo-600">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-md text-center">
                <h1 className="text-2xl font-bold mb-4">Reset Email Sent</h1>
                <p className="text-gray-700 mb-6">Please check your email for further instructions to reset your password.</p>
                <a href="/auth/login/" className="text-blue-500 hover:underline">Back to Login</a>
            </div>
        </div>
    );
}