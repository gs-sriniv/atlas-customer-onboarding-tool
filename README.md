# Atlas Customer Onboarding Discovery Tool

A conversational discovery tool that replaces static Excel-based requirements gathering with an AI-guided onboarding experience for the Atlas Renewal Agent platform.

## What it does

When a customer onboards to the Atlas platform, this tool guides them through a structured discovery conversation across 11 phases:

1. **Welcome** — Introduction and context
2. **Company overview** — Org size, revenue, team, primary use case
3. **Segmentation** — Customer segments, tiers, agent eligibility
4. **Value & priorities** — Pain points, root causes, success criteria
5. **Current state** — Existing workflows, systems, churn triggers
6. **Agent journey** — Step-by-step renewal motion (T-90 → T-0)
7. **Reply handling** — Response categories, handoff protocols
8. **Guardrails** — What the agent will and won't do
9. **Communication** — Voice/tone, channels, templates, targeting
10. **Data & security** — Source systems, compliance, GDPR
11. **Business case** — ROI projections, calculator inputs

The AI asks targeted questions in a free-flowing narrative, extracts structured data from the conversation, and produces a single source of truth for the entire implementation.

## LLM agnostic

Uses the **OpenAI chat completions API spec** (`/v1/chat/completions`), which is supported by virtually every LLM provider:

| Provider | Base URL | Example Model |
|----------|----------|---------------|
| OpenAI | `https://api.openai.com/v1` | `gpt-4o` |
| Anthropic (via OpenRouter) | `https://openrouter.ai/api/v1` | `anthropic/claude-sonnet-4` |
| Groq | `https://api.groq.com/openai/v1` | `llama-3.3-70b-versatile` |
| Together | `https://api.together.xyz/v1` | `meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo` |
| Fireworks | `https://api.fireworks.ai/inference/v1` | `llama-v3p1-70b-instruct` |
| Ollama (local) | `http://localhost:11434/v1` | `llama3.1` |

One-click presets are built into the landing page. Bring your own key.

## Getting started

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build
```

Then open [http://localhost:3000](http://localhost:3000).

## Demo mode

Click **"Run demo"** on the landing page to watch a complete fake session play out using NovaTech Solutions — a $38M ARR workforce management SaaS company. No API key needed. The demo shows all 11 phases with realistic conversations and structured data extraction.

## Project structure

```
src/
├── App.js                     # Main orchestrator
├── index.js                   # React entry point
├── index.css                  # Global styles, CSS variables, light/dark mode
├── components/
│   ├── Sidebar.js             # Phase navigation + progress
│   ├── LandingPage.js         # LLM config + mode selection
│   └── ChatComponents.js      # Bubble, TypingDots, DataPanel, ExportModal
├── data/
│   ├── phases.js              # Phase definitions + system prompts + LLM presets
│   └── demoData.js            # NovaTech fake conversations + extracted data
└── utils/
    ├── llm.js                 # OpenAI-compatible API client
    └── export.js              # JSON export builder
```

## Export

Click **"Export discovery data"** to view the full structured output as JSON. Includes both extracted data and conversation transcripts per phase. Copy to clipboard or use programmatically.

## Design decisions

- **Conversational over forms** — Customers tell their story naturally; the AI extracts structure
- **Phase-gated** — Can't skip ahead, but can revisit completed phases
- **Data panel** — Real-time structured data extraction visible alongside the conversation
- **Light/dark mode** — Follows system preference via CSS variables
- **No backend required** — Runs entirely client-side with direct LLM API calls

## License

MIT
