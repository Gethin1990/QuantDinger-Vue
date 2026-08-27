import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const read = path => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8')

test('fast analysis displays final R/R warning and regime outcome monitoring', () => {
  const report = read('src/views/ai-analysis/components/FastAnalysisReport.vue')

  assert.match(report, /tp\.risk_reward_ratio \?\? tp\.riskRewardRatio/)
  assert.match(report, /tp\.rr_warning \?\? tp\.rrWarning/)
  assert.match(report, /hasLowRiskReward/)
  assert.match(report, /regime_performance/)
})

test('strategy logs render typed market-data failures with actionable reasons', () => {
  const logs = read('src/views/strategy-center/components/StrategyLogs.vue')

  assert.match(logs, /event_type === 'market_data_unavailable'/)
  assert.match(logs, /market_data_error/)
  assert.match(logs, /marketDataReasonLabel/)
  assert.match(logs, /marketDataAction/)
  assert.match(logs, /technical_detail/)
})
