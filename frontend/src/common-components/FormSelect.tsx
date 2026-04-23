import { Field } from "formik";
import { useState, useRef, useEffect } from "react";

type Option = {
  label: string;
  value: string;
};

type Props = {
  label: string;
  name: string;
  options: Option[];
  placeholder?: string;
  required?: boolean;
  onChange?: (value: string) => void;
};

export default function FormSelect({
  label,
  name,
  options,
  placeholder = "Select...",
  required,
  onChange,
}: Props) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <Field name={name}>
      {({ field, form, meta }: any) => {
        const selected = options.find((o) => o.value === field.value);

        return (
          <div className="flex flex-col gap-1 relative" ref={containerRef}>
            <label className="font-medium dark:text-white">
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </label>

            {/* Trigger */}
            <div
              onClick={() => setOpen((p) => !p)}
              className={`border rounded-md p-2 hover:bg-gray-100 cursor-pointer bg-white dark:bg-gray-800 dark:text-white
                ${meta.touched && meta.error ? "border-red-500" : "border-gray-300 dark:border-gray-600"}
              `}
            >
              {selected ? (
                selected.label
              ) : (
                <span className="text-gray-400 dark:text-gray-500">
                  {placeholder}
                </span>
              )}
            </div>

            {/* Dropdown */}
            {open && (
              <ul className="absolute top-full mt-1 w-full z-50 border rounded-md bg-white dark:bg-gray-800 dark:border-gray-600 shadow-lg max-h-48 overflow-y-auto">
                {options.map((opt) => (
                  <li
                    key={opt.value}
                    className="p-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white"
                    onClick={() => {
                      form.setFieldValue(name, opt.value);
                      form.setFieldTouched(name, true, false);

                      onChange?.(opt.value); //  external hook
                      setOpen(false);
                    }}
                  >
                    {opt.label}
                  </li>
                ))}
              </ul>
            )}

            {/* Error */}
            {meta.touched && meta.error && (
              <span className="text-red-500 text-sm">{meta.error}</span>
            )}
          </div>
        );
      }}
    </Field>
  );
}
