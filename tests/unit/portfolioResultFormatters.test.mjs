import assert from 'node:assert/strict'
import test from 'node:test'
import { formatVisibleWeights } from '../../src/views/backtest-center/portfolioResultFormatters.js'

const formatRate = value => `${(Number(value) * 100).toFixed(2)}%`

test('rebalance weights omit values that render as zero', () => {
  const result = formatVisibleWeights({
    'USStock:AAPL': 0,
    'USStock:MSFT': 0.000049,
    'USStock:AMD': 0.0949,
    'Crypto:BTC/USDT@okx:swap': -0.125
  }, formatRate)

  assert.equal(result, 'BTC/USDT -12.50% · AMD 9.49%')
})

test('rebalance weights reject invalid values and use a compact empty state', () => {
  assert.equal(formatVisibleWeights({ AAPL: Number.NaN, MSFT: 0 }, formatRate), '-')
  assert.equal(formatVisibleWeights(null, formatRate), '-')
})
