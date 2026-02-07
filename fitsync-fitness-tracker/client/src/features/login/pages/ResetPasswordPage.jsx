import { useRouter, useParams, Link } from "@tanstack/react-router"
import { useResetPassword } from '../hooks/useResetPassword'
import { FormField } from '../../../components/FormField'
import { FormInput } from '../../../components/FormInput'

export function ResetPasswordPage() {

    const router = useRouter();
    const { token } = useParams({ from: "/auth/reset-password/$token" });
    const { 
        password,
        confirmPassword,
        formErrors,
        handleChange,
        handleSubmit,
        isLoading,
        } = useResetPassword({ token, onSuccess: () => router.navigate({ to: '/auth/login/'}) });

    return (
        <div className='flex flex-col items-center justify-center-safe my-auto mx-auto min-w-full'>
            <div className='flex flex-col items-center bg-white justify-center rounded-2xl shadow-xl p-8 w-full max-w-2xl'>
                <h1 className='text-center mb-3 text-xl'>Reset Your Password</h1>
                <form className='grid grid-cols-1 md:grid-cols-1 gap-3' onSubmit={handleSubmit}>
                    <div className="flex flex-col col-span-1 md:col-span-1 gap-4">
                        <FormField name="password" label="New Password" formError={formErrors?.password}>
                            <FormInput
                            name="password"
                            inputType="text"
                            inputValue={password}
                            inputErrors={formErrors?.password}
                            handleChange={handleChange}
                            placeholder="New Password"
                            ></FormInput>
                        </FormField>
                        <FormField name="confirmPassword" label="Confirm Password" formError={formErrors?.confirmPassword}>
                            <FormInput
                            name="confirmPassword"
                            inputType="text"
                            inputValue={confirmPassword}
                            inputErrors={formErrors?.confirmPassword}
                            handleChange={handleChange}
                            placeholder="Confirm Password"
                            ></FormInput>
                        </FormField>
                    </div>
                    <div className="col-span-1 md:col-span-1 flex justify-center mt-5 max-h-20">
                        <button type='submit' className='border-1 border rounded-lg w-50 hover:bg-blue-100' disabled={isLoading}>Reset Password</button>
                    </div>
                    <p className="text-red-500">{formErrors?.general?.[0]}</p>
                </form>
            </div>
            <section className='w-full max-w-2xl mt-4 flex justify-self-start'><Link to='/landing/' className='text-white hover:underline'>&lt; Back to landing page</Link></section>
        </div>
    )
}