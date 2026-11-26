// Copy for the /templates/ library. Plain, practical, answer-first.
// No statistics, quotes or studies, and no personal names.

import type { FaqEntry } from '../data/types';

export type TemplateContent = {
  id: string;
  /** <title> and H1 */
  title: string;
  h1: string;
  metaDescription: string;
  /** Answer-first summary, 2-3 sentences. */
  summary: string;
  /** The template itself, plain text. Shown inline and served as the .txt download. */
  body: string;
  /** 3-5 short steps. */
  howTo: string[];
  /** One line for the CTA box. */
  ctaText: string;
  /** One line for the hub card. */
  hubBlurb: string;
  /** Visible Q&A rendered on the page and mirrored into FAQPage JSON-LD. */
  faqs: FaqEntry[];
};

export const TEMPLATE_CONTENT: readonly TemplateContent[] = [
  {
    id: "meeting-agenda-template",
    title: "Meeting Agenda Template (Free Copy and Download)",
    h1: "Meeting agenda template",
    metaDescription:
      "Free meeting agenda template with a goal, timed topics, owners, decisions and action items. Copy it or download it as a text file.",
    summary:
      "A good meeting agenda states the goal of the meeting, lists the topics in order with an owner and a time for each, and says what outcome each topic needs: a decision, input or an update. Send it to attendees ahead of time so they can prepare, and close the meeting by confirming decisions, owners and due dates. Copy the template below or download it as a text file.",
    body: `MEETING AGENDA

Meeting: [Meeting name]
Date and time: [Date, start - end, time zone]
Location or link: [Room or video link]
Facilitator: [Name]
Note-taker: [Name]
Attendees: [Names]

GOAL
By the end of this meeting we will: [one sentence, e.g. "agree on the launch date"]

PREPARE BEFORE THE MEETING
- [Document or link to read]
- [Update or data to bring]

AGENDA
1. Welcome and goal check (5 min) - [Facilitator]
2. [Topic 1] (__ min) - [Owner]
   Outcome needed: [Decision / Input / Update]
3. [Topic 2] (__ min) - [Owner]
   Outcome needed: [Decision / Input / Update]
4. [Topic 3] (__ min) - [Owner]
   Outcome needed: [Decision / Input / Update]
5. Recap: decisions, action items, next steps (5 min) - [Facilitator]

DECISIONS
- [Decision]

ACTION ITEMS
- [Task] - Owner: [Name] - Due: [Date]

PARKING LOT
- [Topics raised that need their own discussion]
`,
    howTo: [
      "Write the goal first. If you can't say what the meeting should achieve in one sentence, it may not need to be a meeting.",
      "List only the topics that serve that goal, put the most important one first, and give each an owner and a time box.",
      "Mark what each topic needs (a decision, input or an update) so people know how to prepare.",
      "Send the agenda with the invite and ask attendees to add anything missing before the meeting.",
      "Use the last few minutes to read back decisions and action items, then share the notes.",
    ],
    ctaText:
      "Copy this agenda into your calendar invite or notes app — nothing is uploaded and no account is required.",
    hubBlurb: "Goal, timed topics, owners, decisions and action items for any team meeting.",
    faqs: [
      {
        q: "How far in advance should I send a meeting agenda?",
        a: "Send the agenda at least 24 hours before the meeting for routine team calls, and two to three days ahead when attendees need to read a document or prepare data.",
      },
      {
        q: "What should every meeting agenda include?",
        a: "A one-sentence goal, a short list of topics with an owner and time box for each, the outcome needed per topic (decision, input or update), and a closing slot for action items.",
      },
      {
        q: "What if we run out of time for a topic on the agenda?",
        a: "Move the unfinished item to the parking lot section with an owner and decide whether it needs a short follow-up message or a dedicated meeting, rather than rushing the final recap.",
      },
    ],
  },
  {
    id: "one-on-one-meeting-template",
    title: "One-on-One Meeting Template (Free Copy and Download)",
    h1: "One-on-one meeting template",
    metaDescription:
      "Free one-on-one meeting template for managers and team members: check-in, priorities, blockers, feedback, growth and action items.",
    summary:
      "A one-on-one meeting template gives a manager and a team member a shared, repeatable agenda: a quick check-in, the team member's topics first, progress and blockers, feedback in both directions, growth goals and action items. Keep it in one shared document and add each meeting's notes at the top, so you can see what you agreed last time. Copy the template below or download it as a text file.",
    body: `ONE-ON-ONE MEETING

Manager: [Name]
Team member: [Name]
Date: [Date]
Cadence: [Weekly / Every two weeks / Monthly]

1. CHECK-IN
- How are things going overall?
- Anything on your mind outside the day-to-day work?

2. TEAM MEMBER'S TOPICS (added before the meeting)
- [Topic]
- [Topic]

3. MANAGER'S TOPICS
- [Topic]

4. PRIORITIES AND PROGRESS
- What went well since we last met?
- What is blocked or slower than expected?
- What are the top priorities until we next meet?

5. FEEDBACK
- For the team member: [Specific example and suggestion]
- For the manager: What should I start, stop or keep doing?

6. GROWTH
- Goal or skill you're working on: [Goal]
- Support you need: [Project, training, introduction]

7. ACTION ITEMS
- [Task] - Owner: [Name] - Due: [Date]

FOLLOW UP NEXT TIME
- [Topic or open question]
`,
    howTo: [
      "Agree on a regular cadence and keep the slot, even when there is not much to discuss.",
      "Ask the team member to add their topics before each meeting and cover them first.",
      "Spend part of the time on blockers and priorities, and part on feedback and growth, not only status updates.",
      "End with action items that each have an owner and a due date.",
      "Start the next meeting by checking last time's action items.",
    ],
    ctaText:
      "Copy this one-on-one template into your own shared notes document — no account or upload required.",
    hubBlurb: "A repeatable manager and team member agenda: check-in, blockers, feedback and growth.",
    faqs: [
      {
        q: "Who owns the agenda for a one-on-one meeting?",
        a: "The team member should add their topics first and drive the opening half of the conversation, while the manager adds context, feedback and alignment topics for the second half.",
      },
      {
        q: "How often should one-on-one meetings happen?",
        a: "Weekly or every two weeks works for most roles. Keep the time consistent and avoid canceling just because there is no urgent status update — quiet weeks are when career growth and feedback happen.",
      },
      {
        q: "How do you keep a one-on-one from turning into a status meeting?",
        a: "Handle routine project updates in writing before the call, and reserve the live conversation for blockers, decisions, two-way feedback and longer-term growth.",
      },
    ],
  },
  {
    id: "client-onboarding-questionnaire",
    title: "Client Onboarding Questionnaire (Free Template)",
    h1: "Client onboarding questionnaire",
    metaDescription:
      "Free client onboarding questionnaire covering goals, scope, success measures, stakeholders, timeline, budget, access and communication.",
    summary:
      "A client onboarding questionnaire collects the facts you need before a project starts: the client's goals, what is in and out of scope, how success will be judged, who approves work, the timeline and budget, and how they like to communicate. Send it before the kickoff call so the call can be spent on decisions instead of basic questions. Copy the questions below or download them as a text file.",
    body: `CLIENT ONBOARDING QUESTIONNAIRE

ABOUT YOU
1. Company name and website:
2. Main contact (name, role, email, phone):
3. In a few sentences, what does your business do and who are your customers?

GOALS
4. What do you want this project to achieve?
5. Why is this important now?
6. How will you know the project was a success?

SCOPE
7. What do you expect us to deliver?
8. Is anything out of scope or handled by someone else?
9. Have you tried to solve this before? What worked and what didn't?

PEOPLE AND APPROVALS
10. Who else is involved, and what is their role?
11. Who gives final approval on work, and how quickly can they usually respond?

TIMELINE AND BUDGET
12. Are there fixed dates, launches or events we need to plan around?
13. What budget range have you set for this work?

ACCESS AND MATERIALS
14. What accounts, files, brand assets or data will we need access to?
15. Are there policies, legal requirements or security rules we should know about?

COMMUNICATION
16. How do you prefer to communicate (email, chat, calls)?
17. How often would you like progress updates?
18. Is there anything else we should know before we start?
`,
    howTo: [
      "Remove any questions that don't apply to your service and add one or two that are specific to it.",
      "Send the questionnaire as soon as the client signs, with a date you need the answers by.",
      "Read the answers before the kickoff and list anything that is unclear or conflicting.",
      "Use the kickoff call to confirm scope, success measures, approvers and the timeline.",
      "Save the answers with the project so the whole team can refer back to them.",
    ],
    ctaText:
      "Copy these onboarding questions into your intake form or email — everything stays in your own tools, with no sign-up required.",
    hubBlurb: "Goals, scope, approvals, timeline, access and communication, answered before kickoff.",
    faqs: [
      {
        q: "When should you send a client onboarding questionnaire?",
        a: "Send it right after the contract is signed and at least two business days before the kickoff call, so your team has time to read the answers and spot gaps.",
      },
      {
        q: "How many questions should a client onboarding questionnaire have?",
        a: "Keep it to 12 to 18 focused questions. Cut anything you already know from the sales process so the client does not feel like they are repeating themselves.",
      },
      {
        q: "What if a client skips half the questionnaire before kickoff?",
        a: "Use the first 15 minutes of the kickoff call to walk through the missing items together, especially success criteria, final approvers and hard deadlines, then send back a short written summary.",
      },
    ],
  },
  {
    id: "pre-meeting-questionnaire",
    title: "Pre-Meeting Questionnaire Template (Free Download)",
    h1: "Pre-meeting questionnaire",
    metaDescription:
      "Free pre-meeting questionnaire to send before a first call, consultation or discovery meeting. Copy the questions or download them.",
    summary:
      "A pre-meeting questionnaire is a short set of questions you send before a first call, consultation or discovery meeting so you understand the other person's goals, background and questions in advance. Keep it short enough to answer in a few minutes, and use the answers to plan the meeting around what they need. Copy the questions below or download them as a text file.",
    body: `PRE-MEETING QUESTIONNAIRE

Your name:
Company and role (if relevant):
Meeting date:

1. What would make this meeting worth your time?
2. What is the main topic or problem you want to discuss?
3. What background should I know before we talk?
4. What have you already tried, and how did it go?
5. Is there a deadline or timeline we should keep in mind?
6. Who else will join the meeting, and what are their roles?
7. Are there documents, links or examples I should look at beforehand?
8. What questions do you want answered by the end of the meeting?
9. After the meeting, what would a useful next step look like for you?
10. Anything else you'd like me to know?
`,
    howTo: [
      "Pick the five to eight questions that matter most for this kind of meeting; shorter forms are more likely to be completed.",
      "Send the questionnaire with the meeting confirmation and say why you are asking.",
      "Ask for answers a day or so before the meeting so you have time to read them.",
      "Plan your agenda around their answers to the first and last questions.",
      "Start the meeting by playing back what you read, so they can correct anything.",
    ],
    ctaText:
      "Copy these questions into your scheduling confirmation or email — no account or upload needed.",
    hubBlurb: "Short questions to send before a first call, consultation or discovery meeting.",
    faqs: [
      {
        q: "How many questions should a pre-meeting questionnaire include?",
        a: "Stick to five to eight questions that someone can answer in under five minutes. Longer forms tend to be ignored until the call starts.",
      },
      {
        q: "When is the best time to send a pre-meeting questionnaire?",
        a: "Include it right in the meeting confirmation email and send a brief reminder a day before the call if they have not replied yet.",
      },
      {
        q: "How should I use the answers during the meeting?",
        a: "Open by summarizing what they wrote in two or three sentences and asking if anything changed. That proves you read their notes and lets you skip straight to the main problem.",
      },
    ],
  },
  {
    id: "meeting-prep-template",
    title: "Meeting Prep Template (Free Copy and Download)",
    h1: "Meeting prep template",
    metaDescription:
      "Free meeting prep template: purpose, desired outcome, attendees, key points, questions, likely objections, materials and follow-up.",
    summary:
      "A meeting prep template is a one-page checklist you fill in before an important meeting: why it is happening, the outcome you want, who will be there and what they care about, the points you need to make, the questions you need answered and the objections you might hear. Filling it in takes a few minutes and gives you a clear plan going in. Copy the template below or download it as a text file.",
    body: `MEETING PREP

Meeting: [Name]
Date and time: [Date, time, time zone]
Location or link: [Room or video link]

PURPOSE
Why this meeting is happening: [One sentence]

OUTCOME I WANT
By the end of the meeting: [Decision, agreement or next step]
Fallback if that's not possible: [Smaller next step]

WHO WILL BE THERE
- [Name, role] - Cares about: [Priorities or concerns]
- [Name, role] - Cares about: [Priorities or concerns]

KEY POINTS TO MAKE
1. [Point] - Supporting fact or example: [ ]
2. [Point] - Supporting fact or example: [ ]
3. [Point] - Supporting fact or example: [ ]

QUESTIONS TO ASK
- [Question]
- [Question]

LIKELY QUESTIONS OR OBJECTIONS
- [Objection] - My answer: [ ]

MATERIALS
- [Slides, documents, links, demo]

AFTER THE MEETING
- Follow-up to send: [What, to whom, by when]
`,
    howTo: [
      "Write the outcome you want before anything else; the rest of the prep should support it.",
      "Look up each attendee's role and note what they are likely to care about.",
      "Limit yourself to three key points, each with a fact or example behind it.",
      "List the hardest questions you could be asked and draft a short answer to each.",
      "Decide on the follow-up before the meeting, then send it the same day.",
    ],
    ctaText:
      "Keep your meeting prep private in a local text file on your device — copy or download it with no account required.",
    hubBlurb: "Purpose, desired outcome, attendees, key points and objections on one page.",
    faqs: [
      {
        q: "How long does it take to fill out a meeting prep sheet?",
        a: "Ten to fifteen minutes is enough for most meetings. Writing down one desired outcome, three key points and two likely objections prevents rambling once the call starts.",
      },
      {
        q: "What is the difference between a meeting agenda and a meeting prep template?",
        a: "An agenda is shared with everyone to structure the meeting; a meeting prep template is your private brief for deciding what you want out of the conversation and how to handle pushback.",
      },
      {
        q: "Should I write a fallback outcome before the meeting?",
        a: "Yes. Knowing your fallback next step — such as agreeing on a smaller pilot or a clear decision date — keeps the meeting productive if you cannot get a full yes in the room.",
      },
    ],
  },
  {
    id: "interview-preparation-template",
    title: "Interview Preparation Template (Free Copy and Download)",
    h1: "Interview preparation template",
    metaDescription:
      "Free interview preparation template: research the role, match your experience to the requirements, prepare STAR stories and questions to ask.",
    summary:
      "An interview preparation template helps you organize what you know about the role and company, match your experience to each requirement in the job description, prepare short stories using the STAR method (situation, task, action, result) and list the questions you want to ask. Fill it in a few days before the interview and review it the morning of. Copy the template below or download it as a text file.",
    body: `INTERVIEW PREPARATION

Role: [Job title]
Company: [Company name]
Date and time: [Date, time, time zone]
Format: [Phone / Video / In person] - Location or link: [ ]
Interviewers: [Names and roles, if known]

THE COMPANY
- What they do and who their customers are:
- Recent news, products or announcements:
- Why I want to work there:

THE ROLE
- Why I want this role:
- Top requirements from the job description, and my matching experience:
  1. [Requirement] - [My example]
  2. [Requirement] - [My example]
  3. [Requirement] - [My example]

MY STORIES (STAR: Situation, Task, Action, Result)
Story 1: [Title]
- Situation:
- Task:
- Action:
- Result:
Story 2: [Title]
- Situation:
- Task:
- Action:
- Result:

COMMON QUESTIONS
- Tell me about yourself: [Short answer]
- Why are you interested in this role?
- What is a challenge you handled well?

QUESTIONS I WILL ASK
- What does success look like in this role in the first few months?
- What are the team's biggest priorities right now?
- What are the next steps in the process?

LOGISTICS
- What to bring or have open: [Resume, portfolio, notes]
- Tech check or travel time: [ ]

AFTER THE INTERVIEW
- Thank-you note sent to: [Names] - Date: [ ]
- Notes on how it went:
`,
    howTo: [
      "Read the job description and copy its top requirements into the template.",
      "Next to each requirement, write a specific example from your experience.",
      "Turn your best examples into two or three STAR stories and practice saying them out loud.",
      "Prepare three or more questions for the interviewer that show you researched the role.",
      "After the interview, send a short thank-you note and write down what you learned.",
    ],
    ctaText:
      "Keep your interview notes, STAR stories and questions private on your own device using the free Prep Pack builder — no account and no uploads.",
    hubBlurb: "Research, requirement-to-experience matching, STAR stories and questions to ask.",
    faqs: [
      {
        q: "How many STAR stories should I prepare before an interview?",
        a: "Prepare three to five strong stories that cover a difficult problem, a disagreement or stakeholder challenge, a mistake you fixed, and a result you are proud of. Most behavioral questions map to one of those.",
      },
      {
        q: "Can I bring my filled-in interview preparation template to the interview?",
        a: "Yes. Bring a clean one-page version of your questions and bullet-point prompts — interviewers expect thoughtful candidates to take notes, as long as you are not reading full paragraphs word for word.",
      },
      {
        q: "Is anything I copy or build here saved on a server?",
        a: "No. Everything you copy, download or prepare in B4WeMeet stays only on your device. There are no accounts and nothing is uploaded.",
      },
    ],
  },
  {
    id: "30-60-90-day-plan-template",
    title: "30-60-90 Day Plan Template (Free Copy and Download)",
    h1: "30-60-90 day plan template",
    metaDescription:
      "Free 30-60-90 day plan template for interviews and new roles: learning goals, early wins, ownership milestones and success metrics. Copy or download as a text file.",
    summary:
      "A 30-60-90 day plan outlines what you will learn in your first month, what you will start owning in your second month, and what measurable outcomes you aim to deliver by day 90. Use it in a final-round interview to show how you think about the role, or during onboarding to align with your new manager. Copy the template below or download it as a plain text file — everything stays private on your device.",
    body: `30-60-90 DAY PLAN

Role: [Job title]
Company / Team: [Company and team name]
Manager: [Name]
Prepared on: [Date]

OVERALL GOAL FOR THE FIRST 90 DAYS
By day 90, I want to: [One clear sentence tied to the team's main priority]

DAYS 1-30: LEARN AND LISTEN
Focus: Understand the business, the team, current workflows and where the biggest friction lives.
- People to meet: [Manager, peers, key cross-functional partners, customers]
- Systems, docs and history to review: [Tools, dashboards, recent postmortems or roadmaps]
- Questions to answer:
  1. What is working well right now that we should protect?
  2. What is the single biggest bottleneck for the team this quarter?
  3. How is success measured for this role?
- Early deliverable (by day 30): [e.g. Short audit, onboarding notes or prioritized list of quick wins reviewed with manager]

DAYS 31-60: CONTRIBUTE AND BUILD MOMENTUM
Focus: Take ownership of core responsibilities and ship one or two visible improvements.
- Core responsibilities I will own independently: [List 2-3 areas]
- Quick win to deliver: [Specific, low-risk improvement]
- Process or collaboration habit to establish: [e.g. Weekly status note, stakeholder sync]
- Midpoint check-in (day 60): Review priorities and adjust the plan with my manager.

DAYS 61-90: OWN AND DELIVER RESULTS
Focus: Operate autonomously, deliver a meaningful milestone and plan the next quarter.
- Primary milestone to ship or complete: [Specific deliverable or outcome]
- Metric or signal of success: [How we will know it worked]
- Longer-term initiative to propose for quarter two: [Next priority]
- Day-90 review: Compare actual outcomes against this plan and set next-quarter goals.

OPEN QUESTIONS FOR MY MANAGER
- Which part of this plan matters most right now?
- What is missing or out of order given what the team is facing this month?
`,
    howTo: [
      "Pull the top three priorities directly from the job description and your interview conversations.",
      "Keep Days 1-30 focused on listening, learning and building trust before proposing big changes.",
      "Pick one realistic quick win for Days 31-60 and one concrete deliverable for Days 61-90.",
      "End with two open questions so the plan feels collaborative rather than prescriptive.",
      "Keep the file private on your device until you are ready to share it in a final interview or onboarding check-in.",
    ],
    ctaText:
      "Pair your 30-60-90 day plan with your STAR stories and interview questions in the private Prep Pack builder — stored only in your browser, with no account and no uploads.",
    hubBlurb: "Learning goals, early wins, ownership milestones and success metrics for a new role.",
    faqs: [
      {
        q: "Should I bring a 30-60-90 day plan to an interview if they did not ask for one?",
        a: "Bring a one-page draft to a hiring-manager or final-round interview, especially for manager, sales, product or operations roles. Frame it as a starting hypothesis to discuss, not a rigid plan.",
      },
      {
        q: "How detailed should a 30-60-90 day plan be?",
        a: "Keep it to one page. Three to four concrete bullets per 30-day block are much easier to discuss than a dense multi-page document full of guesses about internal systems you have not seen yet.",
      },
      {
        q: "What is the biggest mistake people make in a 30-60-90 day plan?",
        a: "Promising sweeping changes in the first 30 days before listening to the team. Strong plans earn trust by learning first, shipping a small win second, and taking full ownership third.",
      },
      {
        q: "Does B4WeMeet store my 30-60-90 day plan?",
        a: "No. Copying or downloading this template happens entirely in your browser, and anything you draft in the Prep Pack builder stays only on your device.",
      },
    ],
  },
  {
    id: "salary-negotiation-script",
    title: "Salary Negotiation Script and Prep Template (Free Copy and Download)",
    h1: "Salary negotiation script and prep template",
    metaDescription:
      "Free salary negotiation script and prep sheet: target range, walk-away number, total compensation trade-offs and word-for-word scripts for calls and emails.",
    summary:
      "A salary negotiation prep sheet helps you decide your numbers before the offer call — your target, your realistic anchor and your walk-away floor — alongside non-salary levers like signing bonus, start date, equity or review timing. Having short, calm scripts ready keeps the conversation collaborative and anchored on the value of the role. Copy the template below or download it as a private text file on your device.",
    body: `SALARY NEGOTIATION PREP & SCRIPTS

Role: [Job title]
Company: [Company name]
Offer received on: [Date]
Response deadline: [Date]

1. THE CURRENT OFFER
- Base salary: [Amount]
- Bonus / variable pay: [Amount or %]
- Equity / stock: [Details and vesting]
- Signing bonus: [Amount]
- Benefits / PTO / remote or hybrid terms: [Details]

2. MY NUMBERS (PRIVATE — DO NOT SHARE FLOOR)
- Market range for this role and level: [Low - High]
- My target base salary: [Amount]
- My opening counter (anchor): [Amount]
- My walk-away floor: [Amount]

3. VALUE CASE (2-3 SPECIFIC REASONS)
- [Relevant experience or skill that reduces ramp time]
- [Specific result or scope I have already delivered]
- [Market data or competing scope]

4. TRADE-OFFS IF BASE SALARY IS FIXED
Rank what matters most if they cannot move on base:
1. [e.g. Signing bonus to bridge the first year]
2. [e.g. Written 6-month compensation review tied to clear milestones]
3. [e.g. Extra PTO, flexible schedule, remote stipend or equity adjustment]

5. SCRIPTS

WHEN YOU FIRST RECEIVE THE OFFER (BUY TIME)
"Thank you so much — I'm really excited about the team and the role. I'd like to review the full written details tonight and follow up by [day/time] with any questions. Does that work for you?"

COUNTERING ON A CALL OR BY EMAIL
"Thank you again for the offer and for walking me through the details. I'm excited about joining [Team/Company] and contributing to [key priority]. Based on the scope of the role and my experience with [specific strength], I was hoping to land closer to [target/anchor] for base salary. Is there flexibility to get closer to that number?"

IF THEY SAY BASE SALARY IS CAPPED
"I understand there are band limits on base salary. Could we look at a signing bonus of [amount] or a six-month performance and compensation review so we can bridge the gap?"

CLOSING ONCE AGREED
"Thank you for working through this with me. Once the updated offer letter comes through reflecting [agreed terms], I'm ready to sign and confirm my start date of [date]."
`,
    howTo: [
      "Always ask for the full offer in writing and take a day to review it before negotiating.",
      "Write down your target, your counter and your walk-away floor privately before the call.",
      "Tie your counter to the scope of the role and the specific problems you will solve, not personal expenses.",
      "Keep your tone warm, direct and collaborative — negotiate one package at a time rather than dripping out requests.",
      "Store your numbers and notes locally on your device so your compensation details stay completely private.",
    ],
    ctaText:
      "Draft your negotiation notes privately on your own device — B4WeMeet requires no account and never uploads your salary details.",
    hubBlurb: "Offer breakdown, private target numbers, trade-offs and word-for-word scripts.",
    faqs: [
      {
        q: "Should I negotiate salary by email or over the phone?",
        a: "Either works, and many candidates combine them: send a brief, clear email laying out your counter and reasoning so the recruiter can share it accurately with approvals, then hop on a quick call to finalize details.",
      },
      {
        q: "Will negotiating cause a company to rescind my offer?",
        a: "A polite, well-reasoned counter based on role scope and market range is normal and expected. Offers are rarely rescinded over a respectful ask; the worst common answer is simply that the number is firm.",
      },
      {
        q: "What can I negotiate if base salary is completely fixed?",
        a: "Ask about a signing bonus, an earlier compensation review at six months with written milestones, extra vacation days, equity, a professional development budget, remote flexibility or a later start date.",
      },
      {
        q: "Is my salary negotiation sheet kept private?",
        a: "Yes. Everything you copy or download stays locally on your device — there is no account, no cloud sync and no server storing your compensation numbers.",
      },
    ],
  },
  {
    id: "panel-interview-prep-template",
    title: "Panel Interview Prep Template (Free Copy and Download)",
    h1: "Panel interview prep template",
    metaDescription:
      "Free panel interview prep template: map each panelist, anticipate role-specific questions, match your STAR stories and prepare tailored questions for every seat.",
    summary:
      "A panel interview puts multiple stakeholders in the same room — each listening for something different. This template helps you map every panelist's role and priorities in advance, match your STAR stories to their perspective, and prepare one tailored question for each person so nobody feels ignored. Copy the template below or download it as a plain text file.",
    body: `PANEL INTERVIEW PREP

Role: [Job title]
Company: [Company name]
Date and time: [Date, time, time zone]
Format: [Video / In person] - Location or link: [ ]
Duration: [e.g. 60 minutes]

1. PANELIST MAP
Panelist 1: [Name] — [Title / Team]
- What they likely care about most: [e.g. Day-to-day execution, reliability]
- Likely question they will ask: [Question]
- Tailored question I can ask them: [Question]

Panelist 2: [Name] — [Title / Team]
- What they likely care about most: [e.g. Cross-team collaboration, communication]
- Likely question they will ask: [Question]
- Tailored question I can ask them: [Question]

Panelist 3: [Name] — [Title / Team]
- What they likely care about most: [e.g. Strategic impact, autonomy, growth]
- Likely question they will ask: [Question]
- Tailored question I can ask them: [Question]

2. MY OPENING (60-90 SECONDS FOR THE WHOLE ROOM)
- Present: [Current role and core focus]
- Past: [2 highlights that speak to different seats on the panel]
- Future: [Why this role and team right now]

3. STAR STORIES TO ROTATE (AVOID REPEATING ONE STORY)
- Story 1 (Execution / Delivery): [Title — S / T / A / R in one line]
- Story 2 (Collaboration / Conflict): [Title — S / T / A / R in one line]
- Story 3 (Problem-solving / Ambiguity): [Title — S / T / A / R in one line]
- Story 4 (Mistake / Learning): [Title — S / T / A / R in one line]

4. ROOM & VIDEO HABITS
- Note each person's name in seating or screen order as soon as the call starts.
- Address the person who asked the question first, then include the rest of the panel as you wrap up.
- Keep answers to 90-120 seconds so every panelist gets time to ask their questions.

5. POST-PANEL THANK-YOU NOTES
- [Panelist 1]: [Specific topic they raised]
- [Panelist 2]: [Specific topic they raised]
- [Panelist 3]: [Specific topic they raised]
`,
    howTo: [
      "Ask the recruiter for the names and titles of everyone on the panel as soon as the interview is scheduled.",
      "Write down what each panelist's function cares about most so you can frame your answers in terms they value.",
      "Prepare at least four distinct STAR stories so you do not repeat the same example to two different panelists.",
      "Draft one tailored question per panelist and jot down a quick seating or video-tile map at the start of the call.",
      "Send brief, distinct thank-you notes referencing one point from each panelist's part of the conversation.",
    ],
    ctaText:
      "Build your full panel prep pack — panelists, STAR stories and tailored questions — privately in your browser with the free Prep Pack builder.",
    hubBlurb: "Map every panelist's priorities, rotate STAR stories and tailor questions for each seat.",
    faqs: [
      {
        q: "How do I keep track of everyone's names in a panel interview?",
        a: "Before the interview, write the panelists' names and titles at the top of your notepad. When the session starts, sketch their seating order or video grid positions so you can address each person by name naturally.",
      },
      {
        q: "Who should I look at when answering a question in a panel interview?",
        a: "Start your answer by looking at the person who asked the question, glance naturally to the other panelists while explaining the middle of your story, and finish back with the person who asked.",
      },
      {
        q: "Should I send separate thank-you emails after a panel interview?",
        a: "If you have individual email addresses, send short, separate notes with one tailored line for each panelist. If you only have the recruiter's email, send one clear note asking them to pass your thanks along to the panel.",
      },
    ],
  },
  {
    id: "reference-check-prep-template",
    title: "Reference Check Prep Template (Free Copy and Download)",
    h1: "Reference check prep template",
    metaDescription:
      "Free reference check prep template: pick the right references, brief them with a short context email and confirm timing before the hiring team reaches out.",
    summary:
      "When a hiring team asks for references, you are usually close to an offer. This template helps you organize your reference list cleanly, choose people who can speak directly to the target role's priorities, and send each reference a short heads-up note with the exact projects and skills worth highlighting. Copy the template below or download it as a private text file.",
    body: `REFERENCE CHECK PREP

Target role: [Job title]
Company: [Company name]
Hiring contact who will reach out: [Name, title, email or phone]
Expected window for outreach: [Dates]

1. MY REFERENCE LIST (READY TO SHARE)
Reference 1 (Former Manager)
- Name and current title: [Name, Title, Company]
- Relationship and dates worked together: [e.g. Direct manager, 2023-2025]
- Email and phone: [Email] | [Phone]
- Best topics for them to speak to: [e.g. Ownership, reliability, delivery]
- Confirmed and briefed: [Yes / Pending]

Reference 2 (Peer or Cross-Functional Partner)
- Name and current title: [Name, Title, Company]
- Relationship and dates worked together: [e.g. Partner on Product/Ops, 2022-2024]
- Email and phone: [Email] | [Phone]
- Best topics for them to speak to: [e.g. Collaboration, communication under pressure]
- Confirmed and briefed: [Yes / Pending]

Reference 3 (Direct Report, Client or Second Manager)
- Name and current title: [Name, Title, Company]
- Relationship and dates worked together: [Relationship and dates]
- Email and phone: [Email] | [Phone]
- Best topics for them to speak to: [e.g. Coaching, stakeholder management]
- Confirmed and briefed: [Yes / Pending]

2. HEADS-UP EMAIL TO SEND EACH REFERENCE
Subject: Quick heads-up — reference check for [Role] at [Company]

Hi [Name],

Thanks again for being willing to serve as a reference for me. I'm in the final stages for a [Job Title] role at [Company], and [Hiring Contact's Name] plans to reach out [by email / by phone] sometime [this week / between dates].

In case it helps jog your memory, the role focuses heavily on [priority 1] and [priority 2]. The work we did together on [specific project or outcome] is especially relevant.

Please let me know if your preferred email or phone number has changed, or if this week is a bad time. Really appreciate your support — I'll keep you posted on how it turns out.

Best,
[Your Name]

3. FOLLOW-UP AFTER THE CHECK
- Send a quick thank-you note once the reference tells you they spoke with the company.
- Share the final outcome (offer accepted or search continuing) so they are never left wondering.
`,
    howTo: [
      "Always ask permission before sharing someone's contact details — never surprise a reference with a cold call.",
      "Choose a balanced mix (typically a former manager, a cross-functional peer, and a second manager or client) rather than three people with the exact same perspective.",
      "Send each reference a two-paragraph heads-up naming who will contact them, the role's focus areas and one project you worked on together.",
      "Verify each reference's current title, email and phone number before sending the list to the recruiter.",
      "Keep your reference contact sheet stored privately on your own device and follow up with a thank-you note once the process wraps.",
    ],
    ctaText:
      "Keep your reference list and briefing notes private on your device — copy or download this template with no account and no uploads.",
    hubBlurb: "Organize your reference list, brief each reference and confirm timing before outreach.",
    faqs: [
      {
        q: "How many references should I prepare for a job search?",
        a: "Prepare three strong references, plus one backup in case someone is traveling or hard to reach. Aim for at least one former direct manager alongside a peer or cross-functional partner.",
      },
      {
        q: "What if I am currently employed and cannot list my current manager?",
        a: "That is completely normal. Tell the recruiter you are conducting a confidential search and offer a former manager, a trusted former peer, or a client who knows your recent work well.",
      },
      {
        q: "What should I tell my references before the employer calls?",
        a: "Share the job title, company name, who will reach out and when, plus two or three bullets on the role's main priorities and a specific project you worked on together.",
      },
    ],
  },
];
