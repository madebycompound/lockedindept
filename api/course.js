// Daily cron (vercel.json). Kit subscribers: lesson N (1 to 5) on day N, with catch-up if a run was missed, then two closing emails before applications shut.
// Applicants: a 'book your call' nudge two days after applying. Anyone who has applied is dropped from the pitch emails.
// Each send is recorded on the lead's note as 'SENT <tag>' so nothing goes out twice.
// Also handles unsubscribe links: /api/course?unsub=<lead id>&t=<token>.
// Needs SUPABASE_SERVICE_ROLE_KEY, RESEND_API_KEY and CRON_SECRET in Vercel (the same ones the check-in reminders use).
// Test by hand (sends to you only, records nothing): /api/course?key=<CRON_SECRET>&to=<your email>&day=<1-5>, or &closing=1|2, or &nudge=1
const { send } = require("./_mail");
const course = require("./_course");
const { token } = require("./kit");
const URL_ = process.env.SUPABASE_URL || "https://pqsgymxddtrmzpcawzxi.supabase.co";
const page = (title, msg) => `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>${title}</title><link rel="stylesheet" href="/assets/page.css"></head><body><header class="bar lbl"><a href="/" style="font-weight:700">Locked In Dept.</a><span>Email</span></header><main class="wrap" style="padding-top:72px"><h1 class="big" style="font-size:clamp(44px,8vw,96px)">${title}</h1><p class="lead" style="margin-top:20px">${msg}</p></main></body></html>`;
const dayDiff = (from, to) => Math.floor((Date.UTC(to.getUTCFullYear(), to.getUTCMonth(), to.getUTCDate()) - Date.UTC(from.getUTCFullYear(), from.getUTCMonth(), from.getUTCDate())) / 864e5);
module.exports = async (req, res) => {
  const q = req.query || {}, key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const H = { apikey: key, authorization: "Bearer " + key, "content-type": "application/json" };
  if (q.unsub) {
    const id = String(q.unsub);
    if (!/^[0-9a-f-]{36}$/i.test(id) || q.t !== token(id)) { res.setHeader("content-type", "text/html"); return res.status(400).send(page("Link expired.", "That unsubscribe link didn't work. DM @lockedin.dept on Instagram and we'll take you off by hand.")); }
    if (key) {
      const g = await fetch(`${URL_}/rest/v1/leads?id=eq.${id}&select=note`, { headers: H }); const row = (await g.json())[0];
      if (row && !/UNSUBSCRIBED/.test(row.note || "")) await fetch(`${URL_}/rest/v1/leads?id=eq.${id}`, { method: "PATCH", headers: H, body: JSON.stringify({ note: (row.note || "") + "\nUNSUBSCRIBED " + new Date().toISOString().slice(0, 10) }) });
    }
    if (req.method === "POST") return res.status(200).json({ ok: true });
    res.setHeader("content-type", "text/html"); return res.status(200).send(page("You're off the list.", "No more emails from the course. The kit is still yours at <a href=\"/pricing-kit/kit\">lockedindept.com/pricing-kit/kit</a>."));
  }
  const auth = req.headers.authorization || "";
  if (process.env.CRON_SECRET && auth !== "Bearer " + process.env.CRON_SECRET && q.key !== process.env.CRON_SECRET) return res.status(401).json({ error: "no" });
  if (!key) return res.status(503).json({ error: "SUPABASE_SERVICE_ROLE_KEY not set" });
  const now = new Date(), ymd = now.toISOString().slice(0, 10), since = new Date(now.getTime() - 45 * 864e5).toISOString();
  const get = async like => { const r = await fetch(`${URL_}/rest/v1/leads?select=id,email,note,created_at&note=like.${like}*&created_at=gte.${since}`, { headers: H }); return r.ok ? await r.json() : []; };
  const [kits, apps] = [await get("KIT"), await get("APPLICATION")];
  const applied = new Set(apps.map(a => (a.email || "").toLowerCase()));
  const only = (q.to || "").toLowerCase(), forceDay = +q.day || 0, test = !!(forceDay || q.closing || q.nudge), sent = [];
  const has = (L, tag) => new RegExp("SENT " + tag + "(\\s|$)").test(L.note || "");
  const mark = async (L, tag) => { if (test) return; L.note = (L.note || "") + "\nSENT " + tag; await fetch(`${URL_}/rest/v1/leads?id=eq.${L.id}`, { method: "PATCH", headers: H, body: JSON.stringify({ note: L.note }) }); };
  const firstOf = L => ((L.note || "").match(/Name: ([^\n]+)/) || [, "there"])[1].split(" ")[0];
  const unsubOf = L => `https://lockedindept.com/api/course?unsub=${L.id}&t=${token(L.id)}`;
  for (const L of kits) {
    if (!L.email || /UNSUBSCRIBED/.test(L.note || "")) continue;
    if (only && L.email.toLowerCase() !== only) continue;
    const gone = applied.has(L.email.toLowerCase());
    const elapsed = dayDiff(new Date(L.created_at), now);
    let tag = null, mail = null;
    const cm = (L.note || "").match(/Calc: now=(\d+) price=(\d+) floor=(\d+) gap=(\d+)/), hm = (L.note || "").match(/hours=(\d+) hnow=(\d+) hprice=(\d+)/);
    const calc = cm ? Object.assign({ now: +cm[1], price: +cm[2], floor: +cm[3], gap: +cm[4] }, hm ? { hours: +hm[1], hnow: +hm[2], hprice: +hm[3] } : {}) : null;
    if (forceDay) { if (course.lessons[forceDay]) { tag = "d" + forceDay; mail = course.lessons[forceDay](firstOf(L), calc); } }
    else if (q.closing) { const c = course.closing[(+q.closing || 1) - 1]; if (c) { tag = "c" + q.closing; mail = c(firstOf(L)); } }
    else if (!q.nudge) {
      // lessons: today's, or the earliest one missed (only for leads already tracked by SENT markers)
      const tracked = /SENT /.test(L.note || "");
      let n = null;
      if (tracked) { for (let i = 1; i <= Math.min(elapsed, 5); i++) if (!has(L, "d" + i)) { n = i; break; } }
      else if (elapsed >= 1 && elapsed <= 5) n = elapsed;
      if (n && !(gone && n === 5)) { tag = "d" + n; mail = course.lessons[n](firstOf(L), calc); }
      // closing emails: only for people who finished the course and haven't applied
      else if (!gone && elapsed > 5 && course.isOpen()) {
        if (ymd >= "2026-11-25" && ymd <= "2026-11-27" && !has(L, "c1")) { tag = "c1"; mail = course.closing[0](firstOf(L)); }
        else if (ymd >= "2026-11-29" && ymd <= "2026-11-30" && !has(L, "c2")) { tag = "c2"; mail = course.closing[1](firstOf(L)); }
      }
    }
    if (!mail) continue;
    try { await send(Object.assign({ to: L.email }, mail, { unsub: unsubOf(L) })); await mark(L, tag); sent.push([L.email, tag]); }
    catch (e) { console.error(L.email, e.message); }
  }
  // applicants: book-your-call nudge two days after applying
  for (const L of apps) {
    if (!L.email || (only && L.email.toLowerCase() !== only)) continue;
    const el = dayDiff(new Date(L.created_at), now);
    if (!q.nudge && !(el >= 2 && el <= 4 && !has(L, "nudge"))) continue;
    if (q.day || q.closing) continue;
    try { await send(Object.assign({ to: L.email }, course.applicantNudge(((L.note || "").match(/Name: ([^\n]+)/) || [, "there"])[1].split(" ")[0]))); await mark(L, "nudge"); sent.push([L.email, "nudge"]); }
    catch (e) { console.error(L.email, e.message); }
  }
  return res.status(200).json({ kits: kits.length, applicants: apps.length, sent });
};
