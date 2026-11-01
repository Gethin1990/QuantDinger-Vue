import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const read = relativePath => fs.readFileSync(path.join(root, relativePath), 'utf8')

test('live portfolio strategies keep their universe identity separate from single-symbol strategies', () => {
  const operations = read('src/views/strategy-center/components/LiveOperationsTable.vue')
  const editor = read('src/views/strategy-center/components/LiveStrategyEditor.vue')

  assert.match(operations, /strategyType === 'portfolio'/)
  assert.match(operations, /rawSymbol\.startsWith\('basket:'\)/)
  assert.match(operations, /rawSymbol\.startsWith\('universe:'\)/)
  assert.match(operations, /strategyV2\.dynamicUniverse/)
  assert.match(operations, /class="portfolio-pill"/)
  assert.match(editor, /!this\.isPortfolioStrategy/)
})

test('live portfolio positions expose aggregate values and per-instrument weights', () => {
  const operations = read('src/views/strategy-center/components/LiveOperationsTable.vue')
  const positions = read('src/views/strategy-center/components/PositionRecords.vue')
  const trades = read('src/views/strategy-center/components/TradingRecords.vue')

  assert.match(operations, /:portfolio="isPortfolioStrategy"/)
  assert.match(operations, /@summary-change="positionSummary = \$event"/)
  assert.match(positions, /class="portfolio-position-summary"/)
  assert.match(positions, /strategyV2\.backtest\.weight/)
  assert.match(positions, /getPositionWeight \(record\)/)
  assert.match(positions, /this\.\$emit\('summary-change'/)
  assert.match(trades, /v-if="portfolio" color="purple"/)
})
