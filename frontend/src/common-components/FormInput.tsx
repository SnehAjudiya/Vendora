import { Field, useFormikContext } from "formik";
import { Eye, EyeOff } from "lucide-react";

type FormInputProps = {
  label: string;
  name: string;
  value?: string | number | null;
  type?: string;
  placeholder?: string;
  showPassword?: boolean;
  onTogglePassword?: () => void;
  required?: boolean;
  disabled?: boolean;
  onChange?: (e:any) => void;
};

export default function FormInput({
  label,
  name,
  value,
  type = "text",
  placeholder,
  showPassword = false,
  onTogglePassword,
  required = false,
  disabled = false,
  onChange,
}: FormInputProps) {
  const isPassword = type === "password";
  const { errors, touched, submitCount } = useFormikContext();
  
  const error = errors[name as keyof typeof errors];
  const isTouched = touched[name as keyof typeof touched];
  
  // Show error if field is touched OR if form has been submitted
  const shouldShowError = error && (isTouched || submitCount > 0);

  return (
    <div className="flex flex-col gap-1">
      <label className="font-medium dark:text-white">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <div className="flex gap-2">
        {type === "textarea" ? (
          <Field
            as="textarea"
            name={name}
            value={value}
            placeholder={placeholder}
            className="border border-gray-300 rounded-md p-2 w-full min-h-20 resize-vertical dark:bg-gray-800 dark:text-white dark:border-gray-600"
            disabled={disabled}
            onChange={onChange}
          ></Field>
        ) : (
          <Field
            name={name}
            type={isPassword && showPassword ? "text" : type}
            placeholder={placeholder}
            disabled={disabled}
            className="border border-gray-300 hover:bg-gray-100 rounded-md p-2 w-full dark:bg-gray-800 dark:text-white dark:border-gray-600"
          ></Field>
        )}

        {isPassword && onTogglePassword && (
          <button
            type="button"
            onClick={onTogglePassword}
            disabled={disabled}
            className="text-black rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-100"
          >
            {showPassword ? <EyeOff /> : <Eye />}
          </button>
        )}
      </div>

      {shouldShowError && (
        <span className="text-red-500 text-sm">{error}</span>
      )}
    </div>
  );
}
