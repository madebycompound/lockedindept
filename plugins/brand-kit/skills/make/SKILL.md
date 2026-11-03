---
name: make
description: Make any brand asset on brand from your brand kit. Rate card, proposal cover, email signature, website hero, event poster, workshop slides, notebook sticker, calendar, business card, YouTube thumbnail. Describe it and it builds it to size, rendered. Use when the user says "/brand-kit:make", "make me a", "design a", "on brand", or asks for any branded asset that isn't a social post or video guide.
---

# Make

Builds one-off brand assets from the member's brand kit.

## Before you start

Read `~/.lockedindept/brand/brand.md` and `tokens.json`. Missing: stop and tell them to run `/brand-kit:brand` first. Read `~/.lockedindept/offer/offer.md` if the asset carries copy about what they sell (rate card, proposal, hero).

Ask only what you need, one question at a time: what it's for, where it will be seen or printed, the size if it's fixed (A-sizes, inches, px), and the copy if they have it. If they don't have copy, write it from offer.md and show it before designing.

## Building

- One self-contained HTML file per asset (per page for multi-page items), sized exactly: print at 96px per inch (A4 794x1123, A3 1123x1587, A2 1587x2245), screen at its pixel size.
- Print: keep 40px clear inside every edge, body text at 12pt (16px) or larger, 1px rules at least, near-black text on light stock, and say whether they need bleed from their printer. Export to PDF with a headless browser if available.
- Screen: render to PNG at 2x.
- Prices, names and numbers only from offer.md or the member. Never invent them; leave a marked slot like `[YOUR PRICE]` instead.
- Email signatures: plain HTML table, inline styles only, web-safe font fallback, no images other than an optional logo hosted somewhere they control.

Save to `~/.lockedindept/brand/made/<date>-<slug>/`. Show the render, ask what's off, change it. Then add a line to `~/.lockedindept/brand/made/index.md` with the date, what it is and the file path, so the kit grows.

British English. No em dashes. Brand rules from brand.md win over anything here; if the asset needs to break one, say so and ask.
