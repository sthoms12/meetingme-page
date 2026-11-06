import type { QuestionEntry, AskEntry, FaqEntry } from "./types";

export const commonQuestions: QuestionEntry[] = [
  {
    question: "Tell me about yourself.",
    whyAsked: "This is an opener, not a biography request. Interviewers want a concise, relevant summary that frames the rest of the conversation and shows you understand what matters for this role.",
    guidance: "Use present, past, future in that order: what you do now and a recent result, one or two earlier experiences that built the relevant skills, then why this role is the logical next step. Keep it to 60 to 90 seconds and end on the role, not on personal details.",
    example: "I am currently a customer support lead for a regional logistics company, where I handle escalations and train new hires — last quarter our team cut average resolution time by about a fifth. Before that I worked in retail operations, which is where I learned to stay calm with frustrated customers and track issues to a root cause. I am looking to move into a larger support organization where I can focus more on process improvement, which is why this role stood out.",
    pitfalls: "Reciting your resume chronologically from your first job, sharing personal details the interviewer did not ask for, or running past two minutes without landing on why you want this job.",
  },
  {
    question: "Why do you want this job?",
    whyAsked: "Interviewers are checking for genuine fit and retention risk. They want evidence you chose this role deliberately, not that you are applying everywhere and will leave in six months.",
    guidance: "Name two or three specifics from the posting or the company that match what you do best and want more of: a responsibility, a tool, a type of customer, a scale of problem. Then connect each one to something you have already done well. Specific beats flattering.",
    example: "Two things drew me in. First, the role owns onboarding end to end — in my current job the handoff from sales is where most of our churn starts, and I have spent the last year tightening that exact handoff. Second, you work in two-week delivery cycles, and I do my best work with short feedback loops rather than quarterly releases.",
    pitfalls: "Saying you need a job, a shorter commute, or better pay as the lead reason, praising the company in generic terms you could say about anyone, or admitting you know little about what the role actually does.",
  },
  {
    question: "Why should we hire you?",
    whyAsked: "This is your closing argument in miniature. The interviewer wants to hear whether you can map your experience directly onto their stated needs without prompting.",
    guidance: "Pick the three requirements that appear most often in the job posting and match each one to a concrete result or experience. Close by naming the gap you fill: the problem they described that you have already solved somewhere else.",
    example: "Your posting emphasizes three things: turning around underperforming accounts, building repeatable processes, and coaching newer reps. I have done each of those — I inherited a book of lapsed accounts and brought most of them back to regular ordering, I wrote the follow-up cadence the team still uses, and I have onboarded four junior colleagues in the past two years.",
    pitfalls: "Answering with adjectives instead of evidence, listing skills the role does not ask for, or sounding apologetic — this question rewards direct, calm confidence backed by specifics.",
  },
  {
    question: "What are your greatest strengths?",
    whyAsked: "Interviewers want to see self-awareness and a strength that is actually relevant to the work, supported by proof rather than self-description.",
    guidance: "Choose one or two strengths the role needs most and prove each with a short situation and outcome. A strength without an example sounds like a claim; a strength with a result sounds like a track record.",
    example: "My strongest skill is untangling messy processes. When I joined my current team, expense approvals went through three inboxes and took over a week. I mapped the steps, cut the redundant approval, and got it down to two days — that process is still in place.",
    pitfalls: "Picking a strength irrelevant to the job, naming three or more strengths with no evidence for any of them, or choosing a disguised weakness like perfectionism.",
  },
  {
    question: "What is your greatest weakness?",
    whyAsked: "This screens for honesty, self-awareness, and whether you actively manage your weak spots. No interviewer expects a perfect candidate, but they do expect a real answer.",
    guidance: "Name a genuine, non-critical weakness, explain the system you use to keep it from affecting your work, and show the improvement it produced. Choose something fixable and already in progress, never a core requirement of the job.",
    example: "I tend to over-prepare for meetings — I used to build decks nobody asked for. Now I time-box prep to the decision the meeting actually needs and send a one-page brief instead. My manager has said my meetings run noticeably tighter since I made that change.",
    pitfalls: "Saying you have no weaknesses, offering a cliche disguised strength with no substance behind it, or naming a weakness that is essential to the role with no plan to address it.",
  },
  {
    question: "Where do you see yourself in five years?",
    whyAsked: "Employers want to know your ambitions point in a direction this job can actually offer, and that you are likely to stay long enough for hiring you to pay off.",
    guidance: "Describe growth that happens inside this kind of role: deeper expertise, broader scope, mentoring others, owning larger projects. Tie it to what the company visibly offers, such as a senior track or a specialist path, so your future and their structure line up.",
    example: "In five years I would like to be the person the team turns to on complex implementations — deeper in the technical side, running the harder projects, and helping onboard new consultants the way senior colleagues helped me when I started.",
    pitfalls: "Naming a different career entirely, saying you plan to start your own competing business, or being so vague that it sounds like you have not thought about staying.",
  },
  {
    question: "Why are you leaving your current job?",
    whyAsked: "Interviewers listen for professionalism and for whether the reason you are leaving will follow you here — conflict, performance problems, or chronic dissatisfaction.",
    guidance: "Keep it forward-looking and brief: what you are moving toward, not what you are escaping. One or two neutral sentences about the current role, then pivot to why this opportunity is a better fit for your direction.",
    example: "I have learned a lot in my current role, but the team is small and there is no path into the operations planning work I want to do more of. This role is built around exactly that, so it feels like the right next step rather than just a change.",
    pitfalls: "Criticizing your manager, team, or employer, citing pay as the sole reason, or giving a long grievance list that makes the interviewer wonder how you will talk about them later.",
  },
  {
    question: "Tell me about a challenge you faced at work and how you handled it.",
    whyAsked: "This tests problem-solving, composure, and ownership. Interviewers want to see your reasoning process, not just a happy ending.",
    guidance: "Use STAR: set the situation in one or two sentences, name your specific responsibility, walk through the actions you personally took in order, and finish with a measurable or clearly observable result. Spend most of your time on the action.",
    example: "Two weeks before a product launch, our main supplier flagged a delay that would have missed the date. I was responsible for the launch timeline, so I split the order across two backup suppliers, renegotiated delivery windows, and re-sequenced the prep work so the team was not idle. We launched on the original date with a slightly reduced first run that sold through.",
    pitfalls: "Choosing a challenge caused entirely by your own serious error without owning it, describing what the team did without clarifying your part, or ending without a result.",
  },
  {
    question: "How do you handle stress or pressure?",
    whyAsked: "The interviewer is checking whether pressure degrades your judgment, your communication, or your reliability — and whether you have working methods, not just endurance.",
    guidance: "Describe your actual system: how you triage, how you communicate early when a deadline is at risk, and one brief example of a high-pressure period you handled well. Concrete habits are more convincing than claiming you thrive under pressure.",
    example: "I keep a single prioritized list and re-rank it every morning when things get busy, so I always know what drops first if time runs out. During our year-end close, that habit let me flag a reporting conflict three days early instead of the night before, and we adjusted the schedule without overtime.",
    pitfalls: "Saying you never get stressed, describing stress responses that affect colleagues, or giving an example where pressure led to missed communication.",
  },
  {
    question: "What are your salary expectations?",
    whyAsked: "This is a screening and budgeting question. The interviewer wants to know whether your range fits the approved band for the role before investing more time.",
    guidance: "Research the market range for the role, level, and location beforehand. Give a range anchored in that research, name the factors it depends on (scope, bonus, benefits, schedule), and keep the tone collaborative. If pressed early, it is reasonable to say you want to understand the full package first.",
    example: "Based on the responsibilities in the posting and market ranges for similar roles in this area, I am looking in the range we discussed for this level, and I am flexible depending on the full package — bonus structure, schedule, and development support all factor in for me.",
    pitfalls: "Naming a single low number out of nervousness, refusing to engage at all after the interviewer has shared their band, or basing your figure on personal expenses rather than market evidence.",
  },
  {
    question: "What do you know about our company?",
    whyAsked: "This separates candidates who researched from candidates who mass-applied. It also shows how you gather information and what you pay attention to.",
    guidance: "Cover three things briefly: what the company does and who it serves, one recent development such as a launch, expansion, or published priority, and why that makes the company an interesting place for someone in your function. Check the company site, recent news, and the posting itself the day before.",
    example: "You provide scheduling software for home healthcare agencies, mostly mid-size operators. I saw you launched a mobile app for field staff this year and that you are expanding into two new states, which suggests the operations team is about to handle a lot more onboarding volume — that is part of what interested me in this role.",
    pitfalls: "Reciting the homepage tagline and nothing else, confusing the company with a competitor, or admitting you did not look — always find at least two accurate specifics.",
  },
  {
    question: "How do you prioritize your work when everything seems important?",
    whyAsked: "Interviewers want evidence you can distinguish urgency from importance, protect deadlines, and escalate trade-offs instead of silently dropping tasks.",
    guidance: "Explain your criteria: deadlines, impact on customers or revenue, and dependencies other people are waiting on. Then describe how you confirm priorities with your manager when two high-stakes items collide, with a short example.",
    example: "I rank by deadline and by who is blocked on me. If two urgent items conflict, I flag it to my manager with a recommendation rather than guessing. Last month a client report and an internal audit landed the same week — I delivered the client report first because the contract had a date attached, and the audit owner agreed to a two-day shift once I showed the clash.",
    pitfalls: "Saying you just work longer hours, having no system beyond a to-do list, or never mentioning communication when priorities conflict.",
  },
  {
    question: "What motivates you at work?",
    whyAsked: "This helps the interviewer judge cultural and role fit: whether the things that energize you are things this job actually provides day to day.",
    guidance: "Name one or two authentic drivers and connect each to a feature of this role. Visible progress, solving hard problems, helping customers succeed, and mastering a craft are all credible — as long as you can point to where the job offers them.",
    example: "I am most motivated when I can see a problem get measurably better because of something I built. That is why roles with clear operational metrics appeal to me — this posting mentions owning the intake backlog, and that kind of visible before-and-after is exactly what keeps me engaged.",
    pitfalls: "Leading with money or perks, giving an answer that contradicts the nature of the job, or being so generic that it could describe anyone.",
  },
  {
    question: "How would your colleagues or manager describe you?",
    whyAsked: "Interviewers use this to cross-check self-awareness against the picture you have painted, and to surface traits that matter for teamwork.",
    guidance: "Choose two or three traits you can support with a small proof point or a piece of actual feedback you have received. Quoting a real performance review phrase, briefly, is more credible than inventing praise.",
    example: "My manager described me in my last review as the person who documents what everyone else keeps in their head. Colleagues tend to say I am steady during escalations — I ask what we know, what we do not, and what the next step is, which helps when customers are frustrated.",
    pitfalls: "Claiming universal praise with no specifics, choosing traits unrelated to work, or contradicting answers you gave earlier in the interview.",
  },
  {
    question: "What is your greatest professional achievement?",
    whyAsked: "This reveals what you value, what you are capable of at your best, and whether your peak work resembles the work this role needs.",
    guidance: "Pick an achievement with a clear before and after, state your personal contribution precisely, and quantify the result if you honestly can — time saved, errors reduced, revenue protected, customers retained. End with why it matters for this role.",
    example: "I rebuilt our new-hire training for the service desk. Before, shadowing was unstructured and new staff took about six weeks to work independently. I wrote a staged checklist with supervised milestones, and new hires now reach independent work in about four weeks, with fewer escalations in their first month.",
    pitfalls: "Choosing something from long ago when recent work exists, taking credit for a team result without naming your part, or picking an achievement unrelated to the job you want.",
  },
  {
    question: "Why do you want to work here specifically, rather than a competitor?",
    whyAsked: "This is a deeper version of company research. The interviewer wants to know you understand what distinguishes this organization — its market, model, or culture — and that those distinctions matter to you.",
    guidance: "Name one or two verifiable differences: the customer segment they serve, how the team is structured, a product decision, or a stated value you have seen demonstrated in their content or reviews. Tie each difference to a preference you genuinely hold.",
    example: "Most firms in this space sell to large enterprises and treat smaller clients as an afterthought. You have built the whole service around mid-size practices, which is the segment I know best and enjoy most. I would rather go deep on that customer than split attention across segments I care less about.",
    pitfalls: "Having no competitor comparison at all, flattering without facts, or criticizing a competitor you may previously have worked for.",
  },
  {
    question: "Describe your ideal work environment.",
    whyAsked: "This is a fit check in both directions. The interviewer is listening for deal-breakers — and for whether your preferences match how the team actually operates.",
    guidance: "Describe preferences in terms of how work gets done: feedback frequency, autonomy, collaboration style, structure. Keep it compatible with what you have learned about this team, and avoid framing preferences as rigid demands.",
    example: "I do my best work with clear goals, room to plan my own approach, and regular short check-ins rather than constant oversight. I also like a team where people share drafts early — most of the improvements in my work have come from quick feedback before something was finished.",
    pitfalls: "Describing an environment opposite to the one advertised, listing perks instead of working conditions, or sounding inflexible about normal variation between teams.",
  },
  {
    question: "What are you looking for in your next role that your current role does not offer?",
    whyAsked: "This refines the leaving question: the interviewer wants to confirm this job actually supplies the thing you are missing, so you will not leave again for the same reason.",
    guidance: "Name one or two growth gaps — scope, mentorship, technical depth, customer contact — and show precisely where this posting provides them. Keep the current employer out of it; the focus is the gap, not the blame.",
    example: "Two things: more direct client contact, since my current role is almost entirely internal, and a manager who does structured development planning. This role has both — the posting mentions leading client reviews, and your team page describes quarterly development plans.",
    pitfalls: "Listing things this role also lacks, framing it as a complaint about your current employer, or naming only compensation and title.",
  },
  {
    question: "How do you keep your skills up to date?",
    whyAsked: "Especially in technical and regulated fields, interviewers want proof of self-directed learning habits rather than reliance on employer-provided training alone.",
    guidance: "Name the specific channels you actually use — documentation, vendor updates, a professional community, side projects, certifications in progress — and give one recent example of something you learned and then applied at work.",
    example: "I follow the release notes for the two platforms I administer and set aside an hour a week to test changes in a sandbox before they reach production. Last quarter I picked up the new reporting module that way and ended up running a short session for the rest of the team.",
    pitfalls: "Claiming you learn on the job only, listing courses you started but cannot describe, or naming nothing more recent than your formal education.",
  },
  {
    question: "Do you have any questions for us?",
    whyAsked: "This is a real evaluation point, not a courtesy. Thoughtful questions signal genuine interest and judgment; having none signals the opposite, whatever the reason.",
    guidance: "Prepare five or six questions and ask the two or three most relevant to what came up in conversation: success measures for the role, team priorities, the manager's working style, and next steps. Listen to the answers — a good follow-up question often lands better than the prepared one.",
    example: "What would success in this role look like at six months, and what are the biggest obstacles the person in this seat will face in the first quarter?",
    pitfalls: "Saying everything was covered, asking only about pay, hours, and perks in a first interview, or asking questions the posting already answers clearly.",
  },
];

export const behavioralQuestions: QuestionEntry[] = [
  {
    question: "Tell me about a time you had to deal with a difficult coworker or customer.",
    whyAsked: "Interviewers are assessing emotional control, empathy, and whether you resolve conflict directly instead of escalating or avoiding it.",
    guidance: "Use STAR and keep the focus on your actions: how you listened, what you did to understand their concern, and the concrete step that de-escalated things. Describe the other person neutrally — how you talk about them is part of the answer.",
    example: "A client was angry that a delivery had slipped twice and asked to cancel. I let them finish without interrupting, repeated back the two failures to confirm I had them right, and offered a dated recovery plan with a check-in call halfway through. They kept the order, and that check-in step became standard for at-risk deliveries.",
    pitfalls: "Blaming or mocking the other person, describing avoidance as the solution, or telling a story where someone else rescued the situation.",
  },
  {
    question: "Tell me about a time you made a mistake at work. How did you handle it?",
    whyAsked: "This tests accountability and learning speed. Interviewers expect a real mistake — claiming none reads as dishonest or lacking self-awareness.",
    guidance: "Pick a genuine but contained mistake. State clearly what you did wrong, how quickly you disclosed it and to whom, the fix you put in place, and the safeguard that prevents a repeat. The recovery system matters more than the error itself.",
    example: "I sent a client report with figures from the wrong month. I caught it within the hour, told my manager before the client responded, sent a corrected version with a short note explaining the change, and added a date-check step to my report template. It has not happened again.",
    pitfalls: "Choosing a non-mistake disguised as one, blaming tools or colleagues, or describing a mistake with no change in behavior afterward.",
  },
  {
    question: "Tell me about a time you went above and beyond for a customer or your team.",
    whyAsked: "Interviewers want to see initiative and judgment — extra effort aimed at a real need, not performative overwork.",
    guidance: "Explain the gap you noticed, why it mattered, and the specific extra step you took without being asked. Finish with the outcome for the customer or team, not with how hard you worked.",
    example: "Before a holiday weekend, I noticed our support queue had a cluster of unresolved shipping questions that would sit for three days. I drafted a status update, got it approved, and sent it proactively to every affected customer. Monday's queue was about a third lighter than a typical post-holiday Monday, and most replies were thank-yous.",
    pitfalls: "Describing tasks that were simply your job, framing regular overtime as the achievement, or choosing an example with no benefit to anyone else.",
  },
  {
    question: "Tell me about a time you had to learn something new quickly.",
    whyAsked: "This measures learning agility: how you break down unfamiliar material, find resources, and reach competence under a deadline.",
    guidance: "Describe your method as much as the topic: what you prioritized first, which resources or people you used, how you practiced or tested yourself, and how soon you were able to deliver real work with the new skill.",
    example: "Our team adopted a new scheduling system with two weeks' notice and no trainer. I worked through the vendor's documentation, built a test schedule to experiment on, and wrote down every workaround I found. By go-live I was answering colleagues' questions, and my notes became the team's quick-reference sheet.",
    pitfalls: "Picking something trivial, describing only passive consumption like watching videos with no application, or implying you avoided asking anyone for help out of pride.",
  },
  {
    question: "Tell me about a time you disagreed with your manager or a decision at work.",
    whyAsked: "Interviewers want to know you can raise concerns constructively, with evidence, and still commit once a decision is made — disagree and commit, not comply silently or resist passively.",
    guidance: "Choose a professional, work-focused disagreement. Explain the data or reasoning you presented, how you presented it (privately, calmly, with alternatives), and how you fully supported the outcome even if the decision went the other way.",
    example: "My manager planned to cut our weekly quality check to save time. I pulled the error data for the previous quarter, which showed the check caught most defects before customers saw them, and proposed a shorter sampled version instead. We adopted the sampled version, and error rates stayed flat while saving half the time.",
    pitfalls: "Describing a personality clash, admitting you undermined the decision afterward, or choosing an example where you never actually voiced the disagreement.",
  },
  {
    question: "Tell me about a time you failed to meet a goal or deadline.",
    whyAsked: "This screens for honesty about setbacks, early communication, and whether failure changed how you plan.",
    guidance: "Be direct about what was missed and why, emphasize when you flagged the risk and what you negotiated, and close with the specific planning change you adopted. Interviewers forgive a miss more readily than a surprise.",
    example: "I underestimated a data-cleanup project and missed the original date by a week. I raised it ten days out with a revised plan and finished the highest-impact portion on the original date so reporting was not blocked. Since then I break estimates into stages and add a buffer for data quality issues, which I now expect rather than discover.",
    pitfalls: "Blaming the miss entirely on others, revealing you told no one until the deadline passed, or picking an example with severe consequences and no learning.",
  },
  {
    question: "Tell me about a time you worked successfully as part of a team.",
    whyAsked: "Beyond collaboration in the abstract, interviewers want your actual contribution style: what you personally did that made the team work better.",
    guidance: "Set up the shared goal and the team's composition, then be precise about your role and one or two contributions that were distinctly yours — coordinating, unblocking, documenting, quality-checking. Credit the team while keeping your part visible.",
    example: "For our annual inventory count, five of us had overlapping responsibilities and the previous year had ended in recounts. I proposed a zone map with named owners and a shared tally sheet everyone updated in real time. We finished in one pass, and the same map was reused the following year.",
    pitfalls: "Using we for every action so your contribution disappears, describing parallel solo work as teamwork, or taking sole credit for a group result.",
  },
  {
    question: "Tell me about a time you had to juggle multiple priorities or tight deadlines.",
    whyAsked: "This tests triage under real load: how you decide, communicate, and protect quality when you cannot do everything at once.",
    guidance: "Describe the competing demands concretely, walk through the order you chose and why, and mention how you kept stakeholders informed. A visible system — a ranked list, a daily check-in, an early renegotiation — is the substance of a strong answer.",
    example: "During a system migration I was supporting two departments with go-lives a week apart. I published a shared schedule showing which team had me on which days, flagged the one overlap early, and arranged cover for routine tickets. Both go-lives happened on time and neither team was surprised by my availability.",
    pitfalls: "Implying you simply worked unsustainable hours, having no prioritization logic, or admitting tasks were dropped without telling anyone.",
  },
  {
    question: "Tell me about a time you received critical feedback. How did you respond?",
    whyAsked: "Interviewers are checking coachability: whether feedback triggers defensiveness or visible improvement.",
    guidance: "Recount the feedback accurately and fairly, describe your immediate response (listening, asking a clarifying question), then the specific change you made and any evidence it worked. Fair, specific feedback you acted on makes the strongest story.",
    example: "My manager told me my status updates buried the decision items at the end, so busy readers missed them. I restructured my updates to lead with decisions and deadlines, and asked her to check the next two. She said the format worked, and other team members started copying it.",
    pitfalls: "Disputing the feedback's fairness as the main point of the story, choosing feedback so minor it avoids the question, or showing no resulting change.",
  },
  {
    question: "Tell me about a time you took the lead on a project or initiative.",
    whyAsked: "Leadership here means ownership, not title. Interviewers want to see you define the work, coordinate people, and carry it to completion.",
    guidance: "Explain why the project needed an owner, how you scoped it and got buy-in, how you tracked progress and handled obstacles, and the delivered result. Mention what you delegated — leading includes distributing work, not doing it all.",
    example: "Our onboarding paperwork was inconsistent across locations, so I volunteered to standardize it. I gathered every version in use, drafted a single packet with the compliance lead, and piloted it at two sites before rolling it out. Processing time for new hires dropped noticeably, and locations stopped keeping private versions.",
    pitfalls: "Describing a project you were assigned and merely completed, skipping how you handled a setback, or presenting leadership as doing everything yourself.",
  },
  {
    question: "Tell me about a time you persuaded someone to see things your way.",
    whyAsked: "This assesses influence without authority: whether you build a case from the other person's priorities rather than just arguing harder.",
    guidance: "Identify the stakeholder and what they cared about, then show how you framed your proposal around their concerns, what evidence you brought, and what compromise or adjustment sealed the agreement.",
    example: "A department head resisted moving her team's records into the shared system because she feared losing control of access. I walked her through the permission settings using her own team's structure as the example and offered a pilot with five users. After the pilot she approved the full move herself.",
    pitfalls: "Describing persuasion as wearing someone down, winning by escalation to senior management, or showing no understanding of the other side's concern.",
  },
  {
    question: "Tell me about a time you had to deliver bad news or a difficult message.",
    whyAsked: "Interviewers want honesty, directness, and empathy — especially for roles involving clients, patients, or the public.",
    guidance: "Describe the message, explain how you prepared (facts, timing, privacy), how you delivered it plainly without false reassurance, and what you offered next: options, a plan, or support. Close with how the person responded or what happened afterward.",
    example: "I had to tell a long-standing customer that we were discontinuing the service tier they relied on. I called rather than emailing, explained the timeline and the reason honestly, and had a migration option priced and ready before the call. They were unhappy but stayed, later saying the early notice was why.",
    pitfalls: "Choosing an example where you delayed until the news leaked, softening the message until it was misleading, or showing no follow-up support.",
  },
  {
    question: "Tell me about a time you improved a process or solved a recurring problem.",
    whyAsked: "This reveals initiative and systems thinking: whether you notice patterns, diagnose causes, and leave things better than you found them.",
    guidance: "Quantify the recurring problem if you can, explain how you identified the cause rather than treating symptoms, describe the change you introduced, and give the before-and-after result. Note whether the fix stuck or was adopted by others.",
    example: "Our team kept discovering stock discrepancies only at month-end. I traced most of them to one receiving step where quantities were typed from memory. I introduced a scan-and-confirm step at that point; the next two month-ends had a fraction of the corrections, and the step is now in the training checklist.",
    pitfalls: "Describing a one-off fix rather than a recurring problem, skipping the diagnosis, or claiming an improvement you cannot describe the effect of.",
  },
  {
    question: "Tell me about a time you had to work with someone whose working style was very different from yours.",
    whyAsked: "Teams are mixed by default. Interviewers want flexibility and curiosity about other approaches, not tolerance through gritted teeth.",
    guidance: "Describe the difference concretely — pace, detail level, communication style — then the adjustment you made or the agreement you reached, and what the collaboration produced. Bonus credibility if the difference genuinely improved the work.",
    example: "A colleague liked to explore options verbally for a long time before deciding, while I prefer a written shortlist. We agreed I would send a one-page summary before meetings and she would talk through it with me there. Decisions got faster, and her challenges caught a flaw in one of my proposals that a quicker process would have missed.",
    pitfalls: "Framing the other style as simply wrong, describing endurance rather than adaptation, or choosing an example that ends in separation rather than collaboration.",
  },
  {
    question: "Tell me about a time you had to make a decision with incomplete information.",
    whyAsked: "Real work rarely waits for perfect data. Interviewers assess judgment: how you weigh risk, decide what is enough to know, and keep a decision reversible where possible.",
    guidance: "Explain what was missing, what you did to close the most important gaps quickly, the assumption you proceeded on and why it was reasonable, and how it turned out — including how you monitored for being wrong.",
    example: "A venue change forced us to pick a new training room without visiting it. I gathered photos, measurements, and the building manager's answers on access and equipment, chose the room that met the non-negotiables, and booked a backup slot in our own office in case it failed. It worked, and the backup was never needed.",
    pitfalls: "Presenting a guess as analysis, freezing as the strategy, or omitting any contingency thinking from the story.",
  },
  {
    question: "Tell me about a time you handled an unhappy or escalated situation and turned it around.",
    whyAsked: "Service recovery is a distinct skill. Interviewers listen for listening first, ownership of the problem, and a resolution that restored trust rather than just closing the ticket.",
    guidance: "Describe the complaint fairly, show the moment you took ownership (a named action, a timeline, a follow-up you personally made), and end with the customer's actual outcome — retained, reordered, revised their feedback, or accepted the plan.",
    example: "A patient family was upset about repeated billing confusion across three visits. I reviewed all three accounts with billing on the call, found the duplicated charge, corrected it, and gave them a single contact — me — for any further questions. They completed the remaining appointments with us and mentioned the follow-through in a satisfaction survey.",
    pitfalls: "Offering discounts as the entire resolution, blaming a policy you hide behind, or ending at the apology with no verified outcome.",
  },
  {
    question: "Tell me about a time you had to adapt quickly to a change at work.",
    whyAsked: "Reorganizations, new systems, and shifting priorities are constant. This question checks resilience and speed of adjustment without drama.",
    guidance: "Name the change and its timeline, describe your first practical steps — what you relearned, reorganized, or communicated — and the point at which you were operating at full speed again. Acknowledge the difficulty briefly; forced enthusiasm reads false.",
    example: "Midway through a quarter, our region was restructured and I picked up accounts I had never covered. I spent the first week reviewing each account's history and meeting their contacts with a short list of questions. By the second month my coverage metrics matched my old accounts, and two of those contacts became steady referrers.",
    pitfalls: "Describing resistance or workarounds that undermined the change, choosing a trivial change, or claiming instant adaptation with no concrete steps.",
  },
  {
    question: "Tell me about a time you noticed a problem before anyone else did.",
    whyAsked: "Interviewers value attentiveness and the instinct to act on an early signal rather than waiting for an assignment or a crisis.",
    guidance: "Explain what you observed, how you verified it was real before raising it, who you brought it to, and what acting early prevented or made cheaper. The verification step is what separates vigilance from alarm.",
    example: "Reviewing weekly sign-ups, I noticed registrations from one referral partner had quietly halved over three weeks. I checked the tracking link, found it had broken during a site update, and flagged it to the web team the same day. The link was restored within 48 hours, and the partner never knew there had been a problem.",
    pitfalls: "Describing a problem everyone already knew about, raising the alarm with no checking first, or noticing but leaving the fix entirely to others without following up.",
  },
];

export const questionsToAsk: { category: string; items: AskEntry[] }[] = [
  {
    category: "The role",
    items: [
      {
        question: "What would success in this role look like in the first six months?",
        why: "Reveals the real priorities behind the posting and gives you the yardstick you will be measured against, so you can speak to it in later rounds.",
      },
      {
        question: "What are the biggest challenges someone stepping into this role will face?",
        why: "Shows you are thinking about the hard parts, not just the attractive ones, and surfaces obstacles you can address with relevant experience.",
      },
      {
        question: "How is this role different from the last person who held it, if anyone has?",
        why: "Uncovers whether the job is growing, being redesigned, or was vacated for a reason worth understanding before you accept.",
      },
      {
        question: "What does a typical week actually look like — how is time split between the main responsibilities?",
        why: "Postings list duties without proportions. This tells you whether the work you enjoy is the bulk of the job or a small slice of it.",
      },
      {
        question: "Which responsibilities in the posting are the most urgent for the team right now?",
        why: "Lets you focus the rest of the conversation on the problems they most need solved and position your experience against them.",
      },
      {
        question: "What tools, systems, or processes does this role rely on day to day?",
        why: "Clarifies the real working environment and gives you a natural opening to mention directly relevant experience without forcing it.",
      },
    ],
  },
  {
    category: "The team",
    items: [
      {
        question: "How is the team structured, and who would I work with most closely?",
        why: "Helps you picture the actual collaboration pattern and judge whether the team size and mix suit how you work.",
      },
      {
        question: "How does the team handle disagreements about approach or priorities?",
        why: "The answer reveals more about culture than any values statement — look for evidence, discussion, and a clear way decisions get made.",
      },
      {
        question: "What is the team's biggest current bottleneck or frustration?",
        why: "Shows candor about joining a real workplace, and may reveal the exact problem your skills could relieve.",
      },
      {
        question: "How do team members share knowledge — is there documentation, pairing, or regular reviews?",
        why: "Tells you how quickly you can get up to speed and whether learning is built into the workflow or left to chance.",
      },
      {
        question: "What do the strongest performers on this team have in common?",
        why: "Gives you the unwritten success criteria and lets you reflect honestly on whether they match your strengths.",
      },
      {
        question: "How often does the whole team meet or collaborate in person or live?",
        why: "A practical fit question about rhythm and communication style that is hard to judge from a posting alone.",
      },
    ],
  },
  {
    category: "The manager",
    items: [
      {
        question: "How do you like to stay updated on your team's work — regular check-ins, written updates, something else?",
        why: "Management style shapes daily life more than almost anything else. This tells you whether their default matches yours.",
      },
      {
        question: "How do you approach giving feedback, and how often does it usually happen?",
        why: "Signals whether development is continuous or confined to annual reviews, and how comfortable the manager is with direct conversation.",
      },
      {
        question: "What do you enjoy most about managing this team?",
        why: "An open, human question that managers tend to answer honestly — the answer shows what they value and notice.",
      },
      {
        question: "When a project is off track, how do you prefer to hear about it?",
        why: "Reveals expectations around early escalation and psychological safety, which matter most in your first difficult month.",
      },
      {
        question: "How do you support people on the team who want to grow into new responsibilities?",
        why: "Shows whether growth is actively managed or left entirely to the employee, without sounding like you are already planning an exit.",
      },
      {
        question: "What is your background, and how long have you led this team?",
        why: "Builds genuine rapport and gives context for their perspective — tenure and path often explain a team's style.",
      },
    ],
  },
  {
    category: "Growth",
    items: [
      {
        question: "What learning or development opportunities are built into this role?",
        why: "Shows ambition grounded in the job, and tells you whether training, mentoring, or stretch projects are real or theoretical.",
      },
      {
        question: "What career paths have people in this role taken within the company?",
        why: "Concrete precedents beat promises. Real examples show the progression is possible; vague answers suggest it is rare.",
      },
      {
        question: "How are promotions or level changes decided here?",
        why: "Understanding the criteria early lets you aim your work at what actually counts rather than guessing for a year.",
      },
      {
        question: "Is there a formal review cycle, and what does it focus on?",
        why: "Clarifies how performance is judged and how often, so there are no surprises about goal-setting or ratings.",
      },
      {
        question: "Are there opportunities to take on projects outside the core responsibilities?",
        why: "Signals initiative and tells you whether the organization rewards people who raise their hand for cross-team work.",
      },
      {
        question: "Does the company support certifications, courses, or conference attendance for this role?",
        why: "A concrete resourcing question that distinguishes employers who invest in skills from those who only talk about it.",
      },
    ],
  },
  {
    category: "Company",
    items: [
      {
        question: "What are the company's main priorities for the next year or two?",
        why: "Shows you think beyond your desk and helps you judge stability and direction before committing.",
      },
      {
        question: "How does this department's work connect to those priorities?",
        why: "Reveals whether the team is central to the strategy or peripheral, which affects resources, visibility, and job security.",
      },
      {
        question: "What distinguishes the company from its main competitors, in your view?",
        why: "Asking for their perspective, rather than reciting marketing copy, produces a more candid picture of positioning.",
      },
      {
        question: "What changes or growth is the company going through right now?",
        why: "Expansion, restructuring, and new markets all change what a job feels like. Better to learn it now than in month two.",
      },
      {
        question: "What do you enjoy most about working here?",
        why: "A classic for a reason: the specificity and warmth of the answer is itself information about the culture.",
      },
      {
        question: "How would you describe the culture in practical terms — how do people actually work together here?",
        why: "Pushes past slogans to daily reality: pace, transparency, meeting load, and how decisions really get made.",
      },
    ],
  },
  {
    category: "Next steps",
    items: [
      {
        question: "What are the next steps in the process, and what is your timeline for a decision?",
        why: "Sets expectations, prevents anxious guessing, and shows professional follow-through. Always ask this if it has not been covered.",
      },
      {
        question: "Is there anything else I can provide that would help you evaluate my fit?",
        why: "Gives the interviewer an opening to request proof you can supply — a work sample, a reference, a detail — and signals openness.",
      },
      {
        question: "Will the next round involve meeting the team or a practical exercise?",
        why: "Lets you prepare properly and signals that you take the process seriously enough to plan for it.",
      },
      {
        question: "Who should I stay in contact with as the process moves forward?",
        why: "Avoids the common dead end of having no named contact, and makes your thank-you note land with the right person.",
      },
      {
        question: "If the timeline shifts, how will you communicate updates?",
        why: "A calm, practical question that normalizes follow-up and reduces the chance of being ghosted without recourse.",
      },
    ],
  },
];

export const questionsToAskEnd: AskEntry[] = [
  {
    question: "Is there anything about my background that gives you pause about my fit for this role?",
    why: "The most valuable closing question. It surfaces objections while you are still in the room to address them calmly with evidence, instead of leaving them unspoken in the decision meeting.",
  },
  {
    question: "What would you want the person in this role to accomplish in the first 90 days?",
    why: "Shows forward focus and gives you a concrete picture of early expectations you can sanity-check against your experience.",
  },
  {
    question: "What are the next steps, and when should I expect to hear from you?",
    why: "Removes ambiguity, gives you a legitimate date for follow-up, and closes the conversation professionally.",
  },
  {
    question: "Based on our conversation, is there an area of my experience you would like me to go deeper on?",
    why: "Invites the interviewer to steer you to what matters most to them — often the topic their final evaluation will hinge on.",
  },
  {
    question: "What do you personally enjoy most about working on this team?",
    why: "Ends on a human note, often produces the most candid answer of the interview, and gives you real information about the culture.",
  },
  {
    question: "Is there anything about the role or team that candidates usually misunderstand before starting?",
    why: "Signals maturity and a desire for the real picture. The answer frequently reveals the job's true center of gravity.",
  },
  {
    question: "How will you be evaluating candidates for this role — what carries the most weight?",
    why: "Tells you what to emphasize in your thank-you note and any later rounds, and occasionally reveals criteria you can still address on the spot.",
  },
  {
    question: "Would it be helpful if I sent over an example of my work related to what we discussed?",
    why: "Turns a claim you made into evidence after the interview, and gives you a substantive reason to reappear in their inbox within 24 hours.",
  },
  {
    question: "What is the team working on right now that you are most excited about?",
    why: "Reveals current energy and priorities, and lets you end the interview responding to something they care about rather than something generic.",
  },
  {
    question: "Is there anyone else on the team you would recommend I speak with to understand the role better?",
    why: "Shows collaborative intent and respect for the team's perspective — and sometimes leads directly to an additional conversation that strengthens your candidacy.",
  },
];

export const tellMeAboutYourself: {
  structure: { step: string; detail: string }[];
  examples: { context: string; text: string }[];
  faqs: FaqEntry[];
} = {
  structure: [
    {
      step: "Present — where you are now",
      detail: "Open with your current role or situation and one credibility marker: your scope, your main responsibility, or a recent result. Two sentences is enough. This frames everything that follows as relevant to the job in front of you.",
    },
    {
      step: "Past — how you got here",
      detail: "Select the one or two earlier experiences that built the skills this role needs most. Do not retell your whole history — draw a straight line from those experiences to the capabilities you are claiming today.",
    },
    {
      step: "Future — why this role, why now",
      detail: "Close by connecting your direction to this specific opportunity: what you want to do more of, and where this role provides it. Ending on the role leaves the interviewer with fit, not biography, as the takeaway.",
    },
    {
      step: "Keep it to 60 to 90 seconds",
      detail: "Rehearse out loud and time it. If you run long, cut early history first — the present and the future connection matter most. Leave deliberate hooks: a result or project the interviewer can ask about next.",
    },
  ],
  examples: [
    {
      context: "Career changer — retail management to office administration",
      text: "I currently manage a team of eight at a busy retail store, where I handle scheduling, hiring paperwork, and our weekly reporting. Over the past two years I have taken on more of the back-office work — building the staff rota, reconciling daily takings, and training new supervisors on our systems — and found that is the part of the job I am best at and enjoy most. I have completed an evening course in office administration, and I am now looking to make that operational work my full-time focus, which is what drew me to this role.",
    },
    {
      context: "Recent graduate — first professional role",
      text: "I graduated this spring with a degree in communications, and for the past year I have been running social media and newsletters for a local nonprofit on a part-time basis, growing their mailing list steadily with a weekly content series I proposed and produced. During my degree I completed two internships in marketing teams, where I learned campaign planning and basic analytics reporting. I am looking for my first full-time role where I can build on the content and campaign work — this position's mix of writing and performance reporting is exactly the combination I have been preparing for.",
    },
    {
      context: "Experienced specialist — senior technical role",
      text: "I am a systems administrator with nine years in healthcare IT, currently supporting a network of clinics — about 400 users across six sites. My recent work has focused on migrations and security hardening; last year I led our move to a new endpoint management platform with no unplanned downtime for clinics. Earlier in my career I worked generalist support roles, which gave me the troubleshooting breadth I still rely on. I am now looking for a role with more infrastructure ownership and project work, which is why this position caught my attention.",
    },
  ],
  faqs: [
    {
      q: "How long should my answer to 'Tell me about yourself' be?",
      a: "Aim for 60 to 90 seconds spoken aloud — roughly 150 to 200 words. Shorter can feel thin; longer almost always drifts into resume narration. Time yourself in rehearsal, because answers feel shorter in your head than they sound in the room.",
    },
    {
      q: "Should I mention personal details or hobbies?",
      a: "Only briefly and only if they connect to the work — a relevant volunteer role or a skill-building hobby. Interviewers are listening for professional fit, so personal history, family details, and unrelated interests take time away from the case you are building.",
    },
    {
      q: "What if I have a career gap or a non-linear path?",
      a: "Do not apologize or over-explain. Name the period in one neutral clause if it is needed for the timeline to make sense, note anything productive or skill-related from it if true, and move quickly back to your qualifications and the role. The past-present-future structure keeps a gap from becoming the story.",
    },
    {
      q: "Is it a problem if my answer overlaps with my resume?",
      a: "Overlap is expected — your resume lists facts, while this answer selects and connects them. The mistake is reading the resume in order. Choose only the experiences that support your fit for this specific role and arrange them as a short narrative with a clear destination.",
    },
  ],
};

export const elevatorPitch: {
  formula: { step: string; detail: string }[];
  examples: { context: string; text: string }[];
  faqs: FaqEntry[];
} = {
  formula: [
    {
      step: "Who you are — role and level in one line",
      detail: "Lead with a clear professional identity: your role or field plus a rough sense of seniority or setting. One sentence a stranger could repeat back accurately.",
    },
    {
      step: "What you do best — your specialty",
      detail: "Name the specific kind of work, problem, or customer you are known for. Specificity is what makes a pitch memorable; a narrow claim beats a broad one in almost every conversation.",
    },
    {
      step: "Proof — one result or credential",
      detail: "Add a single concrete anchor: a scale you have handled, an outcome you produced, or a qualification that matters. One proof point, stated plainly, does more than a list of adjectives.",
    },
    {
      step: "Direction — what you are looking for or offering",
      detail: "End with the forward-looking line that fits the setting: the role you are seeking, the clients you take on, or the collaboration you are open to. In networking settings, finish with a question that hands the conversation back.",
    },
  ],
  examples: [
    {
      context: "Job fair — operations candidate",
      text: "I am an operations coordinator in distribution — for the past four years I have run scheduling and vendor follow-up for a regional warehouse. My strength is tightening handoffs: I rebuilt our delivery exception process and cut repeat customer calls noticeably. I am looking for a larger operation where I can focus on process improvement.",
    },
    {
      context: "Networking event — career changer",
      text: "I spent six years teaching middle school, and this year I completed a certification in instructional design. I now build onboarding training for small companies — basically applying classroom craft to workplace learning. I am looking to connect with operations managers whose new hires take too long to get up to speed.",
    },
    {
      context: "Interview opener — healthcare professional",
      text: "I am a medical assistant with five years in outpatient clinics, mostly in family practice. I specialize in keeping a provider's schedule running on time — rooming, intake, and follow-up calls — and I was the trainer for our clinic's new scheduling system. I am looking for a clinic role with more patient education work.",
    },
    {
      context: "Professional introduction — software developer",
      text: "I am a backend developer focused on payment systems. For the last three years I have worked on transaction processing for a retail platform, mostly reliability work — retries, reconciliation, the unglamorous parts that keep money moving correctly. I am interested in teams where that kind of correctness really matters.",
    },
    {
      context: "Freelancer — introducing services",
      text: "I help small professional firms keep their books clean without hiring in-house. I am a bookkeeper with a decade of experience in monthly closes, payroll support, and cleaning up records that have fallen behind — most of my clients arrive with a backlog and stay for the monthly routine.",
    },
    {
      context: "Recent graduate — alumni event",
      text: "I graduated in May with a degree in data analytics, and I spent my final year interning with the city's transportation department, building dashboards on ridership patterns. I am looking for an entry-level analyst role where I can keep working with operational data — and I am curious what kinds of problems your team uses data for.",
    },
    {
      context: "Internal meeting — new team member",
      text: "I have just joined from the customer success side, where I managed onboarding for our mid-size accounts for three years. I know our customers' first ninety days in detail, which is why I have moved into product operations — to fix the friction points I used to talk customers through.",
    },
    {
      context: "Conference — specialist consultant",
      text: "I work with manufacturers on safety documentation — audits, training records, and the paperwork that has to be right when an inspector arrives. After twelve years in plant operations, I now consult for smaller sites that cannot justify a full-time safety manager. Most of my engagements start with a gap assessment.",
    },
  ],
  faqs: [
    {
      q: "How long should an elevator pitch be?",
      a: "Twenty to forty seconds for a spoken pitch — about 50 to 100 words. It should cover identity, specialty, one proof point, and direction without rushing. If the listener wants more, they will ask, which is the pitch working as intended.",
    },
    {
      q: "Should I memorize my pitch word for word?",
      a: "Memorize the structure and your key phrases, not a script. A fully scripted pitch sounds recited and collapses if the listener interrupts. Knowing your four beats — identity, specialty, proof, direction — lets you adapt length and emphasis to the moment.",
    },
    {
      q: "How do I pitch myself if I am changing careers?",
      a: "Lead with your target identity supported by transferable proof: the new credential, the project, or the part of your old role that was already this work. A brief bridge — 'after six years in X, I have moved into Y' — is clearer than hiding the change and hoping nobody notices.",
    },
    {
      q: "What is the difference between an elevator pitch and 'Tell me about yourself'?",
      a: "They share ingredients but serve different moments. The pitch is for introductions — networking, job fairs, first meetings — and runs under a minute with a direction line at the end. The interview answer is longer, tailored to a specific role, and structured present-past-future to set up the conversation that follows.",
    },
  ],
};

export const starMethod: {
  steps: { letter: string; name: string; detail: string }[];
  workedExample: { title: string; situation: string; task: string; action: string; result: string };
  faqs: FaqEntry[];
} = {
  steps: [
    {
      letter: "S",
      name: "Situation",
      detail: "Set the scene in two or three sentences: where you worked, what was happening, and what was at stake. Give only the context the listener needs to understand the difficulty — background is the most common place answers overrun.",
    },
    {
      letter: "T",
      name: "Task",
      detail: "State your specific responsibility in the situation. What were you personally accountable for — not the team, not your manager? This sentence separates your contribution from everyone else's and sets up the actions that follow.",
    },
    {
      letter: "A",
      name: "Action",
      detail: "Walk through what you did, in the order you did it. This is the heart of the answer and should take roughly half your time. Name the steps, the tools, the conversations, and any obstacle you had to work around. Use 'I' for your actions even in team stories.",
    },
    {
      letter: "R",
      name: "Result",
      detail: "Close with the outcome: what improved, what was delivered, what the customer or team gained. Quantify when you honestly can — time, money, volume, error rates — and mention if the result was recognized, adopted, or is still in place.",
    },
  ],
  workedExample: {
    title: "Tell me about a time you handled a difficult deadline.",
    situation: "At my previous job with a regional accounting firm, our largest client moved their year-end audit forward by three weeks with little notice. Two of the five staff assigned to the engagement were already committed elsewhere, so the team was short-handed for the busiest filing period of the year.",
    task: "As the senior associate on the engagement, I was responsible for reorganizing the work plan and making sure every audit section still had an owner and a review date.",
    action: "I broke the engagement into sections, ranked them by how much client input each one needed, and sent the document requests for the most dependent sections that same day. I reassigned the two available juniors to the sections they knew best, took the most technical section myself, and set a fifteen-minute daily stand-up so blockers surfaced within a day instead of at the weekly meeting. When one client's records arrived incomplete, I escalated with a specific list of what was missing rather than a general reminder.",
    result: "We delivered the audit two days before the revised deadline, with no sections deferred. The daily stand-up format worked well enough that the firm adopted it for the whole busy season, and the client renewed their engagement the following year.",
  },
  faqs: [
    {
      q: "How long should a STAR answer be?",
      a: "About one to two minutes spoken — long enough for a complete action sequence, short enough to hold attention. If your situation and task take more than a third of the answer, compress them; interviewers score the action and result, not the backstory.",
    },
    {
      q: "Can I use the same story for more than one question?",
      a: "A versatile story can serve two questions if you genuinely re-angle it — different actions emphasized, different lesson drawn. Repeating the same story a third time, or telling it identically twice, signals a thin evidence base. Prepare five or six stories that between them cover leadership, conflict, failure, pressure, and improvement.",
    },
    {
      q: "What if my result was not fully successful?",
      a: "Use it anyway if you can show sound actions and a clear lesson. State the outcome honestly, explain what the partial result still achieved, and name what you changed afterward. Interviewers rate honest reflection on a mixed outcome higher than a suspiciously perfect record.",
    },
    {
      q: "Should I quantify every result?",
      a: "Quantify where the numbers are real and yours to share — time saved, backlog cleared, error rates, deadlines met. Where you cannot quantify, describe the observable outcome: the client renewed, the process was adopted, the complaint was withdrawn. Never invent figures; interviewers probe numbers, and a fabricated statistic unravels the whole story.",
    },
    {
      q: "Can I use examples from outside work — volunteering, school, or caregiving?",
      a: "Yes, especially if you are early in your career or returning to work. Choose organized, responsibility-bearing examples — running a volunteer rota, leading a group project, coordinating care — and apply the same discipline: your task, your actions, a concrete result. One non-work story among several work stories reads as resourceful; a full set can read as a gap.",
    },
  ],
};

export const prepareGuide: {
  sections: { heading: string; body: string[] }[];
  faqs: FaqEntry[];
} = {
  sections: [
    {
      heading: "Research the company and the role",
      body: [
        "Read the job posting closely enough to list its five core requirements from memory, and match each one to an experience you can talk about. Gaps you find now can be addressed honestly in the interview; gaps discovered in the room cannot.",
        "Study the company's website beyond the homepage: what it sells, who it serves, and any recent news, launches, or expansions. Note two specifics you can reference naturally — in your 'why here' answer and in the questions you ask.",
        "Look up your interviewers if you are told their names. Knowing a hiring manager's function or a panel member's background helps you pitch your answers at the right level and prepare relevant questions for each person.",
        "Check recent employee and customer reviews for recurring themes, good and bad. Treat single comments cautiously, but repeated mentions of pace, management style, or growth tell you what to probe in your own questions.",
      ],
    },
    {
      heading: "Prepare and practice your answers",
      body: [
        "Build a bank of five or six stories using STAR — leadership, conflict, a mistake, pressure, improvement, and a success — each written out in bullet points covering situation, task, action, and result. Most behavioral questions can be answered from this bank with a small adjustment.",
        "Draft your core answers in advance: tell me about yourself, why this job, your strengths, and one real weakness with the system you use to manage it. These four questions appear in some form in nearly every interview.",
        "Practice out loud, not silently. Answers that read well often run long or tangle when spoken. Time your core answers: 60 to 90 seconds for tell me about yourself, one to two minutes for each behavioral story.",
        "Do at least one mock interview with another person — or record yourself — and listen specifically for filler, rambling endings, and stories where your own contribution is unclear. Fix the two worst habits before the day.",
      ],
    },
    {
      heading: "Plan the logistics",
      body: [
        "Confirm the format, location or video link, start time, expected duration, and who you will meet. Save the interviewer's contact details in your phone in case something goes wrong on the day — needing them and having them reads as professional.",
        "If the interview is in person, work out the route and parking or transit in advance and plan to arrive ten to fifteen minutes early. If it is by video, test your camera, microphone, lighting, and background a day ahead, and have a phone hotspot plan if your connection is unreliable.",
        "Choose and prepare your outfit the day before: clean, pressed, and appropriate to the workplace's dress level — when in doubt, one step more formal than the team's everyday wear. Comfort matters; an interview is the wrong day for new shoes.",
        "Prepare your materials: printed copies of your resume if in person, a notebook and pen, your prepared questions written down, and any work samples or documents the employer requested, organized where you can reach them without searching.",
      ],
    },
    {
      heading: "On the day of the interview",
      body: [
        "Eat a normal meal beforehand and keep caffeine near your usual level. Arrive composed rather than wired — the goal is to sound like yourself on a good day, not like a performance.",
        "In the room, listen to each question fully before answering, and pause briefly to choose your best example rather than your first one. A two-second pause reads as thoughtfulness; a rushed answer often answers a question that was not asked.",
        "Answer the question asked, then stop. When you reach your result or your closing line, end cleanly instead of adding qualifications. If you lose your thread, it is fine to say 'let me come back to the core of that' and restate your point.",
        "Take brief notes on names, priorities, and anything you promised to send. These notes become the raw material for a specific, credible thank-you note.",
      ],
    },
    {
      heading: "Follow up after the interview",
      body: [
        "Send a thank-you email within 24 hours — same day is better for morning interviews. Thank them for a specific part of the conversation, restate one fit point briefly, and reference something they said about the role to show you listened.",
        "Send anything you offered during the interview: a work sample, a reference, a link, or a fuller answer to a question you handled briefly. Promised follow-through is itself an evaluation, and most candidates fail it by forgetting.",
        "Write down the questions you were asked and how your answers landed while your memory is fresh. This record is your preparation edge if you reach another round, and your improvement list if you do not.",
        "Respect the timeline they gave you. If the decision date passes without news, one polite follow-up email restating your interest and asking about timing is appropriate. Then wait — repeated chasing after that point works against you.",
      ],
    },
  ],
  faqs: [
    {
      q: "How early should I start preparing for an interview?",
      a: "For a scheduled interview, start as soon as the date is set. One focused session for research and story selection, one for out-loud practice, and a short review the day before beats a single long cram. If the interview is tomorrow, prioritize in this order: core answers, five STAR stories, company specifics, logistics.",
    },
    {
      q: "What should I bring to an in-person interview?",
      a: "Copies of your resume (one per interviewer, if you know the panel size), a notebook and pen, your written questions, a list of references in case it is requested, and any work samples or documents the employer asked for. Keep your phone silenced and out of sight from the moment you enter the building.",
    },
    {
      q: "How do I prepare when I do not know who will interview me?",
      a: "Prepare for three audiences at once: a recruiter screening for basics and logistics, a hiring manager testing depth and fit, and a potential colleague testing teamwork. Keep your tell-me-about-yourself answer flexible enough to shorten for a screen and expand for a manager conversation.",
    },
    {
      q: "What if I am asked a question I did not prepare for?",
      a: "Pause, and reach for the nearest story in your bank — most surprise questions are a familiar theme in new wording. If you genuinely have no example, say so briefly and describe how you would approach the situation, step by step. Interviewers accept a reasoned approach far more readily than a fabricated story.",
    },
  ],
};

export const checklist: { phase: string; items: string[] }[] = [
  {
    phase: "A week before",
    items: [
      "Re-read the job posting and list its five core requirements, each matched to an experience you can discuss",
      "Research the company: what it does, who it serves, and two recent specifics worth referencing",
      "Look up your interviewers' names and roles, if provided",
      "Write out five or six STAR stories covering leadership, conflict, a mistake, pressure, and improvement",
      "Draft answers to tell me about yourself, why this job, your strengths, and one managed weakness",
      "Prepare five or six questions to ask, spanning the role, the team, and next steps",
      "Confirm the interview format, time, location or video link, and expected duration",
    ],
  },
  {
    phase: "The day before",
    items: [
      "Practice your core answers out loud and time them — 60 to 90 seconds for tell me about yourself",
      "Do one mock interview or record yourself answering three behavioral questions",
      "Choose, check, and lay out your outfit; one step more formal than the team's everyday wear if unsure",
      "Plan your route and arrival time for in person, or test camera, microphone, lighting, and background for video",
      "Print resume copies and assemble notebook, pen, written questions, and any requested documents",
      "Save the interviewer's contact details in your phone",
      "Get a normal night's sleep rather than cramming late",
    ],
  },
  {
    phase: "The morning of",
    items: [
      "Eat a normal breakfast and keep caffeine near your usual amount",
      "Skim your story bank and prepared questions once — review, do not rewrite",
      "Dress fully before a video interview, not only from the waist up, to settle into a professional mindset",
      "Leave with enough buffer to arrive ten to fifteen minutes early, or log on five to ten minutes early for video",
      "Silence your phone and close unrelated tabs, apps, and notifications",
      "Bring water, and keep a copy of your resume and the job posting within reach",
    ],
  },
  {
    phase: "During the interview",
    items: [
      "Listen to each question completely before answering; pause briefly to pick your best example",
      "Structure behavioral answers with STAR and spend most of the time on your actions",
      "Be specific: name your personal contribution wherever a team is involved",
      "Keep answers to one to two minutes unless the interviewer asks you to go deeper",
      "Take short notes on names, priorities, and anything you promise to send",
      "Ask your prepared questions, prioritizing the ones the conversation made most relevant",
      "Close by asking about next steps and timeline if they have not been covered",
      "Thank each interviewer by name where you can",
    ],
  },
  {
    phase: "After the interview",
    items: [
      "Send a thank-you email within 24 hours, referencing a specific part of the conversation",
      "Send any work sample, reference, or information you promised during the interview",
      "Write down the questions asked and how your answers landed, while memory is fresh",
      "Note the stated decision timeline in your calendar",
      "If the timeline passes with no news, send one polite follow-up restating your interest",
      "Review what you would improve and add stronger stories to your bank for the next interview",
    ],
  },
];

export const generalFaqs: {
  common: FaqEntry[];
  behavioral: FaqEntry[];
  questionsToAsk: FaqEntry[];
} = {
  common: [
    {
      q: "How many common interview questions should I prepare for?",
      a: "Prepare solid answers for about ten core questions — tell me about yourself, why this job, why hire you, strengths, weakness, a challenge, where you see yourself, why you are leaving, salary expectations, and what you know about the company. These recur across almost every industry, and most other questions are variations on one of them.",
    },
    {
      q: "Is it okay to ask for a moment to think before answering?",
      a: "Yes. A brief pause, or a phrase like 'that is a good question — let me think of the best example,' reads as careful rather than unprepared. What hurts is a long silence followed by a rushed, unstructured answer, so use the pause to choose an example and a structure, not to search for any words at all.",
    },
    {
      q: "How honest should I be about why I am leaving my job?",
      a: "Honest about direction, discreet about grievances. Stating that you want more client contact, growth, or a different scope is both truthful and checkable. Detailing conflicts, complaints about management, or pay disputes invites the interviewer to imagine your future references — and your future exit interview with them.",
    },
    {
      q: "What if I do not meet every requirement in the posting?",
      a: "Apply and interview anyway if you meet the core of the role. If asked about a gap, acknowledge it plainly, point to the closest adjacent experience, and describe how you would close the gap quickly, with an example of learning something similar before. Never claim a qualification you do not have — most gaps are survivable, dishonesty is not.",
    },
    {
      q: "Should I bring up salary in a first interview?",
      a: "Follow the interviewer's lead. If they raise it, answer with a researched range tied to the role's scope and the full package. If they do not, save negotiation for the offer stage — the first interview is for establishing fit and value, which is what your eventual number will rest on.",
    },
  ],
  behavioral: [
    {
      q: "What makes a behavioral answer strong?",
      a: "A specific, real example structured with STAR, where your personal actions take up most of the answer and the result is concrete — delivered, measured, adopted, or visibly improved. Vague principles and team accomplishments without your contribution are the two most common reasons behavioral answers score poorly.",
    },
    {
      q: "How many behavioral stories should I prepare?",
      a: "Five or six well-built stories cover the great majority of behavioral questions. Choose them to span success, failure, conflict, pressure, leadership, and improvement, and know each one well enough to emphasize a different angle depending on the question asked.",
    },
    {
      q: "What if I have never faced the exact situation they ask about?",
      a: "Say so briefly and offer the closest genuine parallel: 'I have not managed a formal project, but I did coordinate…' — then answer fully with that example. Interviewers are assessing transferable behavior, and an honest adjacent story beats an invented exact match, which tends to collapse under follow-up questions.",
    },
    {
      q: "Can I use a story where things went wrong?",
      a: "Yes — for failure and mistake questions you must. Interviewers are listening for ownership, speed of disclosure, and a change in method afterward. Choose a real but contained setback, keep the majority of the answer on the fix and the safeguard, and never select a story involving dishonesty or harm.",
    },
    {
      q: "How do I stop my behavioral answers from rambling?",
      a: "Write each story as four bullet points before the interview — one per STAR stage — and rehearse to the bullets rather than a script. In the room, when you reach the result, stop talking. Most rambling happens after the answer is complete, when candidates add context that dilutes a clean ending.",
    },
  ],
  questionsToAsk: [
    {
      q: "How many questions should I ask at the end of an interview?",
      a: "Prepare five or six and expect to ask two to four, depending on time and on how many were answered during the conversation. Quality matters more than coverage — one question that sparks a real exchange is worth more than a rapid list read from a page.",
    },
    {
      q: "What if the interviewer already answered my prepared questions?",
      a: "Acknowledge it and pivot: 'You covered most of what I planned to ask about the team — one thing I am still curious about is…' Then use a backup from another category, or ask a follow-up based on something said earlier. Never close with 'you answered everything' and nothing else; always keep one question in reserve, even if it is about next steps.",
    },
    {
      q: "Are there questions I should avoid asking in a first interview?",
      a: "Avoid leading with pay, hours, vacation, and perks before an offer is on the table — those are legitimate topics at the right stage, but asking them first signals your priorities in the wrong order. Also avoid anything the posting or the company's public pages answer plainly, which suggests you did not prepare.",
    },
    {
      q: "Is it appropriate to ask about the interviewer's own experience?",
      a: "Yes — questions like what they enjoy about the team or how long they have been with the company are welcome and often produce the most candid answers of the interview. Keep them professional in scope: their role, the team, and the work, rather than personal topics.",
    },
    {
      q: "Should I write my questions down and bring them?",
      a: "Yes. Bringing a written list in a notebook signals preparation, and glancing at it briefly is completely normal. Write the questions in shorthand rather than reading them verbatim, and note the answers — the notes give you material for a specific thank-you note and for comparing offers later.",
    },
  ],
};
