# Atlas Renewal Agent — Implementation Requirements

| Field | Value |
|-------|-------|
| **Company** | Okta |
| **Project** | proj-okta-v1 |
| **Version** | v1 |
| **Date** | 2026-04-10 |
| **Author** | Atlas Admin |
| **Sources** | 4 documents/meetings referenced |

---
# Okta Auto-Renewal Agent Implementation Requirements Document

## 1. Executive Summary  
Okta seeks to improve Gross Revenue Retention (GRR) from 78% to 80% within its Okta-only auto-renew customer segment by automating the renewal email outreach and reply handling process. The primary objective is to reduce manual triage workload on the current renewal team, comprised of 7 CGS contractors and renewal managers, by enabling an AI agent to autonomously or semi-autonomously address common customer replies and retain more customers in the auto-renewal flow [1][2]. This initiative is scoped for Phase 1, targeting approximately 5,000 customers representing $60 million ARR, deferring more complex renewal and upsell processes and Auth0 customers to later phases [2].

## 2. Problem Statement  
Currently, any customer reply to an auto-renewal email results in automatic removal from the auto-renew flow, necessitating manual handling by CGS contractors in Romania. This triggers a growing queue comprising frequently answerable questions and opt-out requests, which drains contractor bandwidth and delays the renewal process. The root cause includes tooling limitations, such as disjointed email systems (SendGrid attachment issues, Slack notifications, manual deal support tickets) and Salesforce governance constraints, requiring manual triage for even simple customer replies [2]. Consequently, the labor-intensive manual workflow risks poorer retention outcomes and impacts GRR negatively by breaking the streamlined renewal flow [2].

## 3. Key Tenets  
The AI agent will autonomously or semi-autonomously handle known, frequent categories of customer replies to keep customers engaged in the renewal flow and minimize manual interruptions. It will deliver personalized outreach emails and canned responses addressing common issues such as billing contact updates and access problems while escalating complex or out-of-scope cases—like opt-out requests, micro-changes requiring contract amendments, and upsell inquiries—to the renewal manager with prepared briefings [4]. The agent will not make pricing decisions, generate custom quotes, execute save plays like discount offers, directly remove customers from auto-renewal, or act as a human renewal manager in Phase 1 [4].

## 4. Solution Approach  
The renewal workflow initiates with a Salesforce-governed auto-renew checkbox and automated quoting at T-120 days pre-renewal. Emails are primarily sent via Gainsight (Okta-only) with dynamic contract attachments managed through SendGrid. The AI agent will intervene at multiple renewal journey points: at T-150 days it processes internal renewal notifications and autonomously handles common replies to reduce manual triage. From T-90, the agent sends personalized, value-focused renewal emails to the auto-renew cohort and continues dialogue until T-60, escalating any out-of-scope situations (e.g., upsell interest) to renewal managers. Escalations trigger addition of the renewal manager to email threads and submission of deal support tickets to maintain compliance with Salesforce governance [1][3].

Reply handling is systematically categorized to cover frequent issues: requests for removal from auto-renew (escalated), outdated contacts (handled via canned responses), quantity changes (mostly agent-handled but escalated if requiring contract amendments), upsell pursuits (escalated), and access issues (agent-managed with Emily’s existing templates) [2]. This structured approach preserves renewal flow continuity and minimizes manual triage workload.

## 5. Customer Segmentation  
**Okta-only auto-renew customers:** Phase 1 focuses exclusively on these approximately 5,000 customers who engage via the Okta platform under auto-renewing SaaS contracts generating around $60 million in ARR. These customers are supported through an assisted agent model that blends automation with human oversight to improve renewal outcomes and operational efficiency [2].

**Auth0 (Customer Identity Cloud) customers:** Represent a more complex segment accessing an entirely separate portal with less visibility in Gainsight and independent workflow structures. These customers are currently handled through human-led renewal processes and are excluded from Phase 1 due to integration complexity, with inclusion planned for future phases [2].

## 6. Success Metrics & Leading Indicators  
Primary success will be measured by improving GRR from the current baseline of 78% to the goal of 80%, reflecting better retention driven by automation of reply handling [2]. Additional key performance indicators include reducing the manual triage workload imposed on the 7 CGS contractors, as evidenced by decreased queue volume and faster handling times for renewals escalated by the agent [2]. Leading indicators entail tracking agent cohort vs. control group customers through Salesforce flagging or Gainsight tagging for rigorous impact assessment, along with monitoring reduced time to resolution in escalated cases due to agents’ preparatory briefings [3].

## 7. Agent Journey & Customer Experience  
At T-150 days prior to renewal, the agent receives internal AE notifications and autonomously manages common reply categories and enriches communications with customer health data to prevent unnecessary opt-outs. Beginning T-90 days, the agent initiates a structured email cadence delivering personalized, value-driven renewal messages designed to counteract the current generic tone and reduce customer uncertainty. From T-90 to T-60 days, the agent actively identifies opportunities that require escalation—such as upsell or save plays—and smoothly transitions these to human renewal managers to maintain customer experience quality without disruption [1].

This journey emphasizes uninterrupted renewal engagement, reducing friction and manual intervention to improve retention outcomes for the Okta-only auto-renew segment.

## 8. Communication Strategy  
Renewal communications currently convey a basic “you’re renewing, please confirm” message. The implementation will enhance this by injecting value realization snapshots to demonstrate the benefits customers derive from their contracts and reduce ambiguity around renewal intent, per leadership vision [2]. Emails will be delivered via Gainsight as the preferred platform given its system of record status, with SendGrid reserved solely for dynamic contract attachments [4]. Outbound emails will utilize the established email alias 'autorenew@okta' managed through a Salesforce service user with appropriate security approvals [4].

Customer targeting focuses on billing contacts within the Okta-only auto-renew segment, with procedures for updating contact information handled by the agent using standardized templates. Escalation paths are well defined; the agent adds the relevant renewal manager (Dan) to email threads to resolve situations beyond automation scope, including opt-out requests [4].

## 9. Data Sources & Integrations  
The solution integrates the following systems for seamless operation: Gainsight serves as the primary platform for email delivery, timeline logging, customer success data, and call-to-actions; Salesforce provides opportunity and AE data while storing auto-renew checkbox statuses; SendGrid manages dynamic contract attachments; Clary is the contract source repository. Snowflake and Databricks furnish data layers interfaced by the Digital Success team’s Matic tool to provide personalized value snapshots embedded in communications. Additionally, Staircase is piloted to supply customer health signals enriching agent decisioning [2].

Data security and compliance requirements have yet to be captured and will require further discovery to ensure regulatory adherence and risk mitigation.

## 10. Risks & Mitigations  
Key risks include:
- **Emily’s imminent departure:** Emily is the single institutional knowledge source on renewal processes; her exit creates an urgent need for knowledge transfer to mitigate operational disruption [1][2].
- **Salesforce field approval delays:** Political sensitivity and complex approval workflows may delay the implementation of pilot tracking fields used for cohort visibility, potentially impacting evaluation timelines [2].
- **SendGrid reliability issues:** Frequent email delivery failures and spam filtering diminish customer engagement; the preference is to phase out SendGrid in favor of Gainsight-based emailing, requiring coordinated migration planning [1][2].
- **Phase 1 scope limitations:** The narrow focus on Okta-only auto-renew customers and limited agent functionality in Phase 1 excludes handling discounts, micro-changes, and complex renewals, which must be managed via escalation—requiring precise escalation workflow design to avoid customer experience degradation [2][4].
- **Agent to renewal manager handoff challenges:** Proper context preservation and clear escalation triggers must be designed to maintain smooth workflow continuity and avoid duplication or customer confusion [2].
- **Service user and email alias setup:** Creation and security approval for Salesforce service user and email alias may involve multiple teams and require early stakeholder engagement to prevent delays [4].
- **Political dynamics around pilot tracking:** Cohort visibility within Salesforce is politically sensitive; stakeholder alignment on approach and transparency is necessary [2].

Mitigation includes prioritizing staff knowledge capture, early coordination with Salesforce and security teams, pilot field development aligned with stakeholder input, and thorough escalation protocol documentation.

## 11. Open Items  
Regulatory, compliance, and data security requirements have not yet been identified or documented and remain a critical area for discovery prior to full deployment [Data not yet captured — pending discovery].
---

## Source References

[1] 2026-03-23_ Goals and Strategy Alignment with Melissa.md, 2026-04-01 Okta GS Atlas Connect - Emily Mariel.md
[2] 2026-03-23_ Goals and Strategy Alignment with Melissa.md
[3] 2026-04-01 Okta GS Atlas Connect - Emily Mariel.md
[4] 2026-03-23_ Goals and Strategy Alignment with Melissa.md; 2026-04-01 Okta GS Atlas Connect - Emily Mariel.md

---

## Meeting History

| Date | Type | Conducted By | Duration | Fields |
|------|------|-------------|----------|--------|
| 4/10/2026 | 2026-03-23  Goals and Strategy Alignment with Melissa | Atlas Admin | — | 31 |

---

## Version History

- **v1** — 2026-04-10 by Atlas Admin

---
_Generated by Atlas Discovery Tool on 2026-04-10. All assertions are traceable to their source via [N] references above._