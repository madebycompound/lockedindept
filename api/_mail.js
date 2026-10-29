// Shared: branded email shell + send via Resend. Needs RESEND_API_KEY in Vercel.
const FROM = "Locked In Dept. <hello@lockedindept.com>";
function esc(s) { return String(s || "").replace(/[&<>]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c])); }
function shell({ kicker, title, body, cta, url }) {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)}</title></head>
<body style="margin:0;padding:0;background:#ECEBE7;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#ECEBE7;"><tr><td align="center" style="padding:32px 16px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ECEBE7;border:1px solid #0B0B0B;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;color:#0B0B0B;">
<tr><td style="padding:14px 24px;border-bottom:1px solid #0B0B0B;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td style="font-size:11px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;">Locked In Dept.</td><td align="right" style="font-size:11px;font-weight:500;letter-spacing:.06em;text-transform:uppercase;">${esc(kicker)}</td></tr></table></td></tr>
<tr><td style="padding:40px 24px 8px;"><div style="font-size:44px;line-height:.95;font-weight:800;letter-spacing:-1.5px;text-transform:uppercase;">${esc(title)}</div></td></tr>
<tr><td style="padding:16px 24px 32px;font-size:17px;line-height:1.5;white-space:pre-line;">${esc(body)}</td></tr>
${cta ? `<tr><td style="padding:0 24px 40px;"><a href="${url}" style="display:block;background:#0B0B0B;color:#ECEBE7;text-decoration:none;padding:18px 24px;font-size:13px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;">${esc(cta)} &nbsp;→</a></td></tr>` : ""}
<tr><td style="padding:14px 24px;border-top:1px solid #0B0B0B;font-size:11px;font-weight:500;letter-spacing:.06em;text-transform:uppercase;">Independent culture / 001</td></tr>
</table></td></tr></table></body></html>`;
}
async function send({ to, subject, ...rest }) {
  const key = process.env.RESEND_API_KEY; if (!key) throw new Error("RESEND_API_KEY not set");
  const r = await fetch("https://api.resend.com/emails", { method: "POST", headers: { authorization: "Bearer " + key, "content-type": "application/json" }, body: JSON.stringify({ from: FROM, to: [to], subject, html: shell(rest) }) });
  if (!r.ok) throw new Error("Resend " + r.status + " " + await r.text());
  return r.json();
}
function weekKey(d) { const x = new Date(d || Date.now()); x.setUTCDate(x.getUTCDate() - ((x.getUTCDay() + 6) % 7)); return x.toISOString().slice(0, 10); }
module.exports = { send, shell, weekKey };
