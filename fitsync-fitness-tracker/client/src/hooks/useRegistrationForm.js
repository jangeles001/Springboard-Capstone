import { useState } from "react";
import {
  useFormDataField,
  useFormErrors,
  useRegisterFormActions,
} from "../features/registration/store/RegistrationStore";
export function useRegistrationForm({ onSuccess }) {
  // Store state slices
  const fields = {
    firstName: useFormDataField("firstName"),
    lastName: useFormDataField("lastName"),
    age: useFormDataField("age"),
    height: useFormDataField("height"),
    weight: useFormDataField("weight"),
    userName: useFormDataField("userName"),
    password: useFormDataField("password"),
    email: useFormDataField("email"),
    promoConsent: useFormDataField("promoConsent"),
    agreeToTerms: useFormDataField("agreeToTerms"),
    formErrors: useFormErrors(),
  };

  // Store actions slice
  const { setFormField, resetFormData, resetOnValidation, validateForm } =
    useRegisterFormActions();

  // Flag for form submission errors
  const [hasErrors, setHasErrors] = useState(false);

  // Updates a specific field in the form store when an input changes
  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setFormField(name, type === "checkbox" ? checked : value);
  };

  // Validates and submit the form then resets the form and errors
  const handleSubmit = async (e) => {
    e.preventDefault();
    setHasErrors(false);
    const { isValid, formErrors: validationErrors } = await validateForm();
    if (!isValid) {
      setHasErrors(true);
      resetFormData(validationErrors);
      return;
    }
    // TODO: Submit to DB using service/server component.
    // try{
    //   await submitToDB(fields);
    //   resetOnValidation();
    //  if (onSuccess) onSuccess();
    // }catch{err}{
    //   throw new Error(err)
    // }

    resetOnValidation();
    if (onSuccess) onSuccess();
  };

  return {
    ...fields,
    hasErrors,
    handleChange,
    handleSubmit,
  };
}
