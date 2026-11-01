import assert from 'node:assert/strict'
import fs from 'node:fs'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

const componentPath = fileURLToPath(
  new URL('../../src/views/backtest-center/FactorResearchResult.vue', import.meta.url)
)
const source = fs.readFileSync(componentPath, 'utf8')

test('factor correlation matrix uses light surfaces by default and dark surfaces only in dark mode', () => {
  assert.match(source, /\.correlation-grid \{[^}]*border: 1px solid #e2e8f0;[^}]*background: #e2e8f0;/)
  assert.match(source, /\.correlation-head, \.correlation-corner \{ background: #f8fafc; \}/)
  assert.match(source, /\.factor-result\.theme-dark \.correlation-grid \{[^}]*background: #303030;/)
  assert.match(source, /\.factor-result\.theme-dark \.correlation-head, \.factor-result\.theme-dark \.correlation-corner \{[^}]*background: #111;/)
})

test('factor correlation cells adjust fill intensity and text contrast for the active theme', () => {
  assert.match(source, /const alpha = this\.isDark/)
  assert.match(source, /Math\.min\(0\.42, intensity \* 0\.34 \+ 0\.06\)/)
  assert.match(source, /color: this\.isDark \? '#fff' : '#1f2937'/)
})
