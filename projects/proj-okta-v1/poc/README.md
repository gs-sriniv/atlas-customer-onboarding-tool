# Okta Corp Renewal Agent — Agentic POC
**Project:** `proj-okta-v1`  **Company:** Okta Corp  **Generated:** 2026-04-06
## What this POC contains
| File | Contents |
|------|----------|
| `agent.config.json` | Full normalised agent configuration |
| `playbook.md` | Human-readable renewal playbook |
| `simulation_run.md` | AI-generated simulation of first renewal cycle |
## Agent Summary
The Atlas Renewal Agent autonomously detects renewal dates and sends personalized outreach emails that include targeted value realization snapshots to auto-renew customers. It handles common inbound replies such as contact updates or billing questions semi-autonomously, reducing manual workload. For replies indicating desire to opt out or complex upsell inquiries, the agent escalates cleanly to the Renewal Manager via email threads and deal support tickets, maintaining context and ensuring timely human follow-up.
## Deployment Readiness
The agent demonstrates readiness to run the initial renewal outreach and reply handling autonomously within the defined segment. The single most important gap is the undefined compliance requirements, which pose a risk to outreach legality and customer data handling. Additionally, the absence of no-response branches in the journey steps may cause indefinite agent loops post-outreach.
## Blocking Gaps (2)
- **journey_steps**: 4 steps missing a no-response branch — agent loops indefinitely without one
- **compliance**: Compliance requirements undefined — outreach may violate GDPR, CCPA, HIPAA, or other regulations