"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { Loader2, ShieldCheck, X } from "lucide-react";

interface PaymentRedirectModalProps {
  onClose: () => void;
  onRedirect: () => void;
}

export default function PaymentRedirectModal({ onClose, onRedirect }: PaymentRedirectModalProps) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    const timer = setTimeout(onRedirect, 2200);
    return () => {
      document.body.style.overflow = "";
      clearTimeout(timer);
    };
  }, [onRedirect]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Secure payment redirect"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="px-8 pt-10 pb-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center mx-auto mb-6 shadow-lg">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>

          <h3 className="text-xl font-bold text-slate-900 mb-2">Secure Transaction Gateway</h3>
          <p className="text-slate-600 leading-relaxed">
            Redirecting to our secure transaction gateway&hellip;
          </p>

          <div className="mt-8 flex items-center justify-center gap-2 text-amber-600">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm font-medium">Please wait</span>
          </div>
        </div>

        <div className="h-1 bg-slate-100">
          <motion.div
            className="h-full bg-gradient-to-r from-amber-400 to-amber-600"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 2.2, ease: "easeInOut" }}
          />
        </div>
      </motion.div>
    </div>
  );
}
