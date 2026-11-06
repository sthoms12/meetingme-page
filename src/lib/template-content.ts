// First-draft copy for the /templates/ library. Plain, practical, answer-first.
// No statistics, quotes or studies, and no personal names.

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
      "Share your agenda, goal and the context people need on one B4WeMeet page, and link it in the invite.",
    hubBlurb: "Goal, timed topics, owners, decisions and action items for any team meeting.",
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
      "Give your team one page with how you run one-on-ones, what to bring and the topics you want to cover.",
    hubBlurb: "A repeatable manager and team member agenda: check-in, blockers, feedback and growth.",
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
      "Send new clients one page with who you are, how you work and what you need from them before kickoff.",
    hubBlurb: "Goals, scope, approvals, timeline, access and communication, answered before kickoff.",
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
      "Put your intro, your questions and what to expect on one B4WeMeet page that people open before the call.",
    hubBlurb: "Short questions to send before a first call, consultation or discovery meeting.",
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
      "Send attendees a page with your background and the points you'd like to cover, so everyone arrives prepared.",
    hubBlurb: "Purpose, desired outcome, attendees, key points and objections on one page.",
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
      "Share a one-page intro with your background, links and focus areas with interviewers before you meet.",
    hubBlurb: "Research, requirement-to-experience matching, STAR stories and questions to ask.",
  },
];
