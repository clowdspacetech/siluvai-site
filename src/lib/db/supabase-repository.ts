import { supabase } from "../supabase";
import type { AppData, Video, SiteContent, RegistrationSubmission, DonationSettings } from "../types";

/** Public Events page + CMS shape */
export interface CmsEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  description: string;
  imageUrl: string;
}

export interface RegistrationFormConfig {
  heading: string;
  submitLabel: string;
  requirePhone: boolean;
  requireEvent: boolean;
}

type EventRow = {
  id: string;
  title: string;
  date: string;
  time: string | null;
  description: string | null;
  image_url: string | null;
};

type RegistrationRow = {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  selected_event: string;
  submitted_at: string;
};

type RegistrationFormRow = {
  heading: string;
  submit_label: string;
  require_phone: boolean;
  require_event: boolean;
};

function mapEvent(row: EventRow): CmsEvent {
  return {
    id: row.id,
    title: row.title,
    date: row.date,
    time: row.time ?? "",
    description: row.description ?? "",
    imageUrl: row.image_url ?? "",
  };
}

function mapRegistration(row: RegistrationRow): RegistrationSubmission {
  return {
    id: row.id,
    fullName: row.full_name,
    email: row.email,
    phone: row.phone,
    selectedEvent: row.selected_event,
    submittedAt: row.submitted_at,
  };
}

function mapRegistrationForm(row: RegistrationFormRow): RegistrationFormConfig {
  return {
    heading: row.heading,
    submitLabel: row.submit_label,
    requirePhone: row.require_phone,
    requireEvent: row.require_event,
  };
}

export const supabaseRepository = {
  async getAppData() {
    const { data, error } = await supabase
      .from("app_data")
      .select("*")
      .single();

    if (error) throw error;
    return data as AppData;
  },

  async saveAppData(data: AppData) {
    const { error } = await supabase
      .from("app_data")
      .update({
        videos: data.videos,
        site_content: data.siteContent,
        registrations: data.registrations,
        donation_settings: data.donationSettings,
      })
      .eq("id", 1);

    if (error) throw error;
    return data;
  },

  async addVideo(video: Video) {
    const { data: inserted, error } = await supabase
      .from("videos")
      .insert({
        title: video.title,
        publish_date: video.publishDate,
        category: video.category,
        url: video.url,
        thumbnail: video.thumbnail,
      })
      .select()
      .single();

    if (error) throw error;
    return inserted as Video;
  },

  async addRegistration(reg: RegistrationSubmission) {
    const { data: inserted, error } = await supabase
      .from("registrations")
      .insert({
        full_name: reg.fullName,
        email: reg.email,
        phone: reg.phone,
        selected_event: reg.selectedEvent,
      })
      .select()
      .single();

    if (error) throw error;
    return inserted as RegistrationSubmission;
  },

  async updateDonationSettings(settings: DonationSettings) {
    const { error } = await supabase
      .from("donation_settings")
      .update(settings)
      .eq("id", 1);

    if (error) throw error;
    return settings;
  },

  async updateSiteContent(content: SiteContent) {
    const { error } = await supabase
      .from("site_content")
      .update({
        hero_headline: content.heroHeadline,
        hero_subheadline: content.heroSubheadline,
        about_intro: content.aboutIntro,
        pillars: content.pillars,
        trustees: content.trustees,
      })
      .eq("id", 1);

    if (error) throw error;
    return content;
  },

  // ── Events ──────────────────────────────────────────────

  async getEvents() {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("date", { ascending: true });

    if (error) throw error;
    return (data as EventRow[]).map(mapEvent);
  },

  async addEvent(event: Omit<CmsEvent, "id">) {
    const { data: inserted, error } = await supabase
      .from("events")
      .insert({
        title: event.title,
        date: event.date,
        time: event.time || null,
        description: event.description || null,
        image_url: event.imageUrl || null,
      })
      .select()
      .single();

    if (error) throw error;
    return mapEvent(inserted as EventRow);
  },

  async updateEvent(id: string, event: Partial<Omit<CmsEvent, "id">>) {
    const payload: Record<string, unknown> = {};
    if (event.title !== undefined) payload.title = event.title;
    if (event.date !== undefined) payload.date = event.date;
    if (event.time !== undefined) payload.time = event.time || null;
    if (event.description !== undefined) payload.description = event.description || null;
    if (event.imageUrl !== undefined) payload.image_url = event.imageUrl || null;

    const { data: updated, error } = await supabase
      .from("events")
      .update(payload)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return mapEvent(updated as EventRow);
  },

  async deleteEvent(id: string) {
    const { error } = await supabase.from("events").delete().eq("id", id);
    if (error) throw error;
  },

  // ── Payment ─────────────────────────────────────────────

  async getPaymentSettings() {
    const { data, error } = await supabase
      .from("donation_settings")
      .select("*")
      .eq("id", 1)
      .single();

    if (error) throw error;
    return data as DonationSettings;
  },

  async updatePaymentSettings(settings: Partial<DonationSettings>) {
    const { data: updated, error } = await supabase
      .from("donation_settings")
      .update(settings)
      .eq("id", 1)
      .select()
      .single();

    if (error) throw error;
    return updated as DonationSettings;
  },

  // ── Registration Form ───────────────────────────────────

  async getRegistrationFormConfig() {
    const { data, error } = await supabase
      .from("registration_form_config")
      .select("*")
      .eq("id", 1)
      .single();

    if (error) throw error;
    return mapRegistrationForm(data as RegistrationFormRow);
  },

  async updateRegistrationFormConfig(config: Partial<RegistrationFormConfig>) {
    const payload: Record<string, unknown> = {};
    if (config.heading !== undefined) payload.heading = config.heading;
    if (config.submitLabel !== undefined) payload.submit_label = config.submitLabel;
    if (config.requirePhone !== undefined) payload.require_phone = config.requirePhone;
    if (config.requireEvent !== undefined) payload.require_event = config.requireEvent;

    const { data: updated, error } = await supabase
      .from("registration_form_config")
      .update(payload)
      .eq("id", 1)
      .select()
      .single();

    if (error) throw error;
    return mapRegistrationForm(updated as RegistrationFormRow);
  },

  // ── Submissions ─────────────────────────────────────────

  async getSubmissions() {
    const { data, error } = await supabase
      .from("registrations")
      .select("*")
      .order("submitted_at", { ascending: false });

    if (error) throw error;
    return (data as RegistrationRow[]).map(mapRegistration);
  },

  async deleteSubmission(id: string) {
    const { error } = await supabase.from("registrations").delete().eq("id", id);
    if (error) throw error;
  },
};
