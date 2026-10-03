# Agent Anatomy

An interactive visualizer for what an AI agent does under the hood: system prompt injection,
user prompts, planning, tool use, the observe loop, memory and retrieval.

```bash
npm install
npm run dev
```

## Pages

| URL | What |
| --- | --- |
| `/` | Home: project title, then the list of topics |
| `/topics`, `/topics/:topicId` | One page per topic from `ai-agents-learning-outline.md`: notes, interactive demos, what I built, sources |
| `/playground/:scenarioId?step=N` | Step through a scripted agent run as a sequence diagram (User · Agent · LLM · Tools · Memory). ▶ play/pause (space), step (← →), speed 0.5–4× |
| `/reference/:kind` | Each agent action on its own: explanation, example payload, and where it appears in the playground |

Routing uses React Router with real paths, so the host must serve `index.html` for unknown paths
(Vite's dev and preview servers already do; on Netlify/Vercel/etc. add an SPA rewrite).

## Where things live

| Path | What |
| --- | --- |
| `src/router.tsx` | Route table |
| `src/pages/` | One component per route |
| `src/data/topics/` | Topic content, one file per topic. Add write-ups in each section's `body` |
| `src/data/concepts.ts` | The explainer text + example for every action |
| `src/data/scenarios/` | Scripted runs, one file per scenario |
| `src/components/Timeline.tsx` | The sequence diagram |

To add a scenario, create a file in `src/data/scenarios/` and add it to `SCENARIOS` in `index.ts`.

See [TODO.md](TODO.md) for planned work (advanced concepts, live Claude API mode).
