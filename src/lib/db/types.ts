import type { AppData, DonationSettings, RegistrationSubmission, SiteContent, Video } from "../types";

export interface DataRepository {
  getAppData(): Promise<AppData>;
  saveAppData(data: AppData): Promise<AppData>;
  addVideo(video: Omit<Video, "id">): Promise<AppData>;
  updateSiteContent(content: Partial<SiteContent>): Promise<AppData>;
  addRegistration(submission: Omit<RegistrationSubmission, "id" | "submittedAt">): Promise<AppData>;
  updateDonationSettings(settings: Partial<DonationSettings>): Promise<AppData>;
}
