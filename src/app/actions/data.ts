"use server";

import { getRepository } from "@/lib/db";
import type { DonationSettings, RegistrationSubmission, SiteContent, Video } from "@/lib/types";

export async function fetchAppData() {
  const repo = getRepository();
  return repo.getAppData();
}

export async function addVideoAction(video: Omit<Video, "id">) {
  const repo = getRepository();
  return repo.addVideo(video);
}

export async function updateSiteContentAction(content: Partial<SiteContent>) {
  const repo = getRepository();
  return repo.updateSiteContent(content);
}

export async function addRegistrationAction(
  submission: Omit<RegistrationSubmission, "id" | "submittedAt">
) {
  const repo = getRepository();
  return repo.addRegistration(submission);
}

export async function updateDonationSettingsAction(settings: Partial<DonationSettings>) {
  const repo = getRepository();
  return repo.updateDonationSettings(settings);
}
