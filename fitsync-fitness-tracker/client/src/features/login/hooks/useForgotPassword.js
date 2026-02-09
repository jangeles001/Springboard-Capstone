import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { sendResetPasswordEmailRequest } from '../services/sendResetPasswordEmailRequest';

export function useForgotPassword({ onSuccessFunction }) {
    //Local State for form data, form errors, and API error
    const [formDataEmail, setFormDataEmail] = useState("");
    const [formErrors, setFormErrors] = useState({});
    const [error, setError] = useState(null);

    // Mutation hook for sending reset password email request
    const resetPasswordMutation = useMutation({
        mutationFn: (email) => sendResetPasswordEmailRequest(email),
        onSuccess: (response) =>{
            onSuccessFunction();
        },
        onError: (err) => setError(err.message || 'An error occurred while sending the reset link'),
    });

    // Function to handle form input changes and clear errors for the email field
    const handleChange = (e) => {
        setFormDataEmail(e.target.value);
        if (formErrors.email) {
            setFormErrors((prev) => ({ ...prev, email: null }));
        }
    } 
    
    // Function to handle form submission, validate input, and trigger the mutation
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