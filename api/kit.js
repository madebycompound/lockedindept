// Retainer Pricing Kit opt-in: saves the lead (note starts "KIT"), sends the kit email now.
// Lessons 1 to 5 follow from api/course.js. Email needs RESEND_API_KEY; the save works without it.
const crypto = require("crypto");
const { send } = require("./_mail");
const course = require("./_course");
const clean = (s, n) => String(s || "").replace(/\s+/g, " ").trim().slice(0, n);
const token = id => crypto.createHmac("sha256", process.env.CRON_SECRET || process.env.UNSUB_SECRET || "lid-unsub").update(id).digest("hex").slice(0, 24);
module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });
  const b = typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});
  if (b.company) return res.status(200).json({ ok: true });
  const name = clean(b.name, 80), email = clean(b.email, 200).toLowerCase(), handle = clean(b.handle, 80).replace(/^@/, "");
  if (!name || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return res.status(400).json({ error: "Add your name and a valid email." });
  const id = crypto.randomUUID();
  const url = process.env.SUPABASE_URL || "https://pqsgymxddtrmzpcawzxi.supabase.co";
  const anon = process.env.SUPABASE_ANON_KEY || "sb_publishable_wBq1dszXPJ2CZzqkQIRXTA_hXE3b3zI";
  let saved = false;
  try {
    const r = await fetch(url + "/rest/v1/leads", { method: "POST",
      headers: { apikey: anon, authorization: "Bearer " + anon, "content-type": "application/json", prefer: "return=minimal" },
      body: JSON.stringify({ id, email, handle: handle || null, note: `KIT / Retainer Pricing Kit\nName: ${name}\nSource: ${clean(b.source, 120) || "-"}` }) });
    saved = r.ok;
  } catch (e) {}
  let mailed = false;
  try {
    const first = name.split(" ")[0];
    await send(Object.assign({ to: email }, course.kit(first), { unsub: `https://lockedindept.com/api/course?unsub=${id}&t=${token(id)}` }));
    mailed = true;
  } catch (e) {}
  if (!saved && !mailed) return res.status(502).json({ error: "Something went wrong. Try again in a minute." });
  return res.status(200).json({ ok: true });
};
module.exports.token = token;
