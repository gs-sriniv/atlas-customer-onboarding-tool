# Okta Renewal Agent — Agentic POC
**Project:** `proj-okta-v1`  **Company:** Okta  **Generated:** 2026-04-10
## What this POC contains
| File | Contents |
|------|----------|
| `agent.config.json` | Full normalised agent configuration |
| `playbook.md` | Human-readable renewal playbook |
| `simulation_run.md` | AI-generated simulation of first renewal cycle |
## Agent Summary
The Okta Renewal Agent autonomously sends personalized renewal reminder emails at 90 and 30 days before renewal, including value realization to engage customers and reduce uncertainty. It handles common reply categories like billing contact updates and access issue questions using canned responses, keeping customers in the renewal flow, and escalates complex cases such as quantity changes or opt-out requests to the Renewal Manager. Manual intervention is minimized, reserving human oversight for out-of-scope or sensitive cases.
## Deployment Readiness
The agent is ready to operate within the defined segment with effective outbound email communications and reply handling workflows. The biggest gap is the missing journey step(s) for T-10 outbound proactive email to boost last-minute engagement. Without this, the agent may miss the opportunity to prevent last-minute opt-outs or questions via proactive outreach. Adding this step will improve automated renewal rate and reduce triage workload.
## Blocking Gaps (1)
- **journey_steps**: 3 journey steps defined — agent needs at least 4 (T-90 through T-10)