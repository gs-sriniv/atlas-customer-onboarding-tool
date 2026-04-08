# Partsource Renewal Agent — Agentic POC
**Project:** `proj-partsource-124`  **Company:** Partsource  **Generated:** 2026-04-08
## What this POC contains
| File | Contents |
|------|----------|
| `agent.config.json` | Full normalised agent configuration |
| `playbook.md` | Human-readable renewal playbook |
| `simulation_run.md` | AI-generated simulation of first renewal cycle |
## Agent Summary
The agent is designed to autonomously execute a multi-step renewal outreach sequence leveraging predefined journey steps, segments, and communication channels. It can send personalized emails aligned with account data, monitor replies with reply categories, and escalate when manual intervention is needed. However, in this configuration, the agent cannot operate autonomously due to lack of journey steps, segments, communication channels, and data sources. It requires significant human setup before functioning.
## Deployment Readiness
This agent is currently non-operational due to a complete absence of journey steps, reply categories, communication channels, and data source integration. The single most important gap is the missing journey steps that define the cadence and content of renewal outreach. Without those, the agent cannot take any autonomous action.
## Blocking Gaps (5)
- **journey_steps**: 0 journey steps defined — agent needs at least 4 (T-90 through T-10)
- **reply_categories**: 0 reply categories — agent cannot process customer responses
- **will_not_do**: 0 hard limits — agent has no compliance guardrails
- **data_sources**: No data sources — agent cannot pull account data, health scores, or renewal dates
- **compliance**: Compliance requirements undefined — outreach may violate GDPR, CCPA, HIPAA, or other regulations