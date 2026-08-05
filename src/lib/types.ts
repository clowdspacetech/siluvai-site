export type VideoCategory = "Leadership" | "Sermon" | "Workshop" | "Broadcast";

export interface Video {
  id: string;
  title: string;
  publishDate: string;
  category: VideoCategory;
  url: string;
  thumbnail?: string;
}

export interface Trustee {
  id: string;
  name: string;
  role: string;
  quote: string;
  image?: string;
}

export interface Pillar {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface SiteContent {
  heroHeadline: string;
  heroSubheadline: string;
  aboutIntro: string;
  pillars: Pillar[];
  trustees: Trustee[];
}

export interface RegistrationSubmission {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  selectedEvent: string;
  submittedAt: string;
}

export interface DonationSettings {
  bankName: string;
  accountName: string;
  sortCode: string;
  accountNumber: string;
  stripePaymentUrl: string;
  paypalButtonId: string;
  cardPaymentUrl?: string;
}

export interface AppData {
  videos: Video[];
  siteContent: SiteContent;
  registrations: RegistrationSubmission[];
  donationSettings: DonationSettings;
}

export const EVENT_OPTIONS = [
  "Leadership Training Workshop",
  "Community Outreach Day",
  "Media Production Masterclass",
  "Annual Charity Gala",
  "Youth Fellowship Evening",
] as const;

export type EventOption = (typeof EVENT_OPTIONS)[number];
