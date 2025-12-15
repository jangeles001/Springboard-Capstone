import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  useFormDataPassword,
  useFormDataEmail,
  useFormErrors,
  useLoginActions,
} from "../store/LoginStore";
import { login } from "../services/loginService";

// Custom hook to manage login form state and behavior
export function useLoginForm({ onSuccessFunction }) {
  // Mutation hook
  const loginMutation = useMutation({
    mutationFn: (userCredentials) => login(userCredentials),
  });

  // Login store state slices
  const formDataEmail = useFormDataEmail();
  const formDataPassword = useFormDataPassword();
  const formErrors = useFormErrors();

  // Login store actions slice
  const { setFormField, setFormErrors, resetForm, validateForm } =
    useLoginActions();

  // Local State
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [hasErrors, setHasErrors] = useState(false); // Holds value for both client and mutation errors.

  // Updates a specific field in the form store when an input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormField(name, value);
  };

  // Handles password visibility toggle
  const handlePasswordToggle = (e) => {
    e.preventDefault();
    setPasswordVisible((state) => !state);
  };

  // Validates and submit the form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setHasErrors(false);

    // Runs validation logic from the store
    const { isValid } = validateForm();

    if (!isValid) {
      setHasErrors(true);
      return;
    }
    loginMutation.mutate(
      {
        email: formDataEmail,
        password: formDataPassword,
      },
      {
        onSuccess: () => {
          resetForm();
          onSuccessFunction();
        },
        onError: (error) => {
          console.log(error);
          if (error.status === 400) {
            const details = error.response?.data?.details;
            if (details) {
              setFormErrors(details);
            }
          }
          setHasErrors(true);
        },
      }
    );
  };

  return {
    formDataEmail,
    formDataPassword,
    passwordVisible,
    formErrors,
    error: loginMutation.error,
    isLoading: loginMutation.isLoading,
    hasErrors,
    handleChange,
    handlePasswordToggle,
    handleSubmit,
  };
}
