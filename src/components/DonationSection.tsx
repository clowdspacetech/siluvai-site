"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Building2, Copy, CreditCard, Shield, ExternalLink } from "lucide-react";
import { useAppData } from "@/lib/data-context";
import { copyToClipboard } from "@/lib/data-store";
import { FadeInUp } from "@/components/motion/FadeInUp";

type TabId = "bank" | "card";

interface CopyFieldProps {
  label: string;
  value: string;
}

function CopyField({ label, value }: CopyFieldProps) {
  const [copied, setCopied] = useState(false);
  const reduceMotion = useReducedMotion();

  const handleCopy = async () => {
    const success = await copyToClipboard(value);
    if (!success) return;
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="relative flex items-center justify-between gap-3 py-3 border-b border-slate-100 last:border-0">
      <div className="min-w-0">
        <p className="text-xs text-slate-500 uppercase tracking-wide">{label}</p>
        <button
          type="button"
          onClick={handleCopy}
          className="font-semibold text-slate-900 mt-0.5 text-left hover:text-amber-700 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500 rounded-sm"
        >
          {value}
        </button>
      </div>
      <button
        type="button"
        onClick={handleCopy}
        className="shrink-0 p-2 rounded-lg text-slate-500 hover:text-amber-600 hover:bg-amber-50 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500"
        aria-label={`Copy ${label}`}
      >
        <Copy className="w-4 h-4" />
      </button>

      <AnimatePresence>
        {copied && (
          <motion.span
            role="status"
            initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
            transition={{ duration: reduceMotion ? 0 : 0.25 }}
            className="absolute -top-2 right-10 rounded-lg bg-slate-900 px-2.5 py-1 text-xs font-medium text-white shadow-lg"
          >
            Copied!
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function DonationSection() {
  const { data } = useAppData();
  const { donationSettings } = data;
  const [tab, setTab] = useState<TabId>("bank");
  const reduceMotion = useReducedMotion();

  const tabs: { id: TabId; label: string; icon: typeof Building2 }[] = [
    { id: "bank", label: "Bank Transfer", icon: Building2 },
    { id: "card", label: "Card Payments", icon: CreditCard },
  ];

  return (
    <section id="donate" className="py-16 sm:py-24 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeInUp className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <p className="text-amber-600 font-semibold text-sm uppercase tracking-widest mb-3">
            Give With Confidence
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            Support Our Mission
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            Your generous contribution helps us continue spreading messages of faith, hope, and
            community service. Siluvai Media is a UK registered charity committed to financial
            transparency.
          </p>
          <div className="mt-4 inline-flex items-center gap-2 text-sm text-slate-500">
            <Shield className="w-4 h-4 text-green-600" />
            UK Registered Charity No. 1205248
          </div>
        </FadeInUp>

        <FadeInUp delay={0.08}>
          <div
            role="tablist"
            aria-label="Donation methods"
            className="relative flex p-1.5 rounded-2xl bg-slate-100/90 border border-slate-200/80 mb-6"
          >
            {tabs.map(({ id, label, icon: Icon }) => {
              const selected = tab === id;
              return (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  id={`donate-tab-${id}`}
                  aria-controls={`donate-panel-${id}`}
                  onClick={() => setTab(id)}
                  className={`relative z-10 flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500 ${
                    selected ? "text-slate-900" : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  {selected && (
                    <motion.span
                      layoutId={reduceMotion ? undefined : "donate-tab-pill"}
                      className="absolute inset-0 rounded-xl bg-white shadow-md border border-slate-100"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <Icon className="w-4 h-4 relative z-10" aria-hidden />
                  <span className="relative z-10">{label}</span>
                </button>
              );
            })}
          </div>

          <div className="relative min-h-[280px]">
            <AnimatePresence mode="wait">
              {tab === "bank" ? (
                <motion.div
                  key="bank"
                  id="donate-panel-bank"
                  role="tabpanel"
                  aria-labelledby="donate-tab-bank"
                  initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
                  transition={{ duration: reduceMotion ? 0 : 0.28 }}
                  className="rounded-2xl p-6 sm:p-8 border border-slate-100 bg-slate-50/80 backdrop-blur-sm shadow-sm"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-11 h-11 rounded-xl bg-blue-100 flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-blue-700" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-slate-900">Direct Bank Transfer</h3>
                      <p className="text-sm text-slate-500">Transfer directly to our charity account</p>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-5 border border-slate-100">
                    <CopyField label="Bank Name" value={donationSettings.bankName} />
                    <CopyField label="Account Name" value={donationSettings.accountName} />
                    <CopyField label="Sort Code" value={donationSettings.sortCode} />
                    <CopyField label="Account Number" value={donationSettings.accountNumber} />
                  </div>

                  <p className="mt-4 text-xs text-slate-500">
                    Please use reference &ldquo;Donation&rdquo; when making a transfer. Gift Aid forms
                    available on request.
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="card"
                  id="donate-panel-card"
                  role="tabpanel"
                  aria-labelledby="donate-tab-card"
                  initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
                  transition={{ duration: reduceMotion ? 0 : 0.28 }}
                  className="rounded-2xl p-6 sm:p-8 bg-gradient-to-br from-red-900 to-red-950 text-white shadow-lg"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-amber-300" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">Card Payments</h3>
                      <p className="text-sm text-red-200">Secure online donation processing</p>
                    </div>
                  </div>

                  <p className="text-red-100 text-sm leading-relaxed mb-8">
                    Donate securely via debit or credit card through our trusted payment partner. Your
                    contribution is processed safely and goes directly to supporting our charitable
                    programmes.
                  </p>

                  <a
                    href={donationSettings.cardPaymentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-shimmer inline-flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-semibold bg-amber-400 text-slate-900 hover:bg-amber-300 hover:scale-[1.02] shadow-lg transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-200"
                  >
                    <span className="relative z-10 inline-flex items-center gap-2">
                      Donate via Debit/Credit Card
                      <ExternalLink className="w-4 h-4" />
                    </span>
                  </a>

                  <p className="mt-4 text-xs text-red-300 text-center">Opens securely in a new tab</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </FadeInUp>
      </div>
    </section>
  );
}
