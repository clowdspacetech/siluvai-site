"use client";

import { useState } from "react";
import { Building2, Copy, Check, CreditCard, Shield, ExternalLink } from "lucide-react";
import { useAppData } from "@/lib/data-context";
import { copyToClipboard } from "@/lib/data-store";

interface CopyFieldProps {
  label: string;
  value: string;
}

function CopyField({ label, value }: CopyFieldProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const success = await copyToClipboard(value);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex items-center justify-between gap-3 py-3 border-b border-slate-100 last:border-0">
      <div>
        <p className="text-xs text-slate-500 uppercase tracking-wide">{label}</p>
        <p className="font-semibold text-slate-900 mt-0.5">{value}</p>
      </div>
      <button
        type="button"
        onClick={handleCopy}
        className="shrink-0 p-2 rounded-lg text-slate-500 hover:text-amber-600 hover:bg-amber-50 transition-colors"
        aria-label={`Copy ${label}`}
      >
        {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
      </button>
    </div>
  );
}

export default function DonationSection() {
  const { data } = useAppData();
  const { donationSettings } = data;

  return (
    <section id="donate" className="py-24 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-amber-600 font-semibold text-sm uppercase tracking-widest mb-3">
            Give With Confidence
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            Support Our Mission
          </h2>
          <p className="text-slate-600">
            Your generous contribution helps us continue spreading messages of faith, hope, and
            community service. Siluvai Media is a UK registered charity committed to financial
            transparency.
          </p>
          <div className="mt-4 inline-flex items-center gap-2 text-sm text-slate-500">
            <Shield className="w-4 h-4 text-green-600" />
            UK Registered Charity No. 1205248
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100 hover:shadow-xl transition-all duration-300">
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
          </div>

          <div className="bg-gradient-to-br from-red-900 to-red-950 rounded-2xl p-8 text-white hover:shadow-xl transition-all duration-300">
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
              className="inline-flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-semibold bg-amber-400 text-slate-900 hover:bg-amber-300 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Donate via Debit/Credit Card
              <ExternalLink className="w-4 h-4" />
            </a>

            <p className="mt-4 text-xs text-red-300 text-center">
              Opens securely in a new tab
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
