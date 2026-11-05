---
name: social
description: Build your social templates from your brand (feed post, carousel, quote card, story, reel cover), then write and design posts on demand from your offer and brand. Renders finished images. Writes to ~/.lockedindept/brand/social/. Use when the user says "/brand-kit:social", "social templates", "make me a carousel", "design a post", "Instagram post about", or asks for any social graphic.
---

# Social

Two jobs. The first time: build the member's template set. Every time after: make the post they ask for, on brand, from their own offer and words.

## Before you start

Read `~/.lockedindept/brand/brand.md` and `tokens.json`. Missing: stop and tell them to run `/brand-kit:brand` first. Read `~/.lockedindept/offer/offer.md` if it exists: the pillars, the proposition, the proof, their phrases. Read `~/.lockedindept/brand/social/templates.md` if it exists; if it does, skip to "Making a post".

Check whether a headless browser is available (Playwright in Node or Python, or Chrome with `--headless`). Renders need one. If there isn't one, offer to install Playwright; if they'd rather not, deliver HTML files they open and screenshot.

## Building the template set

Build each as one self-contained HTML file in `~/.lockedindept/brand/social/templates/`, with the copy in clearly marked slots at the top of the file so the next post is a copy change, not a redesign. Fonts from Google Fonts, colours and type only from tokens.json, the accent used as brand.md says.

- `post.html`: single feed post, 1080x1350.
- `carousel.html`: cover, body slide, proof slide (a number or a quote), and final slide with the one action. 1080x1350 each. Consistent margins, a slide counter as a label, and a cover that works on its own in the grid.
- `quote.html`: a client or their own line, 1080x1350.
- `story.html`: 1080x1920, with the top 250px and bottom 340px kept clear of type for the platform UI.
- `cover.html`: reel cover, 1080x1920, with the title readable in the 1080x1350 grid crop.

Render each with placeholder slots filled with their real copy from offer.md (never lorem ipsum, never invented numbers) and show them all. Ask what's off. Two rounds is normal. Then write `templates.md`: each template, its slots, character limits per slot, and the rules (one accent per slide, how many words on a cover, where the handle goes).

## Making a post

When they ask for a post ("a carousel on why I don't quote day rates"):
1. Write the copy first and show it before designing. Use their pillars and their phrases. Cover: one idea in six words or fewer. Body: one point per slide. Proof: their real result or a real client quote; if they have none for this point, say so and ask, never invent one. Last slide: the one action (DM a word, the link in bio, book a call).
2. Ask "right message?" Then build from the template, render to PNG at full size, and save to `~/.lockedindept/brand/social/posts/<date>-<slug>/` with the caption in `caption.txt` (hook line first, no hashtag wall, at most three).
3. Show the images and the caption. Change what they ask. Never post anything; they post.

## Rules

- References and other people's posts are mood only. Never reproduce someone else's design, logo, character or photo.
- No stock photos of people presented as clients. Their own images only, or type-led designs.
- British English. No em dashes, no emoji unless brand.md allows them.
- If a design breaks a brand.md rule because the content needs it, say so and ask, don't just do it.
