"use client";

import { useEffect, useState, FormEvent } from "react";
import { CheckCircle, Loader2 } from "lucide-react";
import { useReducedMotion } from "framer-motion";
import { useAppData } from "@/lib/data-context";
import { EVENT_OPTIONS } from "@/lib/types";
import { useRegistrationIntent } from "@/lib/registration-intent";
import { useTheme } from "@/lib/theme-context";
import { cn, token } from "@/lib/theme-styles";
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
  const { intendedEvent } = useRegistrationIntent();
  const { theme, isDark } = useTheme();
  const reduceMotion = useReducedMotion();
  const [form, setForm] = useState<FormData>(initialForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof FormData, boolean>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!intendedEvent) return;
    setForm((prev) => ({ ...prev, selectedEvent: intendedEvent }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next.selectedEvent;
      return next;
    });
  }, [intendedEvent]);

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
    <section id="register" className="relative py-20 sm:py-28">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeInUp className="text-center mb-10">
          <p className={cn(token("eyebrow", theme), "font-semibold text-sm uppercase tracking-[0.22em] mb-4")}>
            Join Us
          </p>
          <h2 className={cn("text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4", token("heading", theme))}>
            Event Registration
          </h2>
          <p className={cn("text-sm sm:text-base", token("body", theme))}>
            Register for upcoming Siluvai Media events and our leadership team will be in touch.
          </p>
        </FadeInUp>

        {submitted && (
          <div
            className={cn(
              "mb-8 flex items-start gap-3 p-5 rounded-2xl border",
              isDark
                ? "bg-emerald-500/10 border-emerald-400/30 text-emerald-200"
                : "bg-emerald-50 border-emerald-200 text-emerald-800"
            )}
            role="status"
          >
            <CheckCircle className="w-6 h-6 shrink-0 mt-0.5 text-emerald-500" />
            <p className="font-medium">
              Thank you for registering. Our leadership team will contact you shortly.
            </p>
          </div>
        )}

        <FadeInUp delay={0.08}>
          <form onSubmit={handleSubmit} noValidate className="glass-card p-6 sm:p-8 space-y-5">
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
              id="registration-event-select"
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
              className="btn-shimmer btn-gradient-animated w-full py-3.5 rounded-xl font-semibold text-slate-950 shadow-[0_0_24px_rgba(245,158,11,0.28)] hover:scale-[1.02] hover:shadow-[0_0_36px_rgba(245,158,11,0.4)] transition-all duration-300 disabled:opacity-70 disabled:pointer-events-none disabled:hover:scale-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400 inline-flex items-center justify-center gap-2"
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
