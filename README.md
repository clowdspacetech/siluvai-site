# PROJECT_NAME

Siluvai Media


## Table of Contents

- [About](#about)
- [Demo and Screenshots](#demo-and-screenshots)
- [Quick Start](#quick-start)
- [Environment Variables](#environment-variables)
- [Scripts](#scripts)
- [Architecture Overview](#architecture-overview)
- [Key Concepts and Workflows](#key-concepts-and-workflows)
- [Component and Code Examples](#component-and-code-examples)
- [Testing and Quality](#testing-and-quality)
- [Linting and Formatting](#linting-and-formatting)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [Security](#security)
- [Changelog and Releases](#changelog-and-releases)
- [Acknowledgements and Credits](#acknowledgements-and-credits)

## About

PROJECT_DESC It is built for churches, charities, and media teams who need a
cinematic public site plus a simple content workflow. Visitors can watch
broadcasts, explore events, register, and donate. Editors manage videos, copy,
events, and payment details from a protected admin dashboard.

**Key features**

- **Video hub** — YouTube-backed broadcasts with thumbnails, categories, and a
  snap carousel for extra cards.
- **Admin editor** — CMS-style dashboard for site content, videos, events,
  registrations, and donation settings.
- **Local JSON fallback** — `.data/app-data.json` acts as a file-backed store
  when Supabase is not configured.
- **Responsive UI** — Mobile-first layouts with Tailwind and a dark/light theme.
- **Accessibility** — Semantic landmarks, focus rings, reduced-motion support,
  and labelled form controls.

## Demo and Screenshots

- **Live demo:** [https://your-demo-url.example](https://your-demo-url.example)

| Caption | Recommended size | Placeholder |
| --- | --- | --- |
| Home hero and video navbar | 1440 × 900 | `docs/screenshots/01-hero.png` |
| Media hub carousel | 1440 × 900 | `docs/screenshots/02-media-hub.png` |
| Admin dashboard editor | 1440 × 900 | `docs/screenshots/03-admin.png` |

Add images under `docs/screenshots/` and update the paths above. Keep file
sizes small (WebP or compressed PNG) so the README stays fast to load.

## Quick Start

### Prerequisites

- **Node.js** `22.15.21` (LTS recommended)
- **npm** (or Yarn / pnpm if you prefer)
- A modern browser for local preview
- Optional: a Supabase project if you want a remote data backend

### Install and run

```bash
git clone https://github.com/clowdspacetech/siluvai-site
cd PROJECT_NAME
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The admin UI is at
`/admin`.

**Note:** This project targets **Node `22.15.21`** and **Next.js
`15.3.3`**. If your local versions differ, use `nvm`, `fnm`, or Volta to
align before installing.

## Environment Variables

Create `.env.local` in the project root. Never commit secrets.

| Variable | Description | Required |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Public Supabase project URL | Optional* |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public anon key for client access | Optional* |
| `SUPABASE_URL` | Server-side Supabase URL | Optional* |
| `SUPABASE_ANON_KEY` | Server-side anon key | Optional* |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only privileged key | Optional* |
| `DATABASE_URL` | Postgres connection string (hosted DB) | Optional |

\*If Supabase vars are missing, the app uses the **local JSON repository** and
`.data/app-data.json`.

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
DATABASE_URL=postgres://user:pass@host:5432/db
```

**Important:** Restart `npm run dev` after changing environment variables.

## Scripts

Current `package.json` scripts plus recommended quality scripts you should add
as the project grows:

| Script | Command | Purpose |
| --- | --- | --- |
| `dev` | `npm run dev` | Start the Next.js development server |
| `build` | `npm run build` | Create an optimized production build |
| `start` | `npm run start` | Serve the production build locally |
| `lint` | `npm run lint` | Run ESLint via `next lint` |
| `format` | `npm run format` | Format the tree with Prettier *(add script)* |
| `test` | `npm test` | Run unit tests *(add script)* |
| `typecheck` | `npm run typecheck` | Run `tsc --noEmit` *(add script)* |
| `preview` | `npm run preview` | Preview a production build *(add script)* |

Suggested additions:

```json
{
  "scripts": {
    "format": "prettier --write .",
    "test": "jest",
    "typecheck": "tsc --noEmit",
    "preview": "next build && next start"
  }
}
```

## Architecture Overview

```text
PROJECT_NAME/
├── src/
│   ├── app/                 # Next.js App Router pages, layout, API routes
│   │   ├── page.tsx         # Public landing page
│   │   ├── admin/page.tsx   # Admin login + CMS
│   │   ├── actions/data.ts  # Server actions for CRUD
│   │   └── api/data/route.ts
│   ├── components/          # UI: Hero, VideoHub, Events, Donate, admin
│   ├── lib/
│   │   ├── data-context.tsx # Client data provider + YouTube helpers
│   │   ├── data-store.ts    # Defaults, merge, clipboard, dates
│   │   ├── theme-context.tsx
│   │   └── db/              # local-repository | supabase-repository
│   └── public/              # Static assets (videos, images, favicon)
├── .data/app-data.json      # Local file database (generated at runtime)
├── scripts/                 # Optional ops / seed scripts
└── README.md
```

### Local file database

`.data/app-data.json` is the **local file DB**. On first read, the local
repository creates the file from `defaultAppData` in `src/lib/data-store.ts`.
Later reads merge stored JSON with defaults so missing keys (pillars, trustees,
donation settings, events) do not crash the UI.

If Supabase env vars are present, `getRepository()` prefers the remote adapter.
Otherwise it falls back to the JSON file automatically.

## Key Concepts and Workflows

### YouTube thumbnails

Broadcast cards do not store thumbnail files. The hub extracts a video ID from
the watch or embed URL, then requests YouTube’s `maxresdefault.jpg`. If that
image is a tiny placeholder, the UI retries `hqdefault.jpg`. A local fallback
image is used when no ID is found.

### Admin writes to `.data/app-data.json`

1. Sign in at `/admin`.
2. Update videos, about copy, events, or donation fields.
3. Server actions call `localRepository` (or Supabase).
4. The local adapter writes the full `AppData` object to
   `.data/app-data.json`.
5. The public site refreshes via `DataProvider`.

**Do not commit secrets** inside this file. Treat it as environment-specific
content. Add `.data/` to `.gitignore` if it should stay local only.

### Theme boot script

`src/app/layout.tsx` injects a small `beforeInteractive` script that reads
`localStorage` key `siluvai-theme` and sets `document.documentElement`
`data-theme` to `dark` or `light`. That avoids a flash of the wrong theme
before React hydrates. `ThemeProvider` then keeps state, CSS, and the header
toggle in sync.

### Motion and Framer Motion

- `FadeInUp`, `StaggerContainer`, and `StaggerItem` reveal sections on scroll.
- Pillar icons use looping micro-animations (pulse, bob, rotate, sway).
- Event cards use `layout` height animation when expanded.
- All motion respects `prefers-reduced-motion`.

## Component and Code Examples

### `youtubeThumbnail` helper

```ts
export function youtubeThumbnail(url: string) {
  const id = extractYouTubeId(url);
  return id
    ? `https://img.youtube.com/vi/${id}/maxresdefault.jpg`
    : "/images/video-fallback.jpg";
}
```

### VideoHub usage

```tsx
import VideoHub from "@/components/VideoHub";

export default function HomeMedia() {
  return (
    <main>
      <VideoHub />
    </main>
  );
}
```

`VideoHub` reads `data.videos` from `useAppData()`, renders equal-width cards,
and pages extra broadcasts with arrows and dots.

### `CarouselIndicator` with Framer Motion

```tsx
import { motion } from "framer-motion";

type CarouselIndicatorProps = {
  count: number;
  active: number;
  onSelect: (index: number) => void;
};

export function CarouselIndicator({
  count,
  active,
  onSelect,
}: CarouselIndicatorProps) {
  return (
    <div className="flex items-center gap-2" role="tablist">
      {Array.from({ length: count }, (_, index) => (
        <button
          key={index}
          type="button"
          role="tab"
          aria-selected={active === index}
          onClick={() => onSelect(index)}
        >
          <motion.span
            layout
            className="block h-2.5 rounded-full bg-amber-400"
            animate={{ width: active === index ? 32 : 10, opacity: active === index ? 1 : 0.4 }}
            transition={{ type: "spring", stiffness: 380, damping: 28 }}
          />
        </button>
      ))}
    </div>
  );
}
```

## Testing and Quality

Recommended stack:

- **Jest** + **React Testing Library** for unit and component tests
- **Playwright** for end-to-end flows (home, register, admin login)
- **TypeScript** (`tsc --noEmit`) on every PR

```bash
npm test
npx playwright test
npm run typecheck
```

Sample unit test:

```ts
import { extractYouTubeId } from "@/lib/data-context";

describe("extractYouTubeId", () => {
  it("parses a standard watch URL", () => {
    expect(
      extractYouTubeId("https://www.youtube.com/watch?v=S6Z_x4rGyA4")
    ).toBe("S6Z_x4rGyA4");
  });
});
```

Aim for meaningful coverage on helpers (`extractYouTubeId`, `formatDate`,
`resolveEventOption`) before expanding to full page snapshots.

## Linting and Formatting

This repo uses **ESLint** with `eslint-config-next`. Add **Prettier** and
**Husky** so style stays consistent across contributors.

```bash
npm run lint
npm run format
```

Example `.eslintrc.json`:

```json
{
  "extends": ["next/core-web-vitals", "prettier"]
}
```

Example Husky pre-commit hook (`.husky/pre-commit`):

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx lint-staged
```

`lint-staged` can run `eslint --fix` and `prettier --write` on staged files
only.

## Deployment

### Vercel

1. Import `https://github.com/clowdspacetech/siluvai-site` into [Vercel](https://vercel.com).
2. Set the production branch to **MAIN_BRANCH**.
3. Add the same environment variables you use locally.
4. Deploy. Vercel runs `next build` and hosts the App Router output.

Confirm `img.youtube.com` and `images.unsplash.com` remain in
`next.config` `images.remotePatterns` so production thumbnails load.

### Docker (generic)

```dockerfile
FROM node:18-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./
EXPOSE 3000
CMD ["npm", "run", "start"]
```

**Production notes**

- Prefer Supabase (or another hosted store) over a writable `.data` folder on
  ephemeral serverless disks.
- Keep `SUPABASE_SERVICE_ROLE_KEY` server-only. Never prefix it with
  `NEXT_PUBLIC_`.
- Rotate admin credentials before going live.

## Troubleshooting

| Issue | Likely cause | Fix |
| --- | --- | --- |
| Favicon looks stale | Browser cache | Hard refresh, or bump `favicon.svg?v=2` |
| CSS module type errors | Missing ambient types | Ensure `next-env.d.ts` exists; restart TS server |
| Stale `.data/app-data.json` | Old merge or manual edits | Delete `.data/app-data.json` and restart `npm run dev` |
| Broken YouTube images | Host not allowed | Add `img.youtube.com` to `images.remotePatterns` |

Clear caches and restart:

```bash
rm -rf .next
npm run dev
```

On Windows PowerShell:

```powershell
Remove-Item -Recurse -Force .next
npm run dev
```

## Contributing

We welcome issues and pull requests. Please read [CONTRIBUTING.md](./CONTRIBUTING.md)
before you start.

**Branching model**

- `MAIN_BRANCH` is protected and always deployable.
- Create feature branches: `feat/video-carousel`, `fix/select-placeholder`.

**Commit messages** follow [Conventional Commits](https://www.conventionalcommits.org/):

```text
feat(videos): add carousel dots for fourth broadcast
fix(forms): restore select option contrast in light theme
docs(readme): add local JSON fallback notes
```

**PR checklist**

- [ ] Description explains *why*, not only *what*
- [ ] `npm run lint` and `npm run typecheck` pass
- [ ] Tests added or updated when behaviour changes
- [ ] Screenshots for UI changes
- [ ] No secrets committed (`.env.local`, service keys)

**Code review** should check accessibility, theme tokens (`theme === 'dark'`),
and that admin writes still merge safely with `defaultAppData`.

## Security

If you find a vulnerability, **do not open a public issue**.

Email **clowdspace98@gmail.com** with:

- A short description and impact
- Steps to reproduce
- Affected version or commit on `MAIN_BRANCH`

We aim to acknowledge reports within **two business days** and will coordinate
a fix before any disclosure.

## Changelog and Releases

Keep a [CHANGELOG.md](./CHANGELOG.md) and follow **semantic versioning**
(`MAJOR.MINOR.PATCH`).

Example release notes template:

```markdown
## [1.2.0] - YYYY-MM-DD

### Added
- Event Join control prefills the registration select.

### Changed
- Media hub uses a uniform snap carousel.

### Fixed
- Select options were unreadable in some browsers.
```

Tag releases from `MAIN_BRANCH` after changelog updates.

## Acknowledgements and Credits

- [Next.js](https://nextjs.org/) — App Router and React server components
- [Tailwind CSS](https://tailwindcss.com/) — utility-first styling
- [Framer Motion](https://www.framer.com/motion/) — scroll and micro-animations
- [Supabase](https://supabase.com/) — optional hosted data backend
- [Lucide](https://lucide.dev/) — icons
- Contributors and the faith communities who inspire PROJECT_NAME
