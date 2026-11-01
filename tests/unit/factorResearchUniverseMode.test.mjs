import assert from 'node:assert/strict'
import fs from 'node:fs'
import test from 'node:test'

const source = fs.readFileSync(new URL('../../src/views/backtest-center/index.vue', import.meta.url), 'utf8')

test('factor research selects a universe and frequency instead of a strategy source', () => {
  assert.match(source, /v-model="factorForm\.universeId"/)
  assert.match(source, /v-model="factorForm\.frequency"/)
  assert.match(source, /import \{ getUniverses \} from '@\/api\/universe'/)

  const method = source.match(/async runFactorResearch \(\) \{([\s\S]*?)\n    \},\n    runActive/)
  assert.ok(method)
  assert.match(method[1], /universeId: this\.factorForm\.universeId/)
  assert.match(method[1], /frequency: this\.factorForm\.frequency/)
  assert.doesNotMatch(method[1], /sourceId: this\.form\.sourceId/)
})

test('portfolio backtests keep their existing source-controlled request', () => {
  const method = source.match(/async run \(\) \{([\s\S]*?)\n    \},\n    async runFactorResearch/)
  assert.ok(method)
  assert.match(method[1], /sourceId: this\.form\.sourceId/)
})
