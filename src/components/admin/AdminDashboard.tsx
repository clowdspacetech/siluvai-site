"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  LogOut,
  Video,
  FileText,
  Users,
  Plus,
  Download,
  LayoutDashboard,
  CreditCard,
  Calendar,
  ClipboardList,
  Trash2,
  ExternalLink,
  Pencil,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useAppData } from "@/lib/data-context";
import { formatDate } from "@/lib/data-store";
import type { Event, VideoCategory } from "@/lib/types";

const CATEGORIES: VideoCategory[] = ["Leadership", "Sermon", "Workshop", "Broadcast"];

const emptyEventForm = {
  title: "",
  date: "",
  time: "",
  description: "",
  imageUrl: "",
};

type Tab =
  | "dashboard"
  | "about"
  | "payment"
  | "videos"
  | "events"
  | "registration"
  | "submissions";

const glass =
  "rounded-2xl border border-white/60 bg-white/70 backdrop-blur-md shadow-[0_8px_32px_rgba(15,23,42,0.06)]";

const inputClass =
  "w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white/80 focus:ring-2 focus:ring-amber-500 focus:outline-none transition-shadow";

export default function AdminDashboard() {
  const { logout } = useAuth();
  const {
    data,
    addVideo,
    updateSiteContent,
    updateDonationSettings,
    addEvent,
    updateEvent,
    deleteEvent,
  } = useAppData();
  const reduceMotion = useReducedMotion();
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");

  const [videoForm, setVideoForm] = useState({
    title: "",
    publishDate: new Date().toISOString().split("T")[0],
    category: "Sermon" as VideoCategory,
    url: "",
  });
  const [videoMessage, setVideoMessage] = useState("");

  const [contentForm, setContentForm] = useState({
    heroHeadline: data.siteContent.heroHeadline,
    heroSubheadline: data.siteContent.heroSubheadline,
    aboutIntro: data.siteContent.aboutIntro,
  });
  const [contentMessage, setContentMessage] = useState("");

  const [paymentForm, setPaymentForm] = useState({
    bankName: data.donationSettings.bankName,
    accountName: data.donationSettings.accountName,
    sortCode: data.donationSettings.sortCode,
    accountNumber: data.donationSettings.accountNumber,
    referenceHint: "",
  });
  const [paymentMessage, setPaymentMessage] = useState("");

  const [registrationFormConfig, setRegistrationFormConfig] = useState({
    heading: "Event Registration",
    submitLabel: "Register Now",
    requirePhone: true,
    requireEvent: true,
  });
  const [registrationMessage, setRegistrationMessage] = useState("");

  const [eventForm, setEventForm] = useState(emptyEventForm);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [eventMessage, setEventMessage] = useState("");

  const events = data.events ?? [];
  const submissions = data.registrations;

  const fadeUp = {
    initial: reduceMotion ? false : { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: reduceMotion ? 0 : 0.35 },
  };

  const handleAddVideo = (e: FormEvent) => {
    e.preventDefault();
    if (!videoForm.title || !videoForm.url) return;

    addVideo(videoForm);
    setVideoForm({
      title: "",
      publishDate: new Date().toISOString().split("T")[0],
      category: "Sermon",
      url: "",
    });
    setVideoMessage("Video added successfully!");
    setTimeout(() => setVideoMessage(""), 3000);
  };

  const handleUpdateContent = (e: FormEvent) => {
    e.preventDefault();
    updateSiteContent(contentForm);
    setContentMessage("About content updated successfully!");
    setTimeout(() => setContentMessage(""), 3000);
  };

  const handleSavePayment = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await updateDonationSettings({
        bankName: paymentForm.bankName,
        accountName: paymentForm.accountName,
        sortCode: paymentForm.sortCode,
        accountNumber: paymentForm.accountNumber,
      });
      setPaymentMessage("Payment config saved successfully!");
      setTimeout(() => setPaymentMessage(""), 3000);
    } catch (err) {
      setPaymentMessage(err instanceof Error ? err.message : "Failed to save payment config.");
    }
  };

  const handleSaveRegistration = (e: FormEvent) => {
    e.preventDefault();
    setRegistrationMessage("Form config saved for this session.");
    setTimeout(() => setRegistrationMessage(""), 3000);
  };

  const resetEventForm = () => {
    setEventForm(emptyEventForm);
    setEditingEventId(null);
  };

  const handleSaveEvent = async (e: FormEvent) => {
    e.preventDefault();
    if (!eventForm.title || !eventForm.date) return;

    try {
      const payload = {
        title: eventForm.title,
        date: eventForm.date,
        time: eventForm.time || undefined,
        description: eventForm.description || undefined,
        imageUrl: eventForm.imageUrl || undefined,
      };

      if (editingEventId) {
        await updateEvent(editingEventId, payload);
        setEventMessage("Event updated successfully!");
      } else {
        await addEvent(payload);
        setEventMessage("Event added successfully!");
      }
      resetEventForm();
      setTimeout(() => setEventMessage(""), 3000);
    } catch (err) {
      setEventMessage(err instanceof Error ? err.message : "Failed to save event.");
    }
  };

  const handleEditEvent = (ev: Event) => {
    setEditingEventId(ev.id);
    setEventForm({
      title: ev.title,
      date: ev.date,
      time: ev.time ?? "",
      description: ev.description ?? "",
      imageUrl: ev.imageUrl ?? "",
    });
  };

  const handleDeleteEvent = async (id: string) => {
    try {
      await deleteEvent(id);
      if (editingEventId === id) resetEventForm();
      setEventMessage("Event deleted.");
      setTimeout(() => setEventMessage(""), 3000);
    } catch (err) {
      setEventMessage(err instanceof Error ? err.message : "Failed to delete event.");
    }
  };

  const exportSubmissions = () => {
    const headers = ["Full Name", "Email", "Phone", "Event", "Submitted At"];
    const rows = submissions.map((r) => [
      r.fullName,
      r.email,
      r.phone,
      r.selectedEvent,
      new Date(r.submittedAt).toLocaleString("en-GB"),
    ]);
    const csv = [headers, ...rows].map((row) => row.map((c) => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `siluvai-registrations-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const tabs: { id: Tab; label: string; icon: typeof Video }[] = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "about", label: "About", icon: FileText },
    { id: "payment", label: "Payment", icon: CreditCard },
    { id: "videos", label: "Videos", icon: Video },
    { id: "events", label: "Events", icon: Calendar },
    { id: "registration", label: "Registration Form", icon: ClipboardList },
    { id: "submissions", label: "Submissions", icon: Users },
  ];

  const metrics = [
    { label: "Total Videos", value: data.videos.length, tab: "videos" as Tab },
    { label: "Upcoming Events", value: events.length, tab: "events" as Tab },
    { label: "Submissions", value: submissions.length, tab: "submissions" as Tab },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50/30 to-slate-100">
      <header className="sticky top-0 z-10 border-b border-white/50 bg-white/70 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="font-bold text-xl text-slate-900">Siluvai Media CMS</h1>
            <p className="text-sm text-slate-500">Content Management Dashboard</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-sm text-slate-600 hover:text-slate-900 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500 rounded-lg"
            >
              View Site
            </Link>
            <button
              type="button"
              onClick={logout}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100/80 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div
          role="tablist"
          aria-label="CMS sections"
          className="flex gap-2 mb-8 overflow-x-auto pb-1"
        >
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={activeTab === id}
              onClick={() => setActiveTab(id)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500 ${
                activeTab === id
                  ? "bg-slate-900 text-white shadow-lg shadow-slate-900/20"
                  : "bg-white/70 text-slate-600 hover:bg-white border border-slate-200/80 backdrop-blur-sm"
              }`}
            >
              <Icon className="w-4 h-4" aria-hidden />
              {label}
            </button>
          ))}
        </div>

        <motion.div key={activeTab} {...fadeUp}>
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {metrics.map((m, i) => (
                  <motion.button
                    key={m.label}
                    type="button"
                    onClick={() => setActiveTab(m.tab)}
                    initial={reduceMotion ? false : { opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: reduceMotion ? 0 : i * 0.08, duration: 0.35 }}
                    className={`${glass} p-6 text-left hover:-translate-y-1.5 hover:shadow-[0_16px_40px_rgba(15,23,42,0.1)] transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500`}
                  >
                    <p className="text-sm text-slate-500 mb-1">{m.label}</p>
                    <p className="text-3xl font-bold text-slate-900">{m.value}</p>
                  </motion.button>
                ))}
              </div>

              <div className={`${glass} p-6`}>
                <h2 className="font-bold text-lg text-slate-900 mb-4">Quick links</h2>
                <div className="flex flex-wrap gap-3">
                  {(
                    [
                      ["about", "Edit About"],
                      ["videos", "Manage Videos"],
                      ["events", "Manage Events"],
                      ["payment", "Payment Config"],
                      ["submissions", "View Submissions"],
                    ] as const
                  ).map(([id, label]) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setActiveTab(id)}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-slate-900 text-white hover:bg-slate-800 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500"
                    >
                      {label}
                      <ExternalLink className="w-3.5 h-3.5" aria-hidden />
                    </button>
                  ))}
                </div>
              </div>

              <div className={`${glass} p-6`}>
                <h2 className="font-bold text-lg text-slate-900 mb-2">Recent activity</h2>
                <p className="text-sm text-slate-500">
                  {submissions.length === 0 && events.length === 0
                    ? "No recent activity yet."
                    : `${submissions.length} registration(s) · ${events.length} event(s) · ${data.videos.length} video(s)`}
                </p>
              </div>
            </div>
          )}

          {activeTab === "about" && (
            <form onSubmit={handleUpdateContent} className={`${glass} p-6 space-y-4 max-w-2xl`}>
              <h2 className="font-bold text-lg text-slate-900">About & Hero Content</h2>

              {contentMessage && (
                <p className="text-sm text-green-700 bg-green-50/80 px-3 py-2 rounded-lg" role="status">
                  {contentMessage}
                </p>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Hero Headline</label>
                <input
                  type="text"
                  value={contentForm.heroHeadline}
                  onChange={(e) => setContentForm({ ...contentForm, heroHeadline: e.target.value })}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Hero Subheadline</label>
                <textarea
                  value={contentForm.heroSubheadline}
                  onChange={(e) =>
                    setContentForm({ ...contentForm, heroSubheadline: e.target.value })
                  }
                  rows={3}
                  className={`${inputClass} resize-none`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  About Us Introduction
                </label>
                <textarea
                  value={contentForm.aboutIntro}
                  onChange={(e) => setContentForm({ ...contentForm, aboutIntro: e.target.value })}
                  rows={4}
                  className={`${inputClass} resize-none`}
                />
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl font-semibold text-white bg-amber-600 hover:bg-amber-700 hover:scale-[1.03] transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500"
              >
                Save Changes
              </button>
            </form>
          )}

          {activeTab === "payment" && (
            <form onSubmit={handleSavePayment} className={`${glass} p-6 space-y-4 max-w-2xl`}>
              <h2 className="font-bold text-lg text-slate-900">Payment Configuration</h2>
              <p className="text-sm text-slate-500">
                Bank transfer details shown on the Support section. Card flow uses your existing payment module.
              </p>

              {paymentMessage && (
                <p
                  className={`text-sm px-3 py-2 rounded-lg ${
                    paymentMessage.toLowerCase().includes("fail")
                      ? "text-red-700 bg-red-50/80"
                      : "text-green-700 bg-green-50/80"
                  }`}
                  role="status"
                >
                  {paymentMessage}
                </p>
              )}

              {(
                [
                  ["bankName", "Bank Name"],
                  ["accountName", "Account Name"],
                  ["sortCode", "Sort Code"],
                  ["accountNumber", "Account Number"],
                  ["referenceHint", "Payment Reference Hint"],
                ] as const
              ).map(([key, label]) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
                  <input
                    type="text"
                    value={paymentForm[key]}
                    onChange={(e) => setPaymentForm({ ...paymentForm, [key]: e.target.value })}
                    className={inputClass}
                  />
                </div>
              ))}

              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl font-semibold text-white bg-amber-600 hover:bg-amber-700 hover:scale-[1.03] transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500"
              >
                Save Payment Config
              </button>
            </form>
          )}

          {activeTab === "videos" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <form onSubmit={handleAddVideo} className={`${glass} p-6 space-y-4`}>
                <h2 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                  <Plus className="w-5 h-5" aria-hidden />
                  Add New Video
                </h2>

                {videoMessage && (
                  <p className="text-sm text-green-700 bg-green-50/80 px-3 py-2 rounded-lg" role="status">
                    {videoMessage}
                  </p>
                )}

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                  <input
                    type="text"
                    value={videoForm.title}
                    onChange={(e) => setVideoForm({ ...videoForm, title: e.target.value })}
                    className={inputClass}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Publish Date</label>
                  <input
                    type="date"
                    value={videoForm.publishDate}
                    onChange={(e) => setVideoForm({ ...videoForm, publishDate: e.target.value })}
                    className={inputClass}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                  <select
                    value={videoForm.category}
                    onChange={(e) =>
                      setVideoForm({ ...videoForm, category: e.target.value as VideoCategory })
                    }
                    className={inputClass}
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">YouTube URL</label>
                  <input
                    type="url"
                    value={videoForm.url}
                    onChange={(e) => setVideoForm({ ...videoForm, url: e.target.value })}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className={inputClass}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl font-semibold text-white bg-amber-600 hover:bg-amber-700 hover:scale-[1.03] transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500"
                >
                  Add Video
                </button>
              </form>

              <div className={`${glass} p-6`}>
                <h2 className="font-bold text-lg text-slate-900 mb-4">
                  Current Videos ({data.videos.length})
                </h2>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {data.videos.map((video) => (
                    <div
                      key={video.id}
                      className="flex items-center justify-between p-3 rounded-xl bg-slate-50/80 border border-slate-100"
                    >
                      <div>
                        <p className="font-medium text-slate-900 text-sm">{video.title}</p>
                        <p className="text-xs text-slate-500">
                          {video.category} &middot; {formatDate(video.publishDate)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "events" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <form onSubmit={handleSaveEvent} className={`${glass} p-6 space-y-4`}>
                <h2 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                  {editingEventId ? (
                    <Pencil className="w-5 h-5" aria-hidden />
                  ) : (
                    <Plus className="w-5 h-5" aria-hidden />
                  )}
                  {editingEventId ? "Edit Event" : "Add Upcoming Event"}
                </h2>
                <p className="text-sm text-slate-500">
                  Events feed the public Events section (title, date/time, description, image).
                </p>

                {eventMessage && (
                  <p
                    className={`text-sm px-3 py-2 rounded-lg ${
                      eventMessage.toLowerCase().includes("fail")
                        ? "text-red-700 bg-red-50/80"
                        : "text-green-700 bg-green-50/80"
                    }`}
                    role="status"
                  >
                    {eventMessage}
                  </p>
                )}

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                  <input
                    type="text"
                    value={eventForm.title}
                    onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                    className={inputClass}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
                    <input
                      type="date"
                      value={eventForm.date}
                      onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                      className={inputClass}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Time</label>
                    <input
                      type="time"
                      value={eventForm.time}
                      onChange={(e) => setEventForm({ ...eventForm, time: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                  <textarea
                    value={eventForm.description}
                    onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                    rows={3}
                    className={`${inputClass} resize-none`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Image URL</label>
                  <input
                    type="url"
                    value={eventForm.imageUrl}
                    onChange={(e) => setEventForm({ ...eventForm, imageUrl: e.target.value })}
                    placeholder="https://..."
                    className={inputClass}
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl font-semibold text-white bg-amber-600 hover:bg-amber-700 hover:scale-[1.03] transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500"
                  >
                    {editingEventId ? "Update Event" : "Add Event"}
                  </button>
                  {editingEventId && (
                    <button
                      type="button"
                      onClick={resetEventForm}
                      className="px-4 py-2.5 rounded-xl font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>

              <div className={`${glass} p-6`}>
                <h2 className="font-bold text-lg text-slate-900 mb-4">
                  Upcoming Events ({events.length})
                </h2>
                {events.length === 0 ? (
                  <p className="text-sm text-slate-500">No events yet. Add one to populate the public page.</p>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {events.map((ev) => (
                      <div
                        key={ev.id}
                        className="flex gap-3 p-3 rounded-xl bg-slate-50/80 border border-slate-100"
                      >
                        {ev.imageUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={ev.imageUrl}
                            alt=""
                            className="w-16 h-16 rounded-lg object-cover shrink-0 bg-slate-200"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-lg bg-slate-200 shrink-0" aria-hidden />
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-slate-900 text-sm truncate">{ev.title}</p>
                          <p className="text-xs text-slate-500">
                            {ev.date}
                            {ev.time ? ` · ${ev.time}` : ""}
                          </p>
                          {ev.description && (
                            <p className="text-xs text-slate-500 mt-1 line-clamp-2">{ev.description}</p>
                          )}
                        </div>
                        <div className="flex flex-col gap-1">
                          <button
                            type="button"
                            onClick={() => handleEditEvent(ev)}
                            className="p-2 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500"
                            aria-label={`Edit ${ev.title}`}
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteEvent(ev.id)}
                            className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500"
                            aria-label={`Delete ${ev.title}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "registration" && (
            <form onSubmit={handleSaveRegistration} className={`${glass} p-6 space-y-4 max-w-2xl`}>
              <h2 className="font-bold text-lg text-slate-900">Registration Form Configuration</h2>

              {registrationMessage && (
                <p className="text-sm text-green-700 bg-green-50/80 px-3 py-2 rounded-lg" role="status">
                  {registrationMessage}
                </p>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Form Heading</label>
                <input
                  type="text"
                  value={registrationFormConfig.heading}
                  onChange={(e) =>
                    setRegistrationFormConfig({ ...registrationFormConfig, heading: e.target.value })
                  }
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Submit Button Label</label>
                <input
                  type="text"
                  value={registrationFormConfig.submitLabel}
                  onChange={(e) =>
                    setRegistrationFormConfig({
                      ...registrationFormConfig,
                      submitLabel: e.target.value,
                    })
                  }
                  className={inputClass}
                />
              </div>

              <fieldset className="space-y-3">
                <legend className="text-sm font-medium text-slate-700">Required fields</legend>
                <label className="flex items-center gap-3 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={registrationFormConfig.requirePhone}
                    onChange={(e) =>
                      setRegistrationFormConfig({
                        ...registrationFormConfig,
                        requirePhone: e.target.checked,
                      })
                    }
                    className="rounded border-slate-300 text-amber-600 focus:ring-amber-500"
                  />
                  Phone required
                </label>
                <label className="flex items-center gap-3 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={registrationFormConfig.requireEvent}
                    onChange={(e) =>
                      setRegistrationFormConfig({
                        ...registrationFormConfig,
                        requireEvent: e.target.checked,
                      })
                    }
                    className="rounded border-slate-300 text-amber-600 focus:ring-amber-500"
                  />
                  Event selection required
                </label>
              </fieldset>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl font-semibold text-white bg-amber-600 hover:bg-amber-700 hover:scale-[1.03] transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500"
              >
                Save Form Config
              </button>
            </form>
          )}

          {activeTab === "submissions" && (
            <div className={`${glass} overflow-hidden`}>
              <div className="flex items-center justify-between p-6 border-b border-slate-100/80">
                <h2 className="font-bold text-lg text-slate-900">
                  Event Registrations ({submissions.length})
                </h2>
                {submissions.length > 0 && (
                  <button
                    type="button"
                    onClick={exportSubmissions}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-slate-900 text-white hover:bg-slate-800 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500"
                  >
                    <Download className="w-4 h-4" aria-hidden />
                    Export CSV
                  </button>
                )}
              </div>

              {submissions.length === 0 ? (
                <p className="p-8 text-center text-slate-500">No registrations yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-slate-50/80 text-left">
                        <th className="px-6 py-3 font-semibold text-slate-700">Name</th>
                        <th className="px-6 py-3 font-semibold text-slate-700">Email</th>
                        <th className="px-6 py-3 font-semibold text-slate-700">Phone</th>
                        <th className="px-6 py-3 font-semibold text-slate-700">Event</th>
                        <th className="px-6 py-3 font-semibold text-slate-700">Submitted</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {submissions.map((reg) => (
                        <tr key={reg.id} className="hover:bg-slate-50/60">
                          <td className="px-6 py-3 text-slate-900">{reg.fullName}</td>
                          <td className="px-6 py-3 text-slate-600">{reg.email}</td>
                          <td className="px-6 py-3 text-slate-600">{reg.phone}</td>
                          <td className="px-6 py-3 text-slate-600">{reg.selectedEvent}</td>
                          <td className="px-6 py-3 text-slate-500 whitespace-nowrap">
                            {new Date(reg.submittedAt).toLocaleString("en-GB")}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
