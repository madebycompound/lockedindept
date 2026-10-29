// Locked In Dept. portal: auth, member state and shared UI.
(function () {
  var C = window.LID_CONFIG || {}, D = window.LID_DATA || {};
  var live = !!(C.SUPABASE_URL && C.SUPABASE_ANON_KEY && window.supabase);
  var sb = live ? window.supabase.createClient(C.SUPABASE_URL, C.SUPABASE_ANON_KEY) : null;
  var page = document.body.dataset.page || "";
  var isLogin = page === "login";

  // ---- storage (preview mode: this browser only; live: member's row in Supabase) ----
  var store = {
    key: "lid_state",
    local: function () { try { return JSON.parse(localStorage.getItem(this.key) || "{}"); } catch (e) { return {}; } },
    saveLocal: function (s) { try { localStorage.setItem(this.key, JSON.stringify(s)); } catch (e) {} },
    async load(user) {
      if (!live || !user) return this.local();
      var r = await sb.from("member_state").select("state").eq("user_id", user.id).maybeSingle();
      return (r.data && r.data.state) || {};
    },
    async save(user, s) {
      if (!live || !user) return this.saveLocal(s);
      await sb.from("member_state").upsert({ user_id: user.id, state: s, updated_at: new Date().toISOString() });
    }
  };

  var P = window.LID = {
    live: live, sb: sb, user: null, state: {},
    data: D, config: C,
    first: function () {
      var n = (this.state.name || (this.user && (this.user.user_metadata || {}).name) || "").trim();
      return n ? n.split(" ")[0] : "";
    },
    greeting: function () {
      var h = new Date().getHours(); var g = h < 12 ? "Morning" : h < 18 ? "Afternoon" : "Evening";
      var f = this.first(); return g + (f ? ", " + f + "." : ".");
    },
    toast: function (msg) {
      var t = document.getElementById("toast"); if (!t) return;
      t.textContent = msg; t.classList.add("on"); clearTimeout(t._h); t._h = setTimeout(function () { t.classList.remove("on"); }, 2200);
    },
    async set(patch) {
      Object.assign(this.state, patch); await store.save(this.user, this.state);
    },
    progress: function () {
      var done = this.state.done || {}; var ls = D.lessons || [];
      var n = ls.filter(function (l) { return done[l.n]; }).length;
      return { done: n, total: ls.length, pct: ls.length ? Math.round(100 * n / ls.length) : 0 };
    },
    nextLesson: function () {
      var done = this.state.done || {}; var ls = D.lessons || [];
      return ls.find(function (l) { return !done[l.n]; }) || ls[ls.length - 1];
    },
    stage: function () {
      var nl = this.nextLesson(); if (!nl) return null;
      return (D.method || []).find(function (m) { return m.key === nl.module; }) || null;
    },
    async signIn(email) {
      if (!live) { this.state.preview = true; store.saveLocal(this.state); location.href = "/portal/home"; return; }
      var r = await sb.auth.signInWithOtp({ email: email, options: { emailRedirectTo: location.origin + "/portal/home" } });
      if (r.error) throw r.error;
    },
    async signOut() {
      if (live) await sb.auth.signOut();
      try { localStorage.removeItem(store.key); } catch (e) {}
      location.href = "/portal/";
    },
    fmtDate: function (iso) {
      if (!iso) return "";
      var d = new Date(iso);
      return d.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" }) + " at " + d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
    }
  };

  // ---- shared chrome ----
  function chrome() {
    var nav = [["/portal/home", "Home"], ["/portal/library", "Library"], ["/portal/check-in", "Check-in"], ["/portal/calls", "Calls"], ["/portal/agents", "Agents"], ["/portal/assistant", "Assistant"]];
    var cur = "/portal/" + ((location.pathname.split("/").pop() || "home").replace(/\.html$/, "") || "home");
    var links = nav.map(function (n) { return '<a href="' + n[0] + '"' + (n[0] === cur ? ' aria-current="page"' : '') + '>' + n[1] + '</a>'; }).join("");
    var who = P.first() || "Member";
    var top = document.getElementById("chrome");
    if (top) top.innerHTML =
      (!live ? '<div class="preview lbl"><span>Preview mode. Progress is saved in this browser only.</span><a href="/">Back to lockedindept.com</a></div>' : '') +
      '<div class="bar gut lbl"><a href="/" style="text-decoration:none;font-weight:700">Locked In Dept.</a><span>Club Locked In / Member</span><nav aria-label="Portal">' + links + '</nav><span>' + who + ' / <a href="#" id="logout" style="text-decoration:none">Log out</a></span></div>';
    var lo = document.getElementById("logout"); if (lo) lo.addEventListener("click", function (e) { e.preventDefault(); P.signOut(); });
    var foot = document.getElementById("foot");
    if (foot) foot.innerHTML = '<div class="bar gut lbl" style="border-bottom:0;border-top:1px solid var(--line)"><span>© 2026 Locked In Dept.</span><span>Independent culture / 001</span><a href="mailto:' + (C.SUPPORT_EMAIL || '') + '" style="text-decoration:none">' + (C.SUPPORT_EMAIL || '') + '</a></div>';
  }

  // ---- boot ----
  async function boot() {
    if (live) {
      var s = await sb.auth.getSession(); P.user = s.data.session ? s.data.session.user : null;
      if (!P.user && !isLogin) { location.href = "/portal/"; return; }
      if (P.user && isLogin) { location.href = "/portal/home"; return; }
    } else {
      P.state = store.local();
      if (!P.state.preview && !isLogin) { location.href = "/portal/"; return; }
    }
    if (P.user) P.state = await store.load(P.user);
    if (!isLogin) chrome();
    document.dispatchEvent(new CustomEvent("lid:ready"));
  }
  boot();
})();
