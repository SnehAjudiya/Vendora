import { useState, useRef, useEffect } from "react";

interface DropdownOption {
  label: string;
  value: string;
}

interface DropdownProps {
  label?: string;
  options: DropdownOption[];
  placeholder?: string;
  onSelect: (value: string) => void;
  defaultValue?: string;
  className?: string;
}

export default function Dropdown({
  label,
  options,
  placeholder = "Select...",
  onSelect,
  defaultValue,
  className,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [direction, setDirection] = useState<"up" | "down">("down");
  const [selected, setSelected] = useState<DropdownOption | null>(
    options.find((opt) => opt.value === defaultValue) || null,
  );

  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!dropdownRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggle = () => {
    if (!isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;

      const DROPDOWN_HEIGHT = 200;

      if (spaceBelow < DROPDOWN_HEIGHT && spaceAbove > spaceBelow) {
        setDirection("up");
      } else {
        setDirection("down");
      }
    }

    setIsOpen((prev) => !prev);
  };

  const handleSelect = (option: DropdownOption) => {
    setSelected(option);
    onSelect(option.value);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className={`relative w-40 ${className}`}>
      <div className="font-bold"></div>
      <button
        ref={buttonRef}
        onClick={handleToggle}
        className="w-full border px-2 py-2 font-semibold text-gray-700 hover:bg-gray-100 rounded-md bg-gray-50 flex items-center justify-center"
      >
        {label}
      </button>

      {isOpen && (
        <div
          className={`absolute w-full border rounded-md bg-gray-50 shadow-md z-10 max-h-52 overflow-y-auto ${
            direction === "up" ? "bottom-full mb-1" : "top-full mt-1"
          }`}
        >
          {options.length === 0 ? (
            <div className="px-3 py-2 text-gray-500">No options</div>
          ) : (
            options.map((option) => (
              <div
                key={option.value}
                onClick={() => handleSelect(option)}
                className="px-3 py-2 cursor-pointe text-gray-700 hover:bg-gray-700 hover:text-white"
              >
                {option.label}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
