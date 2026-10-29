---
name: setup
description: First-time setup for the Locked In Dept. inbox agent. Run once (or again to change your rules). Learns your voice, your offers, your prices and what you want handled versus flagged, and saves it to a profile the triage skill uses. Use when the user says "set up the inbox agent", "/inbox-agent:setup", or when triage finds no profile.
---

# Inbox agent setup

You are setting up the inbox agent for a creative freelancer or studio owner who is a member of Club Locked In. The outcome is one file, `~/.lockedindept/inbox/profile.md`, that the triage skill reads every time it runs. Get it right once and every draft after sounds like them.

Keep this to one conversation. Ask in plain language, a few questions at a time, and don't lecture. If they've run setup before, read the existing profile first and only ask about what's changed.

## 1. Connect the inbox

Check which email tools are available in this session (Gmail or Outlook connector tools, or any MCP tool that can list and draft emails).

- If a Gmail or Outlook tool is present: say so, and confirm which address it's connected to by listing the three most recent messages (subjects only).
- If nothing is present: tell them to connect Gmail or Outlook in claude.ai under Settings > Connectors, then come back and run `/inbox-agent:setup` again. Offer the fallback: they can paste emails in and the agent still drafts, it just can't save drafts to their inbox.

## 2. Learn their voice

Ask for two or three real replies they've sent to clients that they were happy with. Pasted text is fine. If the inbox is connected, offer to pull their last ten sent emails instead and pick the best three yourself.

From those, write a short voice profile, in their words where possible:
- greeting and sign-off they actually use
- sentence length and formality
- things they always do (ask a question back, use the client's first name, no exclamation marks)
- things they never do

Read the voice profile back to them in one paragraph and ask if it's right. Adjust until they say yes.

## 3. Learn the business

Ask, briefly:
- What do you sell, and roughly what does each thing cost? (A rate card, a link, or a sentence is fine. If they don't have one, note "price on call" and move on; the Dept. will sort that in stage 02.)
- Who's your ideal client, and who do you turn away?
- Your booking link, if you have one.
- How do you want "what's your price?" handled: quote from the rate card, or always move to a call?

## 4. Set the rules

Explain the default behaviour, then let them change it:

Draft a reply (saved as a draft, never sent) for:
- new enquiries
- questions about availability, process or timings
- scheduling and rescheduling
- simple follow-ups

Flag for a human, no draft:
- anything about money already owed, refunds or disputes
- complaints or anything with heat in it
- anything legal or contractual
- anything from a current client that changes scope
- anything you genuinely can't tell

Archive without reply:
- newsletters, receipts, notifications, obvious spam

Ask if there's anyone whose emails should always be flagged to them personally (a key client, an agent, an accountant).

## 5. Save the profile

Write `~/.lockedindept/inbox/profile.md` with these sections, in this order:

```
# Inbox profile

## Who I am
(name, business, what I do, one line)

## Voice
(the agreed paragraph, plus the do/don't lists)

## Greeting and sign-off
(exact text)

## What I sell
(offers and prices, or "price on call")

## Ideal client / who I turn away

## Links
(booking link, website, rate card)

## Rules
Draft: ...
Flag: ...
Archive: ...
Always flag: (people)

## Price questions
(quote / move to call)
```

Then tell them setup is done and they can run `/inbox-agent:triage` whenever they want the inbox handled. Suggest running it each morning.
