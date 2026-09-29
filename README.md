# Agent Anatomy

An interactive visualizer for what an AI agent does under the hood: system prompt injection,
user prompts, planning, tool use, the observe loop, memory and retrieval.

```bash
npm install
npm run dev
```

## Two ways to learn

- **Full run**: pick a scenario (Weather, Trip planner, Research with RAG, Coding agent) and step
  through it as a sequence diagram with lanes for User · Agent · LLM · Tools · Memory.
  Controls: ▶ play/pause (space), ◀ ▶ step (← →), speed 0.5–4×. Click any row to jump to it.
  The side panel shows the raw payload of each step and how the context window grows.
- **Explore actions**: pick a single action to see it in isolation, with an explanation, why it
  matters, an example payload, and links to where it appears in the full runs.

## Where things live

| Path | What |
| --- | --- |
| `src/types.ts` | `Step`, `Scenario`, `Concept`, action kinds, and lanes |
| `src/data/concepts.ts` | The explainer text + example for every action |
| `src/data/scenarios/` | Scripted runs, one file per scenario |
| `src/components/Timeline.tsx` | The sequence diagram |

To add a scenario, create a file in `src/data/scenarios/` and add it to `SCENARIOS` in `index.ts`.

See [TODO.md](TODO.md) for planned work (advanced concepts, live Claude API mode).
