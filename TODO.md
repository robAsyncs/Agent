# TODO

## Advanced concepts (4th category)

Add these as new `ActionKind`s in `src/types.ts`, a new `'advanced'` `Category`, entries in
`src/data/concepts.ts`, and remove the disabled placeholders in `src/components/Explorer.tsx`.

- [ ] **Subagents / multi-agent handoff**: orchestrator spawns a subagent with its own context
      window, receives only its summary back. Probably needs a new lane (or nested timeline).
- [ ] **Reflection / self-correction**: the model critiques its own draft and revises it.
- [ ] **Guardrails**: input/output checks in the harness (block PII, refuse unsafe tool calls).
- [ ] **Human-in-the-loop approval**: pause before a risky tool call (e.g. `edit_file` in the
      coding scenario) and wait for the user to approve or reject.
- [ ] Add a scenario that shows these together (e.g. coding agent that asks for approval before
      editing, and delegates a search to a subagent).

## Live mode (real Claude API)

- [ ] Decide where the API key lives. Recommended: a small local Node/Express proxy that reads
      `ANTHROPIC_API_KEY` from `.env`, so the key never reaches the browser.
- [ ] Implement a real agent loop (`messages.create` → handle `tool_use` → run tool → send
      `tool_result` → repeat until `end_turn`) with a few safe mock tools (weather, calculator,
      doc search).
- [ ] Convert each API event into a `Step` so the existing `Timeline`, `StepDetail`, and
      `ContextWindow` render live runs unchanged.
- [ ] Show real token usage from the API response in the context window meter.
- [ ] UI: "Simulated / Live" toggle + free-text prompt input.
