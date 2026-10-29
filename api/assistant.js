// Vercel serverless function: the Dept. assistant.
// Needs ANTHROPIC_API_KEY set in Vercel > Project > Settings > Environment Variables.
// Lesson content lives in portal/data.js; longer transcripts can be added to portal/corpus.txt later.

const fs = require("fs");
const path = require("path");

function loadData() {
  try {
    const src = fs.readFileSync(path.join(process.cwd(), "portal", "data.js"), "utf8");
    const json = src.slice(src.indexOf("{"), src.lastIndexOf("}") + 1);
    return Function("return (" + json + ")")();
  } catch (e) { return null; }
}

function corpus() {
  try { return fs.readFileSync(path.join(process.cwd(), "portal", "corpus.txt"), "utf8"); } catch (e) { return ""; }
}

module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return res.status(503).json({ error: "Assistant not configured" });

  const { messages = [], context = {}, mode = "" } = req.body || {};
  const data = loadData() || {};

  if (mode === "coach") {
    // Draft Josh's Monday reply to one member's weekly check-in. Josh edits before it goes out.
    const coachSystem = `You draft Josh Pearson's Monday reply to a member of Club Locked In, his 90-day programme for creative freelancers. Josh will edit it before sending, so write it in his voice, first person, as if he wrote it.

Josh's voice: direct, warm, plain. Short sentences. He says the uncomfortable thing kindly. He names the one thing that matters this week and ignores the rest. He does not praise effort, he notices action. British English. No em dashes. No bullet points. No sign-off. 80 to 140 words.

What to do with the check-in:
- Lead with what they did (quotes sent, prices said out loud, no's, outreach), not what they wrote.
- If the reps are zero or dropped, say so plainly and ask what got in the way. One question, not three.
- Tie it to their number (earnings per hour) when it has moved either way.
- Hold them to last week's goals by name. Missed goals get named, not excused.
- End with the single thing to do before next Sunday.
- Never promise results or income.`;
    const summary = typeof context.summary === "string" ? context.summary : JSON.stringify(context);
    try {
      const r = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "content-type": "application/json", "x-api-key": key, "anthropic-version": "2023-06-01" },
        body: JSON.stringify({ model: process.env.ASSISTANT_MODEL || "claude-sonnet-5-5", max_tokens: 500, system: coachSystem, messages: [{ role: "user", content: "Member's week:\n" + summary }] })
      });
      const j = await r.json();
      if (!r.ok) return res.status(502).json({ error: (j.error && j.error.message) || "Model error" });
      return res.status(200).json({ reply: (j.content || []).filter(c => c.type === "text").map(c => c.text).join("\n").trim() });
    } catch (e) { return res.status(500).json({ error: "Draft failed" }); }
  }
  const method = (data.method || []).map(m => `${m.n} ${m.title}: ${m.desc}`).join("\n");
  const lessons = (data.lessons || []).map(l => `${l.n} [${l.module}] ${l.title}: ${l.summary}`).join("\n");
  const cf = context.coreFour ? Object.entries(context.coreFour.scores || {}).map(([k, v]) => `${k} ${v}/10`).join(", ") : "not scored yet";
  const nums = context.numbers ? `Their number (earnings per hour worked): ${context.numbers.now ? "£" + Math.round(context.numbers.now.rate) + "/hr now, from £" + Math.round(context.numbers.base.rate) + "/hr at the start" : "£" + Math.round(context.numbers.base.rate) + "/hr at the start, no weeks logged yet"}. Average project at the start: £${context.numbers.base.project}.` : "They haven't entered their starting numbers yet.";
  const wk = context.lastWeek ? `Their last weekly check-in: ${JSON.stringify(context.lastWeek)}` : "No weekly check-ins yet.";

  const system = `You are the Locked In Dept. assistant, trained on Josh Pearson's method for creative freelancers and studio owners.

Who you're talking to: a member of Club Locked In, a 90-day programme. ${context.name ? "Their first name is " + context.name + "." : ""} They're at stage ${context.stage ? context.stage.n + " " + context.stage.title : "01 Clarity"}, ${context.progress ? context.progress.done + " of " + context.progress.total + " lessons watched" : ""}. Their latest Core Four scores: ${cf}.
${nums}
${wk}

The method, in order:
${method}

The lessons:
${lessons}

${corpus() ? "Josh's own words, from the lessons and calls:\n" + corpus().slice(0, 60000) : ""}

How to answer:
- Direct, plain, honest. Short sentences. No fluff, no hedging, no bullet-point essays. Sound like a sharp mentor, not a help desk.
- The core beliefs: price on value not hours; fewer clients paying more every month; stop hiding behind the work and be known for a point of view; back yourself and set the goal that scares you; business leads but health, self and relationships hold it up; use agents so growth doesn't cost hours.
- Give the actual words when they ask what to say to a client. Three-option proposals, middle option as the obvious choice, cut scope never price.
- When a lesson covers it, point them to it by number and title. When it's a big decision, tell them to bring it to their next 1:1 with Josh.
- You know their numbers, their reps (quotes sent, highest price said out loud, no's, outreach) and their goals. Use them. If they said they'd send three proposals and sent one, say so and ask what's stopping them. You hold them to it between calls.
- British English. No em dashes. Never promise results or income.`;

  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "content-type": "application/json", "x-api-key": key, "anthropic-version": "2023-06-01" },
      body: JSON.stringify({
        model: process.env.ASSISTANT_MODEL || "claude-sonnet-5-5",
        max_tokens: 800,
        system,
        messages: messages.filter(m => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string").map(m => ({ role: m.role, content: m.content }))
      })
    });
    const j = await r.json();
    if (!r.ok) return res.status(502).json({ error: (j.error && j.error.message) || "Model error" });
    const reply = (j.content || []).filter(c => c.type === "text").map(c => c.text).join("\n").trim();
    return res.status(200).json({ reply });
  } catch (e) {
    return res.status(500).json({ error: "Assistant failed" });
  }
};
