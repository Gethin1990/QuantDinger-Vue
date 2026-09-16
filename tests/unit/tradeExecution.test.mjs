import assert from 'node:assert/strict'
import test from 'node:test'
import { formatExecutionNumber, formatPriceDeviation } from '../../src/utils/tradeExecution.js'
import messages from '../../src/locales/lang/strategy-trade-records.js'

test('execution values preserve small fills and distinguish unknown from zero', () => {
  assert.equal(formatExecutionNumber(0.00016199), '0.00016199')
  assert.equal(formatExecutionNumber(0.00000000123), '0.00000000123')
  assert.equal(formatExecutionNumber(75724.6), '75,724.6')
  assert.equal(formatExecutionNumber(0), '0')
  for (const value of [null, undefined, '', NaN, Infinity]) {
    assert.equal(formatExecutionNumber(value), '--')
    assert.equal(formatPriceDeviation(value), '--')
  }
})

test('price deviation preserves direction and missing references', () => {
  assert.equal(formatPriceDeviation(1), '+1%')
  assert.equal(formatPriceDeviation(-1), '-1%')
  assert.equal(formatPriceDeviation(0), '0%')
})

test('execution labels are available in every supported locale', () => {
  for (const locale of Object.values(messages)) {
    for (const key of ['price', 'reference', 'deviation', 'note', 'deviationHint', 'orderId']) {
      assert.ok(locale[`trading-assistant.execution.${key}`])
    }
  }
})


test('records table stays visible alongside its execution note', async () => {
  const { readFileSync } = await import('node:fs')
  const { createRequire } = await import('node:module')
  const require = createRequire(import.meta.url)
  const Vue = require('vue')
  const compiler = require('vue-template-compiler')
  const source = readFileSync(new URL('../../src/views/strategy-center/components/TradingRecords.vue', import.meta.url), 'utf8')
  const compiled = compiler.compile(compiler.parseComponent(source).template.content)
  assert.deepEqual(compiled.errors, [])
  for (const [records, loading, expected] of [[[{ id: 1 }], false, true], [[], false, false], [[], true, true]]) {
    const instance = new Vue({
      data: () => ({ records, isRecordsLoading: loading, isDark: false, hasCostSummary: false, costSummaryItems: [], columns: [] }),
      methods: { $t: key => key },
      render: new Function(compiled.render),
      staticRenderFns: compiled.staticRenderFns.map(code => new Function(code))
    })
    const root = instance._render()
    assert.equal(root.children.some(node => node.tag === 'a-table'), expected)
    instance.$destroy()
  }
})
