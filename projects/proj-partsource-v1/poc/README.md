# PartSource Renewal Agent — Agentic POC
**Project:** `proj-partsource-v1`  **Company:** PartSource  **Generated:** 2026-04-06
## What this POC contains
| File | Contents |
|------|----------|
| `agent.config.json` | Full normalised agent configuration |
| `playbook.md` | Human-readable renewal playbook |
| `simulation_run.md` | AI-generated simulation of first renewal cycle |
## Agent Summary
The agent autonomously manages renewal outreach for REMI Long Tail accounts by sending proactive emails starting at T-180, guiding customers through standard renewal processes, and documenting interactions. It detects issue categories from replies and routes complex queries such as pricing or contract modifications to human teams. Due to missing no-response branches, the agent currently cannot handle non-responsiveness effectively and flags this for human follow-up. It uses a consultative, relationship-oriented voice and sends renewal agreements per journey templates as scheduled.
## Deployment Readiness
The agent demonstrates readiness to execute initial outreach autonomously for the REMI Long Tail segment with straightforward renewal communications. The critical gap is the missing no-response branch in the journey steps, which prevents handling of non-responsiveness and limits the agent's ability to close the outreach loop. Addressing this gap is essential before full deployment to enable escalation and ensure renewal coverage completeness.
## Blocking Gaps (1)
- **journey_steps**: 5 steps missing a no-response branch — agent loops indefinitely without one