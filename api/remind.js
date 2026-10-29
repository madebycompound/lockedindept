// Vercel cron (see vercel.json): runs daily. Sunday: nudge anyone who hasn't done this week's check-in.
// Monday: nudge anyone who still hasn't, once more. Needs SUPABASE_SERVICE_ROLE_KEY, RESEND_API_KEY, CRON_SECRET in Vercel.
const { send, weekKey } = require("./_mail");
const SITE = "https://lockedindept.com";

module.exports = async (req, res) => {
  const auth = req.headers.authorization || "";
  if (process.env.CRON_SECRET && auth !== "Bearer " + process.env.CRON_SECRET) return res.status(401).json({ error: "no" });
  const url = process.env.SUPABASE_URL || "https://pqsgymxddtrmzpcawzxi.supabase.co", key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) return res.status(503).json({ error: "SUPABASE_SERVICE_ROLE_KEY not set" });
  const day = new Date().getUTCDay(); // 0 Sun, 1 Mon
  const force = req.query && req.query.force === "1";
  if (!force && day !== 0 && day !== 1) return res.status(200).json({ skipped: "not Sunday or Monday" });

  const r = await fetch(url + "/rest/v1/member_state?select=user_id,email,state", { headers: { apikey: key, authorization: "Bearer " + key } });
  const rows = await r.json(); const wk = weekKey(); const sent = [];
  for (const m of rows) {
    const S = m.state || {}; if (!m.email) continue;
    if ((S.weeks || []).some(w => w.week === wk)) continue;
    if (S.unsubscribed) continue;
    const first = (S.name || "").split(" ")[0] || "there";
    const second = day === 1;
    try {
      await send({ to: m.email, subject: second ? "Still waiting on your week" : "Your weekly check-in",
        kicker: "Club Locked In / Check-in", title: second ? "Monday. Still blank." : "How was the week?",
        body: second
          ? `${first}, your check-in for this week is still empty. Josh reads them Monday morning and replies to every one. Ten minutes: the numbers, three lines of honesty, three goals.`
          : `${first}, Sunday is check-in day. Log the numbers (earned, hours, quotes sent, the biggest price you said out loud), then wins, insights, honesty and three goals for next week. Josh replies Monday.`,
        cta: "Do the check-in", url: SITE + "/portal/check-in#week" });
      sent.push(m.email);
    } catch (e) { console.error(m.email, e.message); }
  }
  return res.status(200).json({ week: wk, sent });
};
