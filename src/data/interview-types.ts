import type { InterviewTypeGuide } from "./types";

// Interview-format guides (spec §5.1): how the format actually works,
// plus the questions that format really uses, answered for its context.

export const phoneInterview: InterviewTypeGuide = {
  intro: [
    "A phone screen is not a small interview. It is a filter, usually run by a recruiter who does not do your job and is not deciding whether you are the best candidate — they are deciding whether you are a plausible one. In twenty minutes they check you against a short list: can this person do the basics of the role, are the logistics compatible, is the salary band survivable, and do they sound like someone the hiring manager will thank them for sending over? Candidates fail phone screens every day who would have passed the real interview, because they prepared for the wrong judge.",
    "So prepare for the filter, not the final. The hiring manager will probe depth later; the screener probes fit, clarity, and red flags. Your answers should be shorter, more concrete, and more logistical than your interview answers, and every one of them should make the recruiter's internal write-up easy to write. The single goal of the call is singular: be the person they are comfortable advancing. Everything else — selling your vision, exploring the role's nuances, negotiating — belongs to later rounds, and trying to do it here reads as not understanding how hiring works.",
  ],
  sections: [
    {
      heading: "How a phone screen is actually scored",
      body: [
        "The recruiter is working from a checklist that came out of their intake meeting with the hiring manager, and most of it is not about brilliance. They confirm the role basics: the two or three skills or experiences the manager named as non-negotiable. They check salary band fit early, because advancing a candidate the budget cannot hire wastes everyone's month. They confirm start date, location or schedule constraints, work authorization, and anything else that could kill the candidacy later. And throughout, they are judging communication clarity — if the recruiter cannot follow your answers, they assume the manager will not either, because their write-up is literally a summary of what you said.",
        "Then there is the silent item: red-flag absence. Screens eliminate far more candidates than they select. Rambling, negativity about a current employer, evasiveness about why you are leaving, or vagueness about what you actually did in your last role all end candidacies quietly, with a “not the right fit” you will never get detail on. Decisions are often effectively made in the first few minutes and confirmed by the rest. The call's job is not to win the job. It is to give the recruiter nothing to worry about and three clean bullet points to carry to the hiring manager.",
      ],
    },
    {
      heading: "Before the call",
      body: [
        "Treat the environment as part of the performance, because on the phone it is. Book a quiet room — not a car, not a café, not a walking route — and be there ten minutes early. Charge the phone fully, check your signal or Wi-Fi calling in that exact spot, and disable anything that might beep, buzz, or announce itself. If the call is with a recruiter at an agency, save their number so you answer confidently rather than screening an unknown caller at the appointed minute.",
        "Put your materials physically in front of you: your resume, the job posting, three bullet points of proof for the role's main requirements, and your questions for the screener, printed or on a screen you will not be typing on noisily. Have a glass of water within reach. Have your calendar open — screens very often end with scheduling the next conversation, and “I'll have to check and get back to you” is a needlessly weak final impression. Two voice tricks that genuinely work: stand up or pace slowly while you talk, which keeps energy in your voice, and smile when you answer — it audibly changes your tone, and on a phone call tone is the entire visual.",
      ],
    },
    {
      heading: "During and after",
      body: [
        "Answer in 60-to-90-second units. In person, an interviewer's body language tells you when to stop; on the phone there is no feedback at all, and rambling is the number one way screens die — the recruiter is typing notes, loses the thread, and writes “communication concerns.” Give the answer, then let silence sit. Silence feels longer to you than to them, and the discipline of stopping is itself a signal of clarity. When a question needs more, the recruiter will ask — follow-ups are interest, and they are how depth happens on a screen.",
        "Close the call deliberately. Ask who the next conversation is with and what it will cover, confirm the timeline for a decision, and make sure you know the right contact route for follow-up. Then send the thank-you email the same day — short, addressed to the recruiter by name, restating your interest and one specific thing from the conversation. If you do not hear back by the date they gave, one polite follow-up is professional; two becomes pressure. Either way, write down immediately after the call what you were asked and what you said — if you advance, your later answers need to be consistent with this conversation, and memory fades within days.",
      ],
    },
  ],
  questions: [
    {
      question: "Tell me about yourself.",
      whyAsked: "On a screen this is a compression test. The recruiter wants a 45-to-60-second summary they can type into their notes and repeat to the hiring manager — not your biography, and not the two-minute version with hooks for a conversational interview.",
      guidance: "Deliver the compressed version: current role and scope in one sentence, the one or two past experiences that map directly onto this posting, and one sentence on why you are moving toward this role. Aim for under a minute and stop cleanly. The recruiter has a form to fill; the more your answer sounds like the summary they need to write, the more of it survives into the write-up the hiring manager actually reads.",
      example: "I am a customer support lead at a regional logistics firm — I handle escalations and train new hires, and last quarter my team cut average resolution time by about a fifth. Before that I worked in retail operations, which is where the de-escalation and root-cause skills come from. I am looking to move into a larger support organization with more process-improvement work, which is exactly how this role is described.",
      pitfalls: "Giving the full two-minute interview version, starting from your first job a decade ago, or adding personal details — on a screen, length is the main way this answer fails.",
    },
    {
      question: "Why are you interested in this role?",
      whyAsked: "The recruiter is separating deliberate applicants from mass appliers and checking retention risk early. “Sounds interesting” tells them you will withdraw or leave quickly; specifics tell them the match is real.",
      guidance: "Name two specifics: one about the work itself — a responsibility, a tool, a customer type from the posting — and one about the setting, such as company size, growth stage, or team structure. Connect each to something you have done well or want more of. Two grounded reasons beat four flattering ones, and on a screen brevity signals confidence.",
      example: "Two things. The role owns onboarding end to end, and in my current job the handoff from sales is where most of our problems start — I have spent a year tightening that exact handoff and I would like it to be my main job rather than my side project. And the team is larger, which means there is a real process to improve rather than three people improvising.",
      pitfalls: "Leading with pay, commute, or perks; praising the company in terms that would fit any employer; or admitting you applied broadly and this one responded.",
    },
    {
      question: "What do you know about our company?",
      whyAsked: "A five-minute research check. The recruiter is not testing company trivia — they are testing whether you did the minimum, because candidates who did not research the screen rarely research the interview.",
      guidance: "Prepare three short facts: what the company does and who it serves, one recent development (a launch, expansion, funding, or a stated priority), and one sentence connecting that to your interest in the role. Verify your facts on the company site the day before, not from a aggregator summary — getting the one thing you say wrong is worse than saying less.",
      example: "You provide scheduling software for home healthcare agencies, mostly mid-size operators. I saw you launched a mobile app for field staff this year and are expanding into two new states, which suggests onboarding volume is about to grow a lot — that is part of what interested me, since onboarding is the work I want to do more of.",
      pitfalls: "Reciting the homepage tagline, confusing the company with a competitor, or saying you planned to research before the next round — the screen is the round.",
    },
    {
      question: "Walk me through your current role / resume.",
      whyAsked: "The recruiter is building the timeline they will present to the hiring manager and quietly checking it hangs together: no unexplained gaps, no title inflation, no contradictions with the resume they have in front of them.",
      guidance: "Move forward in time, one or two sentences per role: scope, main responsibility, one result. Spend the most time on the most recent and most relevant work, and keep the whole pass under ninety seconds. If there is a gap or a short stint, address it in one neutral sentence as you pass it — unprompted explanations are short and factual; explanations extracted by follow-up questions look like concealment.",
      example: "I started in retail operations, four years, ending as a shift lead responsible for closing, cash handling, and training. I moved to my current support role three years ago, was promoted to lead last year, and now I split my time between escalations, coaching a team of five, and the onboarding process work I mentioned. The thread through it is customer problems that need untangling, which is why this posting caught my eye.",
      pitfalls: "Reading the resume aloud bullet by bullet, spending equal time on irrelevant early jobs, or giving dates that do not match the document — the recruiter is comparing as you speak.",
    },
    {
      question: "Why are you leaving (or did you leave) your last job?",
      whyAsked: "A red-flag scan. The recruiter is listening for conflict, performance problems, or a reason that will repeat itself here — and for whether you talk about an employer the way you would one day talk about theirs.",
      guidance: "Forward-looking and brief: one neutral sentence about the current situation, then pivot to what you are moving toward. “The team is small and there is no path into planning work” is a complete answer. If you were laid off or the role ended, say so plainly in the same tone — recruiters hear it daily and think better of candidates who state it without shame or spin.",
      example: "I have learned a lot where I am, but the team is six people and the operations planning work I want to grow into does not exist there. This role is built around exactly that work, so it is a move toward something rather than away — I am on good terms with my manager and she knows I am looking at planning roles.",
      pitfalls: "Criticizing your manager or employer, leading with pay, or a long grievance narrative — on a screen there is no rapport yet to absorb it, so it lands as pure negativity.",
    },
    {
      question: "What are your salary expectations?",
      whyAsked: "Screens ask this early for one reason: band fit. The recruiter needs to know whether your expectations and the approved range overlap before anyone invests in interviews. It is a logistics question wearing a negotiation costume.",
      guidance: "Do the research first — market ranges for the role, level, and location — and give a range anchored in it, not a single figure. Name what the number depends on (scope, bonus, benefits, schedule) and keep the tone collaborative: you are checking compatibility, not bidding. If the recruiter shares their band, acknowledge it directly; if your researched range sits above it, say so honestly rather than agreeing now and collapsing the process later. The lowballing trap is naming your current salary plus a small bump out of nervousness — price the role, not your history.",
      example: "From the responsibilities in the posting and the ranges I have seen for this level in this area, I am looking at the upper-middle of the typical band, and I am flexible depending on the full package — bonus, schedule, and development support all factor in. Does that sit within the range approved for the role?",
      pitfalls: "Naming one low number under pressure, refusing to engage at all, anchoring on your current salary, or treating the screen as the final negotiation and haggling a recruiter who has no authority to negotiate.",
    },
    {
      question: "When could you start?",
      whyAsked: "Pure logistics, and a quiet professionalism check. The recruiter is filling in a timeline and watching how you treat obligations to your current employer.",
      guidance: "Answer plainly with the real date or notice period. If you need to give notice, say so as a matter of course — recruiters read “I can start tomorrow” from an employed candidate as a warning about how you would leave them, too. If you have a pre-booked commitment shortly after a likely start, mention it briefly now rather than after an offer; early honesty about dates is forgotten, late surprises are remembered.",
      example: "I would want to give my current employer two full weeks' notice, so realistically I could start three Mondays from now. I do not have any travel booked in the first couple of months after that.",
      pitfalls: "Claiming immediate availability while employed, being vague about a long notice period until the offer stage, or inventing flexibility you do not have.",
    },
    {
      question: "Are you authorized to work / any location or schedule constraints?",
      whyAsked: "These are knockout questions — the few answers that can end a candidacy outright regardless of skill. The recruiter asks them on the screen precisely so nobody discovers a fundamental incompatibility after three interview rounds.",
      guidance: "Answer plainly, completely, and without defensiveness. If there is a constraint — a schedule limit, a relocation timeline, a licensing step in progress — state it, state its scope, and state when it resolves if it does. Recruiters can often work around a declared constraint; what they cannot forgive is discovering one late. Do not volunteer a legal treatise or over-explain circumstances beyond what was asked.",
      example: "Yes, I am authorized to work in the US for any employer. On schedule: the posting mentions one Saturday a month on rotation, which works for me. I am based here permanently, so there are no relocation moving parts.",
      pitfalls: "Evasiveness or visible irritation at the question, burying a real constraint in qualifications and caveats, or assuming the recruiter will “probably be fine with it” and not mentioning it at all.",
    },
    {
      question: "Tell me about your experience with [tool/skill from the posting].",
      whyAsked: "This is the recruiter verifying the non-negotiable from the hiring manager's intake list. They usually cannot judge depth themselves, so they are listening for specifics — recency, scale, and context — that make your claim easy to write up and hard to doubt.",
      guidance: "Answer with the evidence format: how long you have used it, in what setting, at what scale, and one thing you did with it that had a result. “Three years on the support desk, around forty tickets a week, and I wrote the macro set the team uses for billing cases” survives a write-up; “oh yes, I am very familiar with it” does not. If your experience is adjacent rather than direct, say so and name the transferable part — recruiters pass honest adjacency to managers, but they kill discovered exaggeration.",
      example: "I have used it daily for about three years in my current role — it is our system of record for the whole support queue. I am the person who built our saved views and escalation routing when we reorganized last year, so I know the admin side as well as the agent side.",
      pitfalls: "Claiming expertise you cannot support if the manager probes it next round, answering with years alone and no context, or dismissing the tool as “easy to learn” when the posting lists it as a requirement.",
    },
    {
      question: "Why did you apply for this position?",
      whyAsked: "A close cousin of “why are you interested,” asked to test deliberateness: did this specific posting get a considered application, or was it one of two hundred clicks? The recruiter is also checking you applied for the job as it actually is.",
      guidance: "Reference the posting itself: the duty, project, or requirement that made you stop and apply, and the match in your background that made it a rational application rather than a hopeful one. If a person referred you or you followed the company beforehand, say so — a traceable reason for applying is itself evidence of deliberateness.",
      example: "The line in the posting about owning the new-hire onboarding process is what made me apply. I have been doing that work informally for a year and it is the part of my job I am best at, so a role where it is the actual job rather than an extra felt worth a careful application rather than a quick one.",
      pitfalls: "“I need a job” honesty offered as a virtue, revealing you did not read the posting closely, or describing a different job than the one posted — a real and common screen failure.",
    },
    {
      question: "Are you interviewing anywhere else?",
      whyAsked: "Timeline intelligence. The recruiter wants to know whether they need to move fast, and secondarily whether your interest in this role survives having options. It is not a trick and it is not a loyalty test.",
      guidance: "Be honest and brief: a stage, not a diary. “I am in early conversations with two other companies, nothing at offer stage” is the complete answer. Genuine time pressure — a deadline from another process — is worth stating factually, because it can accelerate this one. Never bluff an offer you do not have; bluffs get called by the simple passage of the deadline you invented, and recruiters compare notes with your demeanor at every step.",
      example: "I am speaking with a couple of other companies — one is at the stage of a first interview next week, the other is still at application stage. Nothing is close to an offer, and this role is the one I am most interested in because of the onboarding focus.",
      pitfalls: "Claiming offers that do not exist, refusing to answer at all, or performing indifference (“I'm in no hurry, just seeing what's out there”) that tells the recruiter not to prioritize you.",
    },
    {
      question: "What are your strengths for this kind of work?",
      whyAsked: "The recruiter wants the one or two strengths that match this role's core work, stated in a form they can put in the write-up. It is a relevance check, not an invitation to enumerate your virtues.",
      guidance: "Pick the strengths the posting itself demands and prove each in one sentence with a situation or a number. On a screen, two strengths with evidence outweigh four with adjectives, because the recruiter is typing as you talk and only the concrete version makes it into their notes. Mention a strength the role does not need only if it is your differentiator — and even then, keep the matched ones first.",
      example: "For this kind of work, two things. I stay systematic when the queue is chaos — I work from a ranked list and re-triage every morning, which is how our team's backlog stopped rolling over week to week. And I write clearly: my resolution notes get used as examples in our new-hire training, which matters for a role where the customer mostly experiences you in writing.",
      pitfalls: "Strengths with no proof, strengths the role does not use, or the disguised-weakness clichés — recruiters hear “perfectionist” several times a week and discount it on contact.",
    },
    {
      question: "Do you have any questions for me?",
      whyAsked: "Yes, this is evaluated on a screen too — but the judge is a recruiter, so the right questions are about the process and the shape of the role, not deep technical or team questions they cannot answer.",
      guidance: "Ask about the process (rounds, who you would meet, timeline), the role's practical shape (why it is open, team size, who it reports to), and what the hiring manager emphasized in intake — that last one is gold, because it tells you exactly what the real interview will score. Save deep questions about the work itself for the hiring manager. Finish by asking about next steps and timeline if they have not covered it. Two or three questions is right for a screen.",
      example: "What did the hiring manager say matters most in the person they hire — the thing the last round will really be testing? And what does the process look like from here: who would I meet next, and over what kind of timeline?",
      pitfalls: "Saying you have no questions, leading with pay and perks questions the recruiter has already covered, or asking deep role questions and then visibly deflating when the recruiter cannot answer them.",
    },
    {
      question: "How did you hear about this role?",
      whyAsked: "Partly sourcing data for the recruiter, partly a small authenticity check — a named source (a referral, the company's own careers page, a talk you attended) corroborates the deliberateness you have been claiming all call.",
      guidance: "Keep it short and human: the channel, and if true, the one detail that made you act on it. If an employee referred you, name them — referrals get noted, and it occasionally speeds the process. If it was a job board, that is a perfectly acceptable answer delivered in one clause; do not inflate a board application into a long-standing passion for the company, because the recruiter already knows the source from their own system.",
      example: "A former colleague of mine works on your operations team — she mentioned the opening before it was posted and said the onboarding work was becoming a real priority, which is why I applied the day it went live.",
      pitfalls: "Inventing a referral, claiming deep company fandom contradicted by your earlier answers, or treating the question as beneath you — it takes five seconds to answer well.",
    },
  ],
  faqs: [
    {
      q: "How long do phone screens last?",
      a: "Fifteen to thirty minutes is typical; twenty is the most common booking. Read length carefully but not anxiously: a screen that ends in eight minutes with no next-step conversation usually means a knockout answer surfaced — a salary mismatch or a missing non-negotiable. A screen that runs past its slot with the recruiter still asking questions is generally a good sign; recruiters do not donate extra minutes to candidates they are about to reject. The meaningless middle is the standard-length call, which tells you nothing until you hear the outcome.",
    },
    {
      q: "Who conducts the phone screen — and does it matter?",
      a: "Usually a recruiter or HR coordinator working from the hiring manager's checklist, which means logistics, band fit, and the non-negotiable basics get the most weight. Sometimes — at small companies especially — the hiring manager screens directly, and then expect more depth: real questions about the work, your judgment, and your past projects. The invitation usually tells you who you are meeting. If it does not, asking “so I know how to prepare, will this be with you or with the hiring manager?” is a normal, professional question.",
    },
    {
      q: "Is a video call different from a phone screen?",
      a: "The scoring is the same — it is still a filter — but the medium adds a visual channel to manage. Dress as you would for an interview, frame yourself against a plain background, look at the camera when answering rather than at your own preview window, and test the link, camera, and audio beforehand. Your answers can run very slightly longer than on the phone because the interviewer can see engagement, but the 90-second discipline still applies. Everything else — preparation, materials, the same-day thank-you — is identical.",
    },
    {
      q: "What if the call drops or the tech fails?",
      a: "It happens constantly and recruiters are unmoved by it — what matters is the save. Call back immediately yourself rather than waiting; if you cannot get through, email within minutes saying the call dropped, apologizing once, briefly, and offering your availability to continue or reschedule. Have this fallback ready before the call: the recruiter's email address and a charged phone if you were on Wi-Fi calling. One calm, fast recovery can actually help you — it is a live demonstration of the composure your resume claims.",
    },
    {
      q: "How soon will you hear back, and when should you follow up?",
      a: "Most recruiters give a timeline on the call — if they did not, ask before hanging up. Typical is a few days to a week. Follow up once, shortly after the stated date passes: a short email thanking them again, restating your interest in one sentence, and asking whether there is anything else they need from you. If there is still silence a week after that, assume the process has moved on and let it go gracefully — recruiters remember gracious candidates when the next role opens, and screens are often where that reputation starts.",
    },
  ],
};

export const secondInterview: InterviewTypeGuide = {
  intro: [
    "Round two is not a repeat of round one with harder questions. The question underneath the conversation changes. Round one asked “can this person do the job?” — a skills and plausibility check usually run by one or two people. Round two asks “do we want this person on the hard days, and are they still consistent with the candidate we met last time?” The pool is smaller, the scrutiny is closer, and the people judging you multiply: panel members who will work beside you, team members testing whether you fit the room, sometimes a skip-level manager testing whether you fit the organization.",
    "Expect your round-one answers to be cross-examined — kindly, but cross-examined. A story you told the hiring manager will be retold to the panel in summary, and someone will ask you to go deeper on exactly the part you summarized most quickly. New question types appear: scenarios drawn from this team's real work, disagreements and working-style probes, and practicalities that move from screening toward negotiation. The candidates who fail round two rarely fail on skill. They fail on inconsistency, on shallower answers than the format demands, or on questions for the team that reveal they stopped thinking about the job once they got the callback.",
  ],
  sections: [
    {
      heading: "What actually changes in round two",
      body: [
        "Depth replaces breadth. Round one sampled your career; round two excavates selected parts of it. Follow-up questions chase your round-one stories into specifics — the numbers behind a result, your exact role inside a team outcome, what you would do differently. Scenario questions become concrete and local: not “how do you handle conflict” but a plausible Tuesday in this team's actual work, with their constraints and their customers. Working-style and culture probes multiply because the people asking them are the ones who will absorb the cost of a bad fit, and they ask behaviourally — past situations, not self-descriptions — because round two is where self-descriptions stop being believed.",
        "Practicalities also move. Salary talk shifts from the screen's band check toward real range refinement, start dates become actual dates, and questions like “are you expecting other offers” are asked with scheduling intent. Notice, too, that the direction of selling reverses partway through a good round two: in round one you sell yourself to them; in round two they begin, visibly, to sell the role to you. That shift is data, and the “Reading round two” section below covers how to interpret it without over-reading it.",
      ],
    },
    {
      heading: "Prepare differently",
      body: [
        "Start from your own debrief notes. Re-read what you actually said in round one — which stories you used, which numbers you quoted, which claims you made about your experience — because consistency is being checked and your memory of your answers is worse than you think. If you did not write notes after round one, reconstruct them now while anything remains. Then prepare two or three fresh stories you did not spend in round one, at full STAR depth, aimed at collaboration, disagreement, and failure — the themes panels return to. Repeating round-one stories word for word reads as a thin repertoire; new stories on the same strengths read as depth.",
        "Research the people, lightly and professionally: their roles, how long they have been on the team, what their part of the work is — LinkedIn and the company team page, not a personal excavation. Knowing the panel's composition tells you what each person will test: peers test collaboration, the skip-level tests judgment and communication upward, the hiring manager tests what round one left open. Sketch a first-30-60-90 view at the level of learning, then contributing, then owning — panels ask for it directly or circle it — and sharpen your questions beyond round one's: team dynamics, the current project you would join, and why this role is open are all fair game now in a way they were not before.",
      ],
    },
    {
      heading: "Reading round two — and the 24 hours after",
      body: [
        "Signs it is going well: they start selling — describing projects as things you would work on, introducing you to people outside the scheduled panel, talking about start dates and first weeks in the present tense (“when you're here, you'll…”). An interview that runs long because conversation caught fire is a good sign. Treat weaker signals neutrally: a panel member who is quiet or tough is often simply the designated skeptic, a short round may reflect a panelist's calendar rather than your performance, and nobody's poker face on a video call is evidence of anything. Candidates talk themselves out of confidence by over-reading neutral signals far more often than they miss real ones.",
        "In the 24 hours after, send individual thank-you notes to each person you met — not one group email. Each note should reference something specific from that person's conversation: the project they described, the question they asked that you have kept thinking about, the concern they raised and your considered response to it. Brevity still applies; three or four sentences each. Then respect the timeline they gave you. One follow-up at the stated date, short and warm, is professional. The thank-yous matter more in round two than round one precisely because multiple decision-makers compare impressions — and a specific note is often the last piece of evidence each of them sees.",
      ],
    },
  ],
  questions: [
    {
      question: "Since we last spoke, what are your thoughts on the role?",
      whyAsked: "A common round-two opener that tests two things: whether your interest has deepened or quietly faded since round one, and what you actually absorbed from the first conversation. A vague “still very excited” tells them you have not thought about the job since.",
      guidance: "Answer with evidence of reflection: one thing from round one that increased your interest and why, one question or consideration you have thought through since, and a clear statement that your interest is stronger and specific. If round one surfaced a genuine concern, this is the controlled place to raise it as a question rather than a doubt. Keep it under ninety seconds and make it unmistakably about this role, not about job searching in general.",
      example: "I have thought about it a lot, honestly. The part that has stayed with me is what Sarah said about the onboarding backlog being the team's main constraint — that is the exact problem I have spent the last year on, and it confirmed this is the work I want. The one thing I have been turning over is how the role splits time between fixing the current process and supporting day-to-day intake, and I would like to understand that balance better today.",
      pitfalls: "Generic enthusiasm, revealing you have barely thought about the role, or opening with concerns and conditions that make your interest sound conditional.",
    },
    {
      question: "Tell me more about [specific claim from round one / your resume].",
      whyAsked: "This is the deep-dive, and it is the defining round-two question. Someone read the round-one notes, picked the claim that carries the most weight — a result, a responsibility, a number — and is checking whether it survives detail. Inflated claims die here.",
      guidance: "Go one level deeper than you did in round one: the context, your precise personal contribution inside any team result, the method or steps in order, the measurement behind the number, and what was hard about it. If the claim needs a caveat — the result was shared, the number covers a specific period — offer it yourself; volunteered precision builds more trust than the original claim did. Never contradict your round-one version: the facts stay identical, only the depth increases.",
      example: "In round one I mentioned we cut resolution time by about a fifth. The detail: the average was 26 hours to first resolution when I took over the queue. I re-triaged tickets into three lanes by complexity, moved the ten most common issues into templated first responses the team helped write, and the average settled at about 21 hours over the following quarter. My part was the triage design and the templates; the team did the daily work of making it stick, and the figure I would stand behind is that quarter's average, not a single good week.",
      pitfalls: "Repeating the round-one answer at the same depth, inventing new detail that shifts the facts, or taking fuller credit under pressure than you claimed the first time.",
    },
    {
      question: "How would you approach your first 90 days here?",
      whyAsked: "The panel wants to see judgment about sequence: whether you would learn before changing things, how you would build the relationships the job runs on, and whether your early priorities match the team's real needs rather than a generic template.",
      guidance: "Structure it as learning, contributing, owning. First 30: listen, learn the systems and the people, take notes, fix nothing structural — name what you would want to understand by day 30. Days 30–60: own the core deliverables reliably, take one visible piece of work end to end, start forming a view of what needs changing. Days 60–90: act on that view with one improvement, aligned with your manager first. Calibrate ambition to the role: a plan that promises transformation by day 45 reads as naïve to the people who know the terrain.",
      example: "First month, I would learn: sit with the team, work the queue or the caseload myself, and map where handoffs break — no changes beyond obvious quick fixes. By day 60 I would want to be carrying a full share of the core work and to have taken one small process end to end so people have seen how I work. By day 90, I would bring my manager a short list of what I think the priorities should be, with the onboarding backlog first if it looks the way it was described — and start on the first item with her agreement.",
      pitfalls: "A generic plan interchangeable between companies, promising early reorganizations, or a plan that is all learning and no point at which you start delivering.",
    },
    {
      question: "Describe how you'd handle [realistic scenario for this job].",
      whyAsked: "The work-sample-in-words. Panels build scenarios from real incidents — an angry key customer, a system down at peak, two deadlines colliding — and they are scoring your reasoning sequence and your instincts about escalation, not hunting for one right answer.",
      guidance: "Think aloud in order: what you would establish first (facts, impact, who is affected), your immediate containment step, who you would inform and when, the options you would weigh, and how you would close the loop afterward. Ask one clarifying question if a genuinely material fact is missing, then commit to an approach — scenarios punish dithering more than imperfect choices. Where you have handled the real version of this scenario before, say so at the end, briefly: it converts a hypothetical into evidence.",
      example: "First I would establish what we actually know: whether it is all customers or one segment, and when it started, because the fix and the message both depend on that. I would get a holding update out to affected customers within the hour — silence is what turns an incident into a trust problem — then work the technical side with whoever owns the system, keeping one person, me, as the single point of updates. Afterward I would write up what happened and what we are changing, because the same outage twice is a choice. I handled a smaller version of this last spring and that sequence is roughly what worked.",
      pitfalls: "Jumping to a solution before establishing the facts, never mentioning communication with affected people, or refusing to commit (“it depends”) through the whole answer.",
    },
    {
      question: "How do you handle disagreement with your manager?",
      whyAsked: "Round-two behavioral depth: round one may have asked about conflict generally, but this targets the reporting relationship specifically, because your future manager or their peers are sitting in the room imagining themselves in the story.",
      guidance: "Use a real example with the disagree-and-commit shape: the issue, how you made your case privately with evidence, how you responded to the decision — including if it went against you — and what the outcome was. Make clear you distinguish between being heard and winning: professionals argue their corner once, properly, then execute the decision fully. Choose a disagreement about method or priorities, never a personality clash, and speak about the manager in the story with visible respect.",
      example: "My manager wanted to cut our weekly quality check to save time before a busy period. I asked for fifteen minutes, brought the previous quarter's error data showing the check caught most defects before customers saw them, and proposed a sampled version that halved the time instead. She took the sampled version, and error rates stayed flat. If she had decided to cut it entirely, I would have run it her way and tracked the error rate so we would both know within a month whether it mattered — that is the deal as I see it: I get to make the case, she gets to decide.",
      pitfalls: "Claiming you have never disagreed with a manager, describing compliance so total it sounds spineless, or a story where you won by going around them.",
    },
    {
      question: "What questions do you have for the team?",
      whyAsked: "When the panel asks this, your questions are the audition. Team members judge both whether you understand what working here actually involves and whether you are someone they would enjoy problem-solving with — and they compare your questions to every other finalist's.",
      guidance: "Ask questions only this panel can answer: how the team divides the work in the posting, what the current project's hardest problem is, how decisions get made when the manager is not in the room, what the last person in the role found hardest. Direct questions to individuals by role — the peer, the person you would hand work to — rather than broadcasting everything to the room. Ask fewer, better questions and follow up on the answers; a genuine exchange lands better than an interrogation list.",
      example: "For those of you doing the role day to day: what does the posting not tell me about where the time actually goes? And what is the thing the team most needs the next hire to take off everyone's plate?",
      pitfalls: "Repeating your round-one questions verbatim, asking only logistics and perks, or asking nothing and claiming round one covered everything — it signals your curiosity ended at the callback.",
    },
    {
      question: "Where are you in your job search — are you expecting other offers?",
      whyAsked: "In round two this is asked with operational intent: they may be choosing between finalists on a timeline, and they need to know whether their process speed is a competitive factor. It is also a final interest check — candidates about to sign elsewhere sometimes withdraw mentally first.",
      guidance: "Be honest about stage, not theatrical about detail. Name how many processes are live and roughly how advanced, state any real deadline factually and without ultimatum tone, and pair it with a clear statement of where this role ranks for you and why. What you must not do is fabricate an offer to force speed: panels can hear the difference, and an invented deadline that passes quietly destroys the trust round two was built on.",
      example: "I am in a final round with one other company and they have said they expect to decide next week. I am not using that as pressure — I am telling you because I would rather you heard it from me. This role is my first choice, for the onboarding focus we discussed; if your timeline runs past theirs, I would rather talk about that openly than disappear.",
      pitfalls: "Bluffing offers, refusing to answer, or delivering the information as a threat (“I will need an answer by Friday”) rather than as scheduling honesty.",
    },
    {
      question: "Let's talk about compensation — where are you at?",
      whyAsked: "Round two moves salary from the screen's band check to real numbers, because an offer is being contemplated and nobody wants a late collapse. They are checking that your expectations and their range still overlap now that the role's real scope is known.",
      guidance: "Stay consistent with whatever range you gave at the screen — changing your number upward without a scope reason reads as opportunism. If the role has turned out bigger than posted, it is legitimate to say the fuller scope is why you would expect the upper part of the discussed range. Keep the whole exchange collaborative and anchored in the role and the market, and remember the formal offer is a separate conversation: this one is about confirming compatibility, not signing.",
      example: "That is consistent with what I discussed with the recruiter at the start — I am looking at the range we talked about, and having now seen the full scope of the role, I would expect to land in the upper part of it. The package matters as a whole to me, so I am comfortable waiting for the formal offer to work through the details.",
      pitfalls: "Raising your range sharply with no new justification, naming your current salary as the anchor, or negotiating hard terms with a panelist who has no authority over the offer.",
    },
    {
      question: "What would your current manager say is your biggest area to develop?",
      whyAsked: "A self-awareness probe with a reference-check shadow: they may literally ask your manager something like this later, and they are watching whether your answer sounds like feedback you have actually heard or a weakness invented for interviews.",
      guidance: "Quote real feedback if you can — being able to say “in my last review, she said…” is credibility no polished fiction can match. Choose an area that is genuine, non-fatal for this role, and visibly in progress: name the feedback, the system or habit you built in response, and any evidence it is working. Panels at this stage are screening for coachability in someone they will manage, so a managed weakness reassures them more than a spotless claim.",
      example: "She would say my written updates bury the decision items. It is in my last review almost word for word. I restructured my status reports to lead with decisions and deadlines and asked her to check the first few — she has since said the format works, and two other team members have adopted it. I still draft the long version first to get my own thinking straight, but nobody else has to read that version anymore.",
      pitfalls: "A disguised strength with no review behind it, a weakness central to this job with no management system, or disputing the fairness of the feedback inside your own answer.",
    },
    {
      question: "Why this company, after everything you've learned so far?",
      whyAsked: "The round-two version of the fit question, and the phrase “after everything you've learned” is the test: your answer must now contain round-one knowledge. They are checking that exposure to the real company increased your conviction rather than merely your information.",
      guidance: "Build the answer from specifics acquired during the process: something the hiring manager described, a project you heard about from the panel, a way the team works that matches how you work best. One or two process-earned specifics outweigh any amount of pre-interview research recited again. Close the loop to your own direction — the same thread as your round-one fit answer, now with evidence from inside the building.",
      example: "When I applied, it was the role. After the last conversation, it is the way the team talks about the onboarding problem — as theirs, not as sales' fault or the customers' fault. I have worked in both kinds of team, and the one that owns its problems is the one where process work actually sticks. Add that the work itself is the exact problem set I want to spend the next few years on, and my interest is stronger now than when I applied, which is how it should be.",
      pitfalls: "Reciting your round-one company research unchanged, new doubts surfacing disguised as observations, or praise so general it could be said at any finalist interview anywhere.",
    },
    {
      question: "How do you prioritize when two projects collide?",
      whyAsked: "A deeper cut of the standard prioritization question: panels ask it because they have lived the collision, and they want your decision criteria plus your communication behavior — the two things that determine whether a collision becomes a crisis.",
      guidance: "Give criteria in order — external commitments and dates, who is blocked downstream, impact of delay on each side — then describe the move that separates strong answers: surfacing the trade-off early to the person who owns it, with a recommendation, rather than silently choosing or silently failing at both. Illustrate with one compact real collision, naming what you delivered, what moved, and how the moved party heard about it. The example should show the other stakeholder agreeing to the shift because you showed them the clash.",
      example: "I rank by hard external dates first, then by who is blocked on me. When both are genuinely equal, I take the trade-off to my manager with a recommendation instead of guessing. Last quarter a client report and an internal audit landed in the same week; I showed my manager both dates, recommended the client report first because the contract had a date attached, and the audit owner agreed to a two-day shift once they saw the clash. The key part is that nobody learned about the collision from a missed deadline.",
      pitfalls: "“I just work longer hours” as the whole system, criteria with no communication step, or an example where something was quietly dropped and discovered later.",
    },
    {
      question: "What do you need from a manager to do your best work?",
      whyAsked: "Often asked by your prospective manager directly, and it is a two-way fit check: they are comparing your answer against how they actually manage, and testing whether your needs are reasonable, knowable, and compatible with the team's reality.",
      guidance: "Describe working conditions, not perks: how you like goals set, how you prefer feedback delivered and how often, how much autonomy you work best with and where you want check-ins. Ground each preference in self-knowledge — where it came from, what happens to your work without it. Keep demands modest and reciprocal: the strongest answers also state what the manager gets in return, such as early warning on problems and no surprises at deadlines.",
      example: "Two things. Clear priorities when they change — I am fine with plans shifting, I just need to hear it from my manager rather than infer it. And feedback in small doses as we go rather than saved up; I adjust quickly when I know where I stand. In return, I keep a visible plan and I flag problems early with a recommendation attached, so my manager is never finding out about a slipping deadline at the deadline.",
      pitfalls: "A list that describes the opposite of how this manager has presented their style, demands framed as conditions, or claiming you need nothing at all — which experienced managers hear as “you will never know when I am struggling.”",
    },
    {
      question: "Is there anything that would stop you accepting an offer?",
      whyAsked: "The closing probe, usually from the hiring manager or HR late in round two. They are hunting for late-stage deal-breakers — a salary floor, a relocation problem, a competing commitment, a condition the process has not surfaced — while there is still time to address them.",
      guidance: "Answer with the same honesty you would want from them, about real constraints only. If there is a genuine factor — a notice period, a pre-booked commitment, a number the offer needs to reach because you discussed it — state it plainly and completely, because surfacing it now is the last cheap moment to do so. If there is nothing, say so cleanly and pair it with your interest: a clear “nothing I can think of” from a finalist is exactly what the question hopes to hear.",
      example: "Nothing that would stop me. For completeness: I would need the two weeks' notice we discussed, and I have a family commitment on the weekend of the 14th that was booked months ago, but neither affects my start or the role. If an offer came, the conversation would be about the details, not about whether.",
      pitfalls: "Springing a major new condition for the first time here and expecting it to be absorbed cheerfully, bluffing constraints to gain leverage, or being evasive — evasion at this question is itself read as a hidden deal-breaker.",
    },
  ],
  faqs: [
    {
      q: "How many interview rounds is normal now?",
      a: "For most professional roles, a screen plus two or three rounds is the current norm, and four is not unusual where a panel, a practical exercise, and a senior sign-off are involved. The number matters less than the pattern: each round should be adding new judges or new question types. If a process keeps adding rounds that repeat the same conversation with the same people, that is itself information about the organization's decision-making — and it is reasonable to ask, politely, what the remaining steps are meant to establish.",
    },
    {
      q: "Does a second interview mean you're a finalist?",
      a: "Usually you are in a small pool — commonly two to four candidates — but “small pool” is not “won.” Treat round two as the decision round in most processes, because for many roles the panel's recommendation is effectively the decision, while remembering that a hiring manager may still be genuinely undecided between you and one other person. The practical implication: this is not the round to coast on round-one goodwill, and it is also not the round where salary and start dates are settled — both errors come from misjudging how close the finish line is.",
    },
    {
      q: "Should you repeat your round-one answers?",
      a: "Consistency yes, repetition no. The facts, figures, and outcomes you cite must match what you said in round one — panels compare notes, and drifting numbers are the classic credibility killer. But the stories should go deeper and the repertoire should widen: bring fresh examples for the themes round one opened, and when a round-one story is revisited, add the layer underneath it rather than performing the same answer again. If you genuinely cannot remember what you claimed in round one, that is the argument for writing debrief notes within an hour of every interview.",
    },
    {
      q: "Will salary be decided in the second interview?",
      a: "Almost never decided, often refined. Expect range talk: confirmation that your expectations and their band still align now that scope is clear, sometimes a more specific figure from their side. The formal offer — exact number, terms, in writing — comes after the decision, usually through the recruiter or HR. Treat round-two salary talk as alignment, keep your numbers consistent with the screen conversation, and save detailed negotiation for the offer itself, when you have something concrete to negotiate against.",
    },
    {
      q: "What if the panel includes someone you already met in round one?",
      a: "Common, and deliberate: the hiring manager often sits in to check consistency and to watch how you interact with the team they manage. Greet them as a continuing conversation, not a restart — reference what you discussed (“since we talked about the backlog last time, I have been thinking…”) — because that continuity is exactly what they are there to observe. Do not coast on the assumption they are already sold; their round-two job is to test you against colleagues' impressions, and a visibly shallower performance in front of the team undermines the case they built for you after round one.",
    },
  ],
};
