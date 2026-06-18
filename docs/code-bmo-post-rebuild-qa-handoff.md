# Code BMO — Post-Rebuild QA Cleanup Handoff

**Purpose:** Hand this work off to a fresh chat (possibly on another machine). Self-contained — assumes no access to the originating conversation.
**Repo:** `/Users/rijad/Work/personal-projects/personal-website`
**Author of work:** Code BMO (Claude Code, Opus 4.8) for Rijad.
**As of:** 2026-06-18.

---

## TL;DR — current state

- Branch **`chore/post-rebuild-qa`** is cut from `feat/portfolio_rebuild`, holds **4 commits**, is **pushed** and in sync with `origin`. Working tree clean. `npm run build` clean.
- All six QA tickets (Notion Project Tracker, project "Personal Website") are **Done (Deployed)**: PRJ-47, 48, 50, 51, 53, 54.
- Verified locally (Playwright + Claude-in-Chrome) **and** on the Vercel **preview deployment** (build READY, morph clean, no `InvalidStateError`).
- **One open item:** PR #5 is **not opened yet** — see "Open item" below. It must target base `feat/portfolio_rebuild` (NOT `main`).

---

## The branch & commits

```
feat/portfolio_rebuild   (base; this is PR #4 → main, ~22 commits, do NOT touch)
  └── chore/post-rebuild-qa   (this work; PR #5 → feat/portfolio_rebuild)
        f93c60d  chore: meet 44x44 touch target + add active-tab focus ring on inner-page tabs   (PRJ-47 + PRJ-48)
        c231dbb  fix: make Projects homepage card hero clickable                                   (PRJ-53)
        0170a3d  chore: document Notion CMS env vars in .env.example                               (PRJ-50)
        d8a1684  fix: correct ShelfSync description on /now                                         (PRJ-54)  ← tip
```

Commit-message convention for THIS branch follows the QA handoff (`chore:` / `fix:` prefixes), which intentionally overrides the repo's usual no-prefix rule. Commits carry `Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>`.

---

## What each ticket changed (and the non-obvious why)

### PRJ-47 + PRJ-48 — `lib/animations/animations.css` (combined commit)
- **Touch targets (PRJ-47):** raised the visible vertical padding on `.folder-tab` (`8px 18px` → `15px 18px`; active `padding-top/bottom` `12px` → `17px`) and bumped mobile `.mini-body` `min-height` `38px` → `44px`. Result: desktop tabs 49px resting / 53px active; mobile dock 50px hit area, holds down to 360px. Padding was bumped on the interactive element itself (not a wrapper) so the hit area equals the visible tab — no invisible padding tricks. Inner pages scroll by design (`.folder-shell` / `.folder-shell-body` are `min-height:100vh`, overflow visible), so the taller strip clips nothing.
- **Focus ring (PRJ-48):** the active tab had no focus indicator and the inactive one only a hover-style tint. Added a real, consistent ring: `.folder-tab:focus-visible { outline: 2px solid var(--color-text); outline-offset: 2px; }` plus `.folder-tab[data-active="true"]:focus-visible { outline-offset: 4px; }` (the wider offset clears the lift + accent fill instead of sitting inside it). Mirrored onto the mobile dock via `.mobile-folder:focus-visible .mini-body`. `var(--color-text)` is theme-adaptive per page, so the ring stays high-contrast across all inner-page tones.

### PRJ-53 — `components/navigation/FolderCard.tsx` (homepage-locked) ⚠
- **Ground-truth correction:** the ticket text was stale. The homepage cards (`app/page.tsx:27-59`) are **Contact** (toggle, `heroToggleId:"contact"`), **Blog**, **About**, **Projects** — all nav except Contact. There is **no "Now" card** on the homepage (Now is only an inner page). The toggle card is **Contact, not About**. Only **Projects** was actually broken (it's the default front card and renders `ProjectsHero` with no link); Blog/About already navigate via their always-visible peek `<Link>`. Rijad's decision: **fix Projects only.**
- **Change:** in `renderHeroLayer`, when `!heroToggleId && heroContent`, the hero layer is now wrapped in a `next-view-transitions` `<Link href={href}>` (with `aria-label`, `aria-hidden`, and `tabIndex` gated on visibility) instead of a plain `<div>`. This affects only Projects. Contact keeps its plain-div hero (it holds the contact form/links — must not be wrapped). `HeroLead`/`HeroBranding` are link-free, so no nested-interactive issue. The peek `<Link>` is untouched (still the nav surface when Projects sits in a peek slot). `viewTransitionName` stays on `.folder-card-body` so the home↔inner morph pairing is unchanged.

### PRJ-50 — `.env.example`
- Added the Notion CMS vars the data layer reads, with placeholders + one-line comments matching the existing Resend entries: `NOTION_TOKEN` (`lib/notion/shared.ts`), `NOTION_DB_PROJECTS` (`lib/notion/projects.ts`), `NOTION_DB_BLOGPOSTS` (`lib/notion/blog-posts.ts`). Noted that `/projects` and `/blog` fall back to hardcoded content when unset, so a fresh clone still builds.

### PRJ-54 — `app/(pages)/now/page.tsx`
- **Ground-truth correction:** the `/now` copy was factually wrong vs the ShelfSync Notion hub (`172bf806-d35d-8044-96cf-e6f98ca75466`) — it called ShelfSync a "book-tracking platform" in "soft launch" getting "most of my hours." ShelfSync is actually a **home/shelf-inventory app** (Go + Flutter), still in planning, on hold until the site ships. Rijad's decision: **keep + rewrite accurately.**
- **New copy:** "Next up is **ShelfSync** — a home-inventory app for keeping track of what's on your shelves, in the pantry, and in storage. Still on paper: the stack is picked (Go and Flutter) and a v1 scope is drawn up. On hold until this site ships, then it gets real hours." (Used `{" "}` after `</strong>` because JSX strips the space before the em-dash otherwise.)

### PRJ-51 — verification only (no code change)
- Walked the preview deployment in-browser, triggered the home→/projects morph: **no `InvalidStateError`** and no other site-originated console error. The `0b43e80` hydration fix (`suppressHydrationWarning` on `<html>`) resolved it. Closed as verified-resolved.

---

## Verification performed

- **Local** (`npm run dev` on :3000): full Playwright pass + full Claude-in-Chrome pass. Box-model measured (tabs ≥44px), real keyboard-Tab focus ring confirmed on both states, Projects hero click → `/projects`, Contact toggle intact, every inner page rendered, console clean.
- **Preview deployment** (`dpl_8nwJkMSnuib2GeBc8p1oxFP9Qx6i`, commit `d8a1684`, state **READY**):
  - URL: `https://personal-website-git-chore-post-re-931bc4-rijadrajkics-projects.vercel.app`
  - Build green; morph fires with no `InvalidStateError`; tabs 49/53px; `/now` copy correct.
  - NOTE: the preview is **deployment-protected** (Vercel SSO). Console shows benign `vercel.com/api/jwt` 403, `/login` 401, FedCM, and Vercel's own Sentry 429 — that's the protection layer in front of the preview, **not the app**. Accessing the preview in a non-logged-in browser hits a Vercel login wall; log into Vercel in that browser first (or use the Vercel MCP `get_access_to_vercel_url`).

---

## OPEN ITEM — open PR #5 (needs action)

Not opened by Code BMO because **no GitHub MCP is connected** and the repo's `CLAUDE.md` forbids the `gh` CLI. To finish: either connect a GitHub MCP (`mcp__github__*`) and open it via that, or open it by hand.

- **Create URL:** https://github.com/RijadRajkic/personal-website/pull/new/chore/post-rebuild-qa
- **Base:** `feat/portfolio_rebuild` ← **compare:** `chore/post-rebuild-qa`  (⚠ NOT main — when PR #4 merges, GitHub auto-retargets PR #5 to main)
- **Title:** `Post-rebuild QA: tab hit-targets + focus, Projects card nav, env + /now copy`
- **Body** (written in Rijad's prose-PR style — see PRs #3/#4 for the voice):

```markdown
Stacked on #4 (base feat/portfolio_rebuild) to keep this a small reviewable diff while the rebuild settles. Five fixes from the QA pass, verified on the branch preview.

Inner-page tabs now clear the 44×44 hit target. Bump the visible padding on the tab itself rather than a wrapper, so the tap area is what you actually see — 49px resting, 53px active, mobile dock 50px down to 360px. Inner pages already scroll (min-height:100vh), so the taller strip clips nothing.

Keyboard focus on the tabs was effectively missing — the active tab had no indicator and the inactive one only a hover-style tint. Add a real, consistent outline ring to both states; the active tab's offset goes to 4px so the ring clears the lift + accent fill instead of sitting inside it.

The Projects card's front face was a dead click target — its only Link lived in the hidden, pointer-events-none peek layer. Wrap the non-toggle hero in the next-view-transitions Link so the whole visible face navigates. Contact stays a toggle (keeps its form), Blog/About were already clickable. view-transition-name stays on the card body, so the home↔inner morph pairing is unchanged.

.env.example was missing the Notion CMS vars the data layer reads (NOTION_TOKEN, NOTION_DB_PROJECTS, NOTION_DB_BLOGPOSTS). Add them with placeholders; /projects and /blog fall back to hardcoded content when unset, so a fresh clone still builds.

/now called ShelfSync a book-tracking platform in soft launch; per the Notion hub it's a home-inventory app still in planning. Rewrite to match — on hold until this site ships.

Preview checks: build green, home→inner morph fires with no InvalidStateError, tabs ≥44px, focus ring on both states, /now copy correct.
```

---

## Notion state (Project Tracker — project "Personal Website")

- All six cards set to **Done (Deployed)**: PRJ-47, 48, 50, 51, 53, 54.
- Verification comments posted on **PRJ-51** (verified-resolved, no InvalidStateError) and **PRJ-54** (keep + rewrite decision).
- Data source: `collection://b04321de-453d-4225-b4d0-b56c27d2a554`. Status options: `Backlog | Ready | In Progress | Done (Deployed) | Archived`.

---

## Flagged for a NEW ticket (out of scope here, NOT fixed)

The ShelfSync **project** entry — the `/projects` index card and the `/projects/shelfsync` page — still describes ShelfSync as a "Full-stack book tracking platform … track reading progress … discover new books." Same drift as `/now`, but it lives in the Notion CMS (Projects DB) or the hardcoded fallback in `lib/notion/projects.ts` / `lib/data/projects`. Should be corrected in Notion (live) or the fallback. Recorded in the PRJ-54 comment.

---

## Environment & tooling notes for the next system

- **Package manager: npm** (package-lock.json). The cards say `pnpm build`; the repo is on npm. A **pnpm migration is deferred** per Rijad (would cut node_modules disk; `corepack` is installed). Don't switch unprompted.
- **Build/lint:** `npm run build` (authoritative, runs typecheck). `npm run lint` is **noisy** — ~274 pre-existing eslint errors all come from the gitignored `docs/design-bundles/**` reference `.jsx`; judge new-code lint by scoping eslint to changed files.
- **No GitHub MCP** connected; **`gh` CLI is forbidden** by CLAUDE.md. Remote GitHub ops need `mcp__github__*`.
- **Vercel MCP** (`mcp__plugin_vercel_vercel__*`) requires OAuth (`authenticate`) before deployment tools appear. Team `team_TyCvi39R251ISPmVQhz63sjp`, project `personal-website` = `prj_Lm888DiTLjAhgzScseurGEwCrVgD`.
- **Browser verification:** Rijad prefers **Claude in Chrome** (`mcp__claude-in-chrome__*`) over Playwright (real Chrome surfaces extension/SSO noise Playwright's clean browser hides). Both work. Claude-in-Chrome dropped its connection mid-session once — reconnect via `tabs_context_mcp`.
- **Dev server:** a long-running `next dev` may already be on :3000; a second `next dev` in the same dir refuses to start (Next 16 guard) and exits — just reuse :3000.
- `docs/design-bundles/` and `docs/code-bmo-*.md` (incl. this file) are **gitignored** — local-only, never pushed.

---

## CLAUDE.md guardrails to honor

- Homepage is locked — only PRJ-53's Link-wrap was allowed there, and it must stay pixel/behaviour-identical to `main`.
- Never push/force-push/amend/rebase without explicit instruction; never touch `main` or `feat/portfolio_rebuild` directly; no `--no-verify`.
- BMO = "Code BMO". Short, direct comms. Zero gratuitous code comments. Every visible UI change gets a real-browser pass.
- Master conventions: github.com/rijadrajkic/rijadrajkic/blob/main/CLAUDE.md.

---

## Suggested next steps for the receiving chat

1. Open PR #5 with the title/body above (base `feat/portfolio_rebuild`).
2. After PR #4 merges to `main`, confirm GitHub auto-retargeted PR #5 to `main`.
3. Spin up a new ticket for the ShelfSync `/projects` copy drift.
4. (Optional, deferred) the npm→pnpm migration.
