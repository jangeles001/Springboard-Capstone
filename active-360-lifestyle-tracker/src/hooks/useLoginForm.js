import { useState } from "react";
import { useLoginFormStore } from "../features/login/store/LoginStore";

export function useLoginForm({ onSuccess }) {
  const { formData, formErrors, setFormField, resetForm, validateForm } =
    useLoginFormStore();
  const [hasErrors, setHasErrors] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormField(name, value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setHasErrors(false);
    const { isValid } = validateForm();

    if (!isValid) {
      setHasErrors(true);
      return;
    }
    //TODO: Submit information to database

    resetForm();
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
