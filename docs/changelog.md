# Changelog

## v0.1.0 — Portfolio rebuild & folder-stack homepage (2026-04-22)

### What changed

Full rebuild of the portfolio from Next.js 14 Pages Router → App Router with Tailwind v4, a custom design system, and an in-house animation library. The old chrome (navbar + loader overlay) is gone on the homepage: the homepage is now a full-screen stack of four overlapping folder cards (Contact, About, Blog, Projects) that peek out in rest state and expand on hover to preview their contents. Inner pages (`/about`, `/blog`, `/projects`, `/contact`) live in a separate route group with their own header/footer shell. The hero folder at the bottom hosts the site branding (name, role, socials) directly inside the card body.

### Why

The Pages Router scaffold was the "hello world" of Rijad's portfolio — it did the job but the structure, animation system, and visual identity were generic. The rebuild gives the site a distinct metaphor (folders = navigation), a reusable animation library that can travel to other projects in the monorepo, and an App Router foundation ready for a Notion-backed CMS.

### Key decisions

- **Route groups `(site)` + `(pages)`** — Rijad's call: the homepage needs zero chrome for the folder stack to work, while inner pages need conventional header/footer. Splitting into two route groups with distinct `layout.tsx` files keeps both clean without per-page conditionals.
- **Folder stack over a traditional hero** — the folders ARE the navigation. No nav bar needed on the homepage. Order chosen for reveal pacing: Contact → About → Blog → Projects (hero).
- **Animation system as a local library, not a dependency** — `lib/animations/` ships CSS primitives (`hover-lift`, `hover-scale`, `hover-tilt`, `hover-spotlight`, `parallax-layer`, `fade-up`, etc.), a `useInView` observer, and a `useCursorTracker` hook that writes CSS vars (no React re-renders). Designed to be copy-pasted into sibling projects (Business by Bega, ShelfSync).
- **Reduced-motion respected at the library level, overridden here** — Rijad runs macOS Reduce Motion full-time but wants site animations regardless. The `prefers-reduced-motion` guards were removed from this project's CSS. The opt-out is documented in `animations.css` §7 for future reuse.
- **Hero gets the same lift as the other cards, nothing fancier** — we prototyped magnetic tilt, cursor spotlight, and parallax name layers on the hero. Rijad reviewed all three and cut them: the unified `hover-lift` feels right, anything more clutters the minimalism. The primitives remain in the library for future projects.
- **Teasers on hover, not in rest state** — each non-hero folder reveals a small factual teaser when lifted (socials on Contact, "Currently: TypeScript · React · Next.js" on About, recent post titles+dates on Blog). Keeps the rest-state visual quiet; rewards hovering.
- **Folder tab glued to the body** — both the tab strip and the card body live inside the same `.hover-target.hover-lift-xl` wrapper so they lift together. Fixed a bug where the tab stayed put while the body lifted.
- **Colorless atmosphere at rest** — the homepage background has no colored radials until a folder is hovered. Glow is driven by a context broadcast from the hovered `FolderCard` into `FolderStack`, which paints a radial matching the folder's tone.

### Architecture notes

- `app/(site)/` — bare-chrome route group hosting the homepage only.
- `app/(pages)/` — chrome-wrapped route group hosting `/about`, `/blog`, `/projects`, `/contact` and their detail routes. Has its own `layout.tsx` with `SiteHeader` + `SiteFooter`.
- `lib/animations/` — CSS animation library (`animations.css`) + React helpers (`use-in-view.ts`, `use-cursor-tracker.ts`, `smooth-scroll.ts`) exported via `index.ts`. Intended to be portable.
- `lib/data/` — hardcoded project + blog-post data for now; designed to be swapped for Notion-backed repositories later.
- `components/navigation/` — `FolderStack` (context + glow broadcast), `FolderCard` (one folder), `HomeBranding` (hero card contents).
- `components/ui/` — design-system primitives (`Container`, `Section`, `Card`, `Badge`, `Button`, `SectionHeading`, plus their `Animated*` composed variants).
- Tailwind v4 `@theme` block in `app/globals.css` defines the full palette (evergreen, dusty-lavender, copper, molten-lava) and the semantic `--color-text`, `--color-text-muted` vars used throughout.

### What's next

- Wire `lib/data/` to Notion via the Notion MCP (repositories for projects + blog posts).
- First production deploy → bump to `v1.0.0`.
