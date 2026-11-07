import type { PerQuestionGuide } from "./types";

// Full-page guides for single high-volume questions (spec §5.1).
// Worked examples are illustrations to adapt — never scripts to recite.

export const whyHireYou: PerQuestionGuide = {
  question: "Why should we hire you?",
  intro: [
    "This is the closing argument of the interview. By the time it gets asked — near the end, or sometimes bluntly near the beginning — the interviewer has a file full of impressions and a decision to make. The question is an invitation: make the hire/no-hire case yourself, in your own words, so they do not have to assemble it from an hour of scattered answers. Candidates who treat it as a formality waste the one moment where the interviewer is explicitly asking to be persuaded.",
    "Most candidates answer with adjectives: hardworking, dedicated, a team player, a quick learner. Adjectives fail because every candidate claims them and none of them can be checked. A structured answer built from evidence — the posting's own requirements, matched one by one to things you have actually done — stands out precisely because it sounds like a case rather than a self-description. You are not arguing that you are good. You are showing that the specific problem behind this job posting is one you have already solved.",
  ],
  framework: [
    {
      step: "Read the posting like a spec",
      detail: "Before the interview, go back to the job posting and find the three requirements that are repeated most often or listed first. Repetition and position are signals: the first bullet is usually the pain that created the opening, and a requirement mentioned in both the duties and the qualifications sections is the one the hiring manager will score hardest. Those three requirements, in their order, become the skeleton of your answer.",
    },
    {
      step: "Match each requirement to proof",
      detail: "For each of the three, prepare one piece of evidence: a result, a number, or a named experience that demonstrates it directly. Work in the same order the posting lists them, so the interviewer hears their own priorities answered back in sequence. “You need someone who can X” followed by “here is where I did X, and what happened” is the entire move. Proof beats proximity — having held a similar job title is weaker than one concrete outcome in the relevant skill.",
    },
    {
      step: "Name the gap you fill",
      detail: "Behind every posting is a problem: a backlog, a departure, a growth strain, a skill nobody on the team has. If you can name that problem and connect it to something you have solved before, your answer stops being about you and starts being about their situation. Listen during the interview for clues — why the role is open, what the team is struggling with — and fold what you learn into this part of the answer.",
    },
    {
      step: "Add one differentiator only if it is real",
      detail: "An unusual combination — clinical experience plus billing knowledge, a trade background plus customer-facing years, fluency in the language half your customers speak — can be the detail that separates you from an equally qualified finalist. Include it only if it is genuinely relevant and genuinely yours. If it would sound like garnish, skip it: a clean three-point match beats a four-point answer with a decorative flourish.",
    },
    {
      step: "Close forward, then stop talking",
      detail: "End with one sentence about what you would do with these strengths in this role — the first problem you would take on, the standard you would bring. Then stop. The most common way this answer dies is a strong close followed by nervous extra sentences that dilute it. A clean ending signals the confidence the whole answer was built to demonstrate.",
    },
  ],
  examples: [
    {
      context: "Experienced hire — operations and support lead applying for a team lead role",
      text: "Your posting leads with three things: cutting response times, coaching a young team, and cleaning up a messy handoff from sales. On response times, I inherited a support queue averaging two days to first reply and got it under four hours by re-triaging how tickets were routed — no extra headcount. On coaching, I have trained eleven new hires in three years, and my last two are now the people others go to for escalations. And the handoff problem is familiar: I built the intake checklist my current team still uses after sales promised things support could not deliver. I would start here the same way — watch the queue for two weeks, then fix the routing first.",
    },
    {
      context: "Career changer — retail store manager moving into an office and admin role",
      text: "I know my background looks different from the other applicants, so let me match it to what the posting actually asks for. It asks for scheduling and coordination — I build weekly schedules for a staff of twenty-four across three departments, around availability, labor budgets, and last-minute call-outs. It asks for accurate records under pressure — I close out the store's cash, inventory counts, and incident reports every shift, and my audit record is clean for four years. And it asks for calm handling of difficult people, which is most of retail management. What I would bring that a traditional admin hire might not is that I have done all three at once, on my feet, with a line of customers watching.",
    },
    {
      context: "New graduate — first professional role, thin formal experience",
      text: "I will be honest that I am early in my career, so let me point at the evidence I do have. The posting asks for someone who can learn systems quickly: in my internship last summer I was given the inventory database nobody else wanted to touch, taught myself its reporting tools from the documentation, and was producing the weekly stock report by my third week. It asks for reliability — across two years of coursework projects and a part-time job, I have not missed a deadline I committed to, and my capstone team elected me to run our schedule because of that. And it asks for clear writing, which my internship supervisor flagged in my evaluation as the reason she gave me customer-facing documentation. I am not the most experienced applicant. I am probably the one who will be fully up to speed fastest, and I can point to proof of how I learn.",
    },
    {
      context: "Returning professional — back after a caregiving break, applying for an accounting support role",
      text: "The posting asks for three things I can speak to directly. First, accuracy with high-volume transactions: before my break I processed accounts payable for a distributor handling around four hundred invoices a month, with an error rate my manager described as the lowest on the team. Second, month-end discipline — I have closed books through two year-end audits, so I know what a clean file looks like before the auditors ask. Third, the software: I kept my skills current during my time away and completed a refresher certification in the accounting platform this role uses, so there is no ramp on the tools. The gap on my resume is real, but it was caregiving, it is finished, and the skills this posting is built around are the ones I never stopped using informally and have now formally refreshed.",
    },
  ],
  variations: [
    {
      question: "Why should I hire you over the other candidates?",
      note: "You cannot know the other candidates, and the interviewer knows that — this tests whether you will disparage people you have never met. Do not speculate about rivals and never put them down. Sharpen the match instead: return to the posting's top requirements and make your evidence more specific, then let the differentiator step carry more weight. “I cannot speak for anyone else; here is what I can point to” is the right posture.",
    },
    {
      question: "What makes you a good fit for this role?",
      note: "The softer version of the same question, common earlier in the process and with HR interviewers. The structure is identical, but shift the weight: lead with fit signals — the kind of work, the team setting, the customers — and let the hard evidence support rather than dominate. Fit questions also invite one honest sentence about why this role, specifically, matches the direction you want, which the harder version does not need.",
    },
    {
      question: "Why are you the best candidate for this position?",
      note: "Superlative framing is a trap for boasting. Stay evidence-based: “best” is a claim you cannot verify, but a match this tight is something you can demonstrate. Use the same three-requirement structure, deliver it calmly, and let the specificity do the persuading. An answer grounded in their posting sounds stronger than any self-ranking, and it avoids the overclaiming that makes interviewers discount everything else you said.",
    },
    {
      question: "Sell me yourself in 30 seconds.",
      note: "The compressed version, often from busy managers or in sales-adjacent roles. Three sentences, no more: what they need most, your single strongest piece of proof for it, and the gap you fill. Cut the framework down rather than speeding it up — talking faster reads as panic, while a short, well-chosen answer reads as someone who can prioritize, which is itself part of what they are testing.",
    },
  ],
  pitfalls: [
    "Answering with adjectives — hardworking, passionate, detail-oriented — that every candidate claims and none can be checked.",
    "Listing skills the role does not ask for, which tells the interviewer you prepared a speech instead of reading their posting.",
    "Desperation signals like “I will do anything” or “I really need this job” — they shift the interviewer's focus from your value to your circumstances.",
    "Apologizing for gaps in your background instead of matching the requirements you do meet; never argue against your own candidacy.",
    "Reciting your whole resume chronologically — the interviewer has read it, and a summary that covers everything emphasizes nothing.",
    "Ending weakly with “so, yeah” or trailing off — prepare the final sentence in advance and land on it.",
  ],
  faqs: [
    {
      q: "How long should the answer be?",
      a: "Sixty to ninety seconds spoken aloud — roughly 130 to 200 words. That is enough for three matched requirements with one piece of evidence each and a closing sentence. Under thirty seconds usually means you skipped the proof; over two minutes almost always means you started reciting your resume. Time yourself rehearsing, because answers expand under nerves.",
    },
    {
      q: "What if you are underqualified on paper?",
      a: "Do not litigate the gap. Identify which requirements you meet fully and lead with the strongest matches, then address the shortfall once, briefly, with your ramp evidence: how fast you learned the comparable skill last time, what you have already started studying. Interviewers hire underqualified-on-paper candidates regularly — what they need is confidence that the specific gap is small and closable, not a general promise that you learn fast.",
    },
    {
      q: "What if you are overqualified?",
      a: "Name the real concerns yourself, because the interviewer is thinking them: will you leave when something at your level appears, and will your salary expectations break the band? Address both directly. Explain what this role gives you that the bigger title did not — the work itself, the schedule, the team — and confirm plainly that the posted range works for you. An overqualified candidate who preempts the flight-risk question is far more hireable than one who pretends the question does not exist.",
    },
    {
      q: "Can you use the same answer for every interview?",
      a: "No — and that is the point of the question. The match is the answer: three requirements from this posting, in their order, with your evidence rearranged to fit. Your proof points will repeat across interviews because your career is the same, but the selection and ordering must be rebuilt from each posting. An interviewer can tell within seconds whether an answer was built for their role or recycled from the last one.",
    },
    {
      q: "What if they ask it in the first five minutes?",
      a: "Phone screens and busy hiring managers use it early as a filter, so do not be thrown by the timing or save your material for later. Give the same structure, compressed: the top two requirements, your best proof for each, and the gap you fill, in about forty-five seconds. Hearing it early is actually useful information — it means the interviewer scores on direct match, so keep your later answers equally specific.",
    },
  ],
};

export const fiveYears: PerQuestionGuide = {
  question: "Where do you see yourself in 5 years?",
  intro: [
    "The interviewer is running a retention calculation. Hiring and training a replacement is expensive, so behind this question sits a practical one: if we invest in this person, will they still be here and growing in a few years, or is this job a layover on the way to somewhere else? Your answer is being scored less on ambition than on whether your ambition and this job point in the same direction.",
    "That is why the answer needs ambition this job can actually feed. A five-year goal the role cannot support — a different field, a function the company does not have, a business of your own — tells the interviewer to hire someone else. But the opposite failure is just as common: an answer so vague it sounds like you have never thought about staying at all. The target is a direction that grows out of the work in front of you, described specifically enough to sound planned and loosely enough to sound human.",
  ],
  framework: [
    {
      step: "Grow along the role's own axis",
      detail: "Every job has a natural direction of growth: deeper expertise, broader scope, or bigger and harder problems. Describe your five years moving along that axis, in the role's own vocabulary — the senior version of this work, the larger accounts, the harder cases, the systems nobody else fully understands. If your growth story could be told about any job at any company, it is not anchored to this one yet.",
    },
    {
      step: "Anchor to something the company visibly offers",
      detail: "Name a real feature of this employer: a senior or specialist track, a lead role the team has, a second site, a growing department. This shows you researched where you are applying, and it converts your ambition from a personal wish into a path the company already maintains. Check the careers page, the team structure, and the posting itself — postings often name the growth path outright.",
    },
    {
      step: "Show the near end of the line",
      detail: "Five years sounds like fantasy unless year one sounds concrete. Sketch what mastery of the basics looks like in your first year — the core work done reliably, the main tools learned, the point where you stop needing supervision — so the interviewer can see a line from a plausible near term to your five-year picture. Earned ambition is credible; a destination with no first steps is a daydream.",
    },
    {
      step: "Keep outside ambitions out unless they run through this job",
      detail: "A degree you plan to earn in the evenings that deepens this exact work is fine to mention. A future in a different field, a competing business, or a plan that treats this role as funding for the real goal is not — not because ambition is suspect, but because it answers the retention question the wrong way. If an outside goal genuinely runs through this job, say how; if it does not, it belongs in a different conversation.",
    },
    {
      step: "Sound like a person, not a plan document",
      detail: "Close with one or two sentences of real interest in the craft itself — the part of the work you would still enjoy at year five. Interviewers hear rehearsed ambition all day; a specific, unforced sentence about what you like doing is the part they believe. Keep the whole answer to about a minute and let it sound like a direction you are actually walking, not a slide you are presenting.",
    },
  ],
  examples: [
    {
      context: "Individual contributor — analyst aiming for senior scope, no management ambitions",
      text: "In five years I would like to be the senior analyst the team comes to for the messy problems — the forecasts that do not fit the template and the questions nobody has modeled before. This year that starts with mastering your reporting stack and owning the monthly cycle end to end. I know your team has a senior track that stays technical rather than moving into management, and that is the shape I want: deeper expertise, harder problems, and probably mentoring newer analysts on the parts I had to figure out alone. The work itself is the draw for me — I like being the person who actually knows how the numbers behave.",
    },
    {
      context: "Aspiring manager — honest about the direction, careful about the timeline",
      text: "Longer term, I do hope to move into leading a team — that is where I think my strengths in coaching and planning get the most use. But I want to be clear about the order: the next few years are about earning that from inside this role. I need to know this work at the level the team would be doing it, and to build a track record here, before managing it would make sense for anyone. If, in four or five years, I have become someone whose judgment the team already relies on, then a lead role would be a natural step rather than a jump. What I am not looking for is a fast title change — I left my last role partly because growth there meant waiting for a vacancy, and I would rather grow by scope here first.",
    },
    {
      context: "New graduate — skill-building framing, commitment to the field",
      text: "Five years out, I would like to be a fully competent practitioner in this field — not still the person asking where things are, but someone carrying their own caseload and trusted with the harder cases. Concretely, this year I want to build a solid foundation: the core procedures, the documentation standards, the judgment calls you only learn by being supervised through them. By year three I would hope to be working more independently, and by year five, helping newer staff the way I hope people here will help me now. I chose this field deliberately — it is what my degree and my placements were aimed at — so the five-year answer is honestly just more of this, at a higher level.",
    },
    {
      context: "Career changer — the answer must reassure on permanence",
      text: "I expect the interviewer behind this question is wondering whether my change is permanent, so I will answer that directly: this is the destination, not a stop. I spent eight years in hospitality and the last two deliberately retraining — evenings, a certification, and a lot of lost weekends — to move into this work. In five years I see myself established here: fully qualified, known for the compliance side of the role, which is the part I find most interesting, and probably the person who trains new starters on it. I am not keeping a door open back to my old industry. I closed it on purpose, and five years from now I expect to be deeper into this field, not halfway out of it.",
    },
  ],
  variations: [
    {
      question: "Where do you see yourself in 3 years?",
      note: "The same line with a nearer horizon, common for junior roles and faster-moving companies. Compress the arc: emphasize mastery milestones rather than destinations — the certifications completed, the core work owned independently, the first stretch responsibility. A three-year answer that ends at senior scope sounds rushed; one that ends at trusted competence sounds right.",
    },
    {
      question: "What are your long-term career goals?",
      note: "The broader version invites a wider lens, but keep the through-line inside this role's field. You can name the bigger picture — becoming a specialist, eventually leading, being known for a particular kind of work — as long as every element of it can plausibly happen from this seat. The moment the long-term goal requires leaving the field, the retention alarm sounds.",
    },
    {
      question: "How does this job fit your career plan?",
      note: "The reverse framing: instead of projecting forward, work backward from the posting. Name what this role provides that your plan requires — the client exposure, the technical depth, the team size — and show the fit is specific rather than convenient. This version rewards candidates who actually read the posting, so quote its language back where it genuinely matches your direction.",
    },
    {
      question: "Do you plan to go back to school or get certified?",
      note: "A commitment check dressed as a logistics question. Answer plainly: if you are planning study, say what, when, and how it fits around the job — evening or part-time study that deepens this work reassures rather than worries. If you are not, say so without apologizing. What interviewers fear is a full-time plan you are hiding that ends your employment in eighteen months, so clarity is the whole answer.",
    },
  ],
  pitfalls: [
    "Naming a different career entirely — you have just told them this job is a waiting room.",
    "Saying “running my own business” in a competing space, which converts you from a hire into a future competitor they would be training.",
    "Claiming the interviewer's exact job title as your five-year target; it reads as a threat or a joke, and neither helps.",
    "Total vagueness — “still here, hopefully” — which sounds like you have never thought about staying and probably will not.",
    "Over-scripted ambition that sounds like a title hunt, making them expect you to leave the moment a shinier title appears elsewhere.",
    "Joking that five years is forever, or mentioning retirement — humor about the horizon still answers the retention question badly.",
  ],
  faqs: [
    {
      q: "What if you honestly don't know where you'll be in five years?",
      a: "Direction beats destination. You do not need a title or a precise endpoint; you need a credible vector: deeper in this work, broader in scope, more trusted with hard problems. “I don't have a five-year title picked out, but I know I want to be doing this work at a higher level — the complex cases, not the routine ones” is an honest, complete answer. Nobody's five-year plan survives contact with reality, and interviewers know it; what they are checking is orientation, not prophecy.",
    },
    {
      q: "What if you do plan to leave eventually?",
      a: "Never lie — a fabricated commitment that collapses in month three burns references and reputation. But honesty has a framing: speak to the horizon the interviewer is actually asking about. If your plans are genuinely open-ended, say what would keep you growing here and that this role is your plan for the foreseeable future. If you know with certainty you will leave in a year for something incompatible, the ethical answer is also the practical one: this is probably not the right match, and discovering that now is cheaper for everyone.",
    },
    {
      q: "Is it OK to mention management ambitions?",
      a: "Yes, with two conditions. First, timeline realism: management in four or five years, after a track record in the role, sounds like growth; management as the point of the job sounds like you will be dissatisfied doing the actual work until then. Second, check the company has that path — many teams are flat, and naming a ladder that does not exist tells them you will leave frustrated. When in doubt, frame it as “growing toward leading work and mentoring others, in whatever form that takes here.”",
    },
    {
      q: "What if the company has no obvious ladder?",
      a: "Growth is not only promotion. In a flat organization, five-year growth means scope (bigger clients, harder problems), expertise (becoming the specialist others consult), and trust (mentoring new hires, owning a process end to end). Research what seniority looks like there — if the longest-serving person in the role does roughly the same job with more autonomy and harder assignments, describe exactly that. An answer built on the company's real shape always beats one built on a generic ladder.",
    },
    {
      q: "How long and how specific should the answer be?",
      a: "About 45 to 75 seconds — shorter than most candidates make it. Specific about direction and the first year, loose about the destination. Naming an exact title and date (“director by year four”) sounds rehearsed and slightly delusional; naming nothing at all sounds uncommitted. The sweet spot is two or three concrete markers along the line — what mastery looks like this year, what broader scope looks like mid-way — delivered like a person thinking, not reciting.",
    },
  ],
};
