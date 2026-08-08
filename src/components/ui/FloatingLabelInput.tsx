"use client";

import { useId, useState, type InputHTMLAttributes, type SelectHTMLAttributes } from "react";

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
          className={`peer w-full px-4 pt-6 pb-2 rounded-xl border bg-white text-slate-900 transition-all duration-300 focus:outline-none ${
            invalid
              ? "border-red-400 bg-red-50/50"
              : focused
                ? "border-amber-500 shadow-[0_0_0_3px_rgba(245,158,11,0.15)]"
                : "border-slate-200 hover:border-slate-300"
          }`}
          {...props}
        />
        <label
          htmlFor={id}
          className={`pointer-events-none absolute left-4 transition-all duration-300 origin-left ${
            floated
              ? "top-2 text-xs scale-90 text-amber-700"
              : "top-1/2 -translate-y-1/2 text-sm text-slate-400"
          }`}
        >
          {label}
          {required && <span className="text-red-500"> *</span>}
        </label>
        <span
          aria-hidden
          className={`pointer-events-none absolute bottom-0 left-1/2 h-0.5 -translate-x-1/2 rounded-full bg-gradient-to-r from-transparent via-amber-500 to-transparent transition-all duration-500 ease-out ${
            focused && !invalid ? "w-full opacity-100" : "w-0 opacity-0"
          }`}
        />
      </div>
      {invalid && (
        <p id={`${id}-error`} className="mt-1.5 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

interface FloatingLabelSelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "id"> {
  label: string;
  error?: string;
  touched?: boolean;
  options: readonly string[];
  placeholder?: string;
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
  ...props
}: FloatingLabelSelectProps) {
  const id = useId();
  const [focused, setFocused] = useState(false);
  const hasValue = Boolean(value && String(value).length > 0);
  const floated = focused || hasValue;
  const invalid = Boolean(touched && error);

  return (
    <div className={className}>
      <div className="relative">
        <select
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
          className={`w-full appearance-none px-4 pt-6 pb-2 rounded-xl border bg-white text-slate-900 transition-all duration-300 focus:outline-none ${
            invalid
              ? "border-red-400 bg-red-50/50"
              : focused
                ? "border-amber-500 shadow-[0_0_0_3px_rgba(245,158,11,0.15)]"
                : "border-slate-200 hover:border-slate-300"
          } ${!hasValue ? "text-transparent" : ""}`}
          {...props}
        >
          <option value="">{placeholder}</option>
          {options.map((opt) => (
            <option key={opt} value={opt} className="text-slate-900">
              {opt}
            </option>
          ))}
        </select>
        <label
          htmlFor={id}
          className={`pointer-events-none absolute left-4 transition-all duration-300 origin-left ${
            floated
              ? "top-2 text-xs scale-90 text-amber-700"
              : "top-1/2 -translate-y-1/2 text-sm text-slate-400"
          }`}
        >
          {label}
          {required && <span className="text-red-500"> *</span>}
        </label>
        <span
          aria-hidden
          className={`pointer-events-none absolute bottom-0 left-1/2 h-0.5 -translate-x-1/2 rounded-full bg-gradient-to-r from-transparent via-amber-500 to-transparent transition-all duration-500 ease-out ${
            focused && !invalid ? "w-full opacity-100" : "w-0 opacity-0"
          }`}
        />
      </div>
      {invalid && (
        <p id={`${id}-error`} className="mt-1.5 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
