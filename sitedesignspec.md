# root2.in — Design System & Build Prompt

Two parts:
1. **The design system** — the visual language (tokens, type, layout, components). This is the reference.
2. **The build prompt** — copy this whole block into Claude Code in VS Code to scaffold the empty site.

---

## Part 1 — Design system

### Principle
A quiet, precise personal site for a product leader. White paper, black ink, one accent. The writing is the interface: every piece is a **vertical deck** read top-to-bottom like a page — a bold statement, then the thinking behind it. Calm, confident, easy on the eyes. No decoration that doesn't earn its place.

### Signature
Slides are labelled **`root 1`, `root 2`, `root 3` …** down the left edge of each deck. It names the format, echoes the site name, and gives every deck a simple spine. This replaces any page numbers or progress dots.

### Color
| Token | Hex | Use |
|---|---|---|
| `--ink` | `#111114` | Primary text, dark buttons |
| `--paper` | `#ffffff` | Page background |
| `--accent` | `#3437e0` | Links, markers, one bold word per statement |
| `--muted` | `#6b6b73` | Secondary text, ledes |
| `--faint` | `#9a9aa2` | Captions, counts, meta |
| `--hair` | `#ececef` | Hairline dividers |
| `--hair2` | `#dcdce0` | Card / deck borders |
| `--wash` | `#f7f7f9` | Deck header/footer fill |

One accent only. Never introduce a second hue. The accent appears sparingly: links, the `root N` markers, and at most one highlighted word (`.b`) per statement.

### Type
- **Inter** (400/500/600) — everything structural: nav, headings, statements, labels, UI.
- **Source Serif 4** (400, and 400 italic) — reading only: the talk track under each statement, and the about paragraph. The serif is what makes it feel like reading, not a slideshow.
- Load both from Google Fonts. No other faces.

Scale: hero `clamp(38px,6vw,68px)/600`; section h2 `clamp(26px,3.4vw,36px)/600`; statement `clamp(24px,3.2vw,32px)/600`; body 17px; talk track 17px serif; labels 11–13px. Tight tracking on large sans headings (`letter-spacing:-0.03em`), normal on serif.

### Layout
- Content max-width **1080px**, 28px side padding.
- Generous vertical rhythm: sections `padding-top:88px`.
- Sticky blurred nav, 62px tall.
- Deck slide is a 3-column grid: `[74px marker] [1fr statement] [300px talk track]`. Collapses to statement-over-track on tablet, single column on mobile. Marker is `position:sticky` so it stays beside the slide as you scroll.
- **Topic grid is an expandable m×2** — `repeat(2,1fr)`, one card per topic, grows downward as topics are added, single column on mobile.
- Lab is a 3-up card grid.
- Now + About is a 2-column split.

### Components
1. **Nav** — `root2` wordmark (the 2 in accent) + lowercase links: writing, lab, now, about.
2. **Hero** — eyebrow (name), 3-line statement headline with the last line in `--faint`, one plain sentence on the format, a quiet √2 footnote line in serif italic.
3. **Deck** — bordered rounded container. Header: topic tag (pill) + title + meta (slide count · read time). Body: N slides, each = `root N` marker + statement + serif talk track (with an 11px "THINKING" label). Footer: links to full deck + source.
4. **Topic grid** — cards: topic name + count on the right, one-line description. Hover: accent border.
5. **Lab cards** — status line (accent) + title + one-line description.
6. **Now / About** — left: a "currently" list with arrow bullets; right: serif about paragraph + a links list (resume, LinkedIn, GitHub, email) + a dark resume button.
7. **Footer** — wordmark, a √2 digits whisper, back-to-top.

### Motion
One effect only: elements with `.fade` rise 14px and fade in on scroll via IntersectionObserver. Respect `prefers-reduced-motion`. Nothing else moves.

### Quality floor
Responsive to 360px. Visible keyboard focus. Semantic landmarks (`nav`, `main`, `header`, `footer`, `article`, `section`). Alt text on any images. Lighthouse-clean (no layout shift, fonts preconnected).

---

## Part 2 — Build prompt for Claude Code

> Copy everything below into Claude Code in VS Code, in an empty folder.

```
Build a personal website called root2.in. It's a static site deployed to GitHub Pages. Use Astro (latest) with content collections and TypeScript. No CSS framework — hand-write CSS with custom properties. The site must build to fully static HTML.

THE BIG IDEA
The site's writing is published as vertical "decks." A deck reads top-to-bottom like a blog page, but each unit is a slide: a bold statement, with the thinking behind it in a side column. Slides are labelled "root 1", "root 2", "root 3" down the left edge. Publishing a new deck must be as simple as adding one markdown file — no code changes.

PAGES
- / (home): hero, one featured deck rendered in full, the topic grid, the lab preview, the now+about section, footer.
- /writing: index of all decks grouped by topic (the expandable m×2 grid), linking to each deck page.
- /writing/[slug]: a single deck rendered full-page in the deck layout.
- /lab: grid of build/experiment cards.
- /now: a short "what I'm doing now" page.
- /about: bio + prominent links to resume PDF, LinkedIn, GitHub, email.
Keep every page's real content as PLACEHOLDER text — I'll fill it. Ship exactly ONE sample deck so the format is visible.

CONTENT MODEL (Astro content collection "decks")
Each deck is a markdown file at src/content/decks/*.md with frontmatter:
  title: string
  topic: "Real estate" | "AI productivity" | "Learnings" | "Observations"  (extensible — read topics dynamically, don't hardcode a fixed list in the UI)
  date: date
  readingTime: string (e.g. "4 min")
  summary: string
  draft: boolean (default false; drafts excluded from indexes)
The markdown body is the slides. Convention: each "## " heading is a slide STATEMENT; the paragraph(s) immediately after it are that slide's TALK TRACK. Parse the body into an ordered list of {statement, track} pairs. Number them "root 1..N" in render order. Within a statement, allow a span wrapped in [[ ]] to render in the accent color (one highlighted phrase). Provide one sample deck using the Raspberry Pi story with 6 slides.

DESIGN TOKENS (define once in a global stylesheet, use everywhere)
--ink:#111114; --paper:#ffffff; --accent:#3437e0; --muted:#6b6b73; --faint:#9a9aa2; --hair:#ececef; --hair2:#dcdce0; --wash:#f7f7f9; --max:1080px;
Fonts (Google Fonts, preconnected): Inter (400/500/600) for all structural/UI/heading text; Source Serif 4 (400 + 400 italic) for reading text only (the talk track, the about paragraph). No other fonts, no second accent color.

LAYOUT & COMPONENTS (make these as reusable Astro components)
- Nav.astro: sticky, blurred white bar, 62px. Left: "root2" wordmark with the "2" in --accent. Right: lowercase links writing / lab / now / about.
- Hero.astro: eyebrow "Ruturaj"; headline three lines "Builder, thinker,/innovator./Always refining." with the last line in --faint; one plain sentence describing the deck format; a serif-italic footnote "√2 = 1.41421356… — never terminates, never repeats." in --faint.
- Deck.astro: rounded 1px --hair2 border. Header (--wash bg): topic pill (--accent text on #ececfb), title, meta "N slides · read time". Body: for each slide a CSS grid [74px][1fr][300px] = marker | statement | track. Marker shows "root N" in --accent, tabular-nums, position:sticky top:82px. Statement: Inter 600, clamp(24px,3.2vw,32px). Track: Source Serif 4, with a small 11px letter-spaced "THINKING" label above it. Footer (--wash): links "Full deck" and "Code on GitHub".
  Responsive: ≤860px collapse to [56px][1fr] with track dropping under the statement; ≤560px single column, marker static.
- TopicGrid.astro: grid repeat(2,1fr), gap 16px, one card per topic derived from the actual decks, showing topic name + deck count + one-line description; hover = --accent border; single column ≤640px. Must visibly extend to 3 or 4 rows as topics grow.
- LabGrid.astro: 3-up cards (status line in --accent, title, one-line desc); single column ≤820px.
- NowAbout.astro: 2-col split. Left: "CURRENTLY" label + list with → bullets. Right: "ABOUT" label + serif bio paragraph + a links list (Resume, LinkedIn, GitHub, email — each a row with a ↗) + a dark "View resume →" button that turns --accent on hover.
- Footer.astro: wordmark, a faint "1.41421356237…" in serif italic, back-to-top link.

BEHAVIOR
- One scroll animation only: a .fade utility (translateY 14px + opacity) revealed via a single IntersectionObserver in a small inline script. Wrap in prefers-reduced-motion: reduce guard.
- Smooth scroll, sticky markers, accessible focus states, semantic landmarks.

STYLE RULES
- White background only. One accent. Hairline borders. Lots of whitespace.
- Sentence case everywhere except proper nouns. No emojis. No gradients, shadows (except a functional focus ring), or glow.
- Round corners: 16px on decks, 14px on cards, 10px on buttons.

DEPLOYMENT
- Configure astro.config for GitHub Pages (set site and, if using a project repo rather than a custom domain, base). I'll use the custom domain root2.in, so include a public/CNAME containing "root2.in".
- Add a GitHub Actions workflow (.github/workflows/deploy.yml) that builds the Astro site and deploys to GitHub Pages on push to main.
- Include a README explaining: how to run locally (npm install, npm run dev), how to publish a new deck (add a markdown file to src/content/decks/ following the ## statement / paragraph convention), and how to swap the resume PDF and social links.

DELIVERABLES
Full working repo: package.json, astro.config.mjs, tsconfig, src/content/config.ts (zod schema for the decks collection), the components above, the five pages, one global stylesheet with the tokens, one sample deck markdown, public/CNAME, the deploy workflow, and the README. Every page should build with `npm run build` and preview with `npm run preview`. Keep copy as placeholders; make the structure and design system pixel-faithful to the spec above.
```

---

### After Claude Code finishes
1. `npm install && npm run dev` → open the local URL to preview.
2. Drop your resume PDF into `public/` and point the About links at it, your LinkedIn, and your GitHub.
3. Write your first real deck: copy the sample markdown, change the frontmatter, and write `## statement` + a paragraph per slide.
4. Push to `main`; the Action deploys to GitHub Pages. Set root2.in's DNS to GitHub Pages and you're live.