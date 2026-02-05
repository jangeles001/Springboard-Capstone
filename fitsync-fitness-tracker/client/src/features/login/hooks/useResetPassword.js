import { useState } from 'react';

export function useResetPassword(onSuccess) {
    const [ password, setPassword ] = useState("");
    const [ confirmPassword, setConfirmPassword ] = useState("");
    const [ formErrors, setFormErrors ] = useState({});
    const [ successMessage, setSuccessMessage ] = useState(null);

    const resetPasswordMutation = useMutation({
        mutationFn: ({ password, confirmPassword }) => sendResetRequest(password, confirmPassword),
        onSuccess: (response) => {
            console.log('Password reset successful:', response);
            onSuccess();
        },
        onError: (err) => setFormErrors({ general: [err.message || 'An error occurred while resetting your password'] }),
    })

    const handleSubmit = (e) => {
        e.preventDefault();
        if(!password || !confirmPassword) {
            setFormErrors({ password: [...formErrors?.password, 'Both password fields are required'] });
            return;
        }
        if(password !== confirmPassword) {
            setFormErrors({ password: [...formErrors?.password, 'Passwords do not match'] });
            return;
        }
        resetPasswordMutation.mutate({ password, confirmPassword });
        
    }

    return {
        password,
        confirmPassword,
        formErrors,
        successMessage
    }
}