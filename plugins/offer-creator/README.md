# Offer creator (LID-OFR-00)

The first agent to run. It works out who you are the expert for, the problem you solve, what solving it is worth, your pitch angle, your offer with three tiers priced on value, and how to sell it as a consultation rather than a quote. Everything else in the Locked In Dept. library builds on what it writes.

## Install

```
claude plugin marketplace add madebycompound/lockedindept
claude plugin install offer-creator@lockedin-dept
```

## Use

In Claude Code, in this order:

- `/offer-creator:vision` first. What you want and why, a Tuesday twelve months out, who you have to become, your Core Four baseline and the daily rituals that build it. Writes `~/.lockedindept/offer/vision.md`.

- `/offer-creator:offer` builds (or rebuilds) your offer. Give it an hour, have your website and two or three past projects to hand. It asks one question at a time and writes `~/.lockedindept/offer/offer.md` and `pitch.md`.
- `/offer-creator:pitch` preps you for a specific sales call. Paste the enquiry or describe the client. One page back: the questions to ask, the likely prescription, the price said plainly, what to listen for.

## What it won't do

Guess. If it doesn't know, it asks. It never quotes hours or a day rate, and it never sends anything on your behalf.
