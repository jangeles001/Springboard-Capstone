import { useState } from "react";
import { useMutation } from "@tanstack/react-query";

export function useResetPassword(onSuccess) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [formErrors, setFormErrors] = useState({});

  const resetPasswordMutation = useMutation({
    mutationFn: ({ password, confirmPassword }) =>
      sendResetRequest(password, confirmPassword),
    onSuccess: (response) => {
      console.log("Password reset successful:", response);
      onSuccess();
    },
    onError: (err) =>
      setFormErrors({
        general: [
          err.message || "An error occurred while resetting your password",
        ],
      }),
  });

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!password || !confirmPassword) {
      setFormErrors({
        password: [
          ...formErrors?.password,
          "Both password fields are required",
        ],
      });
      return;
    }
    if (password !== confirmPassword) {
      setFormErrors({
        password: [...formErrors?.password, "Passwords do not match"],
      });
      return;
    }
    resetPasswordMutation.mutate({ password, confirmPassword });
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
