import React, {
  useState,
  useRef,
  useEffect,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";
import { ChevronDown } from "lucide-react";

// --- INPUT BASE ---
interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  placeholder: string;
}

export const FormInput = ({
  placeholder,
  className = "",
  ...props
}: FormInputProps) => {
  return (
    <input
      placeholder={placeholder}
      {...props}
      className={`p-3 bg-surface-container-lowest rounded-md text-body-md ghost-border focus:ring-2 focus:ring-primary/30 outline-none transition-smooth w-full ${className}`}
    />
  );
};

export interface CustomSelectOption {
  value: string;
  label: string;
  sublabel?: string;
  rightElement?: ReactNode; // <--- Aquí permitimos cualquier componente, HTML o icono
}

interface CustomSelectProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "onSelect"
> {
  placeholder: string;
  options: CustomSelectOption[];
  selectedValue: string;
  onSelect: (value: string) => void;
  disabled?: boolean;
  required?: boolean;
  name?: string;
}
export const CustomSelect = ({
  placeholder,
  options,
  selectedValue,
  onSelect,
  disabled = false,
  required = false,
  name,
  ...props
}: CustomSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const currentOption = options.find((opt) => opt.value === selectedValue);

  const filteredOptions = options.filter(
    (opt) =>
      opt.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (opt.sublabel &&
        opt.sublabel.toLowerCase().includes(searchTerm.toLowerCase())),
  );

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setSearchTerm(currentOption ? currentOption.label : "");
    }
  }, [isOpen, selectedValue, currentOption]);

  const handleInputFocus = () => {
    if (disabled) return;
    setIsOpen(true);
    setSearchTerm("");
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative flex items-center">
        <input
          {...props}
          name={name}
          autoComplete="disabled-autocomplete"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          required={required}
          disabled={disabled}
          placeholder={placeholder}
          value={isOpen ? searchTerm : currentOption ? currentOption.label : ""}
          onFocus={handleInputFocus}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="truncate p-3 pr-16 bg-surface-container-lowest rounded-md text-body-md ghost-border focus:ring-2 focus:ring-primary/30 outline-none transition-smooth w-full cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        />

        <div className="absolute right-3 flex items-center gap-2 pointer-events-none">
          {!isOpen && currentOption?.rightElement && (
            <div className="flex items-center justify-center">
              {currentOption.rightElement}
            </div>
          )}
          <ChevronDown
            size={18}
            className={`text-on-surface-variant transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </div>
      </div>

      {isOpen && !disabled && (
        <ul className="absolute z-20 left-0 right-0 mt-1 max-h-60 overflow-y-auto bg-surface-container-lowest ghost-border rounded-sm flex flex-col">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => (
              <li
                key={option.value}
                onClick={() => {
                  onSelect(option.value);
                  setSearchTerm(option.label);
                  setIsOpen(false);
                }}
                className={`p-3 text-body-md hover:bg-surface-dim cursor-pointer transition-smooth flex items-center justify-between gap-4 ${
                  selectedValue === option.value
                    ? "bg-primary/10 text-primary font-semibold"
                    : "text-on-surface"
                }`}
              >
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="truncate">{option.label}</span>
                  {option.sublabel && (
                    <span className="text-[11px] text-on-surface-variant font-normal truncate">
                      {option.sublabel}
                    </span>
                  )}
                </div>

                {option.rightElement && (
                  <div className="flex items-center justify-center shrink-0">
                    {option.rightElement}
                  </div>
                )}
              </li>
            ))
          ) : (
            <li className="p-3 text-body-sm text-on-surface-variant text-center italic">
              No se encontraron resultados
            </li>
          )}
        </ul>
      )}
    </div>
  );
};
