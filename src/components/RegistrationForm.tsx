"use client";

import { useState, FormEvent } from "react";
import { CheckCircle, AlertCircle } from "lucide-react";
import { useAppData } from "@/lib/data-context";
import { EVENT_OPTIONS } from "@/lib/types";

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  selectedEvent: string;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  phone?: string;
  selectedEvent?: string;
}

const initialForm: FormData = {
  fullName: "",
  email: "",
  phone: "",
  selectedEvent: "",
};

function validate(data: FormData): FormErrors {
  const errors: FormErrors = {};

  if (!data.fullName.trim()) {
    errors.fullName = "Full name is required";
  }

  if (!data.email.trim()) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = "Please enter a valid email address";
  }

  if (!data.phone.trim()) {
    errors.phone = "Phone number is required";
  } else if (!/^[\d\s+\-()]{7,20}$/.test(data.phone)) {
    errors.phone = "Please enter a valid phone number";
  }

  if (!data.selectedEvent) {
    errors.selectedEvent = "Please select an event";
  }

  return errors;
}

export default function RegistrationForm() {
  const { addRegistration } = useAppData();
  const [form, setForm] = useState<FormData>(initialForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof FormData, boolean>>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (touched[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        const fieldErrors = validate({ ...form, [field]: value });
        if (fieldErrors[field]) {
          next[field] = fieldErrors[field];
        } else {
          delete next[field];
        }
        return next;
      });
    }
  };

  const handleBlur = (field: keyof FormData) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const fieldErrors = validate(form);
    setErrors((prev) => ({
      ...prev,
      [field]: fieldErrors[field],
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const validationErrors = validate(form);
    setErrors(validationErrors);
    setTouched({ fullName: true, email: true, phone: true, selectedEvent: true });

    if (Object.keys(validationErrors).length > 0) return;

    addRegistration(form);
    setSubmitted(true);
    setForm(initialForm);
    setTouched({});
    setErrors({});
  };

  const inputClass = (field: keyof FormData) =>
    `w-full px-4 py-3 rounded-xl border text-slate-900 placeholder-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
      touched[field] && errors[field]
        ? "border-red-400 bg-red-50"
        : "border-slate-200 bg-white hover:border-slate-300"
    }`;

  return (
    <section id="register" className="py-24 bg-slate-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <p className="text-amber-600 font-semibold text-sm uppercase tracking-widest mb-3">
            Join Us
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            Event Registration
          </h2>
          <p className="text-slate-600">
            Register for upcoming Siluvai Media events and our leadership team will be in touch.
          </p>
        </div>

        {submitted && (
          <div className="mb-8 flex items-start gap-3 p-5 rounded-2xl bg-green-50 border border-green-200 text-green-800">
            <CheckCircle className="w-6 h-6 shrink-0 mt-0.5" />
            <p className="font-medium">
              Thank you for registering. Our leadership team will contact you shortly.
            </p>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          noValidate
          className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 space-y-6"
        >
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-slate-700 mb-1.5">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              id="fullName"
              type="text"
              value={form.fullName}
              onChange={(e) => handleChange("fullName", e.target.value)}
              onBlur={() => handleBlur("fullName")}
              className={inputClass("fullName")}
              placeholder="Enter your full name"
            />
            {touched.fullName && errors.fullName && (
              <p className="mt-1.5 flex items-center gap-1 text-sm text-red-600">
                <AlertCircle className="w-4 h-4" />
                {errors.fullName}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1.5">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
              onBlur={() => handleBlur("email")}
              className={inputClass("email")}
              placeholder="you@example.com"
            />
            {touched.email && errors.email && (
              <p className="mt-1.5 flex items-center gap-1 text-sm text-red-600">
                <AlertCircle className="w-4 h-4" />
                {errors.email}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-1.5">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              id="phone"
              type="tel"
              value={form.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              onBlur={() => handleBlur("phone")}
              className={inputClass("phone")}
              placeholder="+44 7700 900000"
            />
            {touched.phone && errors.phone && (
              <p className="mt-1.5 flex items-center gap-1 text-sm text-red-600">
                <AlertCircle className="w-4 h-4" />
                {errors.phone}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="selectedEvent" className="block text-sm font-medium text-slate-700 mb-1.5">
              Selected Event <span className="text-red-500">*</span>
            </label>
            <select
              id="selectedEvent"
              value={form.selectedEvent}
              onChange={(e) => handleChange("selectedEvent", e.target.value)}
              onBlur={() => handleBlur("selectedEvent")}
              className={inputClass("selectedEvent")}
            >
              <option value="">Choose an event...</option>
              {EVENT_OPTIONS.map((event) => (
                <option key={event} value={event}>
                  {event}
                </option>
              ))}
            </select>
            {touched.selectedEvent && errors.selectedEvent && (
              <p className="mt-1.5 flex items-center gap-1 text-sm text-red-600">
                <AlertCircle className="w-4 h-4" />
                {errors.selectedEvent}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 shadow-md hover:shadow-xl transition-all duration-300"
          >
            Register Now
          </button>
        </form>
      </div>
    </section>
  );
}
