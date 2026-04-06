---
tags: [Okta, GainsightAtlas, AutoRenewal]
---

# Meeting Summary: Okta | GS Atlas Connect - Emily/Mariel
**Date:** April 1, 2026
**Participants:** Emily Gennrich, Mariel Gilbert, Michael Lindenberger, Jake Ellis, Sriniv, Chuks Umeani

---

## Context & Purpose

This was a knowledge transfer session with Emily Gennrich, Okta's outgoing renewals ops lead, focused on extracting as much institutional knowledge as possible before her departure. The GS (Gainsight) Atlas Connect team — Michael, Jake, Sriniv — is building an AI agent to take over key parts of Okta's auto-renewal process, and Emily is the primary subject-matter expert on how that process works today.

The session followed an earlier call the same day with Rice Klauke (another renewals team member) and was framed around understanding Emily's day-to-day process well enough to replicate it in the agent. Chuks Umeani from Okta's Business Technology (BT/TDI) team joined toward the end to address infrastructure questions around service user setup.

The overarching goal is to improve Gross Revenue Retention (GRR) by automating the initial outreach to auto-renewal customers, handling common email replies, and eventually executing save plays — like offering alternatives when customers want to opt out.

---

## Auto Renewal Program Overview

Okta's auto-renewal program automatically renews contracts without requiring manual RM involvement, provided the customer hasn't opted out. The program is governed by a checkbox in Salesforce; when checked, the system generates a quote automatically in a nightly batch at T-120 days before the renewal date. That quote is immediately approved and made primary — no human needs to touch it — and it flows directly into forecasting.

Emails currently go out via two systems:
- **Sendgrid** — sends to all auto-renewal customers (Okta and Auth Zero), but is largely an uncustomizable black box. Emails frequently don't send, hit spam filters, or fail silently. The team wants to decommission it.
- **Gainsight** — sends to Okta (and Okta.com) customers only, directing them to the Success Hub where they can view their quote. Auth Zero customers don't yet have a Success Hub equivalent, so they still need a quote attachment.

The goal is for the GS agent to replace Sendgrid's function entirely and eventually handle the full email workflow more intelligently and dynamically.

---

## Phase 1 Agent Scope

The team aligned on a phased approach. Phase 1 is not yet the full pilot — it's a foundation to establish system access, test email delivery, and start building confidence in the agent's behavior.

**Phase 1 objectives:**
- Reach out to auto-renewal customers at the appropriate time with more personalized, engaging emails
- Handle common inbound replies (access issues, billing contact changes, general questions)
- Identify when a situation exceeds the agent's scope and hand off cleanly to the RM (Dan)
- Track which customers are in the agent cohort vs. a control group

Emily was clear that the biggest GRR impact won't come from better emails alone — it will come from handling opt-out scenarios and running save plays (offering discounts, demonstrating 3% lock-in value, etc.). However, those belong to a later phase once the basic email infrastructure is proven.

**What Phase 1 is NOT:**
- Making pricing decisions or generating custom quotes
- Executing save plays (that's Dan's job for now)
- Handling micro-changes that require contract amendments (e.g., adding licenses — those require legal review)
- Fixing bugs in the auto-renewal code (that's Shona/Chuks's lane)

---

## RM Handoff Design

A significant portion of the meeting focused on how the agent hands off to the renewal manager (Dan) when it reaches the limit of what it can handle — specifically when a customer wants to opt out of auto-renewal.

**Today's opt-out flow:**
1. Customer signals they want out (via email back-and-forth with Dan)
2. Dan asks Marian or Sumer (renewal managers) via Slack to uncheck the auto-renewal checkbox
3. Dan works the account manually — save plays, discount offers, etc.
4. If the customer reverses course, Dan submits a deal support case to get them put *back* into auto-renewal (only ops can re-check the box)

**The open design question:** If the agent is playing Dan's role in that initial email exchange, how does Dan find out the handoff is happening and what context does he have?

The group converged on a design where:
- The agent handles the customer email exchange end-to-end while the conversation is within scope
- When escalation is needed, the agent adds Dan to the email thread (giving him full conversation context) and separately triggers the unchecking of the checkbox via Marian/Sumer
- Dan picks up the conversation with full context rather than starting cold

The Slack-based notification to Marian/Sumer (to uncheck the box) was raised as a future capability. For Phase 1, routing through deal support (Emily's team queue, handled by Cesar) is simpler and more auditable, though it adds to Cesar's volume. The team agreed to revisit whether direct Slack notification to Marian/Sumer is preferable once volume is better understood.

One risk flagged: if Dan is added to the email and replies, there needs to be a clear rule that his reply signals the agent should stand down entirely and not continue engaging.

---

## A/B Control Group & Salesforce Tracking

To measure the agent's impact on GRR, the team needs to distinguish between customers the agent touches and those in a control group. This requires a tracking mechanism.

Emily flagged that adding a field to the Salesforce opportunity object is politically difficult — "hot real estate" — and any such request to Shona's team should be started immediately to avoid a month-long delay. The team discussed two approaches:

- **Salesforce checkbox/flag** — visible to RMs and ops, but requires approval from Shona's team
- **Gainsight tagging** — managed on the Gainsight side by Melissa Allen's team, invisible to Salesforce users but sufficient for back-end tracking

The right choice depends on whether RMs need to be able to see which accounts are in the pilot. If yes, a Salesforce field is needed. If tracking is purely operational, Gainsight tagging may suffice. This decision was deferred to a follow-up conversation with the broader stakeholder group.

---

## Integration User & Email Alias

The agent needs a Salesforce service user with appropriate permissions and an email alias to send from. Two issues discussed:

**Email alias:** Emily surfaced that there may already be an existing `autorenew@okta` alias that was set up years ago but is largely unused and possibly going to inactive or departed employees. She recommended starting there rather than creating something new. Elizabeth (who reports to Melissa Allen) is the right person to confirm and activate it.

**Salesforce service user:** Chuks confirmed this goes through the Okta security team. Typically a service user is created for autonomous integrations like Sendgrid and Gainsight. The GS team would get a service user tied to the email alias with scoped Salesforce permissions.

Emily recommended pulling in Melissa Allen as a sponsor for this request — she's already successfully stood up a Gainsight integration user in Salesforce and can make the case to security more effectively. There may even be an existing Gainsight user that can be extended rather than creating a new one.

**Sandbox first:** Chuks confirmed the standard path is to stand up the service user in sandbox first, validate behavior, then promote to production.

---

## Exception Handling & Deal Support Routing

Emily walked through the deal support ticket system (accessible via a form in Salesforce) and the ticket categories relevant to the agent:

- **"Change Auto Renewal Status"** — used when an RM or manager needs to opt a customer out or back in. This is the primary ticket type the agent would interact with, categorized as P2 (not urgent).
- **"Auto Renew Help / Hub Issues"** — a newer category Emily added to track Success Hub access problems. She wants metrics on this to assess whether her team needs to own it or if Marian/Sumer can absorb it.

For Phase 1, when a customer needs to be taken out of auto-renewal, the agent would submit a deal support ticket with all relevant information rather than acting directly. Later phases could automate more of the Salesforce changes.

Emily also shared that she has pre-built email response templates for common Success Hub access issues (e.g., billing contact changes, login problems). She offered to share these as a starting point for the agent's canned responses.

---

## Auth Zero vs. Okta Customer Scope

The auto-renewal program covers both Okta (Okta.com) and Auth Zero customers, but they have different setups:

- **Okta customers** — have the Success Hub; quotes are accessible via a link in the email; no attachment needed
- **Auth Zero customers** — no Success Hub yet; quotes must be attached to the email; a separate Auth Zero Success Hub is a known future initiative (Emily and Chuks have discussed it)

For Phase 1, the team leaned toward starting with Okta customers only, where the infrastructure is more mature. Auth Zero would be added in Phase 2. However, Emily noted that since Sendgrid currently sends to everyone indiscriminately, moving to Gainsight agent emails only for the Okta cohort means Auth Zero customers would continue getting Sendgrid emails for now — which is acceptable as a transitional state.

---

## Playbook & Enablement Materials

The RMs referenced a "playbook" during the earlier Rice call. Emily noted there are likely two or three different playbooks across Okta relevant to renewals, and she isn't sure which one the RMs are actually using day-to-day. The team should follow up directly with the RMs to identify the right one.

Emily also mentioned that Gainsight slides already contain all the email copy for Gainsight-sent messages. Sendgrid copy exists but requires zooming into screenshots since the system is a black box. Brad was identified as the right person to share the Sendgrid templates.

---

## Action Items & Next Steps

| # | Action | Owner | Notes |
|---|---|---|---|
| 1 | Set up meeting with Chuks + Shona to discuss service user setup in sandbox | Michael / Jake | Include Melissa Allen as sponsor; she has an existing Gainsight user that may be extensible |
| 2 | Confirm and activate `autorenew@okta` email alias; identify current members | Emily → Elizabeth (Melissa Allen's team) | Emily to flag to Brad/Melissa Allen; Elizabeth and Puna are right contacts |
| 3 | Add Chuks to the GS Gainsight Slack channel and Friday meeting invite | Mariel | Done during call |
| 4 | Stand up a cohort definition conversation with Elizabeth, Puna, Melissa Allen | Michael | Needed to define A/B split (volume vs. ARR), Okta vs. Auth Zero scope |
| 5 | Start Salesforce pilot flag field request with Shona's team | Jake / Michael | High lead time — start now; Gainsight tagging may be fallback |
| 6 | Share Sendgrid email templates | Brad (via Emily) | Emily to ask Brad; Gainsight copy is already in existing slides |
| 7 | Share Emily's canned Success Hub response templates | Emily | Already built; useful starting point for agent responses |
| 8 | Follow up with RMs to identify which playbook they're using | Jake / Michael | Multiple playbooks exist at Okta; need the one the renewals team actually uses |

---

## Key Themes

- **Emily is the institutional knowledge** — She is leaving and is the single source of truth on how the auto-renewal program works end-to-end. The urgency of this call was to capture that before she's gone; her replacement will be learning on the job alongside the agent buildout.
- **Phase boundaries matter** — The team is deliberately scoping Phase 1 to email + basic reply handling, deferring save plays and discount logic to later phases. Emily pushed back gently, noting GRR won't move much from email polish alone — save plays are where the needle moves.
- **Infrastructure blockers are real** — Service user setup, email alias confirmation, and Salesforce field requests all have non-trivial lead times. These need to be initiated in parallel with technical buildout, not after.
- **Sendgrid is the thing everyone wants to kill** — It's unreliable, uncustomizable, and expensive. The agent replacing it is framed as an unambiguous win, and Emily noted this has been a known desire for years.
- **Control group design is unsolved** — How to tag and track which customers are in the agent pilot vs. control group is a decision that touches Salesforce politics, Gainsight capabilities, and RM visibility needs. It needs a dedicated conversation before the pilot launches.
