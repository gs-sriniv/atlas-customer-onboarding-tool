# Atlas Renewal Agent — Implementation Requirements

| Field | Value |
|-------|-------|
| **Company** | PartSource |
| **Project** | proj-partsource-v1 |
| **Version** | v0 |
| **Date** | 2026-04-06 |
| **Author** | Srini V |
| **Sources** | 1 documents/meetings referenced |

---
Implementation Requirements Document for PartSource

1. Executive Summary  
PartSource is a leading provider of mission-critical healthcare equipment parts, services, and intelligence, serving over 4,000 customers with a total contract and revenue value of $120 million [1]. The company intends to automate and scale proactive renewal engagement for its long-tail segment policies under $20,000 in annual premium by deploying an AI-powered renewal agent to replicate the structured renewal methodology currently applied to enterprise accounts [1]. This initiative aims to improve renewal retention metrics, operational efficiency, and customer experience.

2. Problem Statement  
The REMI renewal team currently cannot proactively engage approximately 1,500 long-tail accounts due to constrained outreach beginning too late—from 60 to 30 days prior to renewals instead of the ideal 180 days—resulting in operational impossibility for early engagement without automation [1]. This issue stems from manual processes, a small services team, and fragmentation across four disconnected data systems—REMI Salesforce, Polaris, Access database, and Gainsight CS—hindering structured early outreach at scale [1]. Consequently, on-time renewal rates stagnate around 55% across the portfolio, and a gross retention rate (GRR) of about 80–82% remains below the 85% target, presenting a material retention risk especially on the $20 million long-tail book; nearly half (48%) of annual churn is controllable [1].

3. Key Tenets  
The renewal agent will proactively send emails, answer FAQs, share standardized documentation (including renewal agreements and policy details), and guide customers through standard renewal processes while scheduling follow-ups and appropriately routing equipment addition requests and POs [1]. Conversely, the agent will not negotiate pricing or discounts, modify contract terms or coverage, handle payment transactions, access sensitive financial data, process refunds or data deletions, approve back-dates beyond one month or large account deletions above $10,000, nor send renewals for exception accounts without review [1]. These guardrails ensure compliance and maintain relationship integrity.

4. Solution Approach  
The solution involves deploying the Atlas platform to run a structured, multi-touch, agent-driven outreach sequence beginning 180 days before renewal following a four-stage methodology: Expressed Interest, Solution Scoping, Solution Proposal, and Contracting [1]. Each stage defines specific agent actions and communication triggers delivered primarily via email, using four standardized templates and supported by phone scripts for potential phased voice outreach [1]. Reply handling categorizes responses into eight scenarios, including pricing requests, service complaints, contract modifications, billing issues, and non-responsiveness, each routed to the appropriate internal team to expedite resolution and ensure compliance with SLAs [1]. This replaces the current compressed and manual 30-60 day renewal outreach workflow, enabling scalability and methodological compliance.

5. Customer Segmentation  
The customer base divides into two key segments:  
- REMI Long Tail: Comprising approximately 1,500 policies with annual premiums under $20,000, collectively representing about $20 million in revenue. These accounts are managed by the customer service team with assisted agent coverage and are the primary focus of the automation initiative [1].  
- REMI Enterprise: Consists of roughly 2,500 policies with annual premiums of $20,000 and above, totaling approximately $100 million in revenue. These accounts are managed by sales representatives through a human-led renewal process utilizing established structured methodologies [1].

6. Success Metrics & Leading Indicators  
Success will be measured by improving the GRR from approximately 80% to 85%, increasing the on-time renewal rate from roughly 55% to a target range of 70–80%, and achieving 100% compliance with the structured proactive renewal methodology starting at T-180 [1]. Leading indicators include triggering the first outreach at 180 days before renewal across all REMI long-tail accounts, maintaining a structured outreach cadence through 30 days before renewal, and categorizing and escalating replies to appropriate teams within defined service level agreements (SLAs) [1].

7. Agent Journey & Customer Experience  
The agent journey follows five key stages aligned with time-to-renewal milestones:  
- T-180 (Expressed Interest): Agents perform sentiment checks, acknowledge renewals, and invite equipment change flags without pricing details via email, measuring customer response as a primary success indicator [1].  
- T-120 (Solution Scoping): Agents update timelines, confirm next steps, surface potential adds/deletes, and escalate pricing or discount requests, with reply rates and risk signals monitored [1].  
- T-90/T-60/T-30 (Solution Proposal and Reminder): Agents deliver renewal agreements using Renewal Queen templates, handle escalated questions, CC account managers on follow-ups, and reiterate details to create urgency, focusing on PO submission rates and reply metrics [1].  
- T-30 (Contracting): Final notification is sent, with agent handoff occurring at T-31. Human engagement intensifies from this point, especially for accounts over $25,000 for management review, with PO/signature rate as a key success metric [1].

8. Communication Strategy  
Outreach will be executed primarily via email sent from customerservice@theremigroup.com, utilizing a consultative and relationship-oriented tone consistent with the existing PartsSource customer service team to foster trust and credibility [1]. AI transparency is under consideration; typically, emails originate from a generic alias with automated responses confirming system use upon inquiry [1]. The target contacts are billing and renewal contacts held in REMI Salesforce and EMMA systems, though data quality issues due to duplicate contacts present risks [1]. Escalations route issue-specific categories—pricing to Pricing/Sales, service complaints to Sales/Service, contract concerns to Sales/Legal, and billing to Billing; non-responsiveness triggers phone outreach by sales reps [1]. Sales leadership prefers dashboard visibility over email CCs for monitoring.

9. Data Sources & Integrations  
Data supporting the renewal process is distributed across four disconnected systems—REMI Salesforce, Polaris, Access database, and Gainsight CS—with no universal unique identifier, complicating integration efforts [1]. The policy and agreement number in Salesforce may serve as a candidate key for data mapping [1]. The billing team operates separately via billing@theremigroup.com, and support history is managed through the Dispatch (EMMA) system [1]. Currently, renewal-related email replies are manually uploaded to Salesforce; a desire exists for automated timeline logging [1]. The minimum viable product (MVP) will likely employ a flat file integration approach, with advanced system integration contingent on the broader technology transformation roadmap [1]. Data retention, PII handling, customer consent, and deletion policies are to be defined pending legal consultation, especially regarding AI-initiated outreach [1].

10. Risks & Mitigations  
Risk factors include accounts possessing policies straddling the $20,000 renewal threshold, potentially causing conflicting outreach efforts requiring robust routing logic [1]. Specific geographic accounts pose compliance risks due to unique requirements: New York State mandates 90-day notice, New York City requires contract numbers, North Carolina demands prior purchase order numbers, Ohio State University renewals submit via an eStores portal, and educational institutions like K-12 have distinctive management protocols [1]. Multi-policy accounts necessitate nuanced routing rules to prevent service gaps or duplication [1]. Duplicate contact records—six to nine per account across systems—introduce communication risks and potential customer dissatisfaction [1]. Mitigation involves developing precise routing logic, updating data hygiene practices, and incorporating these constraints into the renewal agent’s decision framework.

11. Open Items  
Data on REMI-specific full-time equivalents (FTEs) currently remains undetermined, impacting resource allocation [1]. Phone voice channel inclusion for Phase 1 outreach is not confirmed, though scripts exist for potential later use [1]. Details concerning reply handling systems and unsubscribe processes are pending confirmation [1]. Legal review and definition of data retention policies, PII handling requirements, and consent frameworks for AI-driven outreach are outstanding and require urgent attention [1]. Finalization of sender details, escalation contact emails, and customer communication preferences remain to be confirmed [1].

Source:  
[1] PartsSource Implementation Data Extract
---

## Source References

[1] PartsSource- Atlas Renewal Agent Implementation Requirements  (2).docx

---

## Meeting History

| Date | Type | Conducted By | Duration | Fields |
|------|------|-------------|----------|--------|

---

## Version History

- **v0** — 2026-04-06 by Srini V

---
_Generated by Atlas Discovery Tool on 2026-04-06. All assertions are traceable to their source via [N] references above._