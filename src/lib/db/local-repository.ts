import { promises as fs } from "fs";
import path from "path";
import type { AppData, Event } from "../types";
import { defaultAppData, generateId } from "../data-store";
import type { DataRepository } from "./types";

const DATA_DIR = path.join(process.cwd(), ".data");
const DATA_FILE = path.join(DATA_DIR, "app-data.json");

async function ensureDataFile(): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.writeFile(DATA_FILE, JSON.stringify(defaultAppData, null, 2), "utf-8");
  }
}

function mergeWithDefaults(parsed: Partial<AppData>): AppData {
  return {
    ...defaultAppData,
    ...parsed,
    siteContent: {
      ...defaultAppData.siteContent,
      ...parsed.siteContent,
      pillars: parsed.siteContent?.pillars ?? defaultAppData.siteContent.pillars,
      trustees: parsed.siteContent?.trustees ?? defaultAppData.siteContent.trustees,
    },
    donationSettings: {
      ...defaultAppData.donationSettings,
      ...parsed.donationSettings,
    },
    videos: parsed.videos ?? defaultAppData.videos,
    registrations: parsed.registrations ?? defaultAppData.registrations,
    events: parsed.events ?? defaultAppData.events,
  };
}

async function readData(): Promise<AppData> {
  await ensureDataFile();
  const raw = await fs.readFile(DATA_FILE, "utf-8");
  return mergeWithDefaults(JSON.parse(raw) as Partial<AppData>);
}

async function writeData(data: AppData): Promise<AppData> {
  await ensureDataFile();
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
  return data;
}

export const localRepository: DataRepository = {
  async getAppData() {
    return readData();
  },

  async saveAppData(data) {
    return writeData(data);
  },

  async addVideo(video) {
    const current = await readData();
    const next: AppData = {
      ...current,
      videos: [{ ...video, id: generateId("vid") }, ...current.videos],
    };
    return writeData(next);
  },

  async updateSiteContent(content) {
    const current = await readData();
    const next: AppData = {
      ...current,
      siteContent: { ...current.siteContent, ...content },
    };
    return writeData(next);
  },

  async addRegistration(submission) {
    const current = await readData();
    const next: AppData = {
      ...current,
      registrations: [
        {
          ...submission,
          id: generateId("reg"),
          submittedAt: new Date().toISOString(),
        },
        ...current.registrations,
      ],
    };
    return writeData(next);
  },

  async updateDonationSettings(settings) {
    const current = await readData();
    const next: AppData = {
      ...current,
      donationSettings: { ...current.donationSettings, ...settings },
    };
    return writeData(next);
  },

  async getEvents() {
    const current = await readData();
    return current.events;
  },

  async addEvent(event) {
    const current = await readData();
    const nextEvent: Event = { ...event, id: generateId("evt") };
    const next: AppData = {
      ...current,
      events: [...current.events, nextEvent].sort((a, b) => a.date.localeCompare(b.date)),
    };
    return writeData(next);
  },

  async updateEvent(id, updates) {
    const current = await readData();
    const next: AppData = {
      ...current,
      events: current.events
        .map((ev) => (ev.id === id ? { ...ev, ...updates, id } : ev))
        .sort((a, b) => a.date.localeCompare(b.date)),
    };
    return writeData(next);
  },

  async deleteEvent(id) {
    const current = await readData();
    const next: AppData = {
      ...current,
      events: current.events.filter((ev) => ev.id !== id),
    };
    return writeData(next);
  },
};
