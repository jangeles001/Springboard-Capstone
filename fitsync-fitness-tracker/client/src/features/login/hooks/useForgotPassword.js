import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { sendResetPasswordEmailRequest } from '../services/sendResetPasswordEmailRequest';

export function useForgotPassword({ onSuccessFunction }) {
    const [formDataEmail, setFormDataEmail] = useState("");
    const [formErrors, setFormErrors] = useState({});
    const [error, setError] = useState(null);

    const resetPasswordMutation = useMutation({
        mutationFn: (email) => sendResetPasswordEmailRequest(email),
        onSuccess: (response) =>{
            console.log('Reset password request successful:', response);
            onSuccessFunction();
        },
        onError: (err) => setError(err.message || 'An error occurred while sending the reset link'),
    });

    const handleChange = (e) => {
        setFormDataEmail(e.target.value);
        if (formErrors.email) {
            setFormErrors((prev) => ({ ...prev, email: null }));
        }
    } 
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        if(!formDataEmail){
            setFormErrors({ email: ['Email is required'] });
            return;
        }
        resetPasswordMutation.mutate(formDataEmail);
    };

    return {
        formDataEmail,
        formErrors,
        error,
        isLoading: resetPasswordMutation.isLoading,
        handleChange,
        handleSubmit
    };
}