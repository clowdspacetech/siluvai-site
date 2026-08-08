import type { AppData } from "./types";

export const STORAGE_KEY = "siluvai-app-data";
export const AUTH_KEY = "siluvai-admin-auth";

/** Simulated admin credentials — replace with env vars in production */
export const ADMIN_USERNAME = "admin";
export const ADMIN_PASSWORD = "siluvai2024";

export const defaultAppData: AppData = {
  videos: [
    {
      id: "vid-1",
      title: "Genesis Part-1",
      publishDate: "2024-03-15",
      category: "Sermon",
      url: "https://www.youtube.com/embed/S6Z_x4rGyA4?si=li9Os1fJ8AU2v0qZ",
    },
    {
      id: "vid-2",
      title: "Word of Power Ep:14",
      publishDate: "2024-06-22",
      category: "Leadership",
      url: "https://www.youtube.com/embed/BlJ6a0XkwoA?si=hmSF41Tc12NySQ1O",
    },
    {
      id: "vid-3",
      title: "Guest Of The Week",
      publishDate: "2024-09-08",
      category: "Workshop",
      url: "https://www.youtube.com/embed/SwWwJCZBJY0?si=4CJ4M0n5_DJLIATU",
    },
    {
      id: "vid-4",
      title: "Ascertaining your Spiritual Gift",
      publishDate: "2026-04-24",
      category: "Sermon",
      url: "https://youtu.be/duolbq_7ouI?si=EaE0zcPnqYq_l_yW",
    },
  ],
  siteContent: {
    heroHeadline: "Carrying The Burden Of Others Through Faith & Media",
    heroSubheadline:
      "Propagating messages of love, salvation, and redemption through Christian broadcasting, digital media production, and leadership training.",
    aboutIntro:
      "Siluvai Media is a UK registered charity dedicated to serving communities through faith-inspired media, education, and outreach. We combine digital broadcasting with hands-on community support to spread messages of hope, healing, and transformation.",
    pillars: [
      {
        id: "pillar-health",
        title: "Health",
        description:
          "Promoting physical and spiritual wellbeing through community health initiatives and faith-centred wellness programmes.",
        icon: "heart",
      },
      {
        id: "pillar-education",
        title: "Education",
        description:
          "Empowering individuals through leadership training, media literacy workshops, and educational broadcasting.",
        icon: "book-open",
      },
      {
        id: "pillar-culture",
        title: "Culture",
        description:
          "Celebrating diverse heritage while fostering unity through culturally rich media productions and community events.",
        icon: "globe",
      },
      {
        id: "pillar-humanity",
        title: "Humanity",
        description:
          "Serving those in need with compassion — from digital media outreach to on-the-ground community support programmes.",
        icon: "users",
      },
    ],
    trustees: [
      {
        id: "trustee-1",
        name: "Kennedy Sabapathy",
        role: "Leading British Entrepreneur",
        quote: "Let's strive for excellence in all we do.",
        image: "/images/kennedy.jpg",
      },
      {
        id: "trustee-2",
        name: "Udhaya Shanker",
        role: "Senior Engineer",
        quote: "Great achievement is usually born of great sacrifice.",
        image: "/images/udhaya.jpg",
      },
    ],
  },
  registrations: [],
  events: [],
  donationSettings: {
    bankName: "Barclays Bank UK",
    accountName: "Siluvai Media",
    sortCode: "20-00-00",
    accountNumber: "12345678",
    stripePaymentUrl: "",
    paypalButtonId: "",
  },
};

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

export function loadAppData(): AppData {
  if (!isBrowser()) return defaultAppData;

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return defaultAppData;
    const parsed = JSON.parse(stored) as AppData;
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
      events: parsed.events ?? defaultAppData.events,
    };
  } catch {
    return defaultAppData;
  }
}

export function saveAppData(data: AppData): void {
  if (!isBrowser()) return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

export function resolvePaymentUrl(settings: {
  stripePaymentUrl: string;
  paypalButtonId: string;
}): string | null {
  const stripe = settings.stripePaymentUrl?.trim();
  if (stripe) return stripe;

  const paypalId = settings.paypalButtonId?.trim();
  if (paypalId) {
    return `https://www.paypal.com/donate/?hosted_button_id=${encodeURIComponent(paypalId)}`;
  }

  return null;
}

export const FALLBACK_CHECKOUT_URL = "https://stripe.com";
