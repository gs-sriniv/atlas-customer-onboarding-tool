# Okta Renewal Agent — Agentic POC
**Project:** `proj-Okta-v1`  **Company:** Okta  **Generated:** 2026-04-03
## What this POC contains
| File | Contents |
|------|----------|
| `agent.config.json` | Full normalised agent configuration |
| `playbook.md` | Human-readable renewal playbook |
| `simulation_run.md` | AI-generated simulation of first renewal cycle |
## Agent Summary
The agent autonomously manages the entire email renewal outreach sequence for Okta-only auto-renew customers, sending timely, personalized emails at defined intervals (T-90, T-60, T-45, T-5) directing customers to their Success Hub quotes. It also handles inbound email replies regarding access, billing contact updates, and general questions autonomously with canned responses. If customers request removal from auto-renew or have complex requests (e.g., quantity changes), the agent escalates to the Renewal Manager Dan by adding him to the email thread and triggering deal support tickets. This reduces manual workload and increases renewal process efficiency.
## Deployment Readiness
The agent is well configured for fully automated outreach within the Okta-only auto-renew segment and can execute the renewal email campaign end-to-end. However, the most critical gap is the missing fourth journey step (T-10 timing) needed to complete the sequence as defined in the project discovery. Additionally, the lack of defined compliance guidelines (GDPR, CCPA, HIPAA) poses a significant risk for deployment, as the agent’s outreach and data usage may breach regulations. Addressing compliance requirements is essential before production rollout.
## Blocking Gaps (2)
- **journey_steps**: 3 journey steps defined — agent needs at least 4 (T-90 through T-10)
- **compliance**: Compliance requirements undefined — outreach may violate GDPR, CCPA, HIPAA, or other regulations