# Brand kit (LID-BRD-07)

Your brand, built the way Josh built Locked In Dept. You bring what you've got: your logo, your site, your best work, a Pinterest board or a folder of screenshots you keep coming back to. It works out what you're actually reaching for, shows you directions you can look at and react to, and once the look is locked it writes the system down so every post, video and document after it comes out on brand without you thinking about it.

It builds on the offer creator. Your brand should look like the expert your offer says you are, so run `/offer-creator:offer` first. If there's no offer file, it will ask enough about your business to get going, but it works much better with one.

## Install

```
claude plugin marketplace add madebycompound/lockedindept
claude plugin install brand-kit@lockedin-dept
```

## Use

In Claude Code, in this order:

- `/brand-kit:brand` builds the brand. Put everything you've got in one folder first: logo files, screenshots of your site and feed, three to ten pieces of your best work, and your references (download or screenshot your Pinterest board into the folder). Give it an hour. It shows you directions as boards you open in your browser, you tell it what's right and what isn't, and it locks the look. Writes `~/.lockedindept/brand/brand.md`, `tokens.json` and `board.html`.
- `/brand-kit:video` turns the brand into a video style guide for your editor: colours, type, captions, lower thirds, hook and end cards, motion, pacing, grade and sound. Written so you, an editor you hire, or the Locked In Dept. edit assistant can follow it. Writes `~/.lockedindept/brand/video-style.md`.
- `/brand-kit:social` builds your social templates: feed post, carousel, quote card, story and reel cover, each at the right size, rendered as images you can post. Then, any time, ask it for "a carousel on why I don't quote day rates" and it writes and designs it from your offer and your brand. Writes to `~/.lockedindept/brand/social/`.
- `/brand-kit:make` makes anything else on brand: a rate card, proposal cover, email signature, website hero, event poster, notebook sticker, slide template. Describe it and it builds it.

## What it won't do

Copy someone else's brand. References are mood, never spec: everything is translated into your own colours, type and rules. It won't invent proof, clients or numbers for your posts. It won't pick for you when you haven't decided: it shows you the options side by side and asks.
