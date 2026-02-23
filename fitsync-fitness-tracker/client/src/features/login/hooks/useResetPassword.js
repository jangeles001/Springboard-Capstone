import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { sendResetPasswordRequest } from "../services/sendResetPasswordRequest";
import { toast } from "react-hot-toast";

export function useResetPassword({ token, onSuccess }) {
  // Local state for form data and form errors
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [formErrors, setFormErrors] = useState(null);

  // Mutation hook for handling the reset password API call
  const resetPasswordMutation = useMutation({
    mutationFn: ({ token, password }) =>
      sendResetPasswordRequest(token, password),
    onSuccess: () => {
      toast.success("Your Password has been reset!");
      onSuccess();
    },
    onError: (err) =>
      setFormErrors({
        general: [
          err.message || "An error occurred while resetting your password",
        ],
      }),
  });

  // Function handles form input changes and clears errors for the specific field
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (formErrors)
      if (Object.keys(formErrors).includes(name)) delete formErrors[name];

    if (name === "password") {
      setPassword(value);
      return;
    }

    setConfirmPassword(value);
  };

  // Function to handle form submission, validate input, and trigger the mutation
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!password) {
      setFormErrors({ ...formErrors, password: ["Password is required"] });
    }
    if (!confirmPassword) {
      setFormErrors({
        ...formErrors,
        confirmPassword: ["Confirm password is required"],
      });
    }
    if (password !== confirmPassword) {
      setFormErrors({
        ...formErrors,
        confirmPassword: ["Passwords do not match"],
      });
    }
    if (formErrors) return;
    resetPasswordMutation.mutate({ token, password });
  };

  return {
    password,
    confirmPassword,
    formErrors,
    handleSubmit,
    handleChange,
    isLoading: resetPasswordMutation.isLoading,
  };
}
