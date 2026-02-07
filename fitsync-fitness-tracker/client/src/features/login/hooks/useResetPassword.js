import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { sendResetRequest } from "../services/sendResetRequest";

export function useResetPassword(onSuccess) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [formErrors, setFormErrors] = useState(null);

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
    if (!password) {
      setFormErrors({...formErrors, password: ["Password is required"]});
    }
    if (!confirmPassword) {
      setFormErrors({
        ...formErrors,
        confirmPassword: ["Confirm password is required"]
      });
    }
    if (password !== confirmPassword) {
      setFormErrors({
        ...formErrors,
        confirmPassword: ["Passwords do not match"],
      });
    }
    if(formErrors) return;
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
