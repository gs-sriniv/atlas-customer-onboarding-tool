# Okta Renewal Agent — Agentic POC
**Project:** `proj-Okta-v1`  **Company:** Okta  **Generated:** 2026-04-03
## What this POC contains
| File | Contents |
|------|----------|
| `agent.config.json` | Full normalised agent configuration |
| `playbook.md` | Human-readable renewal playbook |
| `simulation_run.md` | AI-generated simulation of first renewal cycle |
## Agent Summary
The Okta Renewal Agent autonomously detects renewal dates, sends initial T-90 renewal notification emails personalized to billing contacts, and handles common inbound replies such as billing changes or access issues with canned responses. It escalates opt-out requests or complex replies to the renewal manager (Dan) with deal support ticket creation. However, missing defined journey steps beyond T-90 and absence of compliance policies limit subsequent reminder emails and finer scheduling automation, requiring human oversight for later cycle engagement and compliance validation.
## Deployment Readiness
The agent demonstrates effective autonomous outreach at T-90 and reply handling for Okta-only auto-renew customers, leveraging Success Hub integration. The most critical gap is the incomplete journey step definitions beyond T-90 and undefined compliance requirements, which currently blocks sending subsequent reminder emails and overall renewal cadence automation. Addressing compliance policies and expanding journey step definitions are essential to move from partial to full automation.
## Blocking Gaps (2)
- **journey_steps**: 3 journey steps defined — agent needs at least 4 (T-90 through T-10)
- **compliance**: Compliance requirements undefined — outreach may violate GDPR, CCPA, HIPAA, or other regulations