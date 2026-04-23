import React from "react";

type ButtonVariant = "primary" | "secondary" | "danger" | "yellow" | "green";

type ButtonProps = {
  children: React.ReactNode;
  type?: "button" | "submit" | "reset";
  variant?: ButtonVariant;
  disabled?: boolean;
  onClick?: (e?: any) => void;
  className?: string;
};

export default function Button({
  children,
  type = "button",
  variant = "primary",
  disabled = false,
  onClick,
  className = "",
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center gap-2 py-2 px-4 rounded-md h-auto font-semibold text-sm transition-all duration-200";

  const variants: Record<ButtonVariant, string> = {
    primary: "text-gray-700 hover:bg-gray-100 bg-white border",
    secondary: "text-gray-700 hover:bg-gray-100 bg-white border",
    danger: "text-red-700 hover:bg-gray-100 bg-white border",
    yellow: "text-yellow-700 hover:bg-gray-100 bg-white border",
    green: "text-green-700 hover:bg-gray-100 bg-white border",
  };

  const disabledStyles =
    "bg-gray-300 text-gray-600 cursor-not-allowed hover:bg-gray-300";

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`
        ${disabled ? disabledStyles : variants[variant]}
        ${className}
        ${baseStyles}
      `}
    >
      {children}
    </button>
  );
}
