# Meeting Summary: Okta | GS Goals and Strategy Alignment
**Date:** March 23, 2026
**Participants:** Shantan Reddy, Michael Lindenberger, Jake Ellis, Melissa Allen (Okta)

---

## Context & Purpose

This was a one-on-one alignment session between the GS team (Shantan, Michael, Jake) and Melissa Allen, Okta's Director of Digital CS and Gainsight owner, who had missed the initial project kickoff call. The goal was to get her perspective on the project's strategic direction, understand her priorities and hypotheses on what would move the needle, and clarify where she wants to be involved versus kept informed. The session was also an opportunity for the GS team to pressure-test their current understanding of the renewal journey against a senior Okta stakeholder.

---

## 1. Scope: GRR vs. NRR

The GS team's current framing targets GRR improvement from 78% to 80%. Shantan raised the question of whether to expand scope to also touch NRR, given that AEs are being notified of potential upsell opportunities at T-150. Melissa's clear direction: **keep NRR out of Phase 1**. GRR is the immediate focus; once the motion is running smoothly, NRR becomes a natural Phase 2 addition.

She reinforced this with an organizational note: AEs now have renewals in their compensation structure for the first time this year, meaning they'll be more engaged in the process than in prior years. This makes Phase 2 timing well-suited for layering in NRR.

---

## 2. Renewal Journey & Touchpoints

The GS team's current understanding of the renewal journey was confirmed as accurate:
- **T-150:** Internal notification to AEs about upcoming renewal; compliance opportunities flagged
- **T-90:** Auto-renew customers enter a defined cadence (90, 60, 45, 5 day touches)
- **T-90 to T-60:** AEs can action upsell or growth opportunities before customers flow into the auto-renew path

Melissa confirmed there are **no customer-facing touchpoints between T-150 and T-90** for the long-tail segment. She noted this as a gap worth addressing — specifically, the internal T-150 notification could be enriched with customer health signals (e.g., from Staircase, which they are currently piloting) rather than being a generic alert.

Adoption campaigns are intentionally avoided near the renewal window to avoid sending mixed messages (e.g., telling a customer they're underadopting when you're simultaneously asking them to renew).

---

## 3. Segment & Product Scope: Okta vs. Auth0

A key scoping decision was reached: **Phase 1 will target Okta-only auto-renew customers**. Auth0 (also called CIC — Customer Identity Cloud) is more complex for several reasons:
- Auth0 customers access a different, separately managed portal with less Gainsight visibility
- The email attachment mechanism (via SendGrid) is not well-connected to Auth0 renewal flows
- Ownership of outreach to Auth0 customers is less clearly defined internally

The team discussed using this pilot as an A/B test — splitting the long-tail Okta auto-renew cohort and using one half as a control group. Exact cohort size was not confirmed; Melissa estimated the rough scale is around 5,000 customers and ~$60M in ARR but deferred to the core team for precise numbers.

Terminology note for the team: **WIC/CIS = Okta**, **CIC = Auth0**.

---

## 4. The Auto-Renew Opt-Out Problem — Biggest Opportunity

The most important strategic insight from this session: **any customer reply to a renewal email automatically removes them from auto-renew**, regardless of the nature of the reply. The customer is then placed in a queue for a CGS contractor to handle manually — and they cannot re-enter auto-renew until the next cycle.

This creates a compounding problem: simple, answerable questions (e.g., "who is my contact?", "can I increase my license count?") drain contractor bandwidth and delay renewals unnecessarily. This is where Melissa sees **the highest bang for buck** for the agent.

**The primary value proposition for Phase 1:** The agent handles known, frequent reply categories autonomously or semi-autonomously, keeping customers in the renewal flow and dramatically reducing the manual triage load on the 7 CGS contractors based in Romania.

Melissa also floated an enhancement: even when a customer must be pulled out of auto-renew (escalation required), the agent should prepare a briefing for the contractor — pulling together everything the contractor needs (customer history, the nature of the request, recommended next step) so they can respond quickly and confidently without digging through systems. This reduces total time-to-resolution even for escalated cases.

---

## 5. Reply Categories

Emily (see Key Contacts below) has an existing list of common reply scenarios. The examples Melissa shared from memory:
- Customer requests removal from auto-renew
- Incorrect/outdated contact on the account
- Quantity changes (up or down)
- Customer is pursuing an upsell (needs a different process)
- Okta for Good customers (nonprofit pricing, special handling)

The GS team should extract a comprehensive version of this list from Emily before she leaves.

---

## 6. Personalization & Value Realization

Melissa's "dream state" for email personalization: inject a value realization snapshot into the renewal email showing what the customer has gotten out of Okta over the past 12 months or their contract lifetime. This would counteract the current generic, transactional tone of renewal emails and reduce the likelihood of customers questioning whether to renew.

Current emails are described as extremely basic — close to "you're renewing, please confirm." Any improvement would be meaningful.

**Data pathway for personalization:**
- Gainsight holds most relevant customer data
- The Digital Success team uses **Matic**, which pulls from both Gainsight and Snowflake/Databricks, to produce value snapshots for enterprise customers
- GS has access to Databricks and Gainsight data — so the same underlying data is reachable
- Melissa proposed a quick conversation between GS and her Digital Success team to explore whether value snapshot logic could be adapted for this use case

**Segmentation logic for personalization:** Melissa suggested binary segmentation — customers showing positive value signals get an enriched email; those who aren't don't get a message that highlights their low adoption (which could prompt them to cancel). Standard template for one group, value-enriched template for the other.

Melissa flagged that the only reason Okta currently uses SendGrid (rather than sending directly from Gainsight) is because Gainsight can't dynamically attach unique per-customer contract documents. Everything else can be handled within Gainsight.

---

## 7. Discount Guardrails (Phase 2 Discussion)

The team surfaced a Phase 2 concept: giving the agent authority to offer a small discount (e.g., 5%) to customers at risk of not renewing, within the guardrails already granted to human renewal reps (who can offer up to a threshold without exec approval). Melissa reacted positively — her framing: once the pilot has established trust through smooth operation, it makes sense to give the agent the same latitude a human rep would have, with a human notification but no required approval for sub-threshold discounts. Anything requiring exec sign-off would always escalate.

This was flagged as a Phase 2 item pending Dan's approval and a successful Phase 1.

---

## 8. Systems & Data

| System | Role |
|---|---|
| **Gainsight** | Primary platform — email sending, timeline logging, CS data, CTAs; should be the system of record for all renewal communications |
| **Salesforce** | Gainsight auto-saves all outbound emails here as well; AE and renewal opportunity data |
| **SendGrid** | Used only for dynamic contract attachment (limitation in Gainsight); likely replaceable if GS can solve attachment |
| **Clary** | Source of contracts/attachments |
| **Snowflake / Databricks** | Data layer accessed by Matic and potentially by GS for value signals |
| **Matic** | Digital Success team's personalization/value snapshot tool; potential source of logic to adapt |
| **Staircase** | Okta is piloting this; could enrich internal T-150 notifications with customer health signals |

Melissa noted that Gainsight is the preferred email hub — it provides a single timeline view of all customer touchpoints, which CSMs and renewal managers rely on. Data from Gainsight is also mirrored to Salesforce automatically.

---

## 9. Key Contacts & Org Context

| Name | Role | Notes |
|---|---|---|
| **Melissa Allen** | Director, Digital CS & Gainsight owner | Primary strategic contact; involved in config/advisement, not renewal ops detail |
| **Emily** | Renewal team (detail TBD) | Has the deepest institutional knowledge of the renewal process; **leaving Okta in ~1 month** — must prioritize time with her |
| **Meriel/Mariel** | VP of Renewals | New to the role; Emily's successor in terms of process ownership |
| **Melissa Zakum** | Renewal Ops | Key partner for success metrics and scope decisions |
| **Brad** | PM (on Melissa Allen's team) | Helping project-manage the pilot from Okta's side |
| **Dan** | Executive (approvals) | Required for any discount offers above the renewal rep threshold |
| **CGS Romania team** | 7 contractors | Handle auto-renew exceptions; queue-based today, no CTA in Gainsight |

**Urgent:** Emily's departure is the most time-sensitive constraint. All knowledge capture sessions with her should be prioritized immediately.

---

## Action Items & Next Steps

| # | Action | Owner | Notes |
|---|---|---|---|
| 1 | Start email alias provisioning process this week | Melissa Allen (Okta IT) | Needs a name, distribution list; also requires a Gainsight user account tied to the alias |
| 2 | Extract full reply category list from Emily | GS (Jake/Michael) | Emily leaving in ~1 month — highest priority knowledge transfer |
| 3 | Schedule dedicated sessions with Emily before she departs | GS team | She has the most detailed process knowledge |
| 4 | Discuss value snapshot feasibility with Melissa's Digital Success team | GS team | Quick exploratory call — can Matic/Databricks data be used to enrich renewal emails? |
| 5 | Confirm pilot cohort composition and size | GS + Meriel/Melissa Zakum | Okta-only auto-renew; A/B split; exact count TBD |
| 6 | Explore Gainsight contract attachment capability with Okta product/engineering | GS team | Could eliminate SendGrid dependency |
| 7 | Confirm scope decision on T-150 engagement | GS + core Okta team | Team has questions; escalate to Meriel/Melissa Zakum/Brad if needed |

---

## Key Themes

- **Auto-renew opt-out is the core pain point** — any reply removes the customer from the flow; fixing this is where the agent delivers the most immediate value
- **Phase 1 is narrowly scoped by design** — Okta-only, auto-renew segment, GRR focus; NRR and Auth0 are deliberate Phase 2 decisions
- **Emily's departure creates urgency** — she is the single point of knowledge for the renewal process; knowledge transfer must begin immediately
- **Gainsight is the intended system of record** — all agent communications should flow through and be logged in Gainsight, not bolted on externally
- **Trust before autonomy** — discount guardrails and expanded agent authority are desired but contingent on Phase 1 proving reliable; the team is thinking in phases deliberately
