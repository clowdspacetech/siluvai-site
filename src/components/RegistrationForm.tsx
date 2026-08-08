"use client";

import { useState, FormEvent } from "react";
import { CheckCircle, Loader2 } from "lucide-react";
import { useReducedMotion } from "framer-motion";
import { useAppData } from "@/lib/data-context";
import { EVENT_OPTIONS } from "@/lib/types";
import { FadeInUp } from "@/components/motion/FadeInUp";
import {
  FloatingLabelInput,
  FloatingLabelSelect,
} from "@/components/ui/FloatingLabelInput";

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
  const reduceMotion = useReducedMotion();
  const [form, setForm] = useState<FormData>(initialForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof FormData, boolean>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const validationErrors = validate(form);
    setErrors(validationErrors);
    setTouched({ fullName: true, email: true, phone: true, selectedEvent: true });

    if (Object.keys(validationErrors).length > 0) return;

    setLoading(true);
    try {
      await addRegistration(form);
      if (!reduceMotion) {
        await new Promise((r) => setTimeout(r, 450));
      }
      setSubmitted(true);
      setForm(initialForm);
      setTouched({});
      setErrors({});
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="register" className="py-16 sm:py-24 bg-slate-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeInUp className="text-center mb-10">
          <p className="text-amber-600 font-semibold text-sm uppercase tracking-widest mb-3">
            Join Us
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            Event Registration
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            Register for upcoming Siluvai Media events and our leadership team will be in touch.
          </p>
        </FadeInUp>

        {submitted && (
          <div
            className="mb-8 flex items-start gap-3 p-5 rounded-2xl bg-green-50 border border-green-200 text-green-800"
            role="status"
          >
            <CheckCircle className="w-6 h-6 shrink-0 mt-0.5" />
            <p className="font-medium">
              Thank you for registering. Our leadership team will contact you shortly.
            </p>
          </div>
        )}

        <FadeInUp delay={0.08}>
          <form
            onSubmit={handleSubmit}
            noValidate
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-100 space-y-5"
          >
            <FloatingLabelInput
              label="Full Name"
              required
              value={form.fullName}
              onChange={(e) => handleChange("fullName", e.target.value)}
              onBlur={() => handleBlur("fullName")}
              error={errors.fullName}
              touched={touched.fullName}
              autoComplete="name"
            />

            <FloatingLabelInput
              label="Email Address"
              type="email"
              required
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
              onBlur={() => handleBlur("email")}
              error={errors.email}
              touched={touched.email}
              autoComplete="email"
            />

            <FloatingLabelInput
              label="Phone Number"
              type="tel"
              required
              value={form.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              onBlur={() => handleBlur("phone")}
              error={errors.phone}
              touched={touched.phone}
              autoComplete="tel"
            />

            <FloatingLabelSelect
              label="Selected Event"
              required
              value={form.selectedEvent}
              onChange={(e) => handleChange("selectedEvent", e.target.value)}
              onBlur={() => handleBlur("selectedEvent")}
              error={errors.selectedEvent}
              touched={touched.selectedEvent}
              options={EVENT_OPTIONS}
              placeholder="Choose an event..."
            />

            <button
              type="submit"
              disabled={loading}
              className="btn-shimmer w-full py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 hover:scale-[1.02] shadow-md hover:shadow-xl transition-all duration-300 disabled:opacity-70 disabled:pointer-events-none disabled:hover:scale-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500 inline-flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2
                    className={`w-5 h-5 relative z-10 ${reduceMotion ? "" : "animate-spin"}`}
                    aria-hidden
                  />
                  <span className="relative z-10">Registering...</span>
                </>
              ) : (
                <span className="relative z-10">Register Now</span>
              )}
            </button>
          </form>
        </FadeInUp>
      </div>
    </section>
  );
}
