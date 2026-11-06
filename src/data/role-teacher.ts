import type { RoleDataset } from "./types";

export const teacher: RoleDataset = {
  slug: "teacher",
  roleName: "Teacher",
  pagePath: "/questions-to-ask-in-a-teacher-interview/",
  title: "Teacher Interview Questions: What You Will Be Asked and What to Ask",
  metaDescription: "Prepare for a teacher interview with realistic questions on classroom management, differentiation, assessment, and difficult parents — plus thoughtful questions to ask about class size, curriculum, mentoring, and planning time.",
  h1: "Teacher interview questions",
  intro: [
    "A teacher interview screens for how a classroom actually runs with you in charge: clear routines, calm responses to disruption, lessons that reach students at different levels, and steady communication with families. Principals are listening for specifics — what you do in the first week, how you handle the moment a lesson derails, and how you know whether students learned — not philosophy alone.",
    "Expect scenario questions alongside questions about your planning and assessment. Strong answers ground every claim in a concrete practice or a short example from student teaching, tutoring, or prior classrooms: what you set up, what you noticed, what you changed, and what happened for students. The questions you ask about mentoring, class size, and support tell a school whether you plan to stay and grow there.",
  ],
  questions: [
    {
      question: "Tell me about yourself and why you want to teach.",
      whyAsked: "Principals use this to hear your motivation in your own words and to see whether your background connects to this grade, subject, and school — rather than teaching in the abstract.",
      guidance: "Keep it focused: your preparation or experience, the age group or subject where you do your best work, and one specific reason this work holds your interest. End by connecting to this school or grade level. Use a brief student moment if it genuinely explains your motivation, and keep it under two minutes.",
      example: "I did my student teaching in fourth grade and stayed on as a long-term sub in the same building, so I have seen a full year arc with this age group. I like this stage because students are ready for real discussion, and I do my best work building that classroom talk.",
      pitfalls: "Reciting your entire work history, saying you chose teaching for summers off, or giving a sentimental answer with no classroom substance behind it.",
    },
    {
      question: "What is your classroom management philosophy, and how do you put it into practice?",
      whyAsked: "Management is the first filter in most teacher interviews. Schools want predictable, positive systems — not a teacher who relies on personality, volume, or referrals to the office.",
      guidance: "Describe structure first: a small number of clear expectations taught and practiced like content, consistent routines for entry, materials, and dismissal, and relationship-building that makes correction easier. Then explain your response ladder — proximity and redirection before private conversation before consequence — and how you stay consistent while staying calm.",
      example: "I teach three expectations and we practice the routines behind them in the first two weeks the same way we practice any skill — model, try it, reset if needed. Most correction after that is quiet and private because students already know what the routine should look like.",
      pitfalls: "Leading with punishments, saying you will be strict so students do not test you, or describing management as keeping students quiet rather than keeping them learning.",
    },
    {
      question: "A student is repeatedly disrupting your lesson. Walk me through what you do.",
      whyAsked: "This scenario tests your de-escalation in the moment and your follow-through afterward. Interviewers want to see instruction protected for the other students while the disrupting student is treated with dignity.",
      guidance: "Walk through escalating steps in order: nonverbal cue or proximity, a brief private redirection with a choice, a calm consequence tied to your classroom system, and a reset conversation after class. Mention checking for a pattern — time of day, task type, peer nearby — documenting as your school expects, and contacting family early with curiosity before it becomes a discipline referral.",
      pitfalls: "Describing sending the student out as your first move, raising your voice or debating in front of the class, or having no step after the consequence.",
    },
    {
      question: "How do you differentiate instruction for students at very different levels?",
      whyAsked: "Every classroom spans multiple levels. Principals screen for planned differentiation — scaffolds, grouping, and extension built into the lesson — rather than improvising help for struggling students while advanced students wait.",
      guidance: "Give a concrete lesson-level example: a common goal, then varied entry points such as sentence starters or graphic organizers, flexible groups based on a quick check, and an extension task that deepens rather than just adds more problems. Mention using exit tickets or formative checks to form the next day groups, so differentiation is driven by evidence.",
      example: "In a fractions lesson, everyone works toward the same standard, but I offer a number-line scaffold for one group, standard practice for most, and a problem that asks advanced students to justify why a common wrong answer is wrong. My exit ticket decides tomorrow groups.",
      pitfalls: "Saying you just give struggling students less work, group permanently by ability with no movement, or differentiate only by giving early finishers extra worksheets.",
    },
    {
      question: "Walk me through how you plan a lesson or a unit.",
      whyAsked: "Planning reveals whether you start from the standard and the assessment or from an activity you liked. Schools want backward design habits even if they do not use that term.",
      guidance: "Start with the standard and what mastery looks like, then the assessment that will prove it, then the sequence of lessons. Mention checking prior knowledge, building in formative checkpoints, and planning the scaffold and extension before you teach — not after you see who is lost. A brief real unit example makes this credible.",
      pitfalls: "Starting with a fun activity and working backward to justify it, planning with no assessment until the unit test, or describing planning as filling in a template the night before.",
    },
    {
      question: "How do you use assessment data to change your instruction?",
      whyAsked: "Schools are saturated with data; they need teachers who actually regroup, reteach, or move on based on what the data shows. Vague answers here are a red flag.",
      guidance: "Name a specific loop: the formative check you use most, how you sort results that same day, and a decision it drove — reteaching a concept a different way to a small group while others extended, for example. For summative data, mention looking for the most common error pattern rather than just the average score.",
      example: "After a quiz where most errors were the same sign mistake, I did not reteach the whole unit. I opened the next lesson with two worked examples contrasting the error, gave a three-question check, and only then moved on.",
      pitfalls: "Saying you review scores but not changing anything, using data only to assign grades, or tracking data in a system you never look back at.",
    },
    {
      question: "Tell me about a difficult conversation with a parent or guardian. How did you handle it?",
      whyAsked: "Family trust affects everything from homework to referrals. Principals screen for teachers who communicate early, listen before defending, and keep the student at the center.",
      guidance: "Choose an example where you initiated contact before the issue grew, or handled a complaint professionally. Describe listening fully, sharing specific observations rather than labels, agreeing on a concrete next step for school and home, and following up when promised. Note involving a counselor or administrator when the conversation needed support, without making that your first move for routine issues.",
      pitfalls: "Blaming the parent for the student behavior, sharing information about other students, or saying you avoid calling home because conferences are enough.",
    },
    {
      question: "A student is falling behind and not completing work. What do you do?",
      whyAsked: "This tests diagnosis over assumption. Effective teachers investigate cause — skill gap, missing prerequisite, organization, or something outside school — before choosing an intervention.",
      guidance: "Describe a sequence: check the pattern in your gradebook or work samples, talk privately with the student to find the barrier, break the work into checkable steps, and communicate the plan to family and support staff as appropriate. Mention tracking whether the intervention works over a set period and escalating to your school support team if it does not.",
      example: "First I would find out whether it is cannot or has not — if a student cannot start the first problem, that is a skill gap and I reteach the entry step. If they can do it with me and not alone, we build a checklist and a check-in routine instead.",
      pitfalls: "Jumping straight to zeros and detention, assuming laziness, or offering unlimited late acceptance with no plan to build independence.",
    },
    {
      question: "How do you build relationships with students, especially at the start of the year?",
      whyAsked: "Relationship is the foundation management and motivation rest on. Schools want deliberate practices, not just being friendly or being the teacher students like most.",
      guidance: "Name repeatable habits: learning names and interests quickly, greeting at the door, short interest inventories, noticing and naming effort specifically, and fairness students can see. Connect relationships to learning — students take academic risks and accept correction from teachers they trust — rather than treating it as separate from instruction.",
      pitfalls: "Confusing relationships with being a friend or lowering expectations, relying on sharing personal social media or outside contact, or having no system beyond the first-day icebreaker.",
    },
    {
      question: "Describe a lesson that did not work. What did you do next?",
      whyAsked: "Every teacher has failed lessons. Principals screen for reflection that identifies the actual cause and a changed next attempt — not blame placed on the students.",
      guidance: "Be honest and specific: what the goal was, the moment you knew it was not landing, and your best diagnosis of why — directions, pacing, missing prior knowledge, or task design. Then describe what you changed the next day or next time you taught it, and what improved. A small, real failure analyzed well beats a dramatic story.",
      example: "My directions were the problem — students spent ten minutes confused about the task, not the content. The next day I modeled the first step, put a worked example on the board, and checked for understanding before releasing them. Completion doubled.",
      pitfalls: "Blaming the class for being low or unmotivated, claiming a lesson failure was actually a success, or reflecting without changing anything concrete.",
    },
    {
      question: "How do you support students with IEPs and 504 plans in your classroom?",
      whyAsked: "Following individualized plans is a legal and ethical obligation, and inclusion fails without the general education teacher. Interviewers check both knowledge and attitude.",
      guidance: "Show you read the plans, implement accommodations consistently — extended time, preferential seating, chunked directions — and communicate with the case manager when something is not working. Frame accommodations as access, not advantage, and mention keeping plan details confidential. If you are early-career, describe how you handled this in student teaching.",
      pitfalls: "Treating accommodations as optional when busy, discussing a student plan with other families or students, or suggesting those students belong only in a separate setting.",
    },
    {
      question: "How do you communicate with families throughout the year, not just when there is a problem?",
      whyAsked: "Schools want proactive communication so the first contact is not a complaint or a failing grade. This also reveals your organization and your awareness of families different access to technology and time.",
      guidance: "Describe a sustainable rhythm: a positive contact early in the year, a regular update through the channel your school uses, and prompt outreach when you notice a change in a student. Mention keeping messages specific and translatable where needed, documenting significant contacts, and inviting two-way communication rather than only broadcasting.",
      example: "I try to make my first contact with every family a positive, specific note about something their child did well in the first few weeks. Later, if I need to raise a concern, we already have a working relationship to build on.",
      pitfalls: "Contacting families only about behavior or missing work, communicating only through students carrying notes home, or promising a response speed you cannot sustain.",
    },
    {
      question: "How do you use technology in the classroom?",
      whyAsked: "Schools are less interested in a list of apps than in judgment: technology used when it improves feedback, practice, or access — and managed so it does not become the lesson distraction.",
      guidance: "Give one or two purposeful examples: formative quizzing that gives same-day data, assistive tools like text-to-speech for access, or structured research with clear checkpoints. Mention your routines for devices — when they are away, how you monitor use — to show technology serves the lesson structure you already described.",
      pitfalls: "Naming many tools with no learning purpose, describing technology as a reward or babysitter for early finishers, or having no plan for distraction and misuse.",
    },
    {
      question: "How would you handle a disagreement with a colleague or your grade-level team?",
      whyAsked: "Teaching teams plan together, share students, and cover for each other. Principals screen for professionals who can disagree about practice without creating factions or involving families.",
      guidance: "Describe going directly to the colleague first, separating the practice from the person, and bringing student evidence to the conversation — shared assessment results are a neutral ground. If a team decision goes against your preference, show you implement it faithfully and revisit with data later. Mention involving administration only when a direct conversation has not resolved a real problem.",
      example: "If we disagreed about pacing, I would bring our common assessment results and propose we test the concern at the next checkpoint rather than argue it out in the abstract. The students data settles most of these questions.",
      pitfalls: "Saying you would go straight to the principal, comply publicly while undermining the plan in your classroom, or involving parents in an internal disagreement.",
    },
    {
      question: "How do you motivate a student who seems not to care about your class?",
      whyAsked: "This tests whether you look for a lever — competence, choice, relevance, relationship — instead of relying on grades as the only motivator or giving up on the student.",
      guidance: "Start with curiosity: a private conversation to learn what is going on and what the student does care about. Then describe tactics matched to the cause, like engineering an early success at the right level, offering meaningful choice in product or topic, and making progress visible to the student. Note patience and consistency over weeks, not a single pep talk.",
      pitfalls: "Relying only on threats of failure or calls home, assuming the student is lazy, or bribing with rewards unrelated to learning as your whole strategy.",
    },
    {
      question: "What do your first two weeks of school look like?",
      whyAsked: "Principals know September routines determine the year. This question checks whether you invest early time in procedures, relationships, and diagnostic information while still teaching content.",
      guidance: "Describe front-loading routines — entry, materials, voice levels, dismissal — taught and practiced explicitly, alongside getting-to-know-you activities that double as baseline assessment. Mention a low-stakes diagnostic in the first days so grouping and planning start from evidence, and early positive family contact. Show content starts too, just structured to teach how your classroom works.",
      pitfalls: "Spending two weeks only on rules with no learning, or diving into content with no routines and spending October paying for it.",
    },
    {
      question: "How do you keep up when the pacing guide moves faster than your students mastery?",
      whyAsked: "This tension is real in every school. Interviewers want judgment: knowing which concepts are foundational and cannot be skipped, and where you can compress or integrate review.",
      guidance: "Explain prioritizing power standards and prerequisites, using formative data to decide where to spend an extra day, and building spiral review into warm-ups so unfinished learning keeps resurfacing. Mention raising the pattern with your team or instructional coach rather than silently racing ahead or silently falling weeks behind.",
      example: "If the data shows a prerequisite is missing, I will spend the day on it and recover time by trimming a practice set later — moving on without the foundation costs more time in the next unit anyway.",
      pitfalls: "Saying you follow the pacing guide no matter what, or that you ignore it entirely, with no data behind either position.",
    },
    {
      question: "How do you handle a safety concern or a student disclosure that worries you?",
      whyAsked: "Teachers are mandated reporters and often the first adult a student trusts. Schools need absolute clarity that you know your duty and your school procedure.",
      guidance: "State it plainly: listen calmly, do not promise secrecy you cannot keep, document the student words factually, and report immediately through your school counselor, administrator, and the reporting process your state and district require. Mention staying within your role — reporting and supporting, not investigating — and following up on the student wellbeing appropriately.",
      pitfalls: "Saying you would keep a disclosure between you and the student, investigate the family yourself, or wait until the end of the week to mention a concern.",
    },
    {
      question: "Why do you want to work at this school, and what questions do you have about our students?",
      whyAsked: "Fit and retention matter, especially in hard-to-staff schools. Principals want evidence you chose this community deliberately and understand its students strengths and needs.",
      guidance: "Reference something real you learned about the school: its programs, grade configuration, community, or a stated initiative, and connect it to your experience. Asking a genuine question back about the students — languages spoken, feeder patterns, extracurricular life — shows you are already thinking like their teacher.",
      example: "I was drawn to the dual-language program and the fact that grade teams plan together daily. I have worked in bilingual settings in student teaching and I want to build my career in a school where that is central, not an add-on.",
      pitfalls: "Saying the commute is convenient as your main reason, knowing nothing about the school beyond its name, or describing the student population in deficit terms.",
    },
    {
      question: "Where do you want to grow as a teacher in the next two to three years?",
      whyAsked: "This screens for coachability and retention. Schools invest heavily in new teachers and want candidates who can name a growth area and welcome observation and feedback.",
      guidance: "Pick a real instructional growth area — questioning technique, small-group instruction, formative assessment — and describe how you pursue it: observation cycles, coaching, professional learning, trying a practice and measuring it. Connect it to what this school offers, like instructional coaches or professional learning communities, without flattering.",
      pitfalls: "Claiming you have no areas to improve, naming only ambitions to leave the classroom quickly, or describing growth as collecting certificates with no change to practice.",
    },
  ],
  questionsToAsk: [
    {
      question: "What is the typical class size for this grade or subject, and are there paraprofessionals or co-teachers in the classroom?",
      why: "Class size and adult support shape what teaching is actually possible. Asking early shows you are planning realistically and helps you compare offers on working conditions, not just salary.",
    },
    {
      question: "What curriculum and materials are provided, and how much flexibility do teachers have in adapting them?",
      why: "This reveals whether you will plan from a full curriculum, build from standards alone, or something between — and how the school balances consistency across classrooms with teacher judgment.",
    },
    {
      question: "What mentoring and induction support do new teachers here receive in the first year?",
      why: "A named mentor, reduced duties, and regular observation with feedback are strong signs a school retains its teachers. Vague answers tell you support will be informal at best.",
    },
    {
      question: "How much protected planning time do teachers get, and how often do grade or subject teams plan together?",
      why: "Planning time determines whether collaborative planning and data review actually happen. It also signals how the school protects teacher workload during the school day.",
    },
    {
      question: "What behavior and discipline support exists beyond the classroom — counselor, dean, restorative practices, administration?",
      why: "You need to know the system you are part of when classroom strategies are not enough. A clear, consistent schoolwide system makes your own management far more effective.",
    },
    {
      question: "How are teachers evaluated and supported through observation, and who would be my direct supervisor?",
      why: "Knowing the observation cycle, who observes you, and whether feedback is coaching-oriented removes uncertainty and shows you welcome the process rather than fear it.",
    },
    {
      question: "What professional development does the school prioritize this year, and are there opportunities to lead or specialize over time?",
      why: "Shows you are thinking about growth in this building. The answer also reveals the school actual instructional priorities beyond what is posted on its website.",
    },
  ],
  faqs: [
    {
      q: "How should I prepare for a teacher interview?",
      a: "Prepare stories and systems, not slogans. Have a clear classroom management system you can walk through step by step, one differentiated lesson you can describe in detail, an example of using assessment data to change a lesson, and a difficult parent or behavior situation you handled. Research the school — grade levels, programs, and community — and bring thoughtful questions about mentoring, planning time, and support.",
    },
    {
      q: "What if I am a new teacher with only student teaching experience?",
      a: "Student teaching, field placements, tutoring, and substitute teaching are valid evidence — interviewers expect new teachers to draw on them. What matters is specificity: describe the routine you actually ran, the lesson you planned, and what you would adjust now. Pair honesty about your experience level with a clear account of the mentoring and feedback you are looking for.",
    },
    {
      q: "Will I be asked to teach a demonstration lesson?",
      a: "Some schools include a demo lesson, a writing sample, or a portfolio review, and some do not. The interview invitation usually says so — if it does not, it is reasonable to ask the person scheduling whether any demonstration or materials are expected, so you can prepare a short, well-structured lesson with a clear objective and a check for understanding.",
    },
    {
      q: "Should I ask about salary in a teacher interview?",
      a: "Public school pay is usually set by a published salary schedule based on education and years of experience, so there is often little to negotiate at the building level. Use the principal interview for fit — students, support, curriculum, and mentoring — and confirm placement on the schedule, benefits, and contract details with the district HR office before signing.",
    },
    {
      q: "What should I bring to a teacher interview?",
      a: "Bring copies of your resume and certification or license information, and a concise portfolio if you have one — a sample lesson plan, a classroom management outline, and anonymized examples of student work or assessment you designed. Remove any student names or identifying details from anything you share. Follow any specific requests in the interview invitation first.",
    },
  ],
};
