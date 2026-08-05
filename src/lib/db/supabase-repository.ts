import type { AppData, DonationSettings, RegistrationSubmission, SiteContent, Video } from "../types";
import type { DataRepository } from "./types";
import { localRepository } from "./local-repository";

/**
 * Supabase adapter scaffold — activate by setting SUPABASE_URL and SUPABASE_ANON_KEY.
 * Replace the method bodies with @supabase/supabase-js calls when ready.
 */
export const supabaseRepository: DataRepository = {
  async getAppData() {
    // TODO: const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!);
    // const { data } = await supabase.from('app_data').select('*').single();
    console.warn("[Supabase] Not yet implemented — falling back to local repository.");
    return localRepository.getAppData();
  },

  async saveAppData(data: AppData) {
    console.warn("[Supabase] Not yet implemented — falling back to local repository.");
    return localRepository.saveAppData(data);
  },

  async addVideo(video: Omit<Video, "id">) {
    console.warn("[Supabase] Not yet implemented — falling back to local repository.");
    return localRepository.addVideo(video);
  },

  async updateSiteContent(content: Partial<SiteContent>) {
    console.warn("[Supabase] Not yet implemented — falling back to local repository.");
    return localRepository.updateSiteContent(content);
  },

  async addRegistration(submission: Omit<RegistrationSubmission, "id" | "submittedAt">) {
    console.warn("[Supabase] Not yet implemented — falling back to local repository.");
    return localRepository.addRegistration(submission);
  },

  async updateDonationSettings(settings: Partial<DonationSettings>) {
    console.warn("[Supabase] Not yet implemented — falling back to local repository.");
    return localRepository.updateDonationSettings(settings);
  },
};
