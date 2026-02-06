import { useRouter, Link } from '@tanstack/react-router';
import { FormField } from "../../../components/FormField"
import { FormInput } from "../../../components/FormInput"
import { useForgotPassword } from '../hooks/useForgotPassword'

export default function ForgotPasswordPage() {
    
    const router = useRouter();
    const { 
        formDataEmail,
        formErrors,
        isLoading,
        handleChange,
        handleSubmit
    } = useForgotPassword({
        onSuccessFunction: () => router.navigate({ to: '/change-password/'})
    });

    return (
        <div className='flex flex-col items-center justify-center-safe my-auto mx-auto min-w-full'>
            <div className='flex flex-col items-center bg-white justify-center rounded-2xl shadow-xl p-8 w-full max-w-2xl'>
                <h1 className='text-center mb-3'>Provide Email Linked To Your Account</h1>
                <form className='grid grid-cols-1 md:grid-cols-1 gap-3' onSubmit={handleSubmit}>
                    <div className="flex flex-col col-span-1 md:col-span-1">
                        <FormField name="email" label="Email" formError={formErrors?.email}>
                            <FormInput
                            name="email"
                            inputType="email"
                            inputValue={formDataEmail}
                            inputErrors={formErrors?.email}
                            handleChange={handleChange}
                            placeholder="Email"
                            ></FormInput>
                        </FormField>
                    </div>
                    <div className="col-span-1 md:col-span-1 flex justify-center mt-5 max-h-20">
                        <button type='submit' className='border-1 border rounded-lg w-50 hover:bg-blue-100' disabled={isLoading}>Send Reset Link</button>
                    </div>
                </form>
            </div>
            <section className='w-full max-w-2xl mt-4 flex justify-self-start'><Link to='/landing/' className='text-white hover:underline'>&lt; Back to landing page</Link></section>
        </div>
    )
}