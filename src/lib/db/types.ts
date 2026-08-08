import type {
  AppData,
  DonationSettings,
  Event,
  RegistrationSubmission,
  SiteContent,
  Video,
} from "../types";

export interface DataRepository {
  getAppData(): Promise<AppData>;
  saveAppData(data: AppData): Promise<AppData>;
  addVideo(video: Omit<Video, "id">): Promise<AppData>;
  updateSiteContent(content: Partial<SiteContent>): Promise<AppData>;
  addRegistration(submission: Omit<RegistrationSubmission, "id" | "submittedAt">): Promise<AppData>;
  updateDonationSettings(settings: Partial<DonationSettings>): Promise<AppData>;
  getEvents(): Promise<Event[]>;
  addEvent(event: Omit<Event, "id">): Promise<AppData>;
  updateEvent(id: string, updates: Partial<Omit<Event, "id">>): Promise<AppData>;
  deleteEvent(id: string): Promise<AppData>;
}
