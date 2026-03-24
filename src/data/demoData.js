export const DEMO_CONVERSATIONS = {
  welcome: [
    { role: "assistant", content: "Welcome to Atlas! I'm your Discovery Guide, and I'll walk you through a structured conversation to design your ideal renewal agent. Think of this as a blueprint session — by the end, we'll have everything needed to configure an agent that fits your exact process.\n\nTo kick things off, tell me a bit about your company — what do you do, who are your customers, and what brought you to Atlas?" },
    { role: "user", content: "Hey! We're NovaTech Solutions — we sell a workforce management SaaS platform to mid-market companies, mostly in logistics, manufacturing, and retail. We've been growing fast but our renewal process is a mess and we're losing customers we shouldn't be losing. Our VP of CS heard about Atlas from a peer at a conference." },
    { role: "assistant", content: "Great to meet you, NovaTech! Workforce management for logistics, manufacturing, and retail — that's a space where renewals can get complicated fast given the diversity of use cases. It sounds like growth has outpaced your renewal infrastructure, which is exactly the kind of problem Atlas was built for. Let's move into the Company Overview to get the full picture." },
  ],
  company: [
    { role: "assistant", content: "Let's start mapping out the landscape. How many total customers does NovaTech have today, and roughly what's your total contract value across the book of business?" },
    { role: "user", content: "We have about 2,400 customers. Total ARR is around $38M. Our average deal size is about $16K but it ranges widely — some SMBs at $3K, some enterprise at $120K+." },
    { role: "assistant", content: "That's a solid book — $38M ARR across 2,400 customers with a wide ACV spread. That range will matter a lot for how we design the agent's approach by segment. What are your current GRR and NRR numbers, and how large is the team managing renewals today?" },
    { role: "user", content: "GRR is 88% which we're not happy about — industry benchmark is more like 92%. NRR is 103%. We have 6 CSMs and 2 dedicated renewal reps. The CSMs each manage about 300-400 accounts, so the lower-value ones get almost no proactive attention." },
    { role: "assistant", content: "So 8 people managing 2,400 accounts, with GRR at 88% against a 92% benchmark — that 4-point gap on $38M is roughly $1.5M in preventable churn annually. And with CSMs stretched across 300-400 accounts each, the long-tail customers are renewing on autopilot. What's the primary use case you're envisioning for Atlas?" },
    { role: "user", content: "Primarily the long-tail. We want the agent to handle the full renewal motion for our SMB segment — about 1,600 accounts — so the CSMs can focus on strategic accounts. But we'd also love it to assist on mid-market accounts as a first-touch before the CSM engages." },
  ],
  segments: [
    { role: "assistant", content: "You've mentioned SMB and enterprise — how do you formally segment your customers today?" },
    { role: "user", content: "Three tiers. Enterprise is $50K+ ACV, about 120 customers, $14M ARR — dedicated CSM plus renewal rep. Mid-Market is $10K-$50K ACV, roughly 680 customers, $15M ARR — pooled CSM model. SMB is under $10K ACV, about 1,600 customers, $9M ARR — basically self-serve with Marketo emails." },
    { role: "assistant", content: "Clean three-tier model. SMB is primary agent territory, Mid-Market is agent-assisted, Enterprise stays human-led. Do you also segment by health score, geography, or industry?" },
    { role: "user", content: "Yes — Gainsight health score 0-100, anything below 60 is at-risk regardless of segment. About 30% of customers are EMEA, which needs different timezone handling and GDPR compliance." },
  ],
  value: [
    { role: "assistant", content: "What's the single biggest challenge your renewal team faces today?" },
    { role: "user", content: "SMB customers fall through the cracks. Nobody proactively reaches out before renewal. They get a Marketo email 30 days out and that's it. By the time we notice they haven't renewed, they've already found an alternative or their champion has left." },
    { role: "assistant", content: "So the core pain is reactive engagement on 1,600 accounts with no proactive touch. What's driving that — capacity, tooling, or something else?" },
    { role: "user", content: "Capacity, 100%. The CSMs are underwater with strategic accounts. We tried hiring but the economics don't work — you can't justify a $90K CSM salary to manage $5K ACVs." },
    { role: "assistant", content: "Classic scale problem — unit economics don't pencil for human coverage at that ACV level. What's this costing you in real numbers?" },
    { role: "user", content: "Of SMB accounts that churned, about 40% had no engagement in the 90 days before renewal. That's roughly $600K in ARR from accounts nobody even talked to. On mid-market, about 25% of renewals close after the contract end date, creating revenue recognition headaches." },
    { role: "assistant", content: "$600K in preventable SMB churn plus late mid-market renewals — concrete, measurable problems. If Atlas works perfectly, what does 6 months from now look like?" },
    { role: "user", content: "GRR from 88% to 91% would be a huge win. And getting 80% of mid-market renewals closing on time instead of 75%. Honestly even just consistent outreach to every account would be a step change." },
  ],
  current: [
    { role: "assistant", content: "Walk me through what happens today when a renewal is approaching — starting from the earliest touchpoint." },
    { role: "user", content: "Enterprise: CSM starts at T-120 with a business review, renewal rep takes over at T-60. Mid-Market: CSM gets a Gainsight CTA at T-90 but often doesn't act until T-45. SMB: just a Marketo email at T-30 and hope they click the renewal link." },
    { role: "assistant", content: "Strong enterprise motion, delayed mid-market, essentially no SMB motion. What systems are involved?" },
    { role: "user", content: "Salesforce for CRM — all opportunities and contracts. Gainsight for health scores and CTAs. Marketo for email campaigns. Pendo for product usage. DocuSign for contracts. Zendesk for support. Plus Snowflake as a data warehouse." },
    { role: "assistant", content: "Solid stack — rich data picture for Atlas. When in the lifecycle are you most likely to lose a customer?" },
    { role: "user", content: "Two patterns: customers with bad support experiences in the last 6 months, and customers who stopped using advanced features. Usage drops about 60-90 days before renewal and that's when they start evaluating competitors." },
  ],
  journey: [
    { role: "assistant", content: "Let's build the agent's journey. When should the first touch happen, and what should it look like?" },
    { role: "user", content: "For SMB, first touch at T-90. A personalized email referencing their usage, acknowledging the partnership, mentioning the renewal timeline. If health score is below 60, different tone acknowledging things haven't been perfect." },
    { role: "assistant", content: "Step 1: personalized email at T-90, branching on health score. What happens if they don't engage?" },
    { role: "user", content: "Follow up at T-75 with a value angle — specific metrics like 'your team logged 4,200 shifts last quarter.' If still nothing by T-60, phone call to confirm the right contact and gauge interest. Once engaged, shift to quote flow." },
    { role: "assistant", content: "T-90 email, T-75 value follow-up, T-60 phone if no engagement, then pivot to quote. After the quote goes out?" },
    { role: "user", content: "Quote at T-45 with DocuSign link. Nudge at T-35 if unsigned. At T-15 if still unsigned, escalate to a human — pooled CSM for mid-market or flag as at-risk for SMB. Agent shouldn't chase past T-15 alone." },
  ],
  replies: [
    { role: "assistant", content: "When customers reply to outreach, what are the most common response types?" },
    { role: "user", content: "About 40% ask about pricing or request a discount. Then 'I need to check with my boss' — buying signal but needs follow-up. Technical complaints maybe 15%. Occasionally cancellation threats or competitor mentions." },
    { role: "assistant", content: "For discount requests — can the agent offer anything, or is every pricing discussion a handoff?" },
    { role: "user", content: "Agent can offer up to 10% for accounts under $10K ACV if they commit within 7 days. Beyond that, goes to renewal rep. Cancellation and competitor mentions always escalate immediately. Technical issues — try knowledge base first, route to support if there's an open ticket." },
  ],
  guardrails: [
    { role: "assistant", content: "What should the agent absolutely NEVER do?" },
    { role: "user", content: "Never promise a feature or roadmap item. Never agree to custom contract terms. Never share another customer's data. Never discuss competitor pricing. Never contact customers on the legal suppression list." },
    { role: "assistant", content: "Clear red lines. What should it handle confidently without your team?" },
    { role: "user", content: "Send emails and calls on schedule. Answer FAQs from knowledge base. Share docs and release notes. Schedule CSM meetings. Update Salesforce. Apply the standard 10% retention discount. Send quotes and DocuSign links. Log everything in Gainsight." },
  ],
  comms: [
    { role: "assistant", content: "How should the agent sound? What tone should emails strike?" },
    { role: "user", content: "Professional but warm — helpful colleague, not salesperson. Sign as 'The NovaTech Renewals Team,' not a fake person name. Avoid stiff phrases like 'as per our records.' Natural language." },
    { role: "assistant", content: "Got it — professional-warm, real team voice. What about channel config?" },
    { role: "user", content: "Email from renewals@novatech.io. Replies go to a shared inbox the agent monitors. Phone only for T-60 calls and escalations. Caller ID shows main office number. Recording disclosure for EMEA. Voicemails under 30 seconds referencing the previous email." },
  ],
  data: [
    { role: "assistant", content: "Where does your customer data live today?" },
    { role: "user", content: "Salesforce is master for accounts, contacts, opportunities. Gainsight for health scores and CTAs. Pendo feeds usage data into Gainsight. Marketo for email engagement. Zendesk for support tickets. DocuSign for contracts. Snowflake aggregates everything." },
    { role: "assistant", content: "Rich ecosystem. On compliance — you mentioned EMEA. What requirements apply?" },
    { role: "user", content: "GDPR: consent tracking, right-to-erasure, DPAs. AI disclosure: footer in emails saying outreach may be AI-assisted. Call recordings need explicit consent. We have a global do-not-contact list in Salesforce. Data retention: 3 years for interactions, 7 years for contracts." },
  ],
  roi: [
    { role: "assistant", content: "Based on everything we've discussed, what improvement would make Atlas a clear win?" },
    { role: "user", content: "SMB GRR from 84% to 90% — about $540K saved. Mid-market on-time rate from 75% to 85% saves finance about 20 hours/month. Plus freeing up about 1.5 FTE of CSM time." },
    { role: "assistant", content: "Strong case. SMB churn prevention ~$540K, 1.5 FTE recaptured ~$135K, finance time savings, total first-year impact $700K+. What's the current cost per renewal interaction?" },
    { role: "user", content: "About 45 minutes per renewal end-to-end at $45/hour — roughly $34 per renewal. For 1,600 SMB accounts, that's $54K in labor per cycle. If the agent handles 80% autonomously, that's $43K in direct savings per cycle on top of retention improvements." },
  ],
};

export const DEMO_EXTRACTED = {
  company: { company_description: "NovaTech Solutions — workforce management SaaS for mid-market logistics, manufacturing, and retail", total_customers: 2400, total_revenue: "$38M ARR", grr_nrr: "GRR 88% / NRR 103%", team_size: "8 (6 CSMs + 2 renewal reps)", primary_use_case: "Full SMB renewal motion; first-touch assist on mid-market" },
  segments: { segments: [
    { name: "Enterprise", definition: "ACV $50K+", count: 120, revenue: "$14M", agent: "No", workflow: "Dedicated CSM + renewal rep" },
    { name: "Mid-Market", definition: "ACV $10K–$50K", count: 680, revenue: "$15M", agent: "Assist", workflow: "Pooled CSM, agent first-touch" },
    { name: "SMB", definition: "ACV <$10K", count: 1600, revenue: "$9M", agent: "Yes — fully automated", workflow: "Currently Marketo email only" }
  ]},
  value: { pain: "SMB accounts get no proactive outreach — 1,600 accounts renewing on autopilot", root_cause: "Capacity constraint: 8 people for 2,400 accounts; unit economics don't justify human CSMs at $5K ACV", consequence: "$600K ARR lost from zero-engagement SMB churn; 25% of mid-market renewals close late", future_state: "GRR 88% → 91% in 6 months; 80% mid-market on-time renewal rate", leading_indicators: "100% account outreach coverage; reply rate improvement", success_criteria: "GRR 91%, on-time rate 80%, $600K churn reduction" },
  current: { renewal_workflow: "Enterprise: T-120 CSM → T-60 renewal rep. Mid-Market: T-90 CTA, often delayed to T-45. SMB: T-30 Marketo email only.", core_systems: "Salesforce, Gainsight, Marketo, Pendo, DocuSign, Zendesk, Snowflake", pain_points: "No SMB engagement; delayed mid-market follow-up; single-channel approach", working_well: "Enterprise process is solid; Gainsight health scores reliable", churn_triggers: "Bad support experience (last 6 months); advanced feature usage drop 60-90 days pre-renewal", risks: "Multi-system data; EMEA compliance; CSM change management" },
  journey: { journey_steps: [
    { step: 1, timing: "T-90", channel: "Email", trigger: "Renewal within 90 days", action: "Personalized email, branch on health score", metric: "Open/reply rate" },
    { step: 2, timing: "T-75", channel: "Email", trigger: "No engagement after 15 days", action: "Value-led follow-up with usage stats", metric: "Open/reply rate" },
    { step: 3, timing: "T-60", channel: "Phone", trigger: "No email engagement", action: "Check-in call, confirm contact", metric: "Connection rate" },
    { step: 4, timing: "T-45", channel: "Email", trigger: "Engagement or scheduled", action: "Quote with DocuSign link", metric: "Quote acknowledgment" },
    { step: 5, timing: "T-35", channel: "Email", trigger: "Unsigned after 10 days", action: "Urgency nudge", metric: "Signature rate" },
    { step: 6, timing: "T-15", channel: "Handoff", trigger: "Still unsigned", action: "Escalate to human", metric: "Escalation response time" }
  ]},
  replies: { reply_categories: [
    { category: "Discount request (~40%)", instructions: "Offer up to 10% for <$10K ACV, 7-day commit. Else → renewal rep.", handoff: "Conditional" },
    { category: "Manager approval needed", instructions: "Follow up in 5 days, offer summary doc", handoff: "No" },
    { category: "Technical complaint (~15%)", instructions: "Resolve from KB; if open ticket → Zendesk", handoff: "Conditional" },
    { category: "Cancellation intent", instructions: "Immediate human escalation", handoff: "Yes — always" },
    { category: "Competitor mention", instructions: "Immediate human escalation", handoff: "Yes — always" }
  ], handoff_scenarios: [
    { trigger: "Discount >10% or ACV >$10K", team: "Renewal rep" },
    { trigger: "Cancellation or competitor", team: "CSM + renewal rep", sla: "Same business day" },
    { trigger: "Unresolved at T-15", team: "Pooled CSM" }
  ]},
  guardrails: { will_do: ["Proactive emails and calls","Answer FAQs from KB","Share docs and release notes","Schedule CSM meetings","Update Salesforce","Apply 10% retention discount (<$10K)","Send quotes and DocuSign links","Log interactions in Gainsight"], will_not_do: ["Promise features/roadmap","Custom contract terms","Share other customer data","Discuss competitor pricing","Contact legal-suppressed accounts","Make legal commitments","Process refunds"] },
  comms: { voice_style: "Professional-warm, helpful colleague. 'The NovaTech Renewals Team' signature. No fake names.", channels: { email: "renewals@novatech.io → shared inbox", phone: "T-60 + escalations only, main office caller ID, EMEA recording disclosure, <30s voicemails" }, contact_targeting: "Primary billing contact, then Gainsight champion", templates: "Initial outreach, value follow-up, at-risk variant, quote delivery, nudge, post-engagement summary" },
  data: { data_sources: { accounts: "Salesforce", health_scores: "Gainsight", usage: "Pendo → Gainsight", email: "Marketo", support: "Zendesk", contracts: "DocuSign", warehouse: "Snowflake" }, compliance: { gdpr: "Consent tracking, right-to-erasure, DPAs", ai_disclosure: "Email footer required", call_recording: "Explicit consent (EMEA mandatory)", suppression: "Salesforce DNC list", retention: "3yr interactions, 7yr contracts" } },
  roi: { impact_projection: { smb_churn_prevention: "$540K (GRR 84% → 90%)", fte_recaptured: "1.5 FTE (~$135K)", finance_savings: "20 hrs/month", total_first_year: "$700K+" }, roi_inputs: { accounts_in_scope: 1600, revenue_in_scope: "$9M", cost_per_renewal: "$34", automation_target: "80%", labor_savings_per_cycle: "$43K" } },
};
