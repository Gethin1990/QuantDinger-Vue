# AI Copilot P1–P3 design and interaction QA

## Evidence

- Source visual truth:
  - `/var/folders/bb/zttk5zmj1bqgl_7fy42dnjfm0000gn/T/codex-clipboard-c3bd5583-a22c-445b-9e41-1eb04b9484b8.png` (2704 × 1590), original QuantDinger workspace.
  - `/var/folders/bb/zttk5zmj1bqgl_7fy42dnjfm0000gn/T/codex-clipboard-caefb089-6355-4456-b7b3-5257af7d8780.png` (2704 × 1590), Kavout empty chat direction.
  - `/var/folders/bb/zttk5zmj1bqgl_7fy42dnjfm0000gn/T/codex-clipboard-0bc74a99-8df9-4e44-9f7a-9e642df228db.png` (2230 × 1422), Kavout answer direction.
  - `/var/folders/bb/zttk5zmj1bqgl_7fy42dnjfm0000gn/T/codex-clipboard-8afb6876-82d8-4c41-9bdb-ee34479b465c.png`, original full-height QuantDinger report treatment.
- Implementation URL: `http://127.0.0.1:8000/#/ai-asset-analysis`.
- Browser-rendered implementation (1624 × 1440 CSS-pixel captures):
  - `design-qa-main-final.png`, authenticated empty state.
  - `design-qa-compact-report-final.png`, compact report plus report-bound follow-up.
  - `design-qa-quick-tools-removed.png`, final research composer without the duplicate utility modal.
  - `design-qa-memory-telemetry-final.png`, memory and context telemetry.
- Same-input comparisons:
  - `design-qa-comparison-final.jpg`, original QuantDinger + Kavout + final implementation.
  - `design-qa-report-comparison-final.jpg`, original full report + compact report implementation.
  - `design-qa-quick-tools-comparison.jpg`, supplied duplicate-modal state + final single-preset-row implementation.
- State coverage: authenticated light/dark themes, empty, loaded history, compact report, report confirmation, report follow-up, streaming, completed answer, saved prompts, memory summary, telemetry, disabled controls, and error-log review.

## Full-view comparison

The original QuantDinger, Kavout reference, and final implementation were inspected together in one comparison input. The implementation keeps QuantDinger's dark shell, three-column research workspace, green brand accent, borders, navigation, watchlist, and persistent composer. It adopts Kavout's quieter research-first center: one clear question, compact adaptive prompt pills, explicit research modes, and less feature-card noise.

No unsupported imagery, CSS drawings, custom SVG substitutes, or placeholder avatars were added. Existing QuantDinger assets and Ant Design icons remain the visual system of record.

## Focused report comparison

The original full-height report and the final compact report were inspected together in one comparison input. The default report now exposes target, decision, concise rationale, confidence, current price, R/R, and any R/R warning in a single scannable card. The detailed legacy report remains available behind “查看完整报告”; copy, saved prompt, PDF export, and report-aware follow-up stay adjacent to the artifact.

This removes the previous long-report interruption without deleting the original analysis card. Dark-theme text, warning contrast, metric grouping, borders, and action hierarchy remain readable at the captured viewport.

## Required fidelity and accessibility surfaces

- Typography: existing system font and QuantDinger hierarchy are preserved. Starter prompts, report summary, metrics, warnings, answer headings, metadata, and utility labels have distinct weight and line-height.
- Spacing/layout: the central research canvas remains primary. Prompt pills are compact, the duplicate quick-tools trigger and modal are removed, and memory remains a clearly named dedicated surface.
- Colors/tokens: dark surfaces use existing text, muted text, border, brand green, and warning amber tokens. Disabled controls and overlays remain distinguishable.
- Copy/content: “生成指标”和“生成策略” are removed from the conversation surface. Utilities describe outcomes, report generation discloses target, interval, duration, and estimated credit cost before running, and memory explains what is retained.
- Icons: visible controls use the existing Ant Design icon family with consistent sizing and alignment.
- Interactions: starter prompts, research modes, expand/collapse, report confirmation/cancel, report follow-up, memory manager, saved prompts, copy/save/export, and composer states were exercised.
- Accessibility: primary interactions are semantic buttons/tabs with accessible names. Focus state was visible on the selected session and composer controls. Long content remains scrollable without clipping.
- Responsiveness: prior verified breakpoints hide the right rail below 1280 CSS pixels and both rails below 960 CSS pixels. The new report, utility grid, and memory statistics include responsive grid fallbacks and do not introduce fixed-width overflow.

## Real integration and answer-quality checks

- Loaded an existing `Crypto:SOL/USDT` professional report and confirmed the compact artifact renders with `HOLD`, 58% confidence, current price `105.63`, and the report's unavailable R/R state. A QA-discovered false “R/R < 1” warning on a missing ratio was corrected so unavailable and genuinely sub-1 ratios are no longer conflated.
- Confirmed the rendered “快捷工具” button count is zero. The six research presets remain directly above the composer, while professional report and conversation memory keep explicit one-click entries.
- Moved “我的常用问题” into the left rail so removing the duplicate modal does not remove saved-prompt reuse or deletion.
- Triggered professional report generation and verified the confirmation disclosed `USStock:MSFT`, `1D`, `30–90 秒`, and `10 积分`; cancellation caused no charge or request.
- Clicked “Ask follow-up” on the SOL/USDT report. The composer displayed “下一条问题将引用当前专业报告”.
- Sent a real follow-up while the symbol selector had previously shown another target. The database stored `referenced_report_id = 9` on the user message and `report_message_id = 9` on request telemetry, proving the request was bound to the selected report.
- The model correctly identified the report's unsupported “宏观环境偏友好” statement as the weakest evidence and explained why missing source data lowers confidence. It did not leak MSFT context into the SOL/USDT answer.
- The request carried only 2 recent messages and an estimated 4312 input tokens. The memory panel showed `Crypto:SOL/USDT`, workflow `research`, two stable constraints, 0 long-term memories, and normal context status.
- Browser logs contained no new application errors during the report, follow-up, utility, and memory flows. Older calendar timeout and unrelated quick-trade permission logs predated this QA run.

## Context, isolation, and reliability checks

- Frontend no longer sends conversation history, server memory, report payloads, or summaries inside client context.
- Backend selects the latest bounded history, merges a structured rolling summary, masks stale numbers in summary requests, chooses relevant confirmed memories, and enforces a 24k estimated input-token budget.
- Report lookup is scoped by message ID, session ID, and user ID. A client cannot forge another report, summary, memory, or conversation history.
- Request telemetry records input characters/tokens, output tokens, history count, summary version, memory count, report reference, truncation, and finish reason.
- Clearing session memory does not delete the transcript. Long-term memory remains explicit, editable, and deletable rather than silently inferred.

## Findings and iteration history

1. Earlier design pass removed oversized starter cards, feature-generation shortcuts, raw tool noise, premature follow-ups, and narrow-width rail compression.
2. P1 added backend-owned bounded context, structured rolling session memory, report-scoped follow-ups, and telemetry.
3. P2 retained the original professional report as a compact first-class artifact; the final alignment pass removed the remaining duplicate quick-tools modal and kept one preset row.
4. P3 exposed remembered target/workflow/constraints, context usage, and long-term memory management.
5. Final browser pass found no P0, P1, or P2 visual, behavioral, accessibility, context-isolation, or answer-quality regressions.
6. Non-blocking P3: very wide empty states intentionally retain calm whitespace, matching the chosen Kavout direction.

## Automated checks

- Frontend lint: passed.
- Frontend unit tests: 40 passed.
- Frontend production build: passed.
- Backend focused context/memory and prompt-library tests: 13 passed.
- Backend full suite: 1479 passed, 5 skipped, 30 existing deprecation warnings.
- Backend container: healthy on Python 3.12.13.
- `git diff --check`: passed in both repositories.

Prior AI Copilot result: passed

---

# Strategy Marketplace P0–P2 design and interaction QA

## Evidence

- Source visual truth: `/var/folders/bb/zttk5zmj1bqgl_7fy42dnjfm0000gn/T/codex-clipboard-12b9d1e8-96bf-415b-a19f-cf2b0559bb5b.png` (1572 × 1128 px), the existing marketplace screen before strategy applicability filters.
- Browser-rendered implementation: `design-qa-market-strategy-desktop.png` (1624 × 1438 px), authenticated light-theme strategy marketplace.
- Same-input comparison: `design-qa-market-strategy-comparison.jpg` (1590 × 770 px), source and implementation normalized to a 780 px content width and shown side by side.
- Responsive evidence before fix: `design-qa-market-strategy-css-1024.png` (2048 × 1800 px at 1024 × 900 CSS px, device scale 2).
- Responsive evidence after fix: `design-qa-market-strategy-css-1024-final.png` (2048 × 1800 px at 1024 × 900 CSS px, device scale 2).
- Narrow breakpoint evidence: `design-qa-market-strategy-css-768-final.png` (1536 × 1680 px at 768 × 840 CSS px, device scale 2).
- State: authenticated, marketplace tab, strategy category, advanced filters expanded, US stock filter active, empty result set.

## Full-view and focused comparison

The source and implementation were compared in one combined image. The implementation retains the existing QuantDinger navigation, tab structure, compact white filter card, green brand accent, neutral canvas, and risk notice. It adds strategy-specific applicability filters without introducing a second toolbar, new visual language, or unsupported assets.

The focused responsive pass used the same route and active filter state at 1024 CSS px. The first pass exposed a P2 layout defect: the right filter group compressed the title and indicator/strategy selector into vertically wrapped glyphs. The header now changes to a stacked two-row layout below 1200 CSS px; the post-fix capture has no horizontal overflow and preserves normal title and tab text.

## Required fidelity surfaces

- Fonts and typography: existing system typography, weights, truncation, and Ant Design control labels are preserved; no vertical glyph wrapping remains at the tested breakpoint.
- Spacing and layout rhythm: the desktop toolbar remains compact; below 1200 px the title/tabs and filters separate into two readable rows while filters continue to wrap naturally.
- Colors and visual tokens: existing white/neutral surfaces, green selected states, subtle borders, and warning colors remain unchanged.
- Image and asset quality: no new imagery or approximate custom assets were introduced; existing logo and Ant Design icons remain the source of truth.
- Copy and content: filters clearly distinguish market, target binding, timeframe, strategy type, instrument type, direction, and leverage. Active filters are repeated as removable chips.

## Findings and comparison history

1. [P2, fixed] At 1024 CSS px, the strategy filter toolbar compressed the title and category selector into vertical text.
   - Fix: added a 1200 px breakpoint that stacks the header regions, gives the filter region full width, and preserves horizontal title/tab layout; the 768 px rule keeps the smaller-screen column behavior.
   - Post-fix evidence: `design-qa-market-strategy-css-1024-final.png`; document and body scroll width both equal the 1024 px viewport.
2. No remaining actionable P0/P1/P2 visual differences were found in the desktop strategy-marketplace state.
3. P3 test gap: authenticated mobile visual capture was not available on the separate mobile development origin. Mobile contract parity is covered by 19 unit tests and a successful production build.

## Primary interactions and runtime checks

- Switched from indicators to strategies.
- Expanded and collapsed advanced filters.
- Opened the market selector and applied “US stocks”.
- Verified the active filter chip and reset affordance.
- Checked browser logs after interactions: no application errors; only the existing Ant Design lazy-load notice.
- Verified 1024 CSS px layout before and after the responsive fix and confirmed no horizontal overflow.
- Verified the 768 CSS px advanced-filter state also keeps the title, category selector, fields, and reset action visible without horizontal overflow.

final result: passed
