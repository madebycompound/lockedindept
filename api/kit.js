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
  if (b.action === "calc") return saveCalc(b, res);
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
  return res.status(200).json({ ok: true, id: saved ? id : null, t: saved ? token(id) : null });
};
// Calculator numbers: replaces the "Calc:" line on the lead. Needs SUPABASE_SERVICE_ROLE_KEY (anon can't update leads).
async function saveCalc(b, res) {
  const id = String(b.id || ""), c = b.calc || {}, key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!/^[0-9a-f-]{36}$/i.test(id) || b.t !== token(id)) return res.status(400).json({ error: "bad id" });
  if (!key) return res.status(503).json({ error: "not configured" });
  const n = k => Math.max(0, Math.min(1e6, Math.round(+c[k] || 0)));
  const line = `Calc: now=${n("now")} price=${n("price")} floor=${n("floor")} gap=${n("gap")} day=${n("day")} hours=${n("hours")} hnow=${n("hnow")} hprice=${n("hprice")}`;
  const url = process.env.SUPABASE_URL || "https://pqsgymxddtrmzpcawzxi.supabase.co", H = { apikey: key, authorization: "Bearer " + key, "content-type": "application/json" };
  const g = await fetch(`${url}/rest/v1/leads?id=eq.${id}&select=note`, { headers: H }); const row = g.ok ? (await g.json())[0] : null;
  if (!row) return res.status(404).json({ error: "not found" });
  const note = (row.note || "").split("\n").filter(l => !l.startsWith("Calc: ")).concat(line).join("\n");
  await fetch(`${url}/rest/v1/leads?id=eq.${id}`, { method: "PATCH", headers: H, body: JSON.stringify({ note }) });
  return res.status(200).json({ ok: true });
}
module.exports.token = token;
