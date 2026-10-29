// Called by the coach view when Josh sends a reply: emails the member. Only a signed-in coach can call it.
const { send } = require("./_mail");
const COACHES = ["info@madebycompound.com"];
module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });
  const url = process.env.SUPABASE_URL || "https://pqsgymxddtrmzpcawzxi.supabase.co";
  const anon = process.env.SUPABASE_ANON_KEY || "sb_publishable_wBq1dszXPJ2CZzqkQIRXTA_hXE3b3zI";
  const token = (req.headers.authorization || "").replace(/^Bearer /, "");
  const u = await fetch(url + "/auth/v1/user", { headers: { apikey: anon, authorization: "Bearer " + token } });
  const me = u.ok ? await u.json() : null;
  if (!me || COACHES.indexOf((me.email || "").toLowerCase()) < 0) return res.status(403).json({ error: "coach only" });
  const { to, name, note } = req.body || {};
  if (!to || !note) return res.status(400).json({ error: "to and note required" });
  try {
    await send({ to, subject: "Josh replied to your check-in", kicker: "Club Locked In / From Josh", title: "From Josh.",
      body: note, cta: "Open the portal", url: "https://lockedindept.com/portal/home" });
    return res.status(200).json({ ok: true });
  } catch (e) { return res.status(502).json({ error: e.message }); }
};
