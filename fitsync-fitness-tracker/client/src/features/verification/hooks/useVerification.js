import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { verifyEmail } from "../services/verifyEmail";
import { useNavigate } from "@tanstack/react-router";

export function useVerification(token) {
    // Local state to manage error messages
    const [errorMessage, setErrorMessage] = useState(null);
    
    // Hook for navigation after successful verification
    const navigate = useNavigate();

    // Mutation hook to handle email verificaiton
    const verifyMutation = useMutation({
      mutationFn: (token) => verifyEmail(token),
      onSuccess: () => {

      },
      onError: (error) => {
        setErrorMessage(error.message);
      },
    });

    // Effect to trigger email verification when token is available
    useEffect(() => {
        if (token) {
            verifyMutation.mutate(token);
        }
    }, [token]);

    // Effect to handle navigation after successful verification
    useEffect(() => {
        if (verifyMutation.isSuccess) {
            // Redirects to login after successful verification
            setTimeout(() => {
                navigate({ to: '/auth/login' });
            }, 2000);
        }
    }, [verifyMutation.isSuccess, navigate]);

    return { 
        isLoading: verifyMutation.isLoading, 
        isSuccess: verifyMutation.isSuccess,
        errorMessage 
    };
}