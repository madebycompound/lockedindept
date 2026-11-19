// Stripe webhook: runs when someone pays through a payment link on /90-days.
// Does four things: records the buyer as a lead, invites them to the portal, emails them the welcome and Josh the sale,
// and for the 3-payment plan sets the subscription to end after the third payment.
// Needs in Vercel: STRIPE_WEBHOOK_SECRET (signing secret of the webhook endpoint) and STRIPE_SECRET_KEY (restricted key: Subscriptions write).
// Uses the existing SUPABASE_SERVICE_ROLE_KEY and RESEND_API_KEY.
const crypto = require("crypto");
const { send } = require("./_mail");
const NOTIFY = "info@madebycompound.com";
const PLANS = { full: "Group, £697", split: "Group, 3 x £247", oneone: "1:1, £2,000" };
const SB = process.env.SUPABASE_URL || "https://pqsgymxddtrmzpcawzxi.supabase.co";

function raw(req) { return new Promise((res, rej) => { const c = []; req.on("data", d => c.push(d)); req.on("end", () => res(Buffer.concat(c))); req.on("error", rej); }); }
function verify(body, header, secret) {
  const parts = Object.fromEntries(String(header || "").split(",").map(p => p.split("=")));
  if (!parts.t || !parts.v1) return false;
  if (Math.abs(Date.now() / 1000 - +parts.t) > 300) return false;
  const want = crypto.createHmac("sha256", secret).update(parts.t + "." + body.toString("utf8")).digest("hex");
  try { return crypto.timingSafeEqual(Buffer.from(want), Buffer.from(parts.v1)); } catch (e) { return false; }
}

module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) return res.status(503).json({ error: "STRIPE_WEBHOOK_SECRET not set" });
  const body = await raw(req);
  if (!verify(body, req.headers["stripe-signature"], secret)) return res.status(400).json({ error: "bad signature" });
  const ev = JSON.parse(body.toString("utf8"));
  if (ev.type !== "checkout.session.completed") return res.status(200).json({ ok: true, ignored: ev.type });
  const s = ev.data.object, plan = (s.metadata || {}).plan;
  if (!PLANS[plan] || (s.metadata || {}).brand !== "lockedindept") return res.status(200).json({ ok: true, ignored: "not a 90 days link" });
  const email = ((s.customer_details || {}).email || "").toLowerCase(), name = (s.customer_details || {}).name || "", first = name.split(" ")[0] || "there";
  const done = {};

  // 1. End the 3-payment plan after the third payment: cancel 75 days in (payments land on day 0, ~30 and ~61; the fourth would be ~91).
  if (plan === "split" && s.subscription) {
    const sk = process.env.STRIPE_SECRET_KEY;
    if (sk) {
      try {
        const r = await fetch("https://api.stripe.com/v1/subscriptions/" + s.subscription, { method: "POST",
          headers: { authorization: "Bearer " + sk, "content-type": "application/x-www-form-urlencoded" },
          body: "cancel_at=" + (ev.created + 75 * 86400) + "&proration_behavior=none" });
        done.cancel_at = r.ok;
      } catch (e) { done.cancel_at = false; }
    } else done.cancel_at = false;
  }

  // 2. Record the sale.
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (key && email) {
    const H = { apikey: key, authorization: "Bearer " + key, "content-type": "application/json" };
    try { const r = await fetch(SB + "/rest/v1/leads", { method: "POST", headers: Object.assign({ prefer: "return=minimal" }, H),
      body: JSON.stringify({ email, note: `PURCHASE / 90 days\nName: ${name}\nPlan: ${PLANS[plan]}\nStripe: ${s.id}` }) }); done.lead = r.ok; } catch (e) { done.lead = false; }
    // 3. Invite to the portal (sends the branded invite email with a sign-in link).
    try { const r = await fetch(SB + "/auth/v1/invite", { method: "POST", headers: H, body: JSON.stringify({ email, data: { name, plan } }) }); done.invite = r.ok || r.status === 422; } catch (e) { done.invite = false; }
  }

  // 4. Emails.
  try {
    if (email) await send({ to: email, subject: "You're in. Here's what happens next.", kicker: "Locked In Dept. / The 90 days", title: "You're in.",
      body: `${first}, welcome to the founding cohort.\n\nYour portal login is in a separate email. Open it and start the 14-day cash sprint today: six short lessons built to bring money in before the programme starts.\n\nThe programme opens on 1 January. The first weekly group call is Tuesday 5 January, and you'll get the link before then.${plan === "oneone" ? "\n\nYou're 1:1, so I'll message you within a day to book our first call." : ""}${plan === "split" ? "\n\nYou're on 3 monthly payments of £247. Billing stops on its own after the third." : ""}\n\nJosh`,
      cta: "Open the portal", url: "https://lockedindept.com/portal/" });
    await send({ to: NOTIFY, subject: `SALE: ${name || email} (${PLANS[plan]})`, kicker: "90 days / Sale", title: "New member.",
      body: `Name: ${name}\nEmail: ${email}\nPlan: ${PLANS[plan]}\n\nPortal invite sent: ${done.invite ? "yes" : "NO, invite by hand"}\n${plan === "split" ? "Ends after 3 payments: " + (done.cancel_at ? "yes" : "NO, set the cancel date in Stripe") + "\n" : ""}${plan === "oneone" ? "\nMessage them to book the first 1:1 call." : ""}` });
    done.mail = true;
  } catch (e) { done.mail = false; }
  return res.status(200).json({ ok: true, done });
};
