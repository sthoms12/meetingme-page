import type { RoleDataset } from "./types";

export const teacherQuestions: RoleDataset = {
  slug: "teacher",
  roleName: "Teacher",
  pagePath: "/teacher-interview-questions/",
  title: "Teacher Interview Questions and Answers",
  metaDescription: "Teacher interview questions with answer guidance and examples: checking for understanding, parent emails, group work, feedback, grading, and classroom setup.",
  h1: "Teacher interview questions — and how to answer them",
  companion: {
    href: "/questions-to-ask-in-a-teacher-interview/",
    heading: "Deciding what to ask them?",
    text: "The companion page covers the questions to ask about class size, curriculum flexibility, mentoring, and planning time — and how to judge the answers you get, so you can tell whether a school will actually support you in your first year.",
  },
  intro: [
    "This page is the candidate side of the interview: the questions a hiring panel asks you, and how to answer them well. It is distinct from researching what to ask a school — here the focus is on answers that convince a panel you can run a classroom on a real Tuesday in October, not just describe an ideal one in June.",
    "Expect a panel — usually the principal, a department chair or grade-level lead, and a classroom teacher — and be ready for a demonstration lesson as a possible next step if this round goes well. Ground every answer in classroom specifics: the routine you actually use, the check you actually run, and what you changed when something did not work.",
  ],
  questions: [
    {
      question: "How do you check for understanding during a lesson — before any test or exit ticket?",
      whyAsked: "Panels want to know you do not teach a full lesson on assumption and discover the confusion at homework stage. Mid-lesson checks are where good teachers catch a misconception while there is still time to fix it.",
      guidance: "Name two or three in-the-moment techniques and what you do with the results: whiteboards that make every student answer at once, a hinge question halfway through with distractors built from common errors, cold-calling after pair talk. Give your decision rule — if a third of the class misses the hinge question, you reteach it differently; if it is three students, you pull a small group while the rest extend.",
      example: "Halfway through a lesson on equivalent fractions I use one question where each wrong answer reveals a specific error. If most students pick the distractor that adds numerators and denominators, I know exactly what to reteach in the next five minutes.",
      pitfalls: "Asking “does everyone understand?” and taking silence as yes, checking only volunteers, or collecting formative checks you never act on during the lesson.",
    },
    {
      question: "A parent emails you, upset about a grade their child received. How do you respond?",
      whyAsked: "Tone in writing, fairness under pressure, and whether you loop in support before a small grade question becomes a formal complaint are all on test. Principals read this as a preview of the emails that will land in their inbox.",
      guidance: "Slow the exchange down: acknowledge the concern without defensiveness, avoid litigating the grade in a long email thread, and invite a short phone call or meeting. Before replying, re-check the work against your rubric so you can explain what earned the grade and what would improve it — and if your grading was wrong, own it and correct it. Mention involving a counselor or administrator if the tone escalates.",
      example: "I would reply the same day, thank them for raising it, and say I had re-checked the project against the rubric shared in advance. I would offer two times to talk it through, because the feedback lands better in conversation than in a chain of emails.",
      pitfalls: "Defending the grade line by line over email, changing a grade simply to end the complaint, or replying in frustration without re-checking the work first.",
    },
    {
      question: "How do you structure group work so that every student contributes and grading stays fair?",
      whyAsked: "Group work is where passengers hide and resentment builds. Panels screen for teachers who design individual accountability into the task itself instead of hoping groups will self-organize fairly.",
      guidance: "Start with task design: a product that genuinely needs multiple hands, defined roles that rotate, and an individual component each student owns. Build in checkpoints — a mid-task progress check and an individual exit response after group time. On grading, explain a defensible split: part group product, part individual evidence, so a student who did the work is not dragged down and a student who coasted is not carried.",
      example: "In a research project each student owns one section that only they present, and I collect a two-minute individual write-up at the end of each session. The group grade covers the shared product; the individual grade covers their section and notes.",
      pitfalls: "Assigning one group grade with no individual evidence, letting students always choose their own groups, or solving free-riding only afterward with a complaint conversation.",
    },
    {
      question: "What role does homework play in your classroom, and how do you handle chronically missing homework?",
      whyAsked: "Homework policy reveals your beliefs about practice, equity, and family circumstances, and missing-work patterns are a common point of friction with families and administrators.",
      guidance: "State a clear purpose first: homework as short practice of something already taught, not new learning that depends on help at home, with an expected time and a plan for getting stuck. For chronic missing work, diagnose before you punish — understanding, organization, or circumstances at home — involve family early and supportively, and use school systems like supported study time while still building the student independence.",
      example: "If a student misses three assignments in two weeks, I do not wait for the report card. I ask privately what is getting in the way, check the work is at the right level, and set a short check-in routine while I loop in home with a plan, not just a tally of zeros.",
      pitfalls: "Assigning homework mainly as a compliance test, defending zeros as the only honest response, or accepting missing work indefinitely with no diagnosis or family contact.",
    },
    {
      question: "How do you prepare students for standardized assessments without teaching to the test?",
      whyAsked: "Every school feels score pressure. Panels want a teacher who takes results seriously without narrowing the curriculum to test formats for months, which usually backfires on both learning and scores.",
      guidance: "Separate the two jobs: teach the underlying standards well all year, which is most of preparation, and treat test literacy as a small, explicit add-on — brief familiarity with formats and timing, strategies for multi-step problems, and low-stakes practice under similar conditions. Mention using released items diagnostically to find which standards are shaky, then reteaching the content rather than drilling the item type.",
      pitfalls: "Describing months of test-prep packets, dismissing the assessments as unimportant when results reflect on your school, or promising score gains you cannot control.",
    },
    {
      question: "How do you give feedback on student work that students actually act on?",
      whyAsked: "Feedback that is ignored is marking, not teaching. This question screens for whether your comments are specific, limited, and built into class time rather than written for parents or administrators.",
      guidance: "Describe feedback designed to be used: one or two prioritized points instead of a page of corrections, phrased as a next action the student can take, and — crucially — protected class time to act on it through revision. Mention formats that scale, like whole-class feedback on common errors. Close the loop: you look for the change in the next piece of work and name it when you see it.",
      example: "On a writing draft I mark one strength and one focus — say, evidence after a claim — rather than fixing every error. The next lesson starts with ten minutes revising just that focus, and I check those revisions first next time.",
      pitfalls: "Treating feedback as mainly grades and percentages, writing extensive comments students never get time to use, or correcting every surface error so the main point is buried.",
    },
    {
      question: "How do you handle a student who is being bullied or systematically left out by classmates?",
      whyAsked: "Panels are checking vigilance, seriousness, and correct process. Social exclusion is easy to miss and easy to minimize, and schools need teachers who act on patterns, not only on incidents they happen to witness.",
      guidance: "Take the report or your observation seriously and document specifics — dates, places, patterns — rather than treating it as a friendship squabble. Increase supervision where it happens, separate students as needed, and follow your school bullying protocol by involving the counselor and administration promptly rather than handling it alone. Describe follow-up that continues afterward: checking in with the targeted student and monitoring groupings and unstructured time. Be clear you would not run a forced mediation that treats both students as equals in the harm.",
      pitfalls: "Calling it drama or telling the student to ignore it, promising to keep it entirely between you and the student, or acting once and never checking whether it stopped.",
    },
    {
      question: "How do you set up your physical classroom — layout, displays, materials — and why?",
      whyAsked: "Room setup is management and instruction made visible. Thoughtful answers show you think about traffic flow, independence, and what walls teach, rather than decorating for appearance.",
      guidance: "Walk through decisions with the reasoning behind each: seating arranged for both collaboration and a clear shift to whole-class attention, materials stored where students can get and return them without a bottleneck, and displays that are working tools — anchor charts you actually reference, exemplars, current learning goals — rather than permanent decoration. Mention access: clear pathways and seating that accounts for vision, hearing, and mobility needs.",
      example: "I keep supplies in labeled bins on open shelves so students can start independent work without waiting on me, and most wall space is anchor charts we built together. If a chart has not been pointed at in two weeks, it comes down.",
      pitfalls: "Describing the room mainly as cute or themed, offering rows facing forward as your only configuration with no rationale, or having no materials system so transitions eat instructional time.",
    },
    {
      question: "How do you work with counselors, specialists, and support staff when a student is struggling?",
      whyAsked: "Struggling students rarely improve on a classroom teacher alone. Panels screen for teachers who refer early with good information, share their classroom, and follow through on plans a team makes.",
      guidance: "Describe bringing data, not just concern: work samples, the pattern you have noticed, and what you have already tried and for how long. Attend support meetings as an active member, implement agreed strategies consistently in your room, and report back on whether they are working. Cover everyday collaboration too — co-planning with specialists and aligning language with the counselor supporting the same student, so the student hears one coherent plan, with confidentiality kept throughout.",
      example: "When I bring a student to our support team I bring three weeks of short check data and the two strategies I have already tried. The meeting can then start at what to try next, not at whether there is really a problem.",
      pitfalls: "Waiting until a student is failing in every area before referring, treating specialists as people who take the problem away, or discussing a student needs with staff not involved in their support.",
    },
    {
      question: "Tell me about a time your plans fell apart mid-lesson — a fire drill, a technology failure, an assembly. What did you do?",
      whyAsked: "Disruption is guaranteed; rigidity is the risk. Panels listen for calm triage — protecting the learning goal and your composure — and for whether you can recover the lesson rather than abandon the period.",
      guidance: "Choose a real, modest example and narrate your decisions in order: the pause where you settled the class, what you cut or converted, and how routines carried students through. Show goal discipline — you kept the one essential idea and dropped or moved the practice set, rather than cramming everything into the remaining minutes. Mention the backup habits behind it, like having a no-technology version of the key task ready.",
      example: "When the projector died ten minutes into a lesson built around a simulation, I switched to the same data set printed as a table — I keep one paper copy for exactly this — and students worked the analysis in pairs. We lost the visuals, not the learning goal.",
      pitfalls: "Describing panic, blaming technology staff, filling the remaining time with unrelated busywork, or claiming disruptions never really affect your teaching.",
    },
    {
      question: "How do you keep your grading turnaround manageable without lowering feedback quality?",
      whyAsked: "Slow grading makes feedback useless and burns teachers out by November. This is a sustainability question disguised as an organization question, and experienced panels know it.",
      guidance: "Explain a system, not heroic effort: stagger major deadlines across classes where you can, grade in the order students will use the feedback, and use lighter-touch checks — spot-checking, short codes, whole-class feedback — for practice work while reserving detailed comments for pieces that warrant them. Mention a realistic turnaround you communicate to students and protected grading blocks instead of relying on weekends, and name how you protect the feedback students revise from.",
      pitfalls: "Promising to grade everything in depth overnight, describing a permanent pile of ungraded work as normal, or cutting feedback to nothing and calling it efficiency.",
    },
    {
      question: "A student publicly challenges something you taught and says it is wrong. How do you handle it?",
      whyAsked: "This moment tests intellectual honesty, authority, and curiosity at once. Panels want a teacher who can be corrected without losing the room — and who checks the facts rather than defending an error to save face.",
      guidance: "Describe a calm, public routine: thank the student for raising it, state how you will check it, and actually check it — in the moment if it is quick, or as the explicit first item next lesson if it needs a source. If the student is right, say so plainly and credit them. If you are right, show the evidence rather than pulling rank. Distinguish a genuine factual challenge, which gets honored, from disruption, which gets your normal redirection.",
      example: "A student once caught a date I had wrong on a slide. I checked it with them, fixed the slide in front of the class, and thanked them by name. After that, students flagged errors more — which made my materials better all year.",
      pitfalls: "Defending a mistake to protect your authority, mocking or shutting down the challenge, or turning every challenge into a long debate that derails the lesson.",
    },
    {
      question: "How do you build a classroom where students volunteer answers even when they are not sure they are right?",
      whyAsked: "Participation from only the confident few gives you false data and leaves quiet students invisible. Panels screen for deliberate structures that lower the social cost of a wrong answer.",
      guidance: "Name the mechanisms: think-pair-share or write-first routines so every answer is rehearsed before it is public, cold-calling framed as sampling thinking rather than catching students out, wait time you actually hold, and mining wrong answers for the useful part before correcting. Explain how you track who has spoken over a week so participation does not depend on volunteers, and how private channels like whiteboards and exit notes count as participation too.",
      pitfalls: "Relying on hands-up from the same volunteers, praising only correct answers, rescuing students instantly at the first pause, or embarrassing a wrong answer even gently.",
    },
    {
      question: "How do you partner with families who need interpretation or translation to communicate with the school?",
      whyAsked: "Access to communication is an equity issue and, for key meetings, a compliance issue. Panels check that you use the school systems for interpretation rather than improvising through students or relatives.",
      guidance: "Start with the systems: your district interpreter service or phone line for meetings and important calls, translated versions of key documents, and booking interpretation in advance for conferences. State clearly that you would not use the student or a sibling to interpret school business — it distorts both the message and the family dynamic. Add the practices around it: shorter, jargon-free messages that translate cleanly, checking which language and format the family prefers, and working with your family liaison or English-learner staff.",
      example: "For conferences I book the interpreter when I book the appointment, not the week of, and I send the report summary ahead in the family language so the meeting itself can be a conversation rather than a first reading.",
      pitfalls: "Using the student as interpreter for a concern about that same student, relying on unreviewed machine translation for sensitive messages, or communicating less with these families because arranging access takes effort.",
    },
    {
      question: "What do you do in the last five minutes of a lesson, and why does it matter?",
      whyAsked: "Endings reveal intentionality. A rushed, bell-driven finish loses consolidation and makes tomorrow start colder; a deliberate close tells the panel you design the whole lesson arc, not just the opening.",
      guidance: "Describe a consistent close with a learning purpose: a brief synthesis where students, not you, state what was learned, a quick check that doubles as tomorrow grouping data, and a preview connecting the next lesson. Add the practical half: cleanup routines on a timer with assigned jobs, so the close is calm rather than a scramble, and next steps stated before the final minutes — never shouted as students pack. Protect the time by cutting earlier content first.",
      pitfalls: "Teaching new content up to the bell and assigning homework on the way out, using the close only for announcements and cleanup, or treating the exit check as optional whenever the lesson runs long.",
    },
  ],
  questionsToAsk: [
    {
      question: "How are parent-teacher conferences and report cards structured here, and what support is available when a conference is likely to be difficult?",
      why: "Conference schedules, translation booking, and whether a counselor or administrator joins hard conversations tell you how much of family communication rests on you alone. It also shows you take the partnership, and its difficult moments, seriously.",
    },
    {
      question: "Which platforms do teachers use day to day — gradebook, learning management system, parent communication app — and is there training on them?",
      why: "You will live in these systems daily, and schools vary enormously in how many there are and how well they are supported. Asking now prevents a first month spent fighting logins instead of learning students.",
    },
    {
      question: "What duty assignments and extracurricular expectations come with this role — bus duty, lunch supervision, clubs, coaching?",
      why: "Duties shape your real schedule and energy, and expectations for sponsoring activities are often unwritten for new hires. A clear answer lets you plan honestly and signals you are willing to be part of school life with your eyes open.",
    },
    {
      question: "How does the substitute and coverage system work when a teacher is out, and how often do teachers cover for each other during planning time?",
      why: "Coverage is where planning time quietly disappears in many schools. Knowing whether there is a real substitute pool or a routine expectation to surrender your prep period tells you a great deal about workload in practice.",
    },
    {
      question: "What classroom budget or supply process exists — what is provided, what do teachers request, and what do teachers typically buy themselves?",
      why: "It is a practical question every teacher wishes they had asked. The answer reveals how the school resources classrooms and sets expectations about materials, copying, and basic supplies before you start spending your own money by default.",
    },
  ],
  faqs: [
    {
      q: "Will there be a demonstration lesson, and how should I prepare for one?",
      a: "Many schools add a demo lesson after a successful panel interview, either with real students or with panel members playing the class. Prepare a short, complete arc: a stated objective, a brief modeled example, active practice with a mid-lesson check for understanding, and a clean close. Bring materials in duplicate, have a no-technology fallback, and teach the students in front of you rather than performing your full unit plan.",
    },
    {
      q: "Who is usually on a teacher interview panel?",
      a: "Most panels include the principal or an assistant principal, a department chair or grade-level team lead, and at least one classroom teacher from the team you would join. Larger districts sometimes add an HR representative or an instructional coach. Each listener wants something slightly different — fit and judgment from administrators, day-to-day classroom craft from teachers — so address answers to the whole panel, not only the principal.",
    },
    {
      q: "How many questions will I be asked, and how long should my answers run?",
      a: "Expect roughly eight to twelve main questions in a 30 to 45 minute interview, often including two or three scenarios. Most answers should run one to two minutes: long enough for a concrete example and the reasoning behind it, short enough to stay a conversation. Scenario answers can run slightly longer if you walk through your steps in order.",
    },
    {
      q: "What should I bring to a teacher interview?",
      a: "Bring copies of your resume and license or certification information, and a slim portfolio if you have one — a sample lesson plan with its assessment, a brief classroom management outline, and one or two anonymized examples of student work or feedback you gave. Slim beats comprehensive: a panel may glance at one strong artifact, but no one reads a binder during an interview. Remove all student names and identifying details.",
    },
    {
      q: "When do schools interview and make offers?",
      a: "The main hiring season runs from early spring through early summer, as budgets and enrollments firm up, with a second wave in late summer when final numbers land. Some vacancies open mid-year and move fast. Districts often make offers within one to two weeks of a final interview in peak season, though board approval can add time — asking the person who schedules your interview about their timeline is always appropriate.",
    },
  ],
};
