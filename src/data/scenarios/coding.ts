import type { Scenario } from '../../types'
import { ctx } from './ctx'

const SYSTEM =
  'You are a coding agent working in a repository. Tools: run_tests, read_file, edit_file. Verify every fix by running the tests. Make minimal changes.'

const REQUEST = 'The parseDate test is failing. Can you fix it?'

const FAIL_OUTPUT = `FAIL  src/date.test.ts
  ✕ parseDate("2026-03-15") returns March 15
    Expected: 2026-03-15
    Received: 2026-04-15

Tests: 1 failed, 11 passed`

const FILE = `export function parseDate(s: string): Date {
  const [y, m, d] = s.split('-').map(Number)
  return new Date(y, m, d)
}`

const PASS_OUTPUT = 'PASS  src/date.test.ts\n\nTests: 12 passed'

const SUMMARY =
  'Fixed. `parseDate` passed the 1-based month straight to `new Date()`, which expects 0-based months, so March became April. Changed to `m - 1` in src/date.ts. All 12 tests pass.'

export const coding: Scenario = {
  id: 'coding',
  title: 'Coding agent',
  tagline: 'Test → read → edit → re-test: an agent that verifies its own work.',
  steps: [
    {
      kind: 'system_prompt',
      from: 'agent',
      to: 'llm',
      label: 'inject system prompt',
      note: 'The system prompt sets a key habit: always verify by running tests.',
      payload: { system: SYSTEM },
      context: ctx('system', 'System prompt', SYSTEM),
    },
    {
      kind: 'user_prompt',
      from: 'user',
      to: 'agent',
      label: '"Fix the parseDate test"',
      note: 'The request is short. The agent has to explore to understand the problem.',
      payload: { role: 'user', content: REQUEST },
      context: ctx('user', '"Fix parseDate test"', REQUEST),
    },
    {
      kind: 'llm_request',
      from: 'agent',
      to: 'llm',
      label: 'messages.create()',
      note: 'Tools: run_tests, read_file, edit_file.',
    },
    {
      kind: 'planning',
      from: 'llm',
      to: 'llm',
      label: 'plan: reproduce first',
      note: 'Good agents reproduce a bug before changing code.',
      payload: '1. Run tests to see the actual failure\n2. Read the source\n3. Fix\n4. Re-run tests to verify',
    },
    {
      kind: 'tool_selection',
      from: 'llm',
      to: 'agent',
      label: 'tool_use: run_tests',
      note: 'The model starts gathering evidence.',
      payload: { type: 'tool_use', id: 'toolu_01', name: 'run_tests', input: { path: 'src/date.test.ts' } },
      context: ctx('assistant', 'tool_use run_tests', { path: 'src/date.test.ts' }),
    },
    {
      kind: 'tool_call',
      from: 'agent',
      to: 'tools',
      label: '$ npx vitest src/date.test.ts',
      note: 'The harness runs a real shell command in a sandbox.',
    },
    {
      kind: 'tool_result',
      from: 'tools',
      to: 'agent',
      label: '1 failed',
      note: 'The test output shows the exact symptom: the month is off by one.',
      payload: FAIL_OUTPUT,
    },
    {
      kind: 'observe',
      from: 'agent',
      to: 'llm',
      label: 'test output → model',
      note: 'The model sees March became April.',
      context: ctx('tool_result', 'test failure output', FAIL_OUTPUT),
    },
    {
      kind: 'tool_selection',
      from: 'llm',
      to: 'agent',
      label: 'tool_use: read_file',
      note: 'Step 2: look at the implementation.',
      payload: { type: 'tool_use', id: 'toolu_02', name: 'read_file', input: { path: 'src/date.ts' } },
      context: ctx('assistant', 'tool_use read_file', { path: 'src/date.ts' }),
    },
    {
      kind: 'tool_call',
      from: 'agent',
      to: 'tools',
      label: 'read_file("src/date.ts")',
      note: 'The file is read from disk.',
    },
    {
      kind: 'tool_result',
      from: 'tools',
      to: 'agent',
      label: '4 lines',
      note: 'The source code comes back.',
      payload: FILE,
    },
    {
      kind: 'observe',
      from: 'agent',
      to: 'llm',
      label: 'file → model',
      note: 'The code is now in context.',
      context: ctx('tool_result', 'src/date.ts contents', FILE),
    },
    {
      kind: 'reasoning',
      from: 'llm',
      to: 'llm',
      label: 'diagnose',
      note: 'The model connects the symptom (month + 1) to the cause.',
      payload:
        'JavaScript Date months are 0-indexed: new Date(2026, 3, 15) is April 15. The parsed month "03" must become 2. Fix: pass m - 1.',
    },
    {
      kind: 'tool_selection',
      from: 'llm',
      to: 'agent',
      label: 'tool_use: edit_file',
      note: 'A minimal, targeted edit, as the system prompt asked.',
      payload: {
        type: 'tool_use',
        id: 'toolu_03',
        name: 'edit_file',
        input: { path: 'src/date.ts', old: 'new Date(y, m, d)', new: 'new Date(y, m - 1, d)' },
      },
      context: ctx('assistant', 'tool_use edit_file', { old: 'new Date(y, m, d)', new: 'new Date(y, m - 1, d)' }),
    },
    {
      kind: 'tool_call',
      from: 'agent',
      to: 'tools',
      label: 'edit_file(src/date.ts)',
      note: 'A write action. Many harnesses ask for human approval here (a future "human-in-the-loop" concept).',
    },
    {
      kind: 'tool_result',
      from: 'tools',
      to: 'agent',
      label: 'ok: 1 line changed',
      note: 'The edit is applied.',
      payload: { ok: true, diff: '-  return new Date(y, m, d)\n+  return new Date(y, m - 1, d)' },
    },
    {
      kind: 'observe',
      from: 'agent',
      to: 'llm',
      label: 'edit ok → model',
      note: 'The model knows the edit landed, but not yet whether it worked.',
      context: ctx('tool_result', 'edit ok', { ok: true }),
    },
    {
      kind: 'tool_selection',
      from: 'llm',
      to: 'agent',
      label: 'tool_use: run_tests',
      note: 'Step 4: verify. The observe → act loop lets the agent check its own work.',
      payload: { type: 'tool_use', id: 'toolu_04', name: 'run_tests', input: { path: 'src/date.test.ts' } },
      context: ctx('assistant', 'tool_use run_tests', { path: 'src/date.test.ts' }),
    },
    {
      kind: 'tool_call',
      from: 'agent',
      to: 'tools',
      label: '$ npx vitest src/date.test.ts',
      note: 'The same command as before.',
    },
    {
      kind: 'tool_result',
      from: 'tools',
      to: 'agent',
      label: '12 passed ✓',
      note: 'All green.',
      payload: PASS_OUTPUT,
    },
    {
      kind: 'observe',
      from: 'agent',
      to: 'llm',
      label: 'pass → model',
      note: 'Evidence the fix works.',
      context: ctx('tool_result', 'tests pass', PASS_OUTPUT),
    },
    {
      kind: 'final_response',
      from: 'llm',
      to: 'agent',
      label: 'stop_reason: end_turn',
      note: 'Plan complete. The model explains what it did.',
      context: ctx('assistant', 'summary of fix', SUMMARY),
    },
    {
      kind: 'final_response',
      from: 'agent',
      to: 'user',
      label: '"Fixed: month off-by-one"',
      note: 'Four tool calls and five model calls. Each loop iteration re-sent the growing context; watch the meter.',
      payload: SUMMARY,
    },
  ],
}
