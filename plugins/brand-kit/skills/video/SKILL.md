---
name: video
description: Turn your locked brand into a video style guide your editor (or an editing agent) can follow. Colours, type, captions, lower thirds, hook and end cards, motion, cut and pace, grade and sound, written as rules. Writes ~/.lockedindept/brand/video-style.md. Use when the user says "video style", "/brand-kit:video", "caption style", "how should my videos look", or before any edit when no video-style file exists.
---

# Video style

You are writing a Club Locked In member's video style guide from their brand, the way Josh Pearson wrote the Locked In Dept. one. The test of a good guide: an editor who has never met them could cut a short and a long-form video that looks unmistakably theirs, and an editing agent could follow it without asking a single question.

## Before you start

Read `~/.lockedindept/brand/brand.md` and `tokens.json`. If they don't exist, stop and tell the member to run `/brand-kit:brand` first. A video style built without a locked brand is guessing.

Read `~/.lockedindept/offer/offer.md` if it exists, for the message pillars and fixed phrases.

Then ask, one at a time:
1. Which editor do they use (Final Cut, Premiere, Resolve, CapCut, someone else's)? The guide names settings in that editor's terms.
2. What do they make: short-form vertical, long-form talking head, client case studies, B-roll reels? Which matters most this quarter?
3. Two or three videos (theirs or anyone's) whose feel is right, and one whose feel is wrong. Same rule as references: mood, never spec.
4. Do they have a LUT or grade they always use?

## What to write

`~/.lockedindept/brand/video-style.md`, dated, with these sections. Every rule specific enough to execute: hex, px at a named frame size, seconds, dB.

1. **Materials.** Ground, type colours and the one accent from brand.md, with the video rules: where the accent may go (flat surfaces, a single word, a single number), where it never goes (over footage is the usual one). One accent per frame. Any material (chrome, grain, film) and how often.
2. **Type.** Display, captions, labels. Face, weight, case, tracking, line height, size at 1080x1920 and at 1920x1080.
3. **Captions (short-form).** Phrase by phrase or word by word (default phrase by phrase: 3 to 7 words cut at the sense break). Position in px from the bottom so they clear the platform UI (at least 400px up on 1080x1920). Max lines. Shadow or box. How the emphasis word is marked: one per phrase at most, never colour pops or scale bounces unless the brand is built on that. Casing and punctuation rules.
4. **Lower third.** Position, size, what it says, in and out timings, shown once.
5. **Hook card and end card.** What's on each, how long, how each leaves. The end card holds at least 1.2s.
6. **Motifs.** The brand's graphic motifs translated to motion: what moves, how, where it's used (titles, chapter breaks, stats, backgrounds).
7. **Motion.** The verbs allowed (e.g. pulled, counted, dissolved) and banned (e.g. bounce, spring). In and out durations; out faster than in.
8. **Cut and pace.** Short-form cut rhythm (e.g. a punch-in or angle change every 3 to 5s, punch-ins as cuts not zooms). Long-form rhythm. Hook lands inside 1.2s. Dead air and fillers out, breaths before the line that matters kept.
9. **Grade and texture.** Base LUT and adjustments in their editor's terms, skin rule, black level, grain. Graphics applied after the grade.
10. **Sound.** Music level under voice in dB, what kind, SFX rules (motif hits only, no stock whooshes unless that's the brand).
11. **Formats.** A table: format, frame size, length, structure in beats (hook, point, proof, line that makes them act), caption on or off.
12. **Do not.** The banned moves, each with a reason.

Then add a short **Editor setup** section in their editor's terms: caption preset values, title template names, export settings per platform.

## Check it

Read the guide back as an editor would and fix anything that needs a judgement call to execute. Then show the member three things built from it, as HTML frames rendered to PNG if a headless browser is available (otherwise as HTML files to open): a hook card, a caption frame at 1080x1920 with an emphasis word, and an end card, using their real copy. Ask "does that look like you?" and fix what's off in both the frames and the guide.

British English. No em dashes. Tell them the next step: cut one short with it this week, and hand the file to anyone who edits for them.
