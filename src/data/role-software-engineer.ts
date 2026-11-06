import type { RoleDataset } from "./types";

export const softwareEngineer: RoleDataset = {
  slug: "software-engineer",
  roleName: "Software Engineer",
  pagePath: "/software-engineer-interview-questions-to-ask/",
  title: "Software Engineer Interview Questions to Ask — and How to Answer Theirs",
  metaDescription: "Prepare for a software engineer interview: the behavioral and technical-discussion questions hiring teams ask, how to answer them well, and the questions to ask about code review, on-call, tech decisions, and growth.",
  h1: "Software engineer interview questions",
  intro: [
    "Software engineer interviews screen for how you think and work with other people, not just whether you can code alone. Beyond any coding exercise, hiring managers and teammates probe how you debug, how you make tradeoffs under a deadline, how you respond to code review, and whether you can explain a technical decision in plain language — because that daily judgment is what the job actually consists of.",
    "The other half of the interview is yours. The questions you ask about code review, on-call, deployment, and how technical decisions get made reveal whether this team will help you grow or burn you out, and asking sharp ones signals senior thinking at any level. This page covers both sides: the behavioral and discussion questions you are likely to face, and a strong set to bring with you.",
  ],
  questions: [
    {
      question: "Tell me about a project you are proud of. What was your role and what made it hard?",
      whyAsked: "This is the anchor question for most engineering interviews. It reveals the scale you have worked at, whether you can explain technical work clearly, and what you consider hard — a design problem, a legacy constraint, or coordinating people.",
      guidance: "Pick a project where your personal contribution is clear and the difficulty was real. Structure it as context, the specific problem, the options you weighed, what you built, and the measurable or observable result. Keep the team credit honest — interviewers trust candidates who can say exactly which parts were theirs.",
      example: "I led the migration of our billing webhooks from polling to event-driven delivery. The hard part was not the new code — it was guaranteeing no duplicate charges during the cutover, so I built idempotency checks and a shadow mode that compared both systems for two weeks before we switched.",
      pitfalls: "Describing a team project where your role stays vague, spending all your time on business background and none on technical decisions, or choosing a project with no difficulty to discuss.",
    },
    {
      question: "Tell me about the hardest bug you have debugged. How did you find it?",
      whyAsked: "Debugging is a large share of real engineering work. Interviewers listen for a method — reproduce, narrow, hypothesize, test — rather than luck or random code changes.",
      guidance: "Walk through your process in order: how you reproduced it or gathered evidence when you could not, what you ruled out and how, the tool or log that broke it open, and the fix plus any guard you added so it would not recur silently. Intermittent, production, or cross-system bugs make the best stories.",
      example: "The failure only happened under production load, so I could not reproduce it locally. I added targeted logging around the suspected race, confirmed two workers were updating the same record, and fixed it with an atomic update plus a test that simulated the concurrent case.",
      pitfalls: "Describing a bug you fixed by trying random changes until it stopped, blaming another team or a library with no evidence, or having no answer for how you would prevent a repeat.",
    },
    {
      question: "How would you design a system like [a URL shortener, a feed, a booking system]?",
      whyAsked: "System design discussions test whether you can clarify requirements, reason about scale and tradeoffs, and evolve a design as constraints change — skills that matter far more day to day than memorized architectures.",
      guidance: "Start by asking clarifying questions: scale, read and write balance, latency and consistency needs. Then outline the simplest design that works, name its bottlenecks, and improve it piece by piece, explaining each tradeoff as you go. Talk through data storage choices, caching, and failure cases rather than drawing boxes in silence.",
      pitfalls: "Jumping to a complex distributed design before establishing requirements, never discussing tradeoffs or failure modes, or going silent while you think instead of reasoning out loud.",
    },
    {
      question: "Tell me about a time you disagreed with a technical decision. What happened?",
      whyAsked: "Teams make better decisions when engineers can argue a position with evidence and then commit. This screens for both technical conviction and professional maturity.",
      guidance: "Choose a real disagreement about approach, library, or architecture. Explain your position and the evidence behind it, how the decision was actually made, and — critically — that you committed fully once it was decided, or what you learned when your approach was not chosen. If you were wrong, say so; that answer builds trust.",
      example: "I argued for building a small internal tool instead of buying one. My manager showed me the maintenance cost from a previous internal tool, we bought instead, and she was right — I now include ongoing ownership cost in my build-versus-buy estimates.",
      pitfalls: "Describing a disagreement you won by going around your manager, holding a grudge in the telling, or saying you have never disagreed with anyone.",
    },
    {
      question: "How do you approach code review — both giving and receiving feedback?",
      whyAsked: "Code review is where team quality and culture meet. Interviewers want reviewers who catch real issues without nitpicking style, and authors who treat feedback as information rather than criticism.",
      guidance: "For giving: describe focusing on correctness, design, and tests first, using automated tools for formatting, asking questions instead of issuing commands, and approving with minor comments rather than blocking on preferences. For receiving: describe assuming good intent, asking for clarification when a comment is unclear, and pushing back with reasoning when you disagree — in the open, not by ignoring the comment.",
      pitfalls: "Saying you look mainly for style consistency, treating review as a gate to win, or admitting you take critical feedback personally.",
    },
    {
      question: "Describe a time a project was behind schedule. How did you handle it?",
      whyAsked: "Estimates slip everywhere. Managers screen for engineers who surface risk early, propose scope options, and communicate tradeoffs — instead of quietly hoping or working unsustainable hours until the deadline breaks.",
      guidance: "Explain when and how you flagged the risk, what options you brought — cut scope, phase the launch, add help, extend the date — and who decided. Be specific about what was underestimated and what you changed in your estimating afterward. Owning the miss plainly reads as senior.",
      example: "Halfway through, the third-party API turned out to rate-limit far below what we needed. I raised it that week with two options: launch without the bulk-import feature or delay two weeks. Product chose the phased launch and we shipped the core on time.",
      pitfalls: "Blaming product, design, or another team for the whole delay, describing heroic all-nighters as your standard solution, or claiming your projects are never late.",
    },
    {
      question: "What is your approach to testing your code?",
      whyAsked: "Testing philosophy predicts production quality more reliably than any single skill. Interviewers listen for risk-based judgment — heavy testing where failure is costly, lighter where it is not — rather than dogma in either direction.",
      guidance: "Describe the layers you actually use: unit tests for logic, integration tests at service boundaries, and a small number of end-to-end tests for critical paths. Mention writing a failing test when fixing a bug, keeping tests fast enough to run constantly, and being honest about code you would test less because the risk is low.",
      example: "For a payment flow I want integration tests around every failure path. For an internal admin page, I will cover the main actions and rely more on type checks and a quick manual pass. The effort follows the cost of being wrong.",
      pitfalls: "Claiming 100 percent coverage as a goal in itself, saying you do not write tests because QA handles it, or describing tests so slow and brittle that nobody runs them.",
    },
    {
      question: "Tell me about a time you had to work with ambiguous or changing requirements.",
      whyAsked: "Requirements are rarely complete. This screens for engineers who ask clarifying questions, prototype to learn, and keep stakeholders aligned — rather than building in silence and delivering the wrong thing precisely.",
      guidance: "Give an example where you identified the key unknowns, asked the questions that mattered most, and proposed a small first step — a prototype, a spike, or a phased delivery — to reduce risk. Mention how you documented decisions so the team shared the same understanding as requirements evolved.",
      pitfalls: "Complaining about product managers as the point of the story, saying you just build whatever is in the ticket without question, or treating changing requirements as someone else failure rather than a normal condition.",
    },
    {
      question: "How do you decide between shipping quickly and building it properly?",
      whyAsked: "Technical debt judgment separates engineers who can be trusted with autonomy. There is no single right answer — interviewers want to hear the factors you weigh and how you make debt visible.",
      guidance: "Talk about reversibility, blast radius, and how long the code will live. A shortcut behind a feature flag for an experiment is different from a shortcut in billing. Mention naming the debt explicitly — in the ticket, the pull request, or a follow-up issue — and proposing when to repay it, so the tradeoff is a team decision rather than a hidden one.",
      example: "I ask: if this works, will we build on it for a year? If yes, I invest in the design now. If it is a two-week experiment, I ship the simple version, log what I skipped, and create the cleanup ticket at the same time.",
      pitfalls: "Answering that quality must never be compromised, or the opposite — that speed always wins — with no sense of context or consequence.",
    },
    {
      question: "Tell me about a production incident you were involved in. What was your role?",
      whyAsked: "Incidents reveal calm, communication, and systems thinking under real pressure. Interviewers also check whether you blame people or examine the system that allowed the failure.",
      guidance: "Describe the sequence: how you detected or were alerted, how you communicated status, whether you mitigated first (rollback, flag off, scale up) before chasing the root cause, and what the post-incident review changed. Emphasize blameless learning — a new alert, a safer deploy step, a runbook entry.",
      example: "I was first responder when error rates spiked after a deploy. I rolled back within minutes to stop the impact, posted status updates every 20 minutes, and only then dug into the cause — a config value that differed in production. We added a deploy-time config check afterward.",
      pitfalls: "Focusing on who caused it, describing diagnosing for hours while users were affected before mitigating, or an incident with no follow-up changes at all.",
    },
    {
      question: "How do you investigate and fix a performance problem?",
      whyAsked: "Performance work tests measurement discipline. Strong engineers profile before optimizing; weak ones guess at bottlenecks and add caching everywhere.",
      guidance: "Start with measuring: reproduce the slowness, check monitoring or profiling to find where time actually goes, and form a hypothesis. Then describe a typical find — an N-plus-one query, a missing index, an oversized payload — the fix, and how you verified the improvement with the same measurement. Mention watching for regressions afterward.",
      example: "The endpoint was slow only on large accounts. Profiling showed hundreds of individual queries loading related records, so I switched to eager loading and added an index. Response time dropped from several seconds to under half a second on the largest account we tested.",
      pitfalls: "Optimizing before measuring, adding a cache as the answer to every performance question, or fixing a symptom without verifying against real data volumes.",
    },
    {
      question: "How do you approach working in a legacy codebase or refactoring old code?",
      whyAsked: "Most engineering is brownfield. Interviewers want respect for code that works, incremental improvement, and tests around changes — not a rewrite impulse or contempt for previous developers.",
      guidance: "Describe reading and understanding before changing, adding characterization tests around the area you must touch, and refactoring in small steps tied to a feature or bug rather than a separate big-bang cleanup. Mention leaving the code cleaner than you found it in the small area you worked, and documenting surprising behavior instead of silently changing it.",
      pitfalls: "Proposing a full rewrite as your default, criticizing the original authors without knowing their constraints, or refactoring widely without test coverage.",
    },
    {
      question: "How do you learn a new technology or framework quickly?",
      whyAsked: "Stacks change constantly. This screens for a repeatable learning method and for honesty about the gap between a tutorial and production competence.",
      guidance: "Describe your actual method: official docs and a small build first, reading existing code in the team codebase, then a real ticket with review from someone experienced. Mention how you evaluate whether a new tool is worth adopting at all — problem fit, community and maintenance, hiring and operational cost — not just novelty.",
      example: "When I had to pick up a new framework for a project, I built a throwaway version of one real feature first. That exposed the questions that mattered, and my first production pull request was much smaller and better reviewed because of it.",
      pitfalls: "Claiming you can learn anything in a weekend with no method, relying only on video courses, or chasing every new tool regardless of team needs.",
    },
    {
      question: "Tell me about a mistake you made in your work. What did you learn?",
      whyAsked: "Self-awareness and accountability are strong predictors of growth. Interviewers are far more interested in what changed in your process afterward than in the size of the mistake.",
      guidance: "Pick a real, contained mistake — a deploy that needed a rollback, a misjudged estimate, a misunderstood requirement. Own your part without over-apologizing, explain the impact honestly, and spend most of the answer on the concrete change you made to your habits or the team process.",
      pitfalls: "Choosing a disguised strength, blaming the circumstances entirely, or picking a mistake with no lesson or behavior change attached.",
    },
    {
      question: "How do you explain a technical concept or tradeoff to a non-technical stakeholder?",
      whyAsked: "Engineers who cannot translate cannot influence product decisions. This tests whether you can frame tradeoffs in terms of cost, risk, and user impact instead of implementation detail.",
      guidance: "Give an example: a migration, a build-versus-buy choice, or why a seemingly small request is large. Describe starting from the stakeholder concern — timeline, cost, reliability — using an analogy sparingly, and offering options with consequences rather than a single verdict. Mention checking understanding and inviting questions.",
      example: "When asked why a simple export feature would take weeks, I explained it was not the button — it was permissions, large files timing out, and audit requirements. I offered a phased option that covered most users in days, which is what we shipped.",
      pitfalls: "Using jargon to end the conversation, presenting estimates with no explanation of risk, or treating non-technical questions as interruptions.",
    },
    {
      question: "What security considerations do you keep in mind when building a feature?",
      whyAsked: "Security is part of every engineer job now, not a separate team concern. Interviewers check baseline habits: authentication, authorization, input handling, and data protection.",
      guidance: "Cover the practical layer you control: validating and sanitizing input, checking authorization on every request rather than trusting the UI, never logging secrets or sensitive data, keeping dependencies updated, and storing credentials through your platform secret management. Mention asking for a security review when handling payments, personal data, or new public endpoints.",
      pitfalls: "Saying security is the security team job, suggesting rolling your own encryption or password storage, or treating authorization as a front-end concern.",
    },
    {
      question: "Tell me about a time you helped a teammate or mentored someone.",
      whyAsked: "Even mid-level roles involve unblocking others. This reveals generosity with knowledge, patience in explaining, and whether your help builds independence or dependence.",
      guidance: "Describe a specific situation: pair debugging a problem, reviewing a design before code was written, or writing the doc you wished had existed. Focus on how you helped — asking guiding questions, sharing context, reviewing in small steps — and what the other person could do afterward that they could not before.",
      example: "A newer teammate was stuck on flaky tests. Instead of fixing them myself, we paired twice that week on how to isolate state between tests. A month later they were the person helping others with the same class of problem.",
      pitfalls: "Describing help as simply doing the task for them, framing mentoring as beneath your level, or having no example at all despite experience.",
    },
    {
      question: "How do you prioritize when you have more work than time?",
      whyAsked: "Backlogs are always longer than capacity. Managers want engineers who surface the tradeoff, use impact and urgency explicitly, and renegotiate rather than silently dropping work or burning out.",
      guidance: "Explain your method: clarify which outcome matters most this cycle, estimate roughly, identify dependencies and deadlines, and bring your manager a proposed order with the consequence of deferring each item. Mention protecting focus — limiting work in progress and finishing before starting — and updating stakeholders when priorities shift.",
      pitfalls: "Saying you just work longer hours, multitasking across everything at once, or letting the loudest request win without checking priorities.",
    },
    {
      question: "Why do you want to work here, and what are you looking for in your next role?",
      whyAsked: "Fit cuts both ways. Hiring managers want evidence you researched the company and that what you want — growth, domain, team size, technical challenge — matches what this role actually offers.",
      guidance: "Name something specific about the product, the technical problems, or the team that you verified, and connect it to your trajectory. Be honest about what you are optimizing for next, whether that is deeper systems work, product ownership, or mentorship, so the manager can judge fit rather than guess.",
      example: "I want to move from agency projects to a product I can own over years, where performance and reliability work compounds. Your team public engineering posts about the recent database migration described exactly the kind of problem I want to work on next.",
      pitfalls: "Focusing only on compensation, remote policy, or perks, praising the company in terms that fit any employer, or describing a next role this job clearly is not.",
    },
    {
      question: "Where do you see your engineering skills growing in the next few years?",
      whyAsked: "This checks direction and self-knowledge. There is no single correct path — depth as a specialist, breadth toward architecture, or growth toward technical leadership are all valid — but a considered answer beats a vague one.",
      guidance: "Name one or two concrete directions tied to recent experience: deeper distributed systems skill, stronger product sense, or mentoring and design leadership. Mention what you are already doing toward it — projects you seek out, areas you study, feedback you have asked for — so it reads as a plan, not a wish.",
      pitfalls: "Saying you plan to be a manager within a year at a company hiring you as an individual contributor, naming a growth area unrelated to any step you have taken, or having no direction at all.",
    },
  ],
  questionsToAsk: [
    {
      question: "How does the team plan and run its work — sprint cadence, who writes tickets, and how are priorities decided?",
      why: "This reveals whether engineering has a voice in planning or simply receives assignments. It also tells you how predictable your weeks will be, which matters more to daily satisfaction than most perks.",
    },
    {
      question: "What does the code review process look like, and what is the typical time from pull request to merge?",
      why: "Review culture shapes both code quality and how fast you learn. Long review queues and blocking style debates are warning signs; prompt, substantive review is a sign of a healthy team.",
    },
    {
      question: "How does on-call work here — rotation size, frequency, typical pages, and is there compensation or time off afterward?",
      why: "On-call is the question candidates most regret not asking. Asking directly and calmly signals experience, and the specifics let you judge whether the load is sustainable and fairly shared.",
    },
    {
      question: "How are technical decisions made on this team — who proposes, who decides, and how are disagreements settled?",
      why: "This tells you how much autonomy you will have and whether decisions happen through design docs and discussion or by hierarchy. It also previews how your own proposals would be received.",
    },
    {
      question: "How does deployment work — CI and CD setup, deploy frequency, feature flags, and rollback practice?",
      why: "Deployment habits reveal engineering maturity more honestly than the tech stack list. Frequent, low-risk deploys with easy rollback usually mean calmer incidents and faster feedback on your work.",
    },
    {
      question: "What are the biggest technical challenges the team expects in the next six to twelve months?",
      why: "This is the best question for learning what you would actually work on and whether it stretches you. It also invites the interviewer to be candid about tech debt, scale problems, or migrations ahead.",
    },
    {
      question: "How is growth supported — promotion criteria, mentorship, learning time, and conference or education budget?",
      why: "Shows you are evaluating a multi-year fit. Concrete criteria and real examples of recent promotions are a good sign; vague encouragement without structure is information too.",
    },
    {
      question: "What would success look like for this role in the first 90 days, and how is performance reviewed?",
      why: "This turns an abstract role into concrete expectations and gives you a head start if you join. It also signals that you plan to be accountable from the start, which hiring managers remember.",
    },
  ],
  faqs: [
    {
      q: "How should I prepare for a software engineer interview?",
      a: "Split your preparation into three parts. Practice the coding or technical format the company describes — ask the recruiter what to expect, since formats vary widely. Prepare five or six stories from real work that cover debugging, disagreement, a missed deadline, an incident, and a project you led, since one good story can serve several questions. Finally, research the product and prepare questions about the team process, on-call, and technical direction.",
    },
    {
      q: "How do I answer questions about technologies I have not used?",
      a: "Be direct about what you have and have not used, then bridge to adjacent experience: a similar language, framework, or problem. Describe how you would get productive — docs, the team codebase, a small first task, review from an experienced teammate — and, if it is a core requirement, be honest about the gap rather than bluffing. Interviewers detect bluffing quickly and value a credible learning plan.",
    },
    {
      q: "Should I ask about salary and remote work in the engineering interview?",
      a: "Compensation range, remote policy, and level are usually handled by the recruiter, often in the first call — confirm them there. Use time with the hiring manager and team for how the work runs: review, deployment, on-call, and growth. If on-call is part of the role, asking about its structure and any associated compensation is a process question and is entirely appropriate to raise with the manager.",
    },
    {
      q: "What if I blank on a behavioral question?",
      a: "It is fine to pause and think, and better to use a smaller real example than to invent a dramatic one. Student, open-source, internship, and freelance work all count for early-career candidates. If you genuinely have no example, say so briefly and describe what you would do in that situation and why — interviewers would rather hear sound reasoning than a fabricated story.",
    },
    {
      q: "How long do software engineer interview processes usually take?",
      a: "Processes vary a lot by company, from a recruiter screen plus one combined onsite to several stages including coding, system design, and behavioral rounds across multiple weeks. Ask the recruiter at the start for the full map — number of stages, format of each, and expected timeline — so you can pace your preparation and any other processes you are running.",
    },
  ],
};
