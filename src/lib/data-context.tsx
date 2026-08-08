"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import {
  addEventAction,
  addRegistrationAction,
  addVideoAction,
  deleteEventAction,
  fetchAppData,
  updateDonationSettingsAction,
  updateEventAction,
  updateSiteContentAction,
} from "@/app/actions/data";
import type {
  AppData,
  DonationSettings,
  Event,
  RegistrationSubmission,
  SiteContent,
  Video,
} from "./types";
import { defaultAppData } from "./data-store";

interface DataContextValue {
  data: AppData;
  isLoaded: boolean;
  addVideo: (video: Omit<Video, "id">) => Promise<void>;
  updateSiteContent: (content: Partial<SiteContent>) => Promise<void>;
  addRegistration: (submission: Omit<RegistrationSubmission, "id" | "submittedAt">) => Promise<void>;
  updateDonationSettings: (settings: Partial<DonationSettings>) => Promise<void>;
  addEvent: (event: Omit<Event, "id">) => Promise<void>;
  updateEvent: (id: string, updates: Partial<Omit<Event, "id">>) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
  refresh: () => Promise<void>;
}

const DataContext = createContext<DataContextValue | null>(null);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<AppData>(defaultAppData);
  const [isLoaded, setIsLoaded] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const next = await fetchAppData();
      setData(next);
    } catch {
      const res = await fetch("/api/data");
      if (res.ok) setData(await res.json());
    }
  }, []);

  useEffect(() => {
    refresh().finally(() => setIsLoaded(true));
  }, [refresh]);

  const addVideo = useCallback(async (video: Omit<Video, "id">) => {
    const next = await addVideoAction(video);
    setData(next);
  }, []);

  const updateSiteContent = useCallback(async (content: Partial<SiteContent>) => {
    const next = await updateSiteContentAction(content);
    setData(next);
  }, []);

  const addRegistration = useCallback(
    async (submission: Omit<RegistrationSubmission, "id" | "submittedAt">) => {
      const next = await addRegistrationAction(submission);
      setData(next);
    },
    []
  );

  const updateDonationSettings = useCallback(async (settings: Partial<DonationSettings>) => {
    const next = await updateDonationSettingsAction(settings);
    setData(next);
  }, []);

  const addEvent = useCallback(async (event: Omit<Event, "id">) => {
    const next = await addEventAction(event);
    setData(next);
  }, []);

  const updateEvent = useCallback(async (id: string, updates: Partial<Omit<Event, "id">>) => {
    const next = await updateEventAction(id, updates);
    setData(next);
  }, []);

  const deleteEvent = useCallback(async (id: string) => {
    const next = await deleteEventAction(id);
    setData(next);
  }, []);

  return (
    <DataContext.Provider
      value={{
        data,
        isLoaded,
        addVideo,
        updateSiteContent,
        addRegistration,
        updateDonationSettings,
        addEvent,
        updateEvent,
        deleteEvent,
        refresh,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useAppData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useAppData must be used within DataProvider");
  return ctx;
}

export function extractYouTubeId(url: string): string | null {
  try {
    const trimmed = url.trim();
    const match = trimmed.match(
      /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([^&\s?/]+)/
    );
    if (match?.[1]) return match[1];

    const parts = trimmed.split("/");
    const last = parts[parts.length - 1]?.split(/[?&]/)[0];
    return last || null;
  } catch {
    return null;
  }
}

export function youtubeThumbnail(url: string): string {
  const id = extractYouTubeId(url);
  return id
    ? `https://img.youtube.com/vi/${id}/maxresdefault.jpg`
    : "/images/video-fallback.svg";
}

export function youtubeEmbedUrl(url: string): string {
  if (url.includes("/embed/")) return url;
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
  if (match) return `https://www.youtube.com/embed/${match[1]}`;
  return url;
}

export function categoryColors(category: Video["category"]): string {
  const map: Record<Video["category"], string> = {
    Leadership: "bg-amber-100 text-amber-800",
    Sermon: "bg-red-100 text-red-800",
    Workshop: "bg-blue-100 text-blue-800",
    Broadcast: "bg-purple-100 text-purple-800",
  };
  return map[category] ?? "bg-slate-100 text-slate-800";
}
