// Daily cron (vercel.json): sends lesson N of the pricing-kit course to anyone who signed up N days ago (N = 1 to 5).
// Also handles unsubscribe links: /api/course?unsub=<lead id>&t=<token>.
// Needs SUPABASE_SERVICE_ROLE_KEY, RESEND_API_KEY and CRON_SECRET in Vercel (the same ones the check-in reminders use).
// Test by hand: /api/course?key=<CRON_SECRET>&to=<your email>&day=<1-5> sends that lesson to you only.
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
  const now = new Date(), since = new Date(now.getTime() - 7 * 864e5).toISOString();
  const r = await fetch(`${URL_}/rest/v1/leads?select=id,email,note,created_at&note=like.KIT*&created_at=gte.${since}`, { headers: H });
  const rows = r.ok ? await r.json() : [];
  const only = (q.to || "").toLowerCase(), forceDay = +q.day || 0, sent = [];
  for (const L of rows) {
    if (!L.email || /UNSUBSCRIBED/.test(L.note || "")) continue;
    if (only && L.email.toLowerCase() !== only) continue;
    const d = forceDay || dayDiff(new Date(L.created_at), now);
    const lesson = course.lessons[d]; if (!lesson) continue;
    const first = ((L.note || "").match(/Name: ([^\n]+)/) || [, "there"])[1].split(" ")[0];
    try { await send(Object.assign({ to: L.email }, lesson(first), { unsub: `https://lockedindept.com/api/course?unsub=${L.id}&t=${token(L.id)}` })); sent.push([L.email, d]); }
    catch (e) { console.error(L.email, e.message); }
  }
  return res.status(200).json({ checked: rows.length, sent });
};
