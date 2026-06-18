## Summary

Rebuild of the personal-website inner pages (about, projects, projects/[slug], blog, blog/[slug], now) with a new token system, folder-nav chrome, and a View Transitions morph between the homepage and the inner pages.

## What's in this PR

**Foundations**

- v0.2.0–v0.2.2: deck-shuffle reorder, direction-aware reorder timing, motion polish & tuck animation on the homepage folder stack
- docs: add Best Practices hub cross-link to CLAUDE.md
- PRJ-32: extend :root with the v2 semantic token system
- PRJ-33: folder-nav inner-page chrome
- PRJ-34: folder morph transition system (View Transitions API)

_Design bundle reference imports (Claude Design v1 + v2) are kept locally and gitignored — they live in `docs/design-bundles/` on disk for reference but never enter repo history._

**Inner-page rewrites**

- PRJ-35: /about — editorial copper page
- PRJ-36: /projects — evergreen index grid
- PRJ-37: /projects/[slug] — evergreen case-study
- PRJ-38: /blog — dusty-lavender editorial list
- PRJ-39: /blog/[slug] — dusty-lavender article
- PRJ-40: /now — almond-cream postcard

**Content & polish**

- PRJ-41: wire /projects to Notion CMS with hardcoded fallback
- PRJ-42: wire /blog to Notion CMS with hardcoded fallback
- PRJ-43: sequenced morph-settling content choreography
- PRJ-44: device-validation tunings + inline why-comments
- PRJ-45: lock in transition fallback decision
- PRJ-46: copy-pass audit — strip fabricated placeholders
- fix: suppressHydrationWarning on the html element (silences extension-injected attribute noise)
- content: replace /now bracketed instruction with shippable placeholder
- chore: ignore .claude/ and local BMO handoff notes

## Homepage

No regressions. The homepage's visual and interaction identity (folder-stack hover, peek layer, toggle, deck-shuffle reorder, direction-aware timing, motion polish) is preserved; the new animation system and inner-page chrome are layered on top.

## Open items deferred to a follow-up

A separate QA pass flagged several items that are not addressed in this PR and will be tracked through Notion tickets + a Code BMO handoff:

- Tab touch target below WCAG 44×44
- Active-tab focus indicator missing
- Homepage project-card hero has no nav link (only the peek layer is linked)
- .env.example missing NOTION_TOKEN, NOTION_DB_PROJECTS, NOTION_DB_BLOGPOSTS
- Visually verify animation InvalidStateError and ShelfSync content drift post-fix
- Vercel preview build sanity check
