# Quick Trade Default-Open and Centered Close Action — Design QA

- final result: passed
- source visual truth: `/var/folders/bb/zttk5zmj1bqgl_7fy42dnjfm0000gn/T/codex-clipboard-c4553403-97bd-4811-9668-b4d961b30b29.png`
- implementation screenshot: `/Users/jinyuxu/Desktop/quantdinger_v5/QuantDinger-Vue/design-qa-quicktrade-centered-button.jpg`
- default-open screenshot: `/Users/jinyuxu/Desktop/quantdinger_v5/QuantDinger-Vue/design-qa-quicktrade-default-open.jpg`
- focused comparison: `/Users/jinyuxu/Desktop/quantdinger_v5/QuantDinger-Vue/design-qa-quicktrade-current-comparison.jpg`
- source pixels: 1336 × 374
- implementation pixels and CSS viewport: 2560 × 1440 at device scale 1
- state: signed in, dark theme, Indicator IDE, ETH/USDT perpetual market, demo account, active position, quick-trade dock expanded by default

## Findings

- P0: none.
- P1: none after iteration.
- P2: none after iteration.
- P3: none for the requested desktop state.

## Full-view evidence

A fresh visit to Indicator IDE renders the quick-trade body immediately and exposes `aria-expanded="true"`. The dock remains user-controlled: clicking its title collapses the body and clicking again restores the expanded state. The title bar remains the single entry point, so no duplicate top-toolbar control was reintroduced.

## Focused comparison evidence

The source close action appeared top-biased inside the far-right position action cell. The implementation uses a stable 148px action width and centers it on both axes. Browser geometry measured the button at 148 × 24px with a vertical center delta of 0px inside the real position row; computed `align-self` and `justify-self` are both `center`.

## Required fidelity surfaces

- Fonts and typography: existing QuantDinger labels and numerical hierarchy are unchanged.
- Spacing and layout rhythm: only the close-action alignment and width changed; the full-row position summary and surrounding grid remain intact.
- Colors and visual tokens: existing semantic red outline, dark surfaces, borders, and hover tokens are retained.
- Image and asset fidelity: no new product assets, custom SVGs, placeholders, or alternate icons were introduced.
- Copy and content: position fields, close-action copy, symbol, and market context are unchanged.

## Primary interactions tested

- Fresh route load: quick-trade body present and title reports `aria-expanded="true"`.
- Title click: body removed and title reports `aria-expanded="false"`.
- Second title click: body restored and title reports `aria-expanded="true"`.
- Contract mode loaded a real ETH/USDT position without submitting an order.
- Real close action measured 148px wide, vertically centered with `centerDeltaY: 0`, and computed horizontal/vertical alignment set to `center`.
- No visible component runtime error appeared during the interaction pass.

## Comparison history

1. Source issue: the close action occupied the right-side cell but was visually pinned toward its top edge.
2. Fix: changed the close action to `align-self: center`, `justify-self: center`, and a responsive 148px target width.
3. Product behavior update: changed the Indicator IDE quick-trade drawer initial state to open.
4. Post-fix evidence: fresh-load and collapse/reopen interactions passed, and exact browser geometry confirmed centered alignment.

## Automated checks

- ESLint passed for the changed Vue and unit-test files.
- Targeted Indicator IDE unit suite passed: 9/9.
- Production build passed.
- `git diff --check` passed.
