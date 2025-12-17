import FieldErrorMessages from "./FieldErrorMessages";

export function FormField({ name, label, formError, children }) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label
          htmlFor={name}
          className={formError ? "form-label-error" : "form-label"}
        >
          {label}
        </label>
      )}

      {children}

      {formError && <FieldErrorMessages field={name} error={formError} />}
    </div>
  );
}