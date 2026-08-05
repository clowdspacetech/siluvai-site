"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import {
  LogOut,
  Video,
  FileText,
  Users,
  Plus,
  Download,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useAppData } from "@/lib/data-context";
import { formatDate } from "@/lib/data-store";
import type { VideoCategory } from "@/lib/types";

const CATEGORIES: VideoCategory[] = ["Leadership", "Sermon", "Workshop", "Broadcast"];

type Tab = "videos" | "content" | "submissions";

export default function AdminDashboard() {
  const { logout } = useAuth();
  const { data, addVideo, updateSiteContent } = useAppData();
  const [activeTab, setActiveTab] = useState<Tab>("videos");

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
    setContentMessage("Site content updated successfully!");
    setTimeout(() => setContentMessage(""), 3000);
  };

  const exportSubmissions = () => {
    const headers = ["Full Name", "Email", "Phone", "Event", "Submitted At"];
    const rows = data.registrations.map((r) => [
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
    { id: "videos", label: "Videos", icon: Video },
    { id: "content", label: "Site Content", icon: FileText },
    { id: "submissions", label: "Registrations", icon: Users },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="font-bold text-xl text-slate-900">Siluvai Media CMS</h1>
            <p className="text-sm text-slate-500">Content Management Dashboard</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-sm text-slate-600 hover:text-slate-900 transition-colors"
            >
              View Site
            </Link>
            <button
              type="button"
              onClick={logout}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex gap-2 mb-8 overflow-x-auto">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setActiveTab(id)}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === id
                  ? "bg-slate-900 text-white"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {activeTab === "videos" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <form
              onSubmit={handleAddVideo}
              className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-4"
            >
              <h2 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Add New Video
              </h2>

              {videoMessage && (
                <p className="text-sm text-green-700 bg-green-50 px-3 py-2 rounded-lg">
                  {videoMessage}
                </p>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                <input
                  type="text"
                  value={videoForm.title}
                  onChange={(e) => setVideoForm({ ...videoForm, title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Publish Date</label>
                <input
                  type="date"
                  value={videoForm.publishDate}
                  onChange={(e) => setVideoForm({ ...videoForm, publishDate: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-amber-500 focus:outline-none"
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
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-amber-500 focus:outline-none"
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
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl font-semibold text-white bg-amber-600 hover:bg-amber-700 transition-colors"
              >
                Add Video
              </button>
            </form>

            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
              <h2 className="font-bold text-lg text-slate-900 mb-4">
                Current Videos ({data.videos.length})
              </h2>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {data.videos.map((video) => (
                  <div
                    key={video.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-50"
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

        {activeTab === "content" && (
          <form
            onSubmit={handleUpdateContent}
            className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-4 max-w-2xl"
          >
            <h2 className="font-bold text-lg text-slate-900">Edit Site Content</h2>

            {contentMessage && (
              <p className="text-sm text-green-700 bg-green-50 px-3 py-2 rounded-lg">
                {contentMessage}
              </p>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Hero Headline
              </label>
              <input
                type="text"
                value={contentForm.heroHeadline}
                onChange={(e) =>
                  setContentForm({ ...contentForm, heroHeadline: e.target.value })
                }
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Hero Subheadline
              </label>
              <textarea
                value={contentForm.heroSubheadline}
                onChange={(e) =>
                  setContentForm({ ...contentForm, heroSubheadline: e.target.value })
                }
                rows={3}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-amber-500 focus:outline-none resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                About Us Introduction
              </label>
              <textarea
                value={contentForm.aboutIntro}
                onChange={(e) =>
                  setContentForm({ ...contentForm, aboutIntro: e.target.value })
                }
                rows={4}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-amber-500 focus:outline-none resize-none"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl font-semibold text-white bg-amber-600 hover:bg-amber-700 transition-colors"
            >
              Save Changes
            </button>
          </form>
        )}

        {activeTab === "submissions" && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h2 className="font-bold text-lg text-slate-900">
                Event Registrations ({data.registrations.length})
              </h2>
              {data.registrations.length > 0 && (
                <button
                  type="button"
                  onClick={exportSubmissions}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-slate-900 text-white hover:bg-slate-800 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Export CSV
                </button>
              )}
            </div>

            {data.registrations.length === 0 ? (
              <p className="p-8 text-center text-slate-500">No registrations yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 text-left">
                      <th className="px-6 py-3 font-semibold text-slate-700">Name</th>
                      <th className="px-6 py-3 font-semibold text-slate-700">Email</th>
                      <th className="px-6 py-3 font-semibold text-slate-700">Phone</th>
                      <th className="px-6 py-3 font-semibold text-slate-700">Event</th>
                      <th className="px-6 py-3 font-semibold text-slate-700">Submitted</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {data.registrations.map((reg) => (
                      <tr key={reg.id} className="hover:bg-slate-50">
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
      </div>
    </div>
  );
}
