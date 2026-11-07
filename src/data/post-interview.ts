import type { EmailGuide } from "./types";

export const thankYouEmail: EmailGuide = {
  intro: [
    "A thank-you email is not a courtesy tax you pay after an interview. It is the last work sample the hiring team sees from you before they compare notes, and it is the only part of the process you write entirely on your own terms, with time to think. Interviewers forward these notes to each other. Hiring managers read them while they are deciding who felt sharp, who felt vague, and who actually listened. A specific, well-timed thank-you does not get you a job you did not earn in the room, but a missing or sloppy one can quietly move you down a list you worked hard to get on.",
    "This page gives you the rules that make the note work: when to send it so it lands while the conversation is still fresh, what to put in it so it reads as evidence rather than flattery, and subject lines that get opened instead of archived. Below are four copy-ready templates for the situations that actually come up — a standard hiring-manager interview, a panel, a short informal screen, and the note you send when you are already late. Copy the structure, replace the bracketed details with real ones from your conversation, and send it the same day.",
  ],
  sections: [
    {
      heading: "When to send it",
      body: [
        "Send it within 24 hours, and treat same business day as the real target. If you interviewed in the morning, send it that afternoon. If you interviewed late in the day, send it the next morning before the team starts its day. That window matters because interviewers usually debrief within a day or two, and your note needs to be in the thread before that conversation happens — not after the shortlist is already set.",
        "Logistics are simple but worth getting right. Email each person who interviewed you at the address you already have from scheduling, or the one on their business card or email signature. If the panel spanned time zones, go by your interviewer's local business hours, not yours — a note that arrives at 9 a.m. their time reads as prompt, one that arrives at 2 a.m. their time reads as careless even if the content is good. If you interviewed on a Friday, do not wait until Monday. Send it Friday evening or Saturday morning; waiting the whole weekend makes the note feel like an afterthought, because it was one.",
        "If you are past 24 hours, send it anyway. A late thank-you costs you a little polish — it signals you were busy or disorganized — but no note at all costs you more, because silence after an interview is easy to read as lost interest. Do not open with a long apology for the delay. One short line at most, then get straight to the substance. The note itself is the recovery.",
      ],
    },
    {
      heading: "What a good thank-you email contains",
      body: [
        "A strong thank-you has five parts, in this order, and none of them is long. First, thank them for a specific block of time — not for the opportunity in the abstract, but for the hour they spent with you on a particular day, on a particular topic. Second, name one specific moment from the conversation: a project they described, a problem they walked you through, a detail about the team you did not know before. That single detail does more work than anything else in the email, because it proves you were listening instead of performing.",
        "Third, make one clear fit point tied to something they said they need. If they told you the team is struggling with onboarding, connect that to the onboarding work you have actually done. One point, made well, beats three generic strengths. Fourth, if there was a moment where you felt a concern surface — a tool you have not used, a gap they probed — address it briefly and without defensiveness. You do not need to relitigate the answer. A single sentence that shows you thought about it afterward and have a credible way in is enough, and it often lands better than the original answer did.",
        "Fifth, close like an adult who wants the job. Say plainly that you are enthusiastic about the role and why, in one sentence that could not be pasted into an email to a different company. Then end with a clean next step: that you are available for anything else they need, or that you look forward to hearing about next steps on the timeline they mentioned. No begging, no pressure, no sign-off paragraph. Four to six short paragraphs total is the whole email.",
      ],
    },
    {
      heading: "Subject lines that get opened",
      body: [
        "Your subject line has one job: make the interviewer open the email today instead of letting it sit under forty others. Clear beats clever every time. The most reliable format names the role and the thanks directly, such as Thank you — [Role] interview, or Thank you for your time today. If you are replying in the existing scheduling thread, keep that thread — the context helps — but if you are starting a new email, a clean new subject is better than a forwarded chain with three Re: prefixes.",
        "You can add one specific detail if it helps the interviewer place you instantly, especially after a panel day when they met several candidates: Thank you — and a note on [the onboarding project], or Thank you, [Name] — [specific topic you discussed]. Keep it under about eight words either way. A subject line is a label, not a pitch.",
        "Avoid anything that creates false urgency or sounds like a marketing email. Following up!!, A quick question for you, and You will not regret hiring me all work against you — the first looks anxious, the second is dishonest if you do not actually have a question, and the third reads as arrogance rather than confidence. Skip exclamation points entirely, skip all caps, and never leave the subject blank. The interviewers who decide your fate open straightforward emails from people they remember. Be easy to remember for the right reason.",
      ],
    },
  ],
  templates: [
    {
      name: "The standard thank-you",
      when: "Use after a one-on-one interview with the hiring manager, sent the same day while the conversation is still fresh.",
      subject: "Thank you — [Role] interview",
      body: [
        "Hi [Name],",
        "Thank you for taking the time to speak with me today about the [Role] position. I appreciated how candid you were about where the team is headed this year, especially [specific project or priority you discussed].",
        "Our conversation confirmed what I had hoped — this role sits right at the intersection of the work I do best. When you described [the challenge or need they named, e.g., the team's migration to X], it sounded very close to what I worked on at [Current or Previous Company], where I [brief concrete result or responsibility]. I would be glad to bring that experience to your team.",
        "I left the conversation more enthusiastic about the role than when I arrived, particularly about [one specific aspect: the scope, the team, the problem space]. Please let me know if there is anything else I can share that would be helpful as you make your decision.",
        "Thank you again for your time and consideration.",
        "Best regards, [Your Full Name] [Your Phone Number]",
      ],
    },
    {
      name: "After a panel interview",
      when: "Use after a panel or a day of back-to-back interviews. Send one separate note to each interviewer — never one group email. Each note must reference something different that specific person said or asked, because panelists compare notes and forward emails to each other. If two of your notes could be swapped without anyone noticing, rewrite both.",
      subject: "Thank you for your time today",
      body: [
        "Hi [Name],",
        "Thank you for your time in today's panel interview for the [Role] position. I especially enjoyed your questions about [topic this interviewer focused on, e.g., how the team handles cross-functional handoffs].",
        "You mentioned that [specific thing this person said — a project, a pain point, a goal for the team]. That stayed with me, because in my current role I [short, relevant experience that connects directly to what they raised]. It is exactly the kind of problem I would like to keep working on.",
        "Talking with you and the rest of the panel gave me a much clearer picture of how [the team or function] works day to day, and it made me more confident this is the right fit. I would welcome the chance to continue the conversation.",
        "Thank you again — I appreciate you making time in a full day of interviews.",
        "Best, [Your Full Name]",
      ],
    },
    {
      name: "The short version",
      when: "Use for a small company, an informal process, or a recruiter phone screen where a long formal note would feel out of proportion. Short is not careless — every line still has to be specific.",
      subject: "Thank you — great speaking today",
      body: [
        "Hi [Name],",
        "Thanks for the conversation today. I enjoyed hearing more about [specific project you discussed] and where [Company] is taking it this year.",
        "It sounds like a strong match for the work I have been doing on [your relevant experience, in one short phrase], and I am glad we got to talk through how that might translate to your team.",
        "I am very interested in moving forward. Let me know what the next steps look like on your end, and I will make myself available.",
        "Thanks again, [Your First Name]",
      ],
    },
    {
      name: "The late thank-you",
      when: "Use when two or three days have passed and you have not sent anything yet. Send it now rather than skipping it. Do not apologize at length and do not invent an excuse — a brief acknowledgment, or none at all, keeps the focus on your fit instead of your delay.",
      subject: "Thank you — [Role] interview",
      body: [
        "Hi [Name],",
        "Thank you for speaking with me on [day of the interview] about the [Role] position. I have been thinking about our conversation since then, particularly what you shared about [specific project or challenge you discussed].",
        "The more I have thought about [the team's migration to X / the problem they described], the more it lines up with the work I did at [Previous Company], where I [brief result]. I am confident I could step into that part of the role quickly.",
        "I wanted to make sure I said directly: I am very interested in this position, and I appreciated the thoughtful questions you and the team asked. If it would help, I am happy to share [a work sample, references, or more detail on a project you mentioned].",
        "Thank you again for your time. I look forward to hearing about next steps whenever the team is ready.",
        "Best regards, [Your Full Name]",
      ],
    },
  ],
  mistakes: [
    "Copy-pasting the identical note to every panelist — they forward and compare them, and identical notes tell the whole panel you did not actually listen to any of them individually.",
    "Writing an essay — anything past roughly 200 words stops being a thank-you and starts being a second cover letter nobody asked for and few will finish.",
    "Introducing brand-new selling points that contradict the interview — the email is for reinforcing what landed in the room, not for quietly rewriting answers you gave.",
    "Misspelling the interviewer's name — it is on the calendar invite and in their email signature, and getting it wrong undoes the attention to detail the note was meant to prove.",
    "Sending at 2 a.m. — schedule it for morning business hours instead, because the timestamp is the first thing they see and it shapes how the rest reads.",
    "Attaching things unasked — unsolicited decks, writing samples, and reference lists read as pushy; offer them in a sentence and send them only if they say yes.",
    "Thanking them for the opportunity three times — once is gracious, three times is groveling, and groveling makes a strong candidate sound unsure they belong in the process.",
  ],
  faqs: [
    {
      q: "Should I send an email or a handwritten note?",
      a: "Email, almost always. Hiring decisions move in days, and a handwritten note that arrives after the debrief helps no one. Email also lets the interviewer forward your note to the rest of the panel, which is often how a good thank-you does its real work. The exception is a very small, traditional organization where you know the culture values it — and even then, send the email first and let the card be a supplement, never a substitute.",
    },
    {
      q: "What if I do not have the interviewer's email address?",
      a: "Do not guess at an address format and risk the note landing in a stranger's inbox. Ask your recruiter or coordinator to forward it — send them the note addressed to the interviewer and ask them to pass it along, which they do routinely. Better still, prevent the problem: at the end of the interview, ask for the best way to follow up, or ask the coordinator for email addresses as you are being walked out. People expect the question and it signals you intend to follow through.",
    },
    {
      q: "With multiple interviewers, do I send one email each or a group email?",
      a: "One email each, every time. A group thank-you reads as a broadcast and forces every recipient to wonder if they were the only one who got it — and it guarantees the content stays too generic to mention anything specific anyone said. Individual notes take ten extra minutes and are the entire point. The only exception is a brief note to a coordinator or recruiter thanking them for organizing the day, which is separate and can be shorter.",
    },
    {
      q: "Should I send a thank-you after a phone screen?",
      a: "Yes, but keep it proportional. A recruiter screen gets the short version: three or four short paragraphs, thanks for the conversation, one specific thing you discussed, and a clear statement of interest in the next step. It takes five minutes and it does help, because recruiters track which candidates follow up and which go silent. A full hiring-manager-style note after a 20-minute screen would feel out of scale, so match the length to the conversation.",
    },
    {
      q: "Does a thank-you email actually affect the hiring decision?",
      a: "On its own, rarely — it will not rescue a weak interview. But decisions are often close calls between two qualified finalists, and in a close call the note is recent, concrete evidence of how you communicate in writing, how much attention you paid, and how much you want this specific job rather than any job. Hiring managers also treat a missing note as data: in a process built on follow-through, the candidate who did not follow up has given the team one less reason to advocate for them in the room.",
    },
  ],
};

export const followUpEmail: EmailGuide = {
  intro: [
    "The thank-you email covers the first 24 hours. This page is about everything after that: the week of refreshing your inbox, the timeline that came and went, the final round that ended in warm words and then silence. Following up in that stretch is not desperate and it is not a nuisance — hiring teams expect it, and recruiters quietly rely on it to know who is still interested. Done on a sane cadence, a follow-up keeps you present without costing you dignity. Done badly, it does the opposite, which is why the timing and the tone matter more than the words themselves.",
    "The goal of every follow-up is narrow: make it easy to reply. You are not trying to force a decision, extract information you are not owed, or make anyone feel guilty. You are putting a short, professional note at the top of an inbox so that replying takes the hiring manager thirty seconds. Below is the cadence to follow, what each note should contain, how to handle total silence, and four templates — from the first check-in after a missed timeline to the final note that closes the loop and, more often than people expect, is the one that finally gets an answer.",
  ],
  sections: [
    {
      heading: "When to follow up: the cadence",
      body: [
        "Anchor everything on the timeline they gave you. If they said you would hear something by Friday, your clock starts Friday — follow up the next business day after that date passes, not before it and not the morning of. Sending early signals that you were not listening; sending the Tuesday after a Friday deadline signals that you were, and that you gave them a fair grace period. If they gave you a range, use the far end of it. If the final interview ended with no timeline at all, wait about a week from your last contact before the first check-in.",
        "After the first follow-up, space subsequent notes roughly a week apart. That rhythm respects the reality that hiring decisions wait on calendars, approvals, and people who are out of office, none of which your daily emails can speed up. Two to three unanswered follow-ups after the stated timeline has passed is the full sequence. At that point you send one final, graceful close-the-loop note and genuinely move on — continuing to chase a process that has gone silent past that point rarely changes the outcome and always costs you leverage and peace of mind.",
        "Keep track of your own cadence in a simple note: who you emailed, when, and what they said last. In a search with several processes running, it is easy to double-email one manager or mix up two timelines, and those small errors are exactly what make a candidate look scattered. Professional follow-up is a system, not a mood — you send when the calendar says to, not when anxiety says to.",
      ],
    },
    {
      heading: "What a good follow-up contains",
      body: [
        "Keep it to four or five short lines of substance. Start by anchoring the note in the last real conversation: name the date you last spoke and the role, so a busy reader can place you without scrolling. Then one line — one — restating your fit and enthusiasm, tied to something specific about the role or team. Not a new pitch, not a repeat of your resume. Just a reminder of the match, in the same terms you used in the interview.",
        "If you have one genuinely useful addition, this is where it belongs. A relevant article about a problem they mentioned, the work sample you offered to send and never did, or a brief, clean answer to a question you fumbled in the interview — each of these gives the reader something instead of only asking for something. Keep it to two or three sentences and do not oversell it. If you do not have a real addition, do not manufacture one; a plain check-in is perfectly respectable.",
        "Close with a single low-friction question that is easy to answer, such as asking whether there is anything else they need from you, or whether the timeline has shifted. That framing invites a one-line reply and offers your help instead of demanding their time. What never belongs in a follow-up: guilt, comparisons to other candidates, hints that you are offended, or any version of an ultimatum. The tone you are aiming for is the colleague they would be hiring — calm, useful, and easy to work with even when the news is slow.",
      ],
    },
    {
      heading: "When you hear nothing at all",
      body: [
        "Silence after interviews is common, and it is almost never a verdict on you delivered in code. Decisions stall for reasons that have nothing to do with any candidate: a budget that needs a second signature, a hiring manager whose quarter just blew up, an internal candidate who has to be considered first, a reorganization that froze requisitions mid-process. Sometimes the role is quietly re-scoped or closed and nobody owns telling the finalists. None of that is fair to you, but understanding it keeps you from reading a stalled process as a personal rejection and acting on that misreading.",
        "This is why the final follow-up — the break-up email — so often gets the reply the earlier notes did not. A gracious note that says you are closing your own loop, that you assume the timing or the role has changed, and that you would still welcome hearing from them, removes the guilt a busy hiring manager feels about an overdue reply. Answering it is a relief instead of a chore. Keep it warm and genuinely final: no passive aggression, no last pitch, no pretending you will keep waiting indefinitely.",
        "Whatever happens, leave the door open on purpose. Industries are small, panels reunite at other companies, and the manager who went silent in March may be the one hiring again in October with you as the first call — if your last interaction left them feeling respected rather than cornered. Send the final note, log the outcome, and put your energy into the next process. The candidates who handle silence professionally are the ones who get remembered when the silence was never about them.",
      ],
    },
  ],
  templates: [
    {
      name: "The timeline-passed check-in",
      when: "Use when the date they gave you has passed by a day or two — they said by Friday, it is now Tuesday. This is your first follow-up, and it should be short, warm, and free of any suggestion that they have done something wrong.",
      subject: "Re: [Role] interview — checking in",
      body: [
        "Hi [Name],",
        "I wanted to check in following my interview on [date] for the [Role] position. When we last spoke, you mentioned the team hoped to have next steps by [Friday / the date they gave]. I know timelines shift, so I mainly wanted to reiterate my interest and ask whether there is anything else you need from me.",
        "Our conversation about [specific project or priority you discussed] has stayed with me, and it reinforced that this role is a strong fit for the work I have been doing on [your relevant experience, in one short phrase].",
        "No rush on my end — I appreciate an update whenever you have one. Thank you again for your time throughout the process.",
        "Best regards, [Your Full Name]",
      ],
    },
    {
      name: "The value-add follow-up",
      when: "Use for a second check-in, or a first one where you have a real follow-through to deliver: the work sample you mentioned in the interview, a relevant link, or a cleaner answer to a question you handled poorly. The addition must be genuinely useful and brief — if it feels like a pretext, leave it out and send the plain check-in instead.",
      subject: "Following up — and the [work sample / article] I mentioned",
      body: [
        "Hi [Name],",
        "Following up on my interview for the [Role] position on [date] — I remain very interested, and I wanted to send along [the portfolio piece / the analysis] I mentioned when we discussed [specific project you discussed]. It is attached here; the short version is [one sentence on what it shows and why it is relevant to their problem].",
        "I also came across [a relevant article / report] on [topic tied to a challenge they named] and thought of your team's work on it — no need to read it on my account, but it sharpened my thinking about how I would approach [the specific challenge] in the role.",
        "I know the team is working through its timeline. Please let me know if more detail on my background with [relevant skill or project] would be useful at this stage.",
        "Thank you again for considering me.",
        "Best, [Your Full Name]",
      ],
    },
    {
      name: "After the final round",
      when: "Use after a final round — panel plus hiring manager — when a week has passed with no word. Address it to the hiring manager, keep it shorter and warmer than the earlier notes, and acknowledge the full process rather than only the last conversation.",
      subject: "Thank you — and checking in on next steps",
      body: [
        "Hi [Name],",
        "I wanted to thank you once more for the time you and the team gave me across the interview process for the [Role] position, and to check in on next steps now that the final round has wrapped up.",
        "Meeting everyone — especially hearing from [panel member or team] about [specific project or direction you discussed] — left me more convinced, not less, that this is the team and the problem I want to work on next.",
        "Whenever the team is ready, I am glad to provide anything further. And if the timeline has moved, a quick note either way is more than enough.",
        "With appreciation, [Your Full Name]",
      ],
    },
    {
      name: "The close-the-loop note",
      when: "Use as your final follow-up after two or three unanswered notes. This is the break-up email, and it works because it is genuinely gracious — no guilt, no edge, no hidden pitch. Send it once, mean it, and move on to your other options with the door left open behind you.",
      subject: "Closing the loop — [Role] position",
      body: [
        "Hi [Name],",
        "I have followed up a couple of times since my interviews for the [Role] position, and I do not want to keep adding to your inbox. I will assume the timing or the role has changed, and I am closing the loop on my end — no hard feelings at all, and no reply is owed.",
        "I genuinely enjoyed meeting you and the team, and [Company] remains a place I would be glad to join if a role like this opens up again. The conversation about [specific project you discussed] told me a lot about the standard your team works to.",
        "Thank you for the time you gave me in the process. I wish you and the team well with the search and with [the project or launch you discussed].",
        "All the best, [Your Full Name]",
      ],
    },
  ],
  mistakes: [
    "Following up before the stated date — if they said Friday, a Wednesday nudge tells them you were not listening, and it burns the goodwill your first real follow-up needed.",
    "Daily or near-daily nudges — more than one note a week stops reading as interest and starts reading as pressure, and people avoid replying to pressure.",
    "Writing just bumping this to the top of your inbox — it adds no information, asks for effort instead of offering ease, and has become the most ignored sentence in hiring.",
    "Guilt trips in any form — mentioning sacrifices you made, interviews you skipped, or how long you have waited makes the reader's overdue reply feel heavier, not easier.",
    "Hinting that you turned down other offers when you have not — a bluff that a single phone call can expose, and one that permanently changes how that manager sees your honesty.",
    "Replying-all to the whole panel — your follow-up belongs with the hiring manager or your recruiter contact; broadcasting it turns a professional check-in into an audience performance.",
  ],
  faqs: [
    {
      q: "How many follow-ups is too many?",
      a: "As a working rule: one check-in after the stated timeline passes, one more about a week later, and one final close-the-loop note. Three, spread over two to three weeks, is persistent. A fourth unanswered note is chasing, and it has never once been the message that turned a silent process around. If they reply at any point — even with a holding update — the count resets, and you simply follow the new timeline they give you.",
    },
    {
      q: "What if the recruiter goes silent but the hiring manager was warm?",
      a: "Give the recruiter one more chance first — they are your official channel and may simply be waiting on the manager themselves. If a full cycle passes with nothing, one brief, polite note directly to the hiring manager is acceptable, especially if you already exchanged email during the process. Keep it shorter than your normal follow-up, acknowledge that you know the recruiter is your main contact, and do not criticize the recruiter's silence. Going around them repeatedly, or playing the two against each other, backfires.",
    },
    {
      q: "Should you follow up after a rejection?",
      a: "Not with a follow-up — with a different note, once, and briefly. Thank them for the news and for the process, name one thing you took from the conversations, and say you would welcome staying in touch if a fitting role opens later. That note is remembered, and it is why rejected finalists get called back for other roles. What not to do: argue the decision, ask for a detailed critique of your candidacy, or keep checking in afterward. One gracious note closes it; anything more reopens it badly.",
    },
    {
      q: "Should I follow up on LinkedIn instead of email?",
      a: "Email first, almost always — it is the channel the process is already running on, it reaches the thread where your interview lives, and it does not ask the person to manage a second conversation in a public-facing inbox. A LinkedIn connection request with a short, warm note is reasonable after the process ends, as a way to stay in each other's networks. Using LinkedIn messages to chase a live decision, especially after email silence, reads as escalation rather than initiative.",
    },
    {
      q: "What if I get another offer while I am waiting?",
      a: "This is the one legitimate reason to compress the cadence, and it only works if it is true. Write once, promptly, and factually: name the role you are waiting on as your strong preference if that is honest, state the date by which you need to respond to the other offer, and ask whether their timeline can accommodate it. Give them a real date with a little room, not a deadline invented for effect. Never bluff an offer or a deadline — hiring managers talk to each other, a called bluff ends the relationship, and a genuine one handled calmly often speeds a decision you actually want.",
    },
  ],
};
