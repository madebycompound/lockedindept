// Content for the portal. Edit this file to change lessons, agents, calls and the Core Four questions.
window.LID_DATA = {
  cohort: { name: "Founding cohort", starts: "January 2027", event: "In person, first week of December" },

  method: [
    { n: "01", key: "clarity", title: "Clarity", desc: "What you're really selling, who it's for, and the bigger vision you've been putting off saying out loud." },
    { n: "02", key: "price", title: "Price", desc: "Offers and pricing rebuilt around value, plus the words for the conversation that makes you nervous." },
    { n: "03", key: "visibility", title: "Visibility", desc: "Stop hiding behind the work. Show how you think and become the name people refer." },
    { n: "04", key: "systems", title: "Systems", desc: "AI agents for the inbox, outreach, content and onboarding, so growth stops costing you hours." }
  ],

  // video: a Vimeo or Mux URL. Empty = coming soon.
  lessons: [
    { n: "01", module: "clarity", title: "What you actually sell", mins: 12, video: "", summary: "Separate the deliverable from the outcome. Clients don't buy a film, they buy what the film does." },
    { n: "02", module: "clarity", title: "The client you want, on paper", mins: 14, video: "", summary: "Write the brief for your ideal client before they write one for you." },
    { n: "03", module: "clarity", title: "Saying the big vision out loud", mins: 11, video: "", summary: "The goal that scares you, and why saying it to someone else is the first move." },
    { n: "04", module: "price", title: "Pricing on value, not hours", mins: 16, video: "", summary: "Day rates tell clients you sell time. Projects tell them you sell results." },
    { n: "05", module: "price", title: "Rewrite your rate card", mins: 14, video: "", summary: "Three options, one obvious choice. Build the card you're not embarrassed to send." },
    { n: "06", module: "price", title: "The quote conversation, word for word", mins: 18, video: "", summary: "Exactly what to say when they ask the price, and when they say it's too much." },
    { n: "07", module: "visibility", title: "Show how you think", mins: 12, video: "", summary: "Posting the work gets you compared. Posting your thinking gets you chosen." },
    { n: "08", module: "visibility", title: "Your face, your opinion", mins: 10, video: "", summary: "Why the creatives who get referred are the ones with a point of view." },
    { n: "09", module: "visibility", title: "Becoming the referral", mins: 13, video: "", summary: "Turn one good client into the next three without asking for favours." },
    { n: "10", module: "systems", title: "Install your first agent", mins: 15, video: "", summary: "Pick the job eating your week and hand it over. Step by step." },
    { n: "11", module: "systems", title: "The inbox you never touch", mins: 12, video: "", summary: "Every enquiry sorted and drafted in your voice before you've opened your laptop." },
    { n: "12", module: "systems", title: "Outreach that runs itself", mins: 14, video: "", summary: "Finding, writing and following up with the clients you actually want, on autopilot." }
  ],

  coreFour: [
    { key: "wealth", title: "Wealth", q: "How's the business doing right now, honestly? Pricing, pipeline, money in the bank." },
    { key: "self", title: "Self", q: "How much do you back yourself at the moment? Are you playing big or playing safe?" },
    { key: "health", title: "Health", q: "Energy, training, sleep. How's the body you're building all this on?" },
    { key: "relationships", title: "Relationships", q: "The people you're doing this for. Are they getting the best of you or what's left?" }
  ],

  // download: link to a .zip. Empty = coming soon.
  agents: [
    { n: "01", code: "LID-EDT-01", slug: "edit-assistant", name: "Edit assistant", desc: "Logs footage, pulls selects and cuts first drafts, so your own content actually goes out.", needs: "Claude Code, your footage folder", download: "", guide: "" },
    { n: "02", code: "LID-CON-02", slug: "content-scheduler", name: "Content scheduler", desc: "Turns your ideas and voice notes into a week of posts, queued by Monday.", needs: "Buffer", download: "", guide: "" },
    { n: "03", code: "LID-INB-03", slug: "inbox-agent", name: "Inbox agent", desc: "Sorts enquiries and drafts replies in your voice. You read and hit send.", needs: "Gmail or Outlook", download: "https://github.com/madebycompound/lockedindept/tree/main/plugins/inbox-agent", guide: "https://github.com/madebycompound/lockedindept/blob/main/plugins/inbox-agent/README.md" },
    { n: "04", code: "LID-PRO-04", slug: "proposal-builder", name: "Proposal builder", desc: "Turns a discovery call into a priced proposal built around value, not hours.", needs: "Your rate card", download: "", guide: "" },
    { n: "05", code: "LID-OUT-05", slug: "outreach-agent", name: "Outreach agent", desc: "Finds the clients you actually want, writes the first email, follows up.", needs: "Gmail, a sending domain", download: "", guide: "" },
    { n: "06", code: "LID-ONB-06", slug: "client-onboarding", name: "Client onboarding", desc: "Sends the welcome, collects the brief, books the kickoff.", needs: "Gmail, your booking link", download: "", guide: "" }
  ],

  // Upcoming calls. date: ISO string. Empty list = nothing scheduled yet.
  calls: [
    { type: "Live group session", title: "The quote conversation", date: "", link: "" }
  ]
};
