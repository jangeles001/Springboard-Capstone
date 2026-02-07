import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { verifyEmail } from "../services/verifyEmail";
import { useNavigate } from "@tanstack/react-router";

export function useVerification(token) {
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();

    const verifyMutation = useMutation({
      mutationFn: (token) => verifyEmail(token),
      onSuccess: () => {

      },
      onError: (error) => {
        setErrorMessage(error.message);
      },
    });

    useEffect(() => {
        if (token) {
            verifyMutation.mutate(token);
        }
    }, [token]);

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