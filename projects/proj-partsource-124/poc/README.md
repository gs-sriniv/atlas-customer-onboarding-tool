# Partsource Renewal Agent — Agentic POC
**Project:** `proj-partsource-124`  **Company:** Partsource  **Generated:** 2026-04-08
## What this POC contains
| File | Contents |
|------|----------|
| `agent.config.json` | Full normalised agent configuration |
| `playbook.md` | Human-readable renewal playbook |
| `simulation_run.md` | AI-generated simulation of first renewal cycle |
## Agent Summary
The automated renewal agent handles the entire SMB renewal cycle autonomously by sending personalized, health score-driven emails; following up with usage stats; making check-in calls; sending quotes with DocuSign links; and nudging unsigned quotes with urgency reminders. The agent leverages defined guardrails to apply discounts and respond to common reply categories with canned responses or escalations. Only when the customer remains unresponsive or raises cancellation or competitor concerns is a human renewal rep engaged to intervene.
## Deployment Readiness
The agent is well-prepared to autonomously manage SMB renewals with multi-step outreach across email and phone, supported by data-driven messaging and automated quote delivery. The single largest gap is the missing no-response branch in the journey steps, which causes potential looping or stalled states if no customer replies or acknowledgments are received. This gap should be resolved before full production deployment to prevent stalled renewals.
## Blocking Gaps (1)
- **journey_steps**: 6 steps missing a no-response branch — agent loops indefinitely without one