// Apply form on /90-days: saves the application as a lead in Supabase, emails Josh, confirms to the applicant.
// Uses the existing public leads table (anyone can insert). Email needs RESEND_API_KEY in Vercel; the save works without it.
const { send } = require("./_mail");
const NOTIFY = "info@madebycompound.com";
const clean = (s, n) => String(s || "").replace(/\s+/g, " ").trim().slice(0, n);
module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });
  const b = typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});
  if (b.company) return res.status(200).json({ ok: true }); // honeypot: bots fill hidden fields
  // Reservation from the buy buttons while checkout links aren't live: name, email, plan.
  if (b.plan) {
    const PLANS = { full: "Group, £697", split: "Group, 3 x £247", oneone: "1:1, £2,000" };
    const r = { name: clean(b.name, 120), email: clean(b.email, 200).toLowerCase(), handle: clean(b.handle, 80).replace(/^@/, ""), plan: PLANS[b.plan] || "Group, £697", source: clean(b.source, 60) };
    if (!r.name || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(r.email)) return res.status(400).json({ error: "Add your name and email." });
    const rnote = `RESERVATION / 90 days\nName: ${r.name}\nPlan: ${r.plan}\nSource: ${r.source || "-"}`;
    const url = process.env.SUPABASE_URL || "https://pqsgymxddtrmzpcawzxi.supabase.co";
    const anon = process.env.SUPABASE_ANON_KEY || "sb_publishable_wBq1dszXPJ2CZzqkQIRXTA_hXE3b3zI";
    let ok = false;
    try { const x = await fetch(url + "/rest/v1/leads", { method: "POST", headers: { apikey: anon, authorization: "Bearer " + anon, "content-type": "application/json", prefer: "return=minimal" }, body: JSON.stringify({ email: r.email, handle: r.handle || null, note: rnote }) }); ok = x.ok; } catch (e) {}
    try {
      await send({ to: NOTIFY, subject: `Reserved: ${r.name} (${r.plan})`, kicker: "90 days / Reservation", title: "Someone wants in.", body: `${rnote}\nEmail: ${r.email}\nInstagram: ${r.handle ? "@" + r.handle : "-"}\n\nSend them the payment link.` });
      await send({ to: r.email, subject: "Your place is held.", kicker: "Locked In Dept. / The 90 days", title: "Place held.", body: `${r.name.split(" ")[0]}, your place in the founding cohort is held at the founding price (${r.plan}).\n\nJosh will send your payment link personally. As soon as you pay you get the portal and the 14-day cash sprint.\n\nWhile you wait, score your Core Four. It's where we start: https://lockedindept.com/score`, cta: "Score your Core Four", url: "https://lockedindept.com/score" });
      ok = true;
    } catch (e) {}
    return ok ? res.status(200).json({ ok: true }) : res.status(502).json({ error: "Something went wrong. DM LOCKED IN to @lockedin.dept instead." });
  }
  const a = {
    name: clean(b.name, 120), email: clean(b.email, 200).toLowerCase(), handle: clean(b.handle, 80).replace(/^@/, ""),
    work: clean(b.work, 160), now: clean(b.now, 40), trap: clean(b.trap, 80), goal: String(b.goal || "").trim().slice(0, 1500), source: clean(b.source, 60)
  };
  if (!a.name || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(a.email) || !a.work || !a.now || !a.goal)
    return res.status(400).json({ error: "Please fill in every field." });
  const note = `APPLICATION / 90 days\nName: ${a.name}\nDoes: ${a.work}\nMonthly now: ${a.now}\nTrap: ${a.trap || "-"}\n90-day goal: ${a.goal}\nSource: ${a.source || "-"}`;
  const url = process.env.SUPABASE_URL || "https://pqsgymxddtrmzpcawzxi.supabase.co";
  const anon = process.env.SUPABASE_ANON_KEY || "sb_publishable_wBq1dszXPJ2CZzqkQIRXTA_hXE3b3zI";
  let saved = false;
  try {
    const r = await fetch(url + "/rest/v1/leads", { method: "POST",
      headers: { apikey: anon, authorization: "Bearer " + anon, "content-type": "application/json", prefer: "return=minimal" },
      body: JSON.stringify({ email: a.email, handle: a.handle || null, note }) });
    saved = r.ok;
  } catch (e) {}
  let mailed = false;
  try {
    await send({ to: NOTIFY, subject: `New application: ${a.name} (${a.now})`, kicker: "90 days / Application", title: "New application.",
      body: `${note}\nEmail: ${a.email}\nInstagram: ${a.handle ? "@" + a.handle : "-"}\n\nReply within 24 hours.`,
      cta: a.handle ? "Open their Instagram" : null, url: a.handle ? "https://instagram.com/" + encodeURIComponent(a.handle) : "" });
    mailed = true;
    await send({ to: a.email, subject: "Application in. Josh will be in touch.", kicker: "Locked In Dept. / Application", title: "You're in the queue.",
      body: `${a.name.split(" ")[0]}, your application for the founding cohort is in.\n\nJosh reads every one himself.\n\nNext step: book your 30-minute call. Pick any time that suits you.\n\nBefore the call, score your Core Four. It's what we'll start with: https://lockedindept.com/score`,
      cta: "Book your call", url: "https://lockedindept.com/book" });
  } catch (e) {}
  if (!saved && !mailed) return res.status(502).json({ error: "Something went wrong. DM LOCKED IN to @lockedin.dept instead." });
  return res.status(200).json({ ok: true });
};
