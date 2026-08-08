"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Building2, Copy, CreditCard, Shield, ExternalLink } from "lucide-react";
import { useAppData } from "@/lib/data-context";
import { copyToClipboard } from "@/lib/data-store";
import { useTheme } from "@/lib/theme-context";
import { cn, token } from "@/lib/theme-styles";
import { FadeInUp } from "@/components/motion/FadeInUp";

type TabId = "bank" | "card";

interface CopyFieldProps {
  label: string;
  value: string;
}

function CopyField({ label, value }: CopyFieldProps) {
  const [copied, setCopied] = useState(false);
  const reduceMotion = useReducedMotion();
  const { theme, isDark } = useTheme();

  const handleCopy = async () => {
    const success = await copyToClipboard(value);
    if (!success) return;
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className={cn("relative flex items-center justify-between gap-3 py-3.5 border-b last:border-0", token("hairline", theme))}>
      <div className="min-w-0">
        <p className={cn("text-xs uppercase tracking-wide", token("body", theme))}>{label}</p>
        <button
          type="button"
          onClick={handleCopy}
          className={cn(
            "font-semibold mt-0.5 text-left hover:text-amber-500 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500 rounded-sm",
            token("heading", theme)
          )}
        >
          {value}
        </button>
      </div>
      <button
        type="button"
        onClick={handleCopy}
        className={cn(
          "shrink-0 p-2 rounded-lg transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500",
          isDark ? "text-slate-400 hover:text-amber-300 hover:bg-amber-500/10" : "text-slate-500 hover:text-amber-700 hover:bg-amber-50"
        )}
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
            className="absolute -top-2 right-10 rounded-lg bg-amber-400 px-2.5 py-1 text-xs font-medium text-slate-950 shadow-lg"
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
  const { theme, isDark } = useTheme();

  const tabs: { id: TabId; label: string; icon: typeof Building2 }[] = [
    { id: "bank", label: "Bank Transfer", icon: Building2 },
    { id: "card", label: "Card Payments", icon: CreditCard },
  ];

  return (
    <section id="donate" className="relative py-20 sm:py-28">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeInUp className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <p className={cn(token("eyebrow", theme), "font-semibold text-sm uppercase tracking-[0.22em] mb-4")}>
            Give With Confidence
          </p>
          <h2 className={cn("text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4", token("heading", theme))}>
            Support Our Mission
          </h2>
          <p className={cn("text-sm sm:text-base", token("body", theme))}>
            Your generous contribution helps us continue spreading messages of faith, hope, and
            community service. Siluvai Media is a UK registered charity committed to financial
            transparency.
          </p>
          <div className={cn("mt-5 inline-flex items-center gap-2 text-sm glass-card px-4 py-2", token("heading", theme))}>
            <Shield className="w-4 h-4 text-amber-500" />
            <span>
              UK Registered Charity No.{" "}
              <span className={cn(token("eyebrow", theme), "font-semibold")}>1205248</span>
            </span>
          </div>
        </FadeInUp>

        <FadeInUp delay={0.08}>
          <div
            role="tablist"
            aria-label="Donation methods"
            className={cn(
              "relative flex p-1.5 rounded-2xl border mb-6 backdrop-blur-md",
              isDark ? "bg-slate-900/60 border-white/10" : "bg-white border-slate-200"
            )}
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
                  className={cn(
                    "relative z-10 flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500",
                    selected ? "text-slate-950" : token("body", theme)
                  )}
                >
                  {selected && (
                    <motion.span
                      layoutId={reduceMotion ? undefined : "donate-tab-pill"}
                      className="absolute inset-0 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-600 shadow-md shadow-amber-500/20"
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
                  className="glass-card p-6 sm:p-8"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div
                      className={cn(
                        "w-11 h-11 rounded-xl border flex items-center justify-center",
                        isDark ? "bg-amber-400/10 border-amber-400/20" : "bg-amber-50 border-amber-200"
                      )}
                    >
                      <Building2 className="w-5 h-5 text-amber-500" />
                    </div>
                    <div>
                      <h3 className={cn("font-bold text-lg", token("heading", theme))}>Direct Bank Transfer</h3>
                      <p className={cn("text-sm", token("body", theme))}>Transfer directly to our charity account</p>
                    </div>
                  </div>

                  <div className={cn("rounded-xl p-5 border", isDark ? "bg-slate-950/50 border-white/10" : "bg-slate-50 border-slate-200")}>
                    <CopyField label="Bank Name" value={donationSettings.bankName} />
                    <CopyField label="Account Name" value={donationSettings.accountName} />
                    <CopyField label="Sort Code" value={donationSettings.sortCode} />
                    <CopyField label="Account Number" value={donationSettings.accountNumber} />
                  </div>

                  <p className={cn("mt-4 text-xs", token("muted", theme))}>
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
                  className="glass-card p-6 sm:p-8"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div
                      className={cn(
                        "w-11 h-11 rounded-xl border flex items-center justify-center",
                        isDark ? "bg-amber-400/10 border-amber-400/20" : "bg-amber-50 border-amber-200"
                      )}
                    >
                      <CreditCard className="w-5 h-5 text-amber-500" />
                    </div>
                    <div>
                      <h3 className={cn("font-bold text-lg", token("heading", theme))}>Card Payments</h3>
                      <p className={cn("text-sm", token("body", theme))}>Secure online donation processing</p>
                    </div>
                  </div>

                  <p className={cn("text-sm leading-relaxed mb-8", isDark ? "text-slate-300" : "text-slate-600")}>
                    Donate securely via debit or credit card through our trusted payment partner. Your
                    contribution is processed safely and goes directly to supporting our charitable
                    programmes.
                  </p>

                  <a
                    href={donationSettings.cardPaymentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-shimmer btn-gradient-animated inline-flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-semibold text-slate-950 shadow-[0_0_24px_rgba(245,158,11,0.28)] hover:scale-[1.02] transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400"
                  >
                    <span className="relative z-10 inline-flex items-center gap-2">
                      Donate via Debit/Credit Card
                      <ExternalLink className="w-4 h-4" />
                    </span>
                  </a>

                  <p className={cn("mt-4 text-xs text-center", token("muted", theme))}>Opens securely in a new tab</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </FadeInUp>
      </div>
    </section>
  );
}
