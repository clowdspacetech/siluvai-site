"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type InputHTMLAttributes,
} from "react";
import { ChevronDown } from "lucide-react";
import { useTheme } from "@/lib/theme-context";
import { cn, token } from "@/lib/theme-styles";

interface FloatingLabelInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "id"> {
  label: string;
  error?: string;
  touched?: boolean;
}

export function FloatingLabelInput({
  label,
  error,
  touched,
  value,
  className,
  required,
  ...props
}: FloatingLabelInputProps) {
  const id = useId();
  const { theme, isDark } = useTheme();
  const [focused, setFocused] = useState(false);
  const hasValue = Boolean(value && String(value).length > 0);
  const floated = focused || hasValue;
  const invalid = Boolean(touched && error);

  return (
    <div className={className}>
      <div className="relative">
        <input
          id={id}
          value={value}
          required={required}
          aria-invalid={invalid || undefined}
          aria-describedby={invalid ? `${id}-error` : undefined}
          onFocus={(e) => {
            setFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            props.onBlur?.(e);
          }}
          placeholder=" "
          className={cn(
            "peer w-full px-4 pt-6 pb-2 rounded-xl border transition-all duration-300 focus:outline-none",
            token("input", theme),
            invalid
              ? "border-red-400/70 focus:border-red-400/70"
              : focused
                ? "border-amber-500/50 ring-1 ring-amber-500/50"
                : isDark
                  ? "hover:border-white/20"
                  : "hover:border-slate-300"
          )}
          {...props}
        />
        <label
          htmlFor={id}
          className={cn(
            "pointer-events-none absolute left-4 transition-all duration-300 origin-left",
            floated
              ? "top-2 text-xs scale-90 text-amber-600 dark:text-amber-400"
              : "top-1/2 -translate-y-1/2 text-sm text-slate-400"
          )}
        >
          {label}
          {required && <span className="text-amber-500"> *</span>}
        </label>
      </div>
      {invalid && (
        <p id={`${id}-error`} className="mt-1.5 text-sm text-red-500" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

interface FloatingLabelSelectProps {
  label: string;
  error?: string;
  touched?: boolean;
  options: readonly string[];
  placeholder?: string;
  className?: string;
  required?: boolean;
  value: string;
  onChange: (event: { target: { value: string } }) => void;
  onBlur?: () => void;
  id?: string;
}

export function FloatingLabelSelect({
  label,
  error,
  touched,
  value,
  options,
  placeholder = "Choose an option...",
  className,
  required,
  onChange,
  onBlur,
  id: providedId,
}: FloatingLabelSelectProps) {
  const reactId = useId();
  const id = providedId ?? reactId;
  const listId = `${id}-listbox`;
  const { theme, isDark } = useTheme();
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const hasValue = Boolean(value && String(value).length > 0);
  const floated = focused || open || hasValue;
  const invalid = Boolean(touched && error);

  const mergedOptions =
    !value || options.some((option) => option === value) ? options : [value, ...options];

  useEffect(() => {
    if (!open) return;

    const onPointer = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
        setFocused(false);
        onBlur?.();
      }
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        setFocused(false);
        onBlur?.();
      }
    };

    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onBlur]);

  const selectOption = (next: string) => {
    onChange({ target: { value: next } });
    setOpen(false);
    setFocused(false);
    onBlur?.();
  };

  return (
    <div className={className} ref={rootRef}>
      <div className="relative">
        <button
          id={id}
          type="button"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={listId}
          aria-invalid={invalid || undefined}
          aria-describedby={invalid ? `${id}-error` : undefined}
          onClick={() => {
            setOpen((prev) => !prev);
            setFocused(true);
          }}
          onBlur={(event) => {
            if (!rootRef.current?.contains(event.relatedTarget as Node)) {
              setFocused(false);
              setOpen(false);
              onBlur?.();
            }
          }}
          className={cn(
            "w-full appearance-none text-left px-4 pt-6 pb-2 pr-11 rounded-xl border transition-all duration-300 focus:outline-none",
            token("input", theme),
            invalid
              ? "border-red-400/70"
              : open || focused
                ? "border-amber-500/50 ring-1 ring-amber-500/50"
                : isDark
                  ? "hover:border-white/20"
                  : "hover:border-slate-300"
          )}
        >
          <span
            className={cn(
              "block truncate",
              hasValue ? (isDark ? "text-white" : "text-slate-900") : open || focused ? "text-slate-400" : "text-transparent"
            )}
          >
            {hasValue ? value : placeholder}
          </span>
        </button>
        <label
          htmlFor={id}
          className={cn(
            "pointer-events-none absolute left-4 transition-all duration-300 origin-left",
            floated
              ? "top-2 text-xs scale-90 text-amber-600 dark:text-amber-400"
              : "top-1/2 -translate-y-1/2 text-sm text-slate-400"
          )}
        >
          {label}
          {required && <span className="text-amber-500"> *</span>}
        </label>
        <ChevronDown
          className={cn(
            "pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 transition-transform",
            open && "rotate-180"
          )}
          aria-hidden
        />

        {open && (
          <ul
            id={listId}
            role="listbox"
            aria-labelledby={id}
            className={cn(
              "absolute z-30 mt-2 w-full max-h-60 overflow-auto rounded-xl border py-1 shadow-xl",
              isDark ? "bg-slate-900 border-white/10 text-white" : "bg-white border-slate-200 text-slate-900"
            )}
          >
            <li
              role="option"
              aria-selected={!hasValue}
              className={cn(
                "px-4 py-2.5 text-sm cursor-pointer",
                isDark ? "text-slate-400 hover:bg-white/5" : "text-slate-500 hover:bg-slate-50"
              )}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => selectOption("")}
            >
              {placeholder}
            </li>
            {mergedOptions.map((opt) => (
              <li
                key={opt}
                role="option"
                aria-selected={value === opt}
                className={cn(
                  "px-4 py-2.5 text-sm cursor-pointer",
                  isDark ? "bg-slate-900 text-white hover:bg-amber-400/10" : "bg-white text-slate-900 hover:bg-amber-50",
                  value === opt && (isDark ? "bg-amber-400/15 text-amber-200" : "bg-amber-50 text-amber-900")
                )}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => selectOption(opt)}
              >
                {opt}
              </li>
            ))}
          </ul>
        )}
      </div>
      {invalid && (
        <p id={`${id}-error`} className="mt-1.5 text-sm text-red-500" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
