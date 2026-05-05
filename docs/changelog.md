# Changelog

## v0.2.1 — Direction-aware reorder timing (2026-05-05)

### What changed

The deck-shuffle reorder now uses different durations depending on direction. Opening (any → contact-as-hero) animates at 850ms wrapper / 450ms cross-fade. Closing (back to default) takes 1100ms / 650ms — about 30% longer. Without the asymmetry the close read as a flicker because there's no incoming hero card for the eye to track.

### Why

After v0.2.0, Rijad noted the open animation looked good but the close was too fast to follow. Symmetric timing meant the return felt abrupt — psychologically there's nothing for the eye to lock onto on the way back. Slower close + slightly slower open both reads as deliberate.

### Key decisions

- **CSS custom properties for the timing**, lifted via inheritance when a `.folder-reorder-backward` modifier class is on the wrapper. The class is added by `FolderCard` based on `reorderDirection` from `FolderStack`'s context.
- **Fallback in `var()` rather than declaring the variable on the leaf element.** `var(--folder-fade-duration, 450ms)` lets a parent's `.folder-reorder-backward` value cascade in; declaring `--folder-fade-duration: 450ms` directly on `.folder-layer-fade` would shadow the parent and break the override.
- **Internal Escape + click-outside listeners now route through `setHeroId`** (was: raw `setHeroIdState`), which is what flips `reorderDirection` to `"backward"`. Without this routing, the close kept the forward timing.

### What's next

- Continue iterating on the rest of the home page UX.

## v0.2.0 — Deck-shuffle reorder + functional contact (2026-05-05)

### What changed

The folder stack's primary interaction pivoted from drawer-expand (clicking contact made it tall while the others collapsed to short strips) to a deck-shuffle reorder: clicking the contact card slides every card to a new position so contact ends up at the front-most "hero" slot, with `[contact, blog, about, projects]` becoming `[blog, about, projects, contact]`. The hero slot now has card-specific content — projects shows its tagline + the new "Currently building [X]" wordmark, contact shows a working form (Resend Server Action with a graceful console-log fallback when no API key is set) plus methods (Email / GitHub / LinkedIn). The wordmark moved out of the projects-only `isLast` branding block into a reusable `HeroBranding` component that rides with whichever card is currently hero. The `/contact` route was deleted; any "Contact me" link points to `/?contact=open` and the home page auto-opens contact in the hero slot. Hover-to-close is gone (felt janky during a reorder); revert is via click-outside, Escape, send-success (1.6s), or navigating to a different card. CLAUDE.md was corrected from "Pages Router" to App Router (the project was already there). All folder-stack motion now lives in `lib/animations/animations.css` instead of inline styles or scattered globals — `.folder-card-enter`, `.folder-reorder-transition`, `.folder-layer-fade`, `.folder-card-body::after` cross-fade, plus the reduced-motion override.

### Why

The drawer-expand model never produced the "stack of papers" overlap Rijad was after, even after several attempts (taller strips, bigger overlap, heavier shadows, flat-bottom strips). The math worked — strips overlapped by 148px geometrically — but visually the next strip's opaque body just covered the previous, reading as adjacent rectangles meeting at a hard line. Reorder sidesteps the problem entirely: every card always uses the default peek-stack height, the "stacked papers" feel comes from the same visual that already sells the home view. The `/contact` deletion + URL redirect is the tidy version of "every door leads to the same room" — there's no separate contact page to maintain. The animation consolidation enforces the project's "build by hand" philosophy: motion should live in the lib, not as one-off inline styles.

### Key decisions

- **Full deck shift, not a contact↔projects swap.** Rijad chose this from a side-by-side preview. Looks more like a deliberate shuffle than two cards trading places. Implemented via a `getDisplayIndex(cardId, defaultIndex)` shift formula in `FolderStack`.
- **Strip mode and the four-branch layout deleted.** One layout — peek-stack — used for every card in every state. `FOLDER_LAYOUT.stripH` and `stripPeekGap` are gone. State just changes `displayIndex`; CSS transitions on `top` + `height` do the rest.
- **Resend over SMTP/Postgres for the form.** Cleanest professional default for Next.js. Falls back to a console-log when `RESEND_API_KEY` is missing so dev works without sign-up. `.env.example` documents the three vars (`RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `CONTACT_TO_EMAIL`).
- **Hand-rolled validation.** `lib/validation/contact.ts` returns the `ValidationResult<T>` pattern from CLAUDE.md. No Zod.
- **Server Action over API route.** `app/actions/contact.ts` has `"use server"` + `"server-only"`. The earlier stub `app/api/contact/route.ts` was deleted.
- **Tabs anchored 4rem from the right edge** (was 1.5rem). Tabs now read as part of the folder body rather than floating on the edge.
- **Animation timing pushed to ease-out-expo at 750ms.** Slower + more dramatic deceleration than the previous `cubic-bezier(0.22, 1, 0.36, 1)` at 600ms — reads as deliberate, not snappy.
- **Animations consolidated into `lib/animations/animations.css` §8.** Rijad's call after spotting that the folder-card animations had been written inline / in `globals.css`. The library is now the single source of truth for motion.

### Architecture notes

- `components/navigation/FolderStack.tsx` — state holder. Holds `heroId`, exposes `setHeroId`, `registerCard`, `getDisplayIndex` via `useFolderHero()`. Click-outside listener uses a `[data-hero-card="<id>"]` attribute the active card writes to its wrapper.
- `components/navigation/FolderCard.tsx` — one layout, two content layers (peek + hero) cross-faded. Tab is absolutely positioned at `top: -tabH` so it sticks above the wrapper. `heroToggleId` is the prop for cards that toggle into the hero slot on click; everything else uses `<Link>` navigation.
- `components/sections/HeroBranding.tsx` — extracted wordmark (status pulse + name + role).
- `components/sections/ContactPanel.tsx` — methods grid + form, react-hook-form, calls the `sendContactMessage` Server Action.
- `app/actions/contact.ts` — Resend integration with the dev-fallback path.
- `app/page.tsx` — composes `ProjectsHero` and `ContactHero` from those parts and feeds them to `FolderCard` as `heroContent`.
- `lib/animations/animations.css` §8 — folder-card motion (`.folder-card-enter`, `.folder-reorder-transition`, `.folder-layer-fade`, `.folder-card-body::after`), reduced-motion override included.

### What's next

- Drop a real `RESEND_API_KEY` into `.env.local` so the form actually delivers.
- Optional: when contact is the hero, also render `HeroBranding` underneath the form (currently only projects's hero composition includes it).
- First production deploy → bump to `v1.0.0`.

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
