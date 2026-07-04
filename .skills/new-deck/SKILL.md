---
name: new-deck
description: >
  Scaffold a new writing "deck" (blog post) for the root2.in static site. Use
  when the user says things like "create a new blog post", "new deck", "add a
  writing post", "start a deck about X". Creates the deck page at the right path
  in the site hierarchy, wires it into the writings list, and leaves clearly
  marked placeholders for the user to fill in later. Do NOT use for editing
  global layout, CSS tokens, labs, or the about page.
---

# New deck (blog post) for root2.in

This site is **hand-written static HTML** served by GitHub Pages at the custom
domain `root2.in`. There is **no build step** — every page is a plain
`index.html` inside a folder so the URL is clean (`/writings/<slug>/`).

A "deck" is one post, laid out **Medium-style**: a vertical series of
**chapters**. Each chapter is a **visual (a slide, possibly an image/animated
block)** with the **writing directly below it**. As the reader scrolls, each
chapter rises into view. The visual carries a small `root N` label as the spine.

## Files in this skill

- `deck-template.html` — the full deck page. Copy it to the new post's folder.
- `listing-snippet.html` — the `<li>` to add to the writings list.

## Inputs to collect (ask only if not given)

| Field         | Example                          | Notes |
|---------------|----------------------------------|-------|
| `TITLE`       | The trip that changed my mind    | Sentence case. |
| `TOPIC`       | Learnings                        | Display name of the topic. |
| `TOPIC_SLUG`  | learnings                        | lowercase, hyphenated. Must match a filter chip. |
| `SLUG`        | trip-that-changed-my-mind        | lowercase, hyphenated. Derived from title if not given. |
| `SUMMARY`     | One line about what the post says.| Shown in the writings list. |
| `SLIDE_COUNT` | 4                                | Number of chapters/slides. |
| `READ_TIME`   | 3 min                            | Rough estimate. |
| `DATE`        | Jul 2026                         | Optional. |

Topics (filter chips) currently in `writings/index.html`: **Product**
(`product`), **Real estate** (`real-estate`), **Observations**
(`observations`), **Learnings** (`learnings`). Topics are extensible.

## Steps

1. **Derive the slug** from the title if not provided: lowercase, spaces → `-`,
   strip punctuation. Confirm `writings/<slug>/` does not already exist.

2. **Create the deck page** at `writings/<slug>/index.html`:
   - Copy `deck-template.html`.
   - Replace every `{{TITLE}}`, `{{TOPIC}}`, `{{SLUG}}`, `{{SUMMARY}}`,
     `{{SLIDE_COUNT}}`, `{{READ_TIME}}`, `{{DATE}}` token.
   - Emit one `<section class="chapter">` per slide, `root N` labels numbered in
     order. Statement goes in `.chapter-statement`, the writing in
     `.chapter-text` paragraphs.
   - Leave the `.chapter-visual` as the animated placeholder, or drop in
     `<img src="/assets/img/<file>" alt="…">` if the user provides an image.
   - If only a title was given, leave 2–3 placeholder chapters for the user to
     fill later.

3. **Wire it into the writings list.** Fill `listing-snippet.html` and paste the
   `<li>` at the **top** of `<ul class="deck-links">` in **both**:
   - `writings/index.html` (the filterable index), and
   - `index.html` (the home page list).
   Set `data-topic` to the `TOPIC_SLUG` so the filter chips work.

4. **New topic?** If the topic doesn't have a chip yet, add a
   `<button class="chip" data-filter="<slug>" aria-pressed="false">Name</button>`
   to the `.filters` group in `writings/index.html`.

5. **Leave placeholders visible.** Real prose stays as clearly-marked
   placeholder text unless the user provided it. Never invent biography or facts.

## Conventions (keep the design system intact)

- Paths are **root-relative** (`/assets/…`, `/writings/…`).
- Reuse the exact nav, footer, class names, and the CSP `<meta>` block from
  existing pages. Prefer the tokens in `assets/css/styles.css`; don't add CSS
  unless the design genuinely needs it.
- One accent color only. Hairline borders. Sentence case. No emojis.
- Every deck page keeps: `<nav class="nav">`, `<main>`, the
  `<article>` with chapters, `<footer class="site-foot">`, and
  `<script src="/assets/js/main.js" defer>`.

## Verify before finishing

- The new folder resolves: `writings/<slug>/index.html` exists.
- Both the home list and the writings index link to `/writings/<slug>/`.
- The new item's `data-topic` matches an existing (or newly added) filter chip.
- No leftover `{{TOKENS}}` remain in any file.
