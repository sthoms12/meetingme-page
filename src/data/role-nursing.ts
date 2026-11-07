import type { RoleDataset } from "./types";

export const nursing: RoleDataset = {
  slug: "nursing",
  roleName: "Nursing",
  pagePath: "/questions-to-ask-in-a-nursing-interview/",
  companion: {
    href: "/nursing-interview-questions/",
    heading: "Preparing for the questions they will ask you?",
    text: "This page covers what to ask the unit. The companion page covers the other direction: fifteen more nursing interview questions — refused medication, floated shifts, verbal orders, asking for help — including the questions new graduates actually get, with answer guidance for each.",
  },
  title: "Nursing Interview Questions: What You Will Be Asked and What to Ask",
  metaDescription: "Prepare for a nursing interview with the questions hiring managers actually ask about patient safety, prioritization, and difficult situations — plus smart questions to ask about ratios, orientation, and unit culture.",
  h1: "Nursing interview questions",
  intro: [
    "A nursing interview screens for safe clinical judgment under pressure, not just textbook knowledge. Managers want to hear how you prioritize when everything feels urgent, how you speak up when something looks wrong, and how you treat patients and families on a hard day — because those habits predict whether a nurse is safe to put on the schedule.",
    "Most questions will be scenario-based: a deteriorating patient, a medication concern, a conflict with a physician, or a family member who is upset. Strong answers are specific, calm, and patient-centered — you name what you assessed first, what you did in order, who you looped in, and what you learned. The questions you ask at the end matter too: ratios, orientation, and support on the unit tell you whether the job is set up for you to succeed.",
  ],
  questions: [
    {
      question: "Tell me about yourself and why you chose nursing.",
      whyAsked: "This opens almost every interview. Managers are listening for a clear, patient-centered reason for doing this work and a brief thread that connects your training or experience to this unit.",
      guidance: "Keep it to 60 to 90 seconds: where you trained or worked, the population you have cared for most, and one honest reason nursing fits you. End by connecting it to this role — for example, why medical-surgical, ICU, ED, or pediatrics is the next step you want. Avoid reciting your whole resume.",
      example: "I completed my clinicals mostly on medical-surgical and telemetry units, and I precepted on a step-down unit in my final semester. I like work where close monitoring actually changes outcomes, which is why I am applying to telemetry rather than a general floor.",
      pitfalls: "Giving a long personal life story, saying you chose nursing only for job security or pay, or speaking vaguely about loving helping people without any clinical detail.",
    },
    {
      question: "Why do you want to work on this unit / at this hospital?",
      whyAsked: "Managers want to know you chose this setting deliberately and are likely to stay. Turnover is expensive and disruptive, so genuine fit matters.",
      guidance: "Name something specific you verified before the interview: the patient population, a specialty service, the orientation program, or the unit reputation among staff. Then link it to your goals — a skill you want to build or a population you want to serve long-term.",
      example: "I want to stay in cardiac care and build toward a CCRN over time. This unit handles the post-intervention patients I saw in clinicals, and the 12-week orientation with a dedicated preceptor is exactly the structure I was looking for as a newer nurse.",
      pitfalls: "Saying it was the first opening you saw, focusing only on commute or schedule, or praising the hospital in generic terms that could apply anywhere.",
    },
    {
      question: "How would you handle a difficult or demanding patient?",
      whyAsked: "Difficult behavior is daily nursing work. Interviewers screen for empathy, de-escalation, and whether you take complaints personally or investigate what is underneath them.",
      guidance: "Start with listening and assessing: pain, fear, confusion, unmet needs, and delirium can all present as demanding behavior. Describe sitting down, using the patient name, setting a clear plan for rounding and call-light response, and involving the charge nurse early if behavior escalates. Show you set boundaries respectfully without withholding care.",
      example: "I would first check the basics — are they in pain, anxious, or have they been waiting without an update? I would explain when I will be back and what I can do now, then follow through. If I promise a check-in in 30 minutes, I make sure it happens.",
      pitfalls: "Saying you would avoid the room, label the patient as noncompliant, or promise things outside your scope just to end the conversation.",
    },
    {
      question: "Tell me about a time you dealt with an upset family member. What did you do?",
      whyAsked: "Families often carry the anxiety the patient cannot express. This tests communication, professionalism under criticism, and knowing when to bring in a charge nurse, provider, or patient advocate.",
      guidance: "Use a real clinical or work example with a clear sequence: listen without interrupting, acknowledge the concern in plain language, clarify what you can address now, and escalate appropriately. Close with the outcome — what calmed the situation or what you handed off cleanly — not just that it was stressful.",
      pitfalls: "Blaming the family, discussing another patient case for comparison, or suggesting you would give medical updates beyond what you are authorized to share.",
    },
    {
      question: "You have four patients and all of them need something at once. How do you prioritize?",
      whyAsked: "Prioritization is the core safety skill on a busy unit. Interviewers want a framework — airway, breathing, circulation, acute changes, time-sensitive medications — not just working faster.",
      guidance: "Walk through your triage out loud: assess the unstable or newly changed patient first, handle time-critical tasks like antibiotics or glucose checks next, cluster care where safe, and delegate tasks within scope to aides or teammates. Say explicitly that you would reassess after the first round and ask the charge nurse for help before falling behind, not after.",
      example: "If one patient has new chest discomfort, that assessment comes before routine vitals on a stable patient. I would get vitals and an ECG started, notify the provider, delegate the stable patient vitals, and keep the charge nurse aware of my load.",
      pitfalls: "Saying you would go in room order, try to do everything yourself without delegating, or treat a new symptom the same as a routine request.",
    },
    {
      question: "Describe a time you disagreed with a physician or provider order. How did you handle it?",
      whyAsked: "This screens for advocacy and respectful assertiveness. Good nurses question orders they believe are unsafe, but they do it with data and through the right chain.",
      guidance: "Describe clarifying first — re-check the order, the chart, allergies, labs, and recent vitals — then contacting the provider with a concise SBAR and your concern. If the concern is not resolved, say you would use the chain of command: charge nurse, then supervisor or attending. Frame it as protecting the patient, not winning an argument.",
      example: "I would say: I am calling about the dose ordered — it is double what the patient received yesterday, their kidney function dropped overnight, and I want to confirm you intended the increase before I give it.",
      pitfalls: "Saying you would give an order you believed was unsafe because the doctor ordered it, refuse without explanation, or go around the provider without trying to clarify first.",
    },
    {
      question: "What would you do if you made a medication error, or caught one just before giving a medication?",
      whyAsked: "Honesty and systems thinking are non-negotiable here. Every experienced nurse has caught a near miss; managers want a candidate who reports, assesses the patient, and learns — not one who hides mistakes.",
      guidance: "Lead with patient assessment and disclosure through proper channels: check the patient, notify the provider and charge nurse promptly, document factually, and file the incident report your facility requires. For a near miss, explain the check that caught it — the five rights, barcode scanning, allergy or dose verification — and that you would still report it so the system can be fixed.",
      pitfalls: "Saying you have never made an error and never will, suggesting you would fix it quietly without reporting, or focusing on fear of punishment instead of patient safety.",
    },
    {
      question: "How do you ensure patient safety in your daily practice?",
      whyAsked: "This is a broad check of habits: hand hygiene, two identifiers, medication checks, fall precautions, handoff accuracy, and willingness to stop and verify.",
      guidance: "Give concrete habits rather than a slogan. Mention verifying two identifiers before meds and procedures, bedside shift report where used, keeping call lights in reach, reassessing after interventions, and speaking up about broken equipment or unclear orders. One brief real example is stronger than a list.",
      example: "I build safety into routine — I do not work around a scanner that is not reading, I get a second nurse for high-alert medication checks where policy requires it, and I confirm allergies out loud with the patient when I can.",
      pitfalls: "Answering only with hand washing, implying safety is someone else job, or describing workarounds as efficiency.",
    },
    {
      question: "A patient you are caring for suddenly becomes short of breath and their oxygen saturation drops. What do you do?",
      whyAsked: "Interviewers test your recognition of deterioration and your first actions before help arrives. Sequence matters more than listing every possible diagnosis.",
      guidance: "State your immediate steps in order: stay with the patient, call for help, sit them up if appropriate, assess airway and breathing, apply oxygen per protocol, get vitals, and notify the provider or rapid response team per unit criteria. Mention you would keep reassessing and be ready to report what changed, when it started, and what you have already done.",
      pitfalls: "Leaving the patient alone to find help without using the call system, jumping straight to a diagnosis, or waiting to see if it resolves when the patient is clearly deteriorating.",
    },
    {
      question: "How do you approach end-of-life care and supporting a dying patient and their family?",
      whyAsked: "Comfort care tests compassion, clarity about goals of care, and comfort working within a plan you did not write — including when the plan is different from what you would personally choose.",
      guidance: "Talk about comfort as active care: pain and breathlessness management, mouth care, repositioning, a quiet environment, and presence. Note the importance of following documented goals and advance directives, coordinating with the provider, social work, and chaplaincy if the family wants it, and answering questions honestly within your scope or getting the right person.",
      example: "I focus on whether the patient looks comfortable and whether the family understands what to expect. If they ask about changes in breathing, I explain in simple terms and make sure they know how to reach us quickly.",
      pitfalls: "Saying you would push for more aggressive treatment against documented wishes, avoid the room because it is sad, or offer false reassurance that everything will be fine.",
    },
    {
      question: "Tell me about a time you worked as part of a team to care for a patient.",
      whyAsked: "Nursing outcomes depend on aides, therapists, respiratory, pharmacy, case management, and other nurses. Managers screen for credit-sharing and for knowing what others contribute.",
      guidance: "Pick an example where coordination changed the result — a discharge that needed teaching, therapy, and equipment aligned, or a busy shift where the team redistributed work. Name your specific role, how you communicated, and what the team accomplished together.",
      pitfalls: "Telling a story where you did everything alone, criticizing teammates, or picking an example with no patient outcome at the end.",
    },
    {
      question: "How do you handle stress and prevent burnout on demanding shifts?",
      whyAsked: "Managers are not looking for a wellness slogan. They want signs you recognize overload early, use the team, take breaks when possible, and do not let stress leak into patient interactions.",
      guidance: "Be practical: brief reset habits during a shift, debriefing after a hard case, asking for help before you are overwhelmed, and what you do outside work to recover. Keep it honest and brief — one or two sustainable habits beat a long self-care list.",
      example: "On shift, the most helpful thing for me is flagging early that my assignment is turning — a quick word with the charge nurse before I am behind. Outside work, I protect sleep on work nights because I know my patience is thinner when I am tired.",
      pitfalls: "Saying you never get stressed, that you just push through without breaks or help indefinitely, or describing venting about patients in public areas.",
    },
    {
      question: "How do you educate a patient about a new medication or discharge instructions?",
      whyAsked: "Poor discharge teaching drives readmissions and harm. Interviewers check whether you assess health literacy, use plain language, and verify understanding instead of just handing over papers.",
      guidance: "Describe asking what the patient already knows, explaining in plain language in small chunks, using teach-back to confirm understanding, and involving family or an interpreter when needed. Mention you document what was taught and flag barriers — cost, no ride to the pharmacy, no scale at home for daily weights — to case management or the provider.",
      example: "I would ask them to tell me in their own words when they will take it and what side effect should prompt a call. If they cannot, that is my cue to re-teach differently, not to repeat the same words louder.",
      pitfalls: "Relying only on printed handouts, using jargon without checking understanding, or assuming a family member will translate medical instructions accurately.",
    },
    {
      question: "Describe a time you had a conflict with a coworker. How did you resolve it?",
      whyAsked: "Unit culture depends on nurses handling friction directly and professionally. This also reveals whether conflict ever affects handoffs or patient care.",
      guidance: "Choose a work-style disagreement, not a dramatic feud. Explain addressing it privately and promptly, listening to the other view, focusing on the shared task or patient, and involving a charge nurse only if direct conversation did not resolve it. End with how the working relationship functioned afterward.",
      pitfalls: "Saying you avoided the person and let handoffs suffer, involved other staff in taking sides, or brought a personal dislike into a clinical decision.",
    },
    {
      question: "What do you do when you do not know how to do a procedure or are unsure about something?",
      whyAsked: "New and experienced nurses alike face unfamiliar tasks. The safe answer is the only acceptable one: stop, verify, and get help rather than improvising.",
      guidance: "Say plainly that you would not attempt an unfamiliar procedure unsupervised. Describe checking policy, asking your preceptor or charge nurse, observing first where appropriate, and being transparent with the patient. Managers would rather hear this clearly than hear confidence without limits.",
      example: "I would say to my charge nurse: I have not done this independently yet, can you walk through it with me or observe me? I would rather ask before I am at the bedside than during.",
      pitfalls: "Saying you would look it up quickly and try, fake confidence in front of a patient, or treat asking for help as a weakness.",
    },
    {
      question: "How do you give a good handoff report?",
      whyAsked: "Handoff gaps are a known safety risk. Interviewers want structure — SBAR or your facility format — and judgment about what detail actually matters for the next nurse.",
      guidance: "Describe covering diagnosis and code status, what changed this shift, current assessment concerns, lines and drips, pending results and tasks, safety risks like falls or skin issues, and what to watch for. Mention giving report at the bedside where that is unit practice and leaving time for questions instead of rushing out.",
      pitfalls: "Reading the entire chart verbatim, omitting pending items, or sharing opinions about a patient personality instead of clinical facts.",
    },
    {
      question: "Tell me about a time you advocated for a patient.",
      whyAsked: "Advocacy is where assessment turns into action — a pain plan that is not working, a discharge that is not safe, a symptom being dismissed. This question separates task-focused answers from patient-focused ones.",
      guidance: "Pick a specific moment: what you noticed, what data you gathered, who you contacted, and what changed for the patient. Keep the patient at the center and credit the team members who responded. If you are a new graduate, a clinical example where you escalated a concern counts.",
      example: "My patient pain was not controlled on the current plan and they could not participate in therapy. I reassessed and documented the scores and function impact, then called the provider with a clear request to review the plan before the therapy session.",
      pitfalls: "Choosing an example where advocacy meant arguing loudly, bypassing all process, or where nothing you did actually affected the patient plan.",
    },
    {
      question: "How do you care for patients whose language, culture, or beliefs are different from your own?",
      whyAsked: "Equitable care requires curiosity and systems — qualified interpreters, dietary and religious accommodations, and not making assumptions from appearance or surname.",
      guidance: "Emphasize using a qualified medical interpreter rather than family for clinical conversations, asking the patient directly about preferences that affect care, and documenting and handing off those preferences. Give a brief example if you have one from clinicals or prior work.",
      pitfalls: "Saying you treat everyone exactly the same without adaptation, relying on gestures or a family member for consent discussions, or stereotyping what a patient will want.",
    },
    {
      question: "How do you manage your time and delegate appropriately during a busy shift?",
      whyAsked: "Delegation errors and missed reassessments are common failure points. Managers want to hear you know what must stay with the RN and what can be delegated with clear instructions and follow-up.",
      guidance: "Describe planning after report: identifying time-sensitive tasks, clustering care, and delegating within scope — vitals on stable patients, ambulation, intake and output — with specific expectations and a check-back. Stress that delegation does not end with assigning: you verify completion and act on abnormal results.",
      example: "If I delegate vitals, I say which patients, by when, and which values to report to me immediately. Then I close the loop — if I have not heard back on a borderline result, I go and check.",
      pitfalls: "Delegating assessments or patient teaching that require RN judgment, delegating without follow-up, or refusing to delegate and falling behind on critical tasks.",
    },
    {
      question: "What is your greatest strength as a nurse, and what is an area you are working on?",
      whyAsked: "Self-awareness predicts coachability. Managers distrust perfection claims and value nurses who know their growth edge and have a plan for it.",
      guidance: "Pick a strength you can prove with a short example — calm assessment, thorough documentation, patient teaching. For the growth area, choose something real but manageable, like speed with documentation or confidence with a specific skill, and name the concrete step you are taking. Avoid disguised strengths.",
      example: "My strength is noticing small changes because I compare every assessment to baseline, not just to normal ranges. I am working on documentation speed — I now chart assessments closer to real time instead of batching, which has cut my end-of-shift charting significantly.",
      pitfalls: "Classic traps: saying your weakness is being a perfectionist, naming a critical safety flaw with no improvement plan, or claiming no weaknesses as a new graduate.",
    },
  ],
  questionsToAsk: [
    {
      question: "What are the typical nurse-to-patient ratios on this unit, and how do they change on nights or when acuity is high?",
      why: "Ratios shape safety and workload more than almost anything else. Asking shows you are evaluating fit seriously, and the answer tells you whether staffing flexes with acuity or is fixed regardless.",
    },
    {
      question: "How long is orientation, and how does precepting work here?",
      why: "A structured orientation with consistent preceptors is the strongest predictor of a good first year. Ask about length, whether it extends if needed, and who evaluates readiness to come off orientation.",
    },
    {
      question: "How would you describe the culture on this unit, especially between newer and experienced nurses?",
      why: "You will spend your hardest moments with this team. The manager answer — and how specifically they can describe teamwork and support — reveals a lot about psychological safety on the unit.",
    },
    {
      question: "How is scheduling handled — self-scheduling, weekend and holiday requirements, and shift differentials?",
      why: "Schedule fit drives retention. Clarifying this now prevents a mismatch later and signals you are thinking about a sustainable, long-term role rather than any opening.",
    },
    {
      question: "What support is available on a busy shift — charge nurse without an assignment, resource nurse, rapid response, lift team?",
      why: "This tells you whether help is real or theoretical when a patient deteriorates or the unit surges. Strong units answer concretely; vague answers are information too.",
    },
    {
      question: "What do new nurses on this unit usually find hardest in the first six months, and what support helps them through it?",
      why: "It invites an honest answer about the learning curve and shows humility and foresight. It also helps you judge whether the unit expects struggle and plans for it.",
    },
    {
      question: "Are there opportunities for certification support, tuition assistance, or moving into charge or preceptor roles over time?",
      why: "Shows you are thinking beyond the first year without sounding like you plan to leave. Units that invest in growth tend to retain nurses longer.",
    },
  ],
  faqs: [
    {
      q: "How should I prepare for a nursing interview?",
      a: "Prepare specific stories, not general claims. Pick clinical examples for prioritization, a difficult patient or family, speaking up about a safety concern, and teamwork, and practice saying them in order: situation, what you assessed, what you did, and the outcome. Review the unit patient population, bring your license and certification details as requested, and prepare two or three thoughtful questions about ratios, orientation, and support.",
    },
    {
      q: "What if I am a new graduate with no nursing job experience?",
      a: "Use clinical rotations, preceptorships, and related work like CNA or tech roles as your evidence. Interviewers expect new graduates to have limited experience — what they screen for is safe judgment, knowing your limits, and asking for help early. Be explicit about that: saying you would check policy, ask your preceptor, and never attempt an unfamiliar procedure alone is a strong answer, not a weak one.",
    },
    {
      q: "How long do nursing interviews last and who will I meet?",
      a: "It varies by employer. Many nursing interviews are 30 to 60 minutes with the nurse manager, sometimes followed by a peer panel or a brief unit tour and shadowing. Ask the recruiter beforehand who you will meet and whether shadowing is included, so you can plan footwear and questions for both the manager and staff nurses.",
    },
    {
      q: "Should I ask about pay in the first nursing interview?",
      a: "Pay, differentials, and sign-on details are usually handled by the recruiter or HR rather than the nurse manager. If the manager raises it, answer honestly. Otherwise, use the manager interview for unit fit — ratios, orientation, culture, and support — and confirm compensation, benefits, and schedule requirements with HR before accepting an offer.",
    },
    {
      q: "What should I bring to a nursing interview?",
      a: "Bring copies of your resume, your nursing license information, and certifications relevant to the unit such as BLS or ACLS if you hold them. Follow any specific instructions in the interview invitation, which may ask for transcripts or immunization records later in the process rather than at the first interview.",
    },
  ],
};
