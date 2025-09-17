import { useState } from "react";
import {
  useFormData,
  useFormErrors,
  useLoginActions,
} from "../features/login/store/LoginStore";

// Custom hook to manage login form state and behavior
export function useLoginForm({ onSuccess }) {
  // Store state slices
  const formData = useFormData();
  const formErrors = useFormErrors();

  // Store actions slice
  const { setFormField, resetForm, validateForm } = useLoginActions();

  // Flag for form submission errors
  const [hasErrors, setHasErrors] = useState(false);

  // Updates a specific field in the form store when an input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormField(name, value);
  };

  // Validates and submit the form
  const handleSubmit = (e) => {
    e.preventDefault();
    setHasErrors(false);

    // Runs validation logic from the store
    const { isValid } = validateForm();

    if (!isValid) {
      setHasErrors(true);
      return;
    }

    //TODO: Submit information to backend
    resetForm();

    // Fires success callback if provided. Made generic to allow custom behavior on login in the future.
    if (onSuccess) onSuccess();
  };

  return {
    formData,
    formErrors,
    hasErrors,
    handleChange,
    handleSubmit,
  };
}
