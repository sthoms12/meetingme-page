import type { RoleDataset } from "./types";

export const nursingQuestions: RoleDataset = {
  slug: "nursing",
  roleName: "Nursing",
  pagePath: "/nursing-interview-questions/",
  title: "Nursing Interview Questions and Answers",
  metaDescription: "Nursing interview questions with answer guidance for new graduates and experienced nurses: refusals, floating, documentation, verbal orders, and escalation.",
  h1: "Nursing interview questions — and how to answer them",
  companion: {
    href: "/questions-to-ask-in-a-nursing-interview/",
    heading: "Deciding what to ask them?",
    text: "The companion page covers the questions to ask before you accept — ratios, orientation length, scheduling, and unit culture — and how to read the answers, because the safest assignment is the one you chose with your eyes open.",
  },
  intro: [
    "This page is the candidate side of the nursing interview: the questions managers and peer panels ask you, and how to answer them so your clinical judgment shows. Several questions below are the ones new graduates actually get — asking for help, building competence in a first year, handling a float shift — because new-grad hiring is where these interviews carry the most weight for both sides.",
    "Expect a unit manager interview, often with a peer panel of staff nurses, and sometimes a tour or brief shadowing afterward. What convinces them is not memorized definitions but judgment stories with a clear sequence: what you assessed, what you did first, who you looped in, and what happened. A specific, calm story from clinicals beats a polished general claim every time.",
  ],
  questions: [
    {
      question: "How do you handle a patient who refuses a medication or treatment?",
      whyAsked: "Refusals test whether you respect autonomy while still doing the clinical work — understanding why, informing the patient, and escalating correctly — instead of either forcing the issue or quietly skipping the dose.",
      guidance: "Start with curiosity: ask what is behind the refusal — nausea, fear, a past reaction, cost, not understanding the purpose — because many refusals resolve once the real concern is addressed. Explain in plain language what the medication is for and what happens if it is not taken, then notify the provider of the refusal and the reason so the plan can be reconsidered. Document the refusal, your education, and the notification factually. Be clear that a competent patient may refuse, and medication is never given covertly in food.",
      example: "A patient refused his evening insulin because the site was sore and he was convinced the dose was wrong. I checked the order and his glucose, showed him the reading, rotated the site, and he accepted it. Had he still refused, I would have notified the provider and documented his reason.",
      pitfalls: "Charting a refusal without exploring why, hiding medication in food, threatening consequences, or failing to notify the provider so the plan never gets adjusted.",
    },
    {
      question: "Tell me about a time you caught a change in a patient's condition before it became an emergency.",
      whyAsked: "Early recognition is where nursing surveillance earns its keep. Managers want evidence that you compare each assessment to the patient baseline, trust a trend, and act on a subtle change rather than waiting for dramatic numbers.",
      guidance: "Pick a genuine example, from practice or clinicals, and narrate the cue precisely: slightly increased work of breathing, new confusion, a urine output trend, a wound that looked different. Explain what you compared it against and the sequence that followed — focused reassessment, vital signs, notifying the provider or charge nurse with specific data, and any intervention started within protocol. Close with the outcome and what it taught you.",
      example: "A post-op patient was answering a beat slower and his urine output had halved over two hours, though his vitals were still in range. I rechecked vitals, found his pressure drifting down, and called the provider with the trend. He was evaluated for bleeding hours before his numbers would have triggered an alarm.",
      pitfalls: "Choosing a full arrest when the question asks about catching change early, giving a story with no specific cues or data, or ending at noticing without escalation or outcome.",
    },
    {
      question: "How do you manage when you are floated to an unfamiliar unit?",
      whyAsked: "Floating is a reality managers need handled safely and without resentment. They screen for nurses who clarify their assignment and limits on an unfamiliar unit instead of silently struggling or refusing the float outright.",
      guidance: "Describe a float routine: introduce yourself to the charge nurse, state honestly what you are competent to do and what you have not done, and ask how this unit differs — code cart and supply locations, common protocols, who to call. Clarify your assignment and push back respectfully if handed a patient outside your competency, offering what you can safely take instead. Identify a resource nurse early and double-check unfamiliar medications and equipment rather than improvising.",
      pitfalls: "Accepting an assignment beyond your competence without speaking up, criticizing the unit routines to its staff, or treating the float as beneath you where patients and colleagues can hear it.",
    },
    {
      question: "How do you keep your documentation accurate when the shift is busy and you are charting late?",
      whyAsked: "Late charting is universal; inaccurate charting is a patient-safety and legal problem. This question checks your habits for recording times truthfully and capturing clinical facts under time pressure.",
      guidance: "State the core rule first: you chart what you did with the actual time you did it, using late-entry notation exactly as policy requires, and you never back-time to make a shift look tidier. Then give the systems that keep late charting rare and accurate — brief point-of-care entries for assessments and time-critical medications, a running note of times and events during a busy stretch, and prioritizing the charting the next caregiver needs for safety. Anything not yet documented is handed over verbally and completed before you leave.",
      example: "During a rapid response I kept a timeline — times, vitals, who I called, what was given — on the sheet we use for that purpose. Afterwards I charted from it as a late entry with real times, so the record matched what actually happened.",
      pitfalls: "Charting times as scheduled rather than actual, copying forward a previous assessment, or planning to reconstruct a full shift of charting from memory at home.",
    },
    {
      question: "A family member asks you for information about a patient that you are not able to share. What do you say?",
      whyAsked: "Privacy breaches are often kind-hearted, not malicious. Managers screen for nurses who can protect information warmly — explaining limits without sounding evasive or sparking the conflict they are trying to avoid.",
      guidance: "Name the principle in plain language: you share information according to the patient wishes and facility privacy policy, using the designated spokesperson or code process where one exists. Acknowledge the concern, explain simply that you are limited in what you can share and that this protects the patient, then redirect to what you can do — pass a message to the patient, connect them with the designated contact, or involve the charge nurse or social work. Avoid confirming details by implication or discussing the patient in public areas.",
      example: "I would say: I understand you are worried, and I am not able to share details about anyone care. If you are the person the patient has named as their contact, I can connect you with the nurse who can update you, or let the patient know you called.",
      pitfalls: "Giving “just a little” information to be helpful, confirming a patient is admitted when policy says otherwise, or quoting regulations at a distressed family member instead of helping them reach the right channel.",
    },
    {
      question: "You find your fall-risk patient trying to get up unassisted for the third time this shift. What do you do?",
      whyAsked: "A repeat pattern means the current plan is failing, and falls are a leading source of inpatient harm. Interviewers want problem-solving beyond re-applying the same precautions that already did not work.",
      guidance: "Start with the immediate moment — stay with the patient, assist them safely, and assess why they are getting up: toileting is the most common driver, along with pain, restlessness, confusion, or forgetting. Then change the plan rather than repeating it: scheduled proactive toileting rounds, a room closer to the nurses station, a bed or chair alarm actually in use, a shared watch plan with the aide team, and reviewing sedating medications with the provider. Document and hand off the pattern explicitly.",
      example: "By the third attempt I would stop treating it as forgetfulness. Most patients getting up repeatedly need the bathroom on a schedule they cannot articulate. I would set two-hourly assisted toileting, flag it in handoff as the active plan, and ask the provider to review an evening sedative adding to the urgency.",
      pitfalls: "Reaching for restraints as a first resort, scolding the patient, raising all four side rails and calling it a plan, or documenting the attempts without changing anything.",
    },
    {
      question: "How do you respond when a patient or visitor becomes verbally abusive or threatening?",
      whyAsked: "Workplace violence in healthcare is common and rising. Managers need nurses who can de-escalate, protect themselves and others, and use the unit systems — not nurses who absorb threats silently or escalate them.",
      guidance: "Walk through de-escalation first: stay calm, keep a safe distance and an exit path, lower your voice, acknowledge the frustration, and set a clear, respectful limit on behavior while keeping care going. Then name the escalation steps — involving the charge nurse, calling security per policy, and moving the interaction out of earshot of other patients where possible. Mention assessing for clinical drivers like pain, delirium, or withdrawal, because abuse is sometimes a symptom, and close with reporting the incident through your facility system.",
      pitfalls: "Matching the volume or threatening to withhold care, staying alone in a room with someone making credible threats, or never reporting incidents because “it is part of the job.”",
    },
    {
      question: "What steps do you take when you receive a verbal or telephone order from a provider?",
      whyAsked: "Verbal orders are a classic error pathway. This is a precision question with a correct sequence, and managers listen for whether you know it cold.",
      guidance: "State the sequence in order: write the order down as it is given rather than trusting memory, read it back to the provider — drug name, dose, route, and frequency, spelling out sound-alike names and numbers — and receive confirmation before acting. Enter it promptly, flagged as a verbal or telephone order per policy, with provider co-signature within your facility timeframe. Add the boundaries: anything unclear gets clarified before you hang up, and a second nurse listens where policy requires it for high-alert medications.",
      example: "I write it, then read back: “Metoprolol, fifty milligrams, by mouth, twice daily” — and I would spell out fifteen versus fifty if a dose sounded ambiguous. I do not act until the provider confirms my read-back.",
      pitfalls: "Relying on memory and writing the order later, skipping read-back when the provider sounds rushed, or accepting an order relayed second-hand without verification.",
    },
    {
      question: "Tell me about feedback you received from a preceptor or manager that was hard to hear. What did you change?",
      whyAsked: "Coachability is one of the best predictors of a new nurse success. Managers distrust candidates who cannot name real feedback; they are listening for whether criticism produced a concrete behavior change.",
      guidance: "Choose feedback that stung because it was accurate — documentation that ran late, assessments that missed a trend, communication that sounded abrupt under pressure. Describe your honest first reaction briefly, then the specific change you built: a new routine, a checklist, asking for observation, or practicing a phrase. Quantify the improvement if you can, and show the relationship survived — the same preceptor later trusted you with more.",
      example: "My preceptor told me my handoff left out pending results, and she was right — I summarized what had happened instead of what the next nurse needed to watch. I switched to a written SBAR template for a month. By my final evaluation, handoff was listed as a strength.",
      pitfalls: "Claiming you have never received hard feedback, choosing feedback that was really someone else fault, or describing hurt feelings with no change in practice afterward.",
    },
    {
      question: "How do you care for a patient with dementia who becomes agitated and tries to leave?",
      whyAsked: "This combines safety, communication, and restraint-free care. Managers screen out approaches that argue with the patient reality or reach for sedation and restraints before understanding the trigger.",
      guidance: "Start with causes: agitation in dementia is usually communication — pain, hunger, toileting, noise, fear, an unfamiliar room, or a disrupted routine. Approach calmly at eye level, validate the feeling rather than correcting the fact, and redirect to a safe activity or a supervised walk. Cover the environment: consistent staff where possible, family involvement and familiar objects, and a room placement that allows observation. Escalate to the provider for review, with medication or restraint only as last resorts under order and policy.",
      pitfalls: "Physically blocking or arguing with the patient, restraining or sedating as a first response, or leaving an exit-seeking patient unobserved while you chart.",
    },
    {
      question: "Tell me about a time you realized you needed help during a shift. How did you ask for it?",
      whyAsked: "New graduates in particular are screened here: the dangerous nurse is not the slow one but the one who disappears into a task and surfaces an hour later, behind and silent. Managers want early, specific help-seeking.",
      guidance: "Pick a real moment — two admissions colliding, a patient deteriorating while another needed a time-critical medication, a procedure taking longer than expected. Describe the trigger that told you you were at capacity and the ask itself: specific, early, and directed, rather than a general cry for help at crisis point. Credit the response, note what got reprioritized or delegated, and name the early-warning signs you now watch for. Frame asking as a clinical skill you are deliberately building.",
      example: "In my precepted shifts a new admission was arriving while my other patient needed hourly neuro checks after a fall. I told my preceptor before the admission hit the floor, not after, and she took the admission assessment while I kept the checks on time.",
      pitfalls: "Presenting self-sufficiency as the ideal and help-seeking as failure, asking only after something was already missed, or making the ask so vague no one could act on it.",
    },
    {
      question: "As a new graduate, how do you plan to build your competence and confidence in your first year?",
      whyAsked: "Managers hiring new graduates are really buying a development trajectory. A candidate with a realistic plan — and realistic expectations of the timeline — is far more likely to still be thriving, and employed, at month twelve.",
      guidance: "Lay out a plan with honest sequencing. In orientation, use your preceptor deliberately: prepare questions from each shift, ask to observe then perform then teach back new skills, and use residency sessions to process cases, not just attend them. Through the first year, keep a personal skills log so you and your manager can see gaps and request exposure, and seek feedback actively rather than waiting for evaluations. Name the timeline truthfully: most new nurses feel shaky for six months and steadier toward the end of year one.",
      pitfalls: "Promising full confidence in a few weeks, offering a plan that is only “work hard and ask questions” with no structure, or implying you will avoid unfamiliar assignments rather than seek them with support.",
    },
    {
      question: "Describe your experience with isolation precautions and infection control in daily practice.",
      whyAsked: "Infection control failures harm patients who never meet the source. Managers check that precautions are automatic habits — including when they are inconvenient — not knowledge performed for an audit.",
      guidance: "Cover the daily mechanics concretely: hand hygiene before and after every contact, standard precautions with every patient, and transmission-based precautions — contact, droplet, airborne — with correct donning and doffing and signage you actually check before entering. Give a lived detail: cohorting equipment to the room, cleaning shared equipment between patients every time rather than when observed, and handling a breach honestly. Mention teaching family members to gown and glove without shaming them, and staying current when an outbreak changes the protocol.",
      example: "The habit I drilled in clinicals was cleaning the shared workstation and vitals machine as part of the task, not a separate chore at the end. For isolation rooms I read the sign before I reach for the handle — guessing the precautions from the diagnosis is how breaches happen.",
      pitfalls: "Treating hand hygiene as the whole answer, describing doffing casually when it is the highest-risk step, or suggesting precautions can be shortcut on a stable, long-stay patient.",
    },
    {
      question: "What do you do if you arrive for your shift and your assignment already looks unsafe?",
      whyAsked: "This tests professional courage and process. Managers need nurses who raise an unsafe assignment through the right channels, with specifics, before accepting it silently and absorbing the risk — and the blame — themselves.",
      guidance: "Act before the shift runs away: review the assignment against acuity and your competency, then take specific concerns to the charge nurse promptly — not a general complaint but the math: this many high-acuity patients, these time-critical tasks, this skill you are not yet signed off on. Offer solutions alongside the concern, such as swapping one patient or pairing you for the unfamiliar element. If it is not resolved, use the chain — nurse manager, house supervisor — and your facility staffing form where one exists, documenting factually.",
      example: "I would go to the charge nurse in the first fifteen minutes with specifics: “Two of these four are fresh post-ops an hour apart, and I have not been checked off on that drain yet — can we swap the second one or pair me with the resource nurse for the first assessment?” That is a problem she can solve; a complaint at hour six is not.",
      pitfalls: "Accepting any assignment silently because questioning it feels insubordinate, refusing outright and leaving patients uncovered, or raising the concern only after an incident.",
    },
    {
      question: "How do you stay current with changing protocols and evidence-based practice?",
      whyAsked: "Protocols change constantly — sepsis bundles, device care, medication safety. Managers screen for nurses whose practice updates deliberately rather than freezing at whatever they were taught in school or a previous job.",
      guidance: "Name real channels and habits: reading unit and facility policy updates instead of archiving them, attending skills fairs and in-services, and using your professional association or a reputable journal source for your specialty. Show the behavior behind it — when a protocol changes, you check the current policy at the point of care rather than working from memory, and you ask your educator when written guidance is unclear. Ground the answer in the weekly habit, because that is what keeps a nurse current between courses.",
      pitfalls: "Saying your schooling is recent so you are already current, relying only on what coworkers tell you changed, or describing continuing education purely as collecting required hours.",
    },
  ],
  questionsToAsk: [
    {
      question: "Does the hospital run a nurse residency or transition-to-practice program for new graduates, and how long and structured is it?",
      why: "Residency programs with cohort sessions, mentorship, and a graduated assignment load are the strongest known support for first-year retention. The answer tells you whether new-grad development here is a designed program or a hope.",
    },
    {
      question: "How are preceptors selected and matched, and what happens if the fit with my preceptor is not working?",
      why: "Your preceptor shapes your first months more than any policy does. A unit with a real answer — trained preceptors, planned matching, a no-blame route to request a change — is a unit that has thought about how nurses actually learn.",
    },
    {
      question: "How does the unit feel about new nurses calling a rapid response — is early escalation encouraged here?",
      why: "The answer reveals the safety culture more honestly than any values poster. Units where experienced nurses thank juniors for calling early are units where you will speak up in time; hesitation or jokes about over-calling are a warning.",
    },
    {
      question: "How are admissions and discharges handled around shift change, and how is that handoff load shared?",
      why: "A new admission at 6:40 pm can wreck a handoff and a nurse evening. Knowing whether admissions pause near shift change or land on whoever is leaving tells you how the unit protects report — and its nurses.",
    },
    {
      question: "What does the clinical ladder or professional development path look like after the first year?",
      why: "It signals you plan to build a career on this unit, and the answer shows whether growth means real roles — preceptor, charge, committee and certification support — or simply more years at the same level.",
    },
  ],
  faqs: [
    {
      q: "What do new graduate nurses get asked most in interviews?",
      a: "Above all, safety judgment: what you do when you do not know a procedure, how you ask for help and how early, how you prioritize, and how you plan to build competence in your first year. Several questions on this page are exactly those, because managers know your clinical stories are limited — they are screening for limits-awareness, escalation, and a real development plan, not a long résumé.",
    },
    {
      q: "How many questions will I be asked, and how long should my answers be?",
      a: "Expect eight to twelve questions in a 30 to 60 minute interview, usually with several scenarios. Aim for one to two minutes per answer: the situation in a sentence, what you assessed and did in order, and the outcome. Scenario answers where you walk through your sequence step by step can run a little longer, and a clear short answer invites good follow-ups.",
    },
    {
      q: "What should I wear to a nursing interview, and what should I bring?",
      a: "Wear business professional clothing unless the recruiter explicitly tells you otherwise — some interviews include unit shadowing and will tell you to bring or wear scrubs for that portion, but do not assume it. Bring copies of your resume, your license, and certifications such as BLS or ACLS if you hold them, plus any documents the invitation specifically requests.",
    },
    {
      q: "Do hospitals use panel interviews for nurses?",
      a: "Frequently, yes. After or alongside the nurse manager interview, many units run a peer panel of staff nurses and sometimes a charge nurse or educator. Peer panels judge day-to-day teamwork and unit fit on a hard shift, so give them the same specific, calm answers you give the manager — and ask them your culture and support questions, because staff answers are often the most candid you will get.",
    },
    {
      q: "When do offers usually come after a nursing interview?",
      a: "Timelines vary, but many hospitals move within one to two weeks of the final interview, and new-graduate residency cohorts often hire on a fixed schedule tied to cohort start dates, which can mean a longer, clearly stated wait. It is always reasonable at the end of the interview to ask about next steps and expected timeline — and a recruiter, rather than the nurse manager, usually handles the offer, pay, and start-date details.",
    },
  ],
};
