import { useState } from "react";
import {
  useFormDataPassword,
  useFormDataEmail,
  useFormErrors,
  useLoginActions,
} from "../store/LoginStore";
import { login } from "../services/loginService";
import { useUserActions } from "../../../store/UserStore.js";

// Custom hook to manage login form state and behavior
export function useLoginForm({ onSuccess }) {
  // Store state slices
  const formDataEmail = useFormDataEmail();
  const formDataPassword = useFormDataPassword();
  const formErrors = useFormErrors();

  // Login Store actions slice
  const { setFormField, resetForm, validateForm } = useLoginActions();

  // User store actions slice
  const { setUsername, setPublicId } = useUserActions();

  // Flag for form submission errors
  const [hasErrors, setHasErrors] = useState(false);

  // Updates a specific field in the form store when an input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormField(name, value);
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
    try {
      const { username, publicId } = await login({
        email: formDataEmail,
        password: formDataPassword,
      });
      setUsername(username);
      setPublicId(publicId);
      resetForm();
      // Fires success callback if provided. Made generic to allow custom behavior on login in the future.
      if (onSuccess) onSuccess();
    } catch (error) {
      console.log(error);
    }
  };

  return {
    formDataEmail,
    formDataPassword,
    formErrors,
    hasErrors,
    handleChange,
    handleSubmit,
  };
}
