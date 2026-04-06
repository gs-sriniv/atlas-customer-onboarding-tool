# Atlas Renewal Agent — Implementation Requirements

| Field | Value |
|-------|-------|
| **Company** | Okta Corp |
| **Project** | proj-okta-v1 |
| **Version** | v1 |
| **Date** | 2026-04-06 |
| **Author** | Shantan Reddy |
| **Sources** | 7 documents/meetings referenced |

---
# Okta Corp. – Implementation Requirements Document

## 1. Executive Summary  
Okta Corp. seeks to enhance its auto-renewal program for Okta-only customers by automating initial outreach and reply handling through an AI agent. This initiative aims to improve Gross Revenue Retention (GRR) from 78% to 80% by reducing manual intervention and preventing premature removal of customers from auto-renew [2]. The Phase 1 pilot excludes Auth0 customers and focuses on a controlled cohort of approximately 5,000 customers generating $60M in ARR [2].

## 2. Problem Statement  
Currently, any customer reply to a renewal email automatically removes them from the auto-renew program, regardless of reply nature, triggering manual triage by a limited team of seven CGS contractors in Romania. This leads to delayed renewals, inefficient bandwidth utilization, and negatively impacts GRR [2]. The root cause includes process design where replies cause forced opt-outs, coupled with tooling limitations, particularly with SendGrid’s unreliable email delivery and Salesforce service user setup complexities [2]. This manual workload bottleneck adversely affects contract renewals and overall revenue retention rates [2].

## 3. Key Tenets  
The AI agent will autonomously or semi-autonomously handle known frequent reply categories such as contact updates, quantity changes, and simple questions to keep customers in the renewal flow [4]. The agent will send personalized, engaging emails timed appropriately, enriched with value realization snapshots as feasible [2]. It will identify inquiries beyond its scope and escalate cleanly to Renewal Managers (RMs), particularly for opt-outs or save plays [4]. The agent will submit deal support tickets instead of directly unchecking auto-renew checkboxes, following clear guardrails to maintain process integrity [4]. Pricing decisions, custom quotes, save plays, and bug fixes in the auto-renew system are explicitly out of scope for this phase [4].

## 4. Solution Approach  
The solution employs Gainsight as the primary email hub and system of record for tracking all renewal communications, with Salesforce maintaining opportunity and AE data [2]. Automated quote generation occurs at T-120 days pre-renewal via a Salesforce checkbox controlling renewal eligibility [1]. The agent initiates personalized outreach emails at T-150, enhancing them with customer health signals from pilot data such as Staircase, and value snapshots potentially drawn from Matic [4]. It autonomously handles frequent inbound replies—like billing contact changes or access issues—using pre-built email templates crafted by experienced renewal leads [4,7]. When customers opt out, the agent escalates by adding the RM (Dan) to the email thread and submits a deal support ticket to uncheck the Salesforce renewal checkbox [5]. Manual interventions are thus minimized, improving workflow efficiency and customer experience [1].

## 5. Customer Segmentation  
Phase 1 targets Okta-only auto-renew customers, estimated at roughly 5,000 accounts contributing $60M ARR, excluding Auth0 customers due to their usage of a separate portal and system complexity [2]. These customers operate under assisted agent coverage with structured outbound communication workflows mediated by email [2]. Auth0 and Okta for Good customers are excluded from initial implementation due to distinct pricing models, portals, and special handling considerations [2,4]. This segmentation enables a focused pilot to address the specific pain points for the most critical renewal cohort while limiting risk and complexity.

## 6. Success Metrics & Leading Indicators  
Success will be measured by an improvement in Gross Revenue Retention from 78% to 80%, reflecting fewer premature opt-outs and increased renewal completion rates [2]. Additional metrics include a measurable reduction in manual triage workload on the seven CGS contractors and smoother escalation processes for complex cases [2]. Leading indicators comprise increased adoption of personalized, engaging emails enriched with value realization snapshots, autonomous handling of common inbound replies, and effective handoff to Renewal Managers without customer experience degradation [1]. Establishing trust in agent operations will enable expansion of its authority in future phases toward discount and save play execution [2].

## 7. Agent Journey & Customer Experience  
At T-150 days prior to renewal, the agent enriches internal AE notifications with customer health signals and initiates personalized outreach emails to auto-renew customers [4]. Customers receiving these communications can reply with common inquiries, which the agent handles autonomously or semi-autonomously, such as billing contact changes or access issues, based on pre-defined templates [4,7]. If a customer replies indicating a desire to opt out, the agent escalates immediately by adding the Renewal Manager to the email thread and submitting a deal support ticket to initiate manual opt-out processing [4,5]. Throughout, the agent ensures continuity, reduced delay, and preserves conversational context, thereby improving customer engagement and retention.

## 8. Communication Strategy  
Renewal communications today are basic, transactional emails primarily sent via Gainsight, with SendGrid used only for contract attachment functionality slated for deprecation [6]. The primary outbound channel is email through the 'autorenew@okta' alias, ensuring centralized control and consistent branding [6]. The agent uses pre-existing and newly derived email templates to personalize messages, injecting value realization snapshots designed to avoid mixed signals such as overlapping adoption campaigns near renewal dates [2,4]. When escalation occurs, internal processes leverage email thread inclusion and Slack notifications for operational transparency [6]. Contacts targeted include billing contacts, renewal managers, and internal contractors managing exceptions [6].

## 9. Data Sources & Integrations  
Key systems include Gainsight, the primary platform for customer success data, email sending, timeline logging, and CTAs, serving as the official system of record for renewal communications [2]. Salesforce supports CRM data and opportunity management, with gainsight auto-saving outbound emails into the system [2]. SendGrid remains in use solely for dynamic contract attachments but is planned for replacement due to unreliability [2]. Contract attachments originate from Clary, while the data lake is maintained in Snowflake and Databricks, providing integration points for Matic's personalization engine and Staircase’s pilot health signals [2]. Coordination with Okta’s security team is required for the setup of related email aliases and Salesforce service users, critical for automation and security compliance [2].

## 10. Risks & Mitigations  
Significant risks include the imminent departure of Emily, the incumbent renewal operations leader, creating urgency for knowledge transfer to avoid institutional knowledge loss [4]. The Salesforce pilot flag addition is politically sensitive, potentially delaying tracking enablement—early stakeholder engagement is necessary to mitigate this [4]. The reliance on manual Slack workflows and deal support tickets to process opt-outs is operationally risky; the agent’s ticket submission mechanism aims to reduce this burden [4]. The narrow Phase 1 pilot scope excludes Auth0 and save plays, limiting immediate NRR impact but enabling trust-building within the Okta-only customer cohort [4]. Set-up dependencies on the Okta security team for service users and email aliases introduce medium-level timeline uncertainties [4]. Lastly, SendGrid’s planned phase-out requires a seamless transition to Gainsight-based email handling to avoid communication disruptions [4].

## 11. Open Items  
Data regarding regulatory and compliance requirements is not yet captured and remains pending for discovery. This gap must be addressed to ensure that the implementation adheres to all relevant governance and data privacy standards.

---

### References  
[1] "Okta's auto-renewal program automatically renews contracts without requiring manual RM involvement... The program is governed by a checkbox in Salesforce..."  
[2] "Melissa estimated the rough scale is around 5,000 customers and ~$60M in ARR... The GS team's current framing targets GRR improvement from 78% to 80%... Any customer reply to a renewal email automatically removes them from auto-renew..."  
[3] "7 CGS contractors based in Romania... Dan, Marian and Sumer are renewal managers; Emily is outgoing renewal ops lead; AEs have renewals in compensation for first time this year."  
[4] "Phase 1 objectives: personalized, engaging emails... handle common inbound replies... clear rule that RM reply signals agent to stand down... Emily leaving Okta in ~1 month... Sendgrid — emails frequently don't send, hit spam filters, or fail silently..."  
[5] "Agent escalates by adding Dan to email thread with full context and triggers checkbox uncheck. Dan picks up conversation. Dan's reply signals agent to stand down. Save plays and discounts handled by Dan, not agent in Phase 1."  
[6] "Gainsight is the preferred email hub. SendGrid used only for dynamic contract attachment... emails sent from 'autorenew@okta' alias... Slack notifications used internally."  
[7] "Gainsight slides already contain all the email copy for Gainsight-sent messages... Emily has pre-built canned Success Hub response templates for common access issues."
---

## Source References

[1] 2026-04-01 Okta GS Atlas Connect - Emily Mariel.md
[2] 2026-03-23_ Goals and Strategy Alignment with Melissa.md
[3] 2026-03-23_ Goals and Strategy Alignment with Melissa.md and 2026-04-01 Okta GS Atlas Connect - Emily Mariel.md
[4] 2026-03-23_ Goals and Strategy Alignment with Melissa.md; 2026-04-01 Okta GS Atlas Connect - Emily Mariel.md
[5] 2026-04-01 Okta GS Atlas Connect - Emily Mariel.md; 2026-03-23_ Goals and Strategy Alignment with Melissa.md
[6] 2026-03-23_ Goals and Strategy Alignment with Melissa.md, 2026-04-01 Okta GS Atlas Connect - Emily Mariel.md
[7] 2026-04-01 Okta GS Atlas Connect - Emily Mariel.md, 2026-03-23_ Goals and Strategy Alignment with Melissa.md

---

## Meeting History

| Date | Type | Conducted By | Duration | Fields |
|------|------|-------------|----------|--------|
| 4/6/2026 | 2026-03-23  Goals and Strategy Alignment with Melissa | Shantan Reddy | — | 31 |

---

## Version History

- **v1** — 2026-04-06 by Shantan Reddy

---
_Generated by Atlas Discovery Tool on 2026-04-06. All assertions are traceable to their source via [N] references above._