# Upgraded Project Specification: Interactive Faith & Media Platform

Modify and expand our existing Next.js and Tailwind CSS setup to match a ultra-modern, cinematic interactive experience inspired by premium agency designs, using Framer Motion for scroll-driven animations.

## 1. Cinematic Video Hero Banner (Inspiration: OPEN Health)
- Replace the static background image in the Hero section with a silent, looping background video asset.
- Implement a dark overlay (`bg-slate-950/50`) on top of the video container to guarantee high contrast and crisp readability for the gold and white typography.
- Use a high-quality, free cinemagraph/loop placeholder URL from Mixkit or Pexels (e.g., streaming light beams, cinematic nature, or abstract bokeh lights).

## 2. Scroll-Driven Animations & Typography (Framer Motion)
- Install `framer-motion` for complex animations.
- Every major header element and content card must smoothly slide and fade up (`initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}`) as the user scrolls down the page.
- Add an interactive visual anchor: When users hover over any grid card (YouTube videos, Trustee profiles), implement a smooth subtle scale up (`hover:scale-[1.02]`) and an elegant shadow deepening transition.

## 3. Database Layer Choice: Supabase vs Local
- Implement a clean server-action or API route configuration layer that reads/writes data.
- Setup a lightweight, local client state layout first, but format the code structures cleanly so they can instantly plug into a free cloud **Supabase** backend by reading environment variables (`process.env.SUPABASE_URL`).

## 4. Secure Admin Dashboard & Payment Config Panel (`/admin`)
- Expand the `/admin` path to include a sidebar with three functional tabs:
  1. **Content Control:** Forms to add new YouTube video links (Title, Category, URL) and save them to our state, updating the live Video Hub layout instantly.
  2. **Submissions Table:** A clean, searchable data table displaying all user names, emails, and choices from the Event Registration Form.
  3. **Payment Configuration:** A simple admin field where the church leadership can paste their live "Stripe Payment Link URL" or "PayPal Button ID". Saving this form must globally update all public credit card buttons.

## 5. Fixing the Debit/Credit Card Button Functionality
- Update the public "Pay by Debit/Credit Card" button component.
- Instead of doing nothing, make the button pull the Stripe/PayPal URL configured in your admin panel. If no URL is saved yet, make it safely open a simulated, beautiful overlay modal that says: *"Redirecting to our secure transaction gateway..."* before opening a placeholder checkout page (`https://stripe.com`) in a secure new browser tab.
