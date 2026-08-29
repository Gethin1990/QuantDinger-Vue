# AI Copilot product and memory audit

Date: 2026-08-28

## Audit scope

- Existing structured AI analysis report card
- Conversation empty state, answer state, and quick-tools modal
- Session history, request context, working memory, persistent user memory, and report follow-up behavior

## User goal

Let users start useful investment research quickly, understand which operation they are invoking, continue a conversation without repeating themselves, and avoid wasting model context as the conversation grows.

## Evidence

- `01-analysis-report-card.png`: supplied current report-card state.
- `02-quick-tools-modal.png`: supplied current quick-tools state.
- Current authenticated empty state, completed MSFT answer state, and quick-tools modal were also inspected in the local app.
- Frontend and backend request-building code was inspected to verify actual context behavior.

## Steps and health

1. **Open the AI assistant — healthy with minor hierarchy debt.**
   - The selected symbol, research modes, starter questions, watchlist, and persistent composer are visible.
   - Saved prompts and starter prompts compete for the same central area, and long saved-prompt copy is hard to scan.

2. **Generate and read a normal answer — healthy.**
   - The answer is structured, supports follow-up actions, and keeps the composer available.
   - Contextual follow-ups are more useful than a static catalogue of generic tasks.

3. **Generate the original structured analysis card — functional but poorly discoverable.**
   - `FastAnalysisReport.vue` is still rendered inside chat messages and supports PDF export and report follow-up.
   - The path is hidden behind “快速工具 → 诊断符号 → insert prompt → send”, while the visible “标的诊断” research mode sounds like the same feature but produces a different output.
   - The full report is visually too large inside the message stream. It should behave like a report artifact with a compact summary and expandable details.
   - The Chinese UI still exposes the English label `Analysis report: ...` in saved history/report messages.

4. **Open quick tools — needs redesign.**
   - The modal repeats tasks that already exist in research modes, starter prompts, and answer follow-ups.
   - “新闻/事件研究”, “宏观数据”, “交易计划”, and “机会雷达” are prompts, not tools, so the mental model is unclear.
   - The modal interrupts the conversation to show another mini home screen.
   - “诊断符号” does not communicate that it creates the structured report card.

5. **Continue a long conversation — functional but context-inefficient.**
   - Sessions and full messages are persisted in the database.
   - Every model request loads up to 20 recent rows, then sends the last 12 messages, each truncated to 4,000 characters.
   - The frontend also sends the last 8 messages, each up to 8,000 characters, inside `copilot_recent_messages`; the backend serializes that context again. Recent conversation can therefore be duplicated.
   - A heuristic `session_working_memory` is rebuilt on every turn from recent user facts and assistant questions. It is not a persisted rolling summary and has no token budget.
   - Current user content and structured research context can appear in both the system prompt and the appended selected-context payload.
   - The full conversation is not sent without a bound, but the duplicated bounds can still create roughly 100,000 characters before fresh market/research context and output reservation.
   - Historical image bytes are not resent, which is correct; only names are included and the user must reattach for visual follow-up.
   - Persistent user memory exists separately and is approval-based, but up to 12 latest memories are injected rather than retrieving only the memories relevant to the current task.
   - Structured `report_json` is persisted for UI replay, but report details are not included in later LLM history. “Ask follow-up about this report” can therefore lack the report values it refers to.

## Highest-impact recommendations

### 1. Make the report card a first-class action

- Add a visible `生成专业分析报告` action beside the selected symbol or research-mode row.
- Show the selected target, expected output, approximate time, and credit cost before execution.
- Render the result as a compact artifact: verdict, confidence, price, risk warning, and actions first; expand for the full report.
- Keep `导出 PDF`, `继续追问`, `转交易计划`, and `设置跟踪` on the artifact.
- Remove the ambiguous “诊断符号” label and fix the Chinese report-history label.

### 2. Replace quick tools with “工具与收藏”

Do not use a large modal containing another set of research prompts. Use a small popover or side drawer with only true utilities:

- `专业分析报告`
- `上传/审查图表`
- `设置定时跟踪`
- `我的收藏问题`
- `管理对话记忆`

Keep market research, diagnosis, technical analysis, trade plan, news, and macro as research modes. Keep answer-specific actions in the contextual follow-up row.

### 3. Use a tiered memory model

1. **Full transcript:** persist all messages for history and audit, but never resend it wholesale.
2. **Short window:** send only the last 3–4 turns under a strict token budget.
3. **Session summary:** persist a structured rolling summary containing goal, active symbol/timeframe, confirmed constraints, key conclusions, open questions, and relevant artifact references.
4. **Artifact memory:** reference `report_json` by report ID and inject only the compact fields relevant to a report follow-up.
5. **Long-term user memory:** save only user-approved stable preferences and retrieve the top 3–5 relevant items, not the newest 12 by default.
6. **Fresh market context:** fetch again per turn with timestamp; do not turn today's price or indicator values into long-term memory.

### 4. Enforce one backend-owned token budget

- Remove frontend `copilot_recent_messages`; the backend already owns canonical history.
- Do not append the whole context JSON after already placing the same fields in the system prompt.
- Include the current user message exactly once as conversational content.
- Reserve output tokens before composing input.
- When input exceeds 60–70% of the model window, update the rolling summary and drop older raw turns.
- Record prompt tokens, history-message count, summary version, memory hits, report references, and truncation events for observability.

## Accessibility risks

- Secondary descriptions in the quick-tools modal have low visual prominence against the dark surface and may be hard to read at smaller sizes.
- The saved-prompt delete control is icon-only and should have a clear accessible label.
- Keyboard traversal, focus trapping, and screen-reader announcement of dynamic answer/follow-up states still require dedicated testing; screenshots alone cannot verify them.

## Recommended delivery order

1. Remove duplicate recent-message payloads and implement report-aware follow-up context.
2. Add a persisted structured session summary and token budget.
3. Promote the structured report to a visible first-class action.
4. Replace the quick-tools modal with a compact utility menu and simplify saved prompts.
5. Add prompt-token and memory-retrieval telemetry, then tune from actual usage.

Overall verdict: the main conversation flow is usable, but quick tools currently duplicate the information architecture and the memory implementation needs a bounded, backend-owned redesign before long conversations are reliable and cost-efficient.
