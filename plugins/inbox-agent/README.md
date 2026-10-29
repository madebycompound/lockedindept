# Inbox agent (LID-INB-03)

Sorts your inbox and drafts replies in your voice. You read and hit send. Nothing goes out without you.

## What it does

Every time you run it:
1. Pulls your unread email.
2. Sorts each one: draft a reply, flag for you, or archive.
3. Writes the drafts in your voice and saves them to your inbox as drafts.
4. Gives you a thirty-second summary of what's waiting.

It never sends. It never replies to anything about money, complaints, contracts or scope. Those get flagged to you.

## Setup (10 minutes, once)

1. Connect your email in claude.ai: Settings > Connectors > Gmail (or Outlook).
2. In Claude Code, add the Locked In Dept. library and install the agent:
   ```
   claude plugin marketplace add madebycompound/lockedindept
   claude plugin install inbox-agent@lockedin-dept
   ```
3. Run `/inbox-agent:setup`. It asks for a few real replies you've sent, what you sell, and what you want handled versus flagged. Saves a profile to `~/.lockedindept/inbox/profile.md`.

## Every day

Run `/inbox-agent:triage`. Read the summary, open your drafts folder, send the ones you're happy with.

To change your voice or rules, run `/inbox-agent:setup` again or edit the profile file directly.

## What it needs

- Claude Code with a claude.ai login
- Gmail or Outlook connected as a connector (without it, you can paste emails in and it still drafts)

## Updates

```
claude plugin update inbox-agent@lockedin-dept
```

Questions: hello@lockedindept.com
