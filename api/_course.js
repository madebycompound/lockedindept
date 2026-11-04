// The 5-day email course that follows the Retainer Pricing Kit. Day 0 is the kit delivery, sent by api/kit.js.
// Days 1 to 5 are sent by api/course.js (daily cron), one per calendar day after signup.
const SITE = "https://lockedindept.com";
module.exports = {
  kit: (first) => ({
    subject: "Your Retainer Pricing Kit",
    kicker: "Kit 01 / Retainer pricing", title: "Here's the kit.",
    body: `${first}, here it is: the formula, the ladder and the calculator.\n\nThere's a PDF version too, with a worksheet you can print and fill in for your next client: https://lockedindept.com/pricing-kit/retainer-pricing-kit.pdf\n\nStart with the calculator. Put in a client you're working with right now, or one you want, and see what the number should be. Most people find they've been quoting somewhere near their floor.\n\nTomorrow morning: lesson one. Why your price has almost nothing to do with your skill.\n\nJosh`,
    cta: "Open the kit", url: SITE + "/pricing-kit/kit"
  }),
  lessons: [
    null,
    (first, c) => ({
      subject: c && c.gap > 0 ? `You're leaving £${c.gap.toLocaleString("en-GB")} a month on the table` : "My £1k retainers pay more per hour than my £10k one did",
      kicker: "Lesson 01 of 05 / Pricing", title: "Your price isn't your skill.",
      body: `${first}, here's something most pricing advice won't tell you.\n\nI've had a £10,000 a month retainer. It needed a team of two and took 2 to 3 days a week. Per hour, before paying the second person, it worked out at £96 to £125.\n\nI've also got a £1,000 a month retainer that takes about 6 hours. That's £165 an hour. Another £1k client has been with me three years at 6 to 7 hours a month, nearly £30,000 so far.\n\nThe small ones pay me more per hour. It's time in, money out.\n\n${c && c.gap > 0 ? `You ran the numbers yesterday. You're charging £${c.now.toLocaleString("en-GB")} a month for work the formula prices at £${c.price.toLocaleString("en-GB")}. That's £${(c.gap * 12).toLocaleString("en-GB")} a year you're not charging for.${c.hours ? ` Or put the way that matters: right now an hour of your time pays you £${c.hnow}. At your price, the same hour pays £${c.hprice}.` : ""}\n\n` : ""}Your price isn't set by how good you are. It's set by the result the client believes you can deliver, and whether they can afford to pay for it.\n\nIf you just learned to use a camera, you're not getting £10k months, and you shouldn't. But if you've been at this a few years and you're still hovering around £5k months, skill isn't the problem. How you communicate it is.\n\nToday: open the calculator and run one real client through it. Look at the gap between your floor and your price. That gap is what you've been leaving on the table.\n\nJosh`,
      cta: "Open the calculator", url: SITE + "/pricing-kit/kit#calc"
    }),
    (first) => ({
      subject: "Sell the result, not the hours",
      kicker: "Lesson 02 of 05 / Offer", title: "Sell the result, not the hours.",
      body: `${first}, nobody wakes up wanting four videos a month.\n\nThey want people to notice them. They want the phone to ring. They want the launch to land. The videos are how you get them there.\n\nWhen you sell hours or deliverables, you get compared on price. When you sell the result, you get compared on whether you can deliver it, and the price follows.\n\nSo rewrite your offer around three things:\n1. Who it's for, specifically.\n2. The result they get, in their words.\n3. What's included, last, as the proof you can deliver.\n\nAnd make it monthly. Project work keeps you on the hamster wheel. Retainers give you a floor every month.\n\nThe honest part: the more of the result you own, the more it's worth. Owning a result takes a stack of skills (strategy, production, editing, copy, ads, reporting) that used to need a team. It's never been easier to stack them yourself. AI now does a lot of what a second person would have done. Own more of the result, without adding more of your hours.\n\nJosh`,
      cta: "See the ladder", url: SITE + "/pricing-kit/kit"
    }),
    (first) => ({
      subject: "Diagnose, then prescribe",
      kicker: "Lesson 03 of 05 / Pitch", title: "Diagnose, then prescribe.",
      body: `${first}, the fastest way to lose a good client is to send a price list.\n\nA doctor doesn't hand you a menu. They ask questions, find the problem, then tell you what you need. You don't haggle, because it's a prescription, not a quote.\n\nSell the same way. On the call, ask:\n• What are you selling, and what's a new customer worth?\n• What's working, and what isn't?\n• If this went perfectly, what would be different in 90 days?\n\nThen prescribe. Three options, the middle one is the one you want. Say the number and stop talking.\n\nIt does two things: it reduces the guesswork, and it builds the emotional buy-in. They buy logically and emotionally, which is how people actually buy.\n\nJosh`,
      cta: "Read: saying the number", url: SITE + "/pricing-kit/kit"
    }),
    (first) => ({
      subject: "Stop being the hired tripod",
      kicker: "Lesson 04 of 05 / Positioning", title: "Stop being the hired tripod.",
      body: `${first}, if a client could swap you for the next person on Instagram and get the same thing, you're a hired tripod. You'll be paid like one.\n\nThe way out isn't a better showreel. It's owning your expertise: being clear on who you're the leader for, and saying it everywhere.\n\nNot "filmmaker for brands". Something like: "I make content for independent food brands that turns followers into customers." Narrow feels scary. It's what lets you charge more, because to that client, you're the obvious choice.\n\nThen add leverage. You win on expertise × leverage, not as a service provider. Expertise without leverage burns you out. Leverage without expertise makes you a commodity. The expert who owns the result and lets agents carry the work is the one who wins.\n\nToday: write your one line. Who you're for, and the result you get them. Put it in your bio. Watch who it pulls in.\n\nJosh`,
      cta: "Score your Core Four", url: SITE + "/score"
    }),
    (first, c) => ({
      subject: "The number you're scared to say",
      kicker: "Lesson 05 of 05 / Belief", title: "The number you're scared to say.",
      body: `${first}, last one.\n\nYou can know all of this and still quote low. Pricing isn't a maths problem. It's a belief problem. The number you're scared to say out loud is usually the right one.\n\n${c && c.price ? `For you, that number is £${c.price.toLocaleString("en-GB")} a month. Say it out loud once today.\n\n` : ""}Josh Gore went from £500 shoots to £5,000 a month retainers, then landed a room of 100 of his ideal clients. He didn't get better at filming. He stopped thinking like a freelancer and started acting like the expert he already was.\n\nThat's what the 90 days are for. Ten creatives, from January. We fix the offer, the price and the pitch, and we work on the person who has to say the number. It comes with an ROI guarantee: do the work, and if you haven't made back what you paid by day 90, I keep working with you free until you have.\n\nApplications close 30 November.\n\nJosh`,
      cta: "Apply for January", url: SITE + "/90-days#apply"
    })
  ]
};
