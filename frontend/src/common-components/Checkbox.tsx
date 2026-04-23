import { useField } from "formik";

type Props = {
  label: string;
  name: string;
  required?: boolean;
};

export default function Checkbox({ label, name, required }: Props) {
  const [field, meta] = useField({ name, type: "checkbox" });

  return (
    <div className="flex flex-col gap-1">
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          {...field}
          className="h-4 w-4 accent-blue-600"
        />
        <span className="text-sm text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </span>
      </label>

      {meta.touched && meta.error && (
        <p className="text-xs text-red-500">{meta.error}</p>
      )}
    </div>
  );
}
