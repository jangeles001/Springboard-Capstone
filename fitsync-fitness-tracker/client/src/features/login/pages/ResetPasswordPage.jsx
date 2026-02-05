import { useResetPassword } from '../hooks/useResetPassword'
export function ResetPasswordPage() {

    const router = useRouter();
    const { 
        password,
        confirmPassword,
        formErrors,
        successMessage } = useResetPassword({ onSuccess: () => router.navigate({ to: '/dashboard/'}) });

    return {

    }
}