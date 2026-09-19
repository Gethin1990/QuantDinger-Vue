<template>
  <div class="ai-decision-records strategy-tab-pane-inner" :class="{ 'theme-dark': isDark }">
    <div class="ai-decision-records__head">
      <div>
        <h3>{{ $t('aiDecisionFilter.processTitle') }}</h3>
        <p>{{ $t('aiDecisionFilter.processHint') }}</p>
      </div>
      <a-button icon="reload" :loading="loading" @click="load">{{ $t('common.refresh') }}</a-button>
    </div>
    <a-spin :spinning="loading">
      <a-empty v-if="!rows.length" :description="$t('aiDecisionFilter.noRecords')" />
      <a-timeline v-else>
        <a-timeline-item v-for="row in rows" :key="row.decision_uid" :color="decisionColor(row)">
          <div class="ai-decision-record">
            <div class="ai-decision-record__top">
              <a-tag :color="decisionColor(row)">{{ decisionLabel(row) }}</a-tag>
              <strong>{{ row.action }} · {{ row.symbol }}</strong>
              <span>{{ formatTime(row.created_at) }}</span>
            </div>
            <div class="ai-decision-record__meta">
              <span>{{ $t('aiDecisionFilter.provider') }}: {{ row.provider || '-' }}</span>
              <span v-if="row.model">{{ $t('aiDecisionFilter.model') }}: {{ row.model }}</span>
              <span v-if="row.confidence != null">{{ $t('aiDecisionFilter.confidence') }}: {{ formatConfidence(row.confidence) }}</span>
              <span>{{ row.latency_ms || 0 }} ms</span>
            </div>
            <div v-if="decisionChecks(row).length" class="ai-decision-record__checks">
              <a-tag v-for="check in decisionChecks(row)" :key="check.name">
                {{ checkLabel(check.name) }}: {{ checkResultLabel(check.result) }} · {{ checkProbability(check) }}
              </a-tag>
            </div>
            <p>{{ reasonText(row.reason) }}</p>
            <p v-if="row.fallback_reason" class="ai-decision-record__fallback">{{ fallbackText(row) }}</p>
          </div>
        </a-timeline-item>
      </a-timeline>
    </a-spin>
  </div>
</template>

<script>
import { getStrategyAiDecisions } from '@/api/strategy'

export default {
  name: 'AiDecisionRecords',
  props: {
    strategyId: { type: [Number, String], required: true },
    isDark: { type: Boolean, default: false }
  },
  data () {
    return { rows: [], loading: false }
  },
  watch: {
    strategyId: { immediate: true, handler () { this.load() } }
  },
  methods: {
    async load () {
      if (!this.strategyId) return
      this.loading = true
      try {
        const res = await getStrategyAiDecisions(this.strategyId)
        this.rows = (res && Array.isArray(res.data)) ? res.data : []
      } finally {
        this.loading = false
      }
    },
    decisionColor (row) {
      if (row.decision === 'reject' || row.allowed === false) return 'red'
      if (row.decision === 'pass') return 'green'
      return 'orange'
    },
    decisionLabel (row) {
      const key = row.decision === 'reject' || row.allowed === false
        ? 'aiDecisionFilter.decisionReject'
        : row.decision === 'pass' ? 'aiDecisionFilter.decisionPass' : 'aiDecisionFilter.decisionSkipped'
      return this.$t(key)
    },
    formatConfidence (value) {
      return `${(Number(value || 0) * 100).toFixed(1)}%`
    },
    formatTime (value) {
      return value ? new Date(value).toLocaleString() : ''
    },
    reasonText (reason) {
      const raw = String(reason || '')
      const exactKey = `aiDecisionFilter.reason.${raw}`
      const exact = this.$t(exactKey)
      if (exact !== exactKey) return exact
      const baseKey = `aiDecisionFilter.reason.${raw.split(':')[0]}`
      const translated = this.$t(baseKey)
      return translated === baseKey ? (raw || '-') : translated
    },
    decisionChecks (row) {
      const checks = row && row.checks_json
      if (Array.isArray(checks)) return checks
      if (typeof checks !== 'string') return []
      try {
        const parsed = JSON.parse(checks)
        return Array.isArray(parsed) ? parsed : []
      } catch (e) {
        return []
      }
    },
    checkLabel (name) {
      const key = `aiDecisionFilter.check.${String(name || '')}`
      const translated = this.$t(key)
      return translated === key ? (name || '-') : translated
    },
    checkResultLabel (result) {
      const key = `aiDecisionFilter.checkResult.${String(result || '')}`
      const translated = this.$t(key)
      return translated === key ? (result || '-') : translated
    },
    checkProbability (check) {
      const probabilities = (check && check.probabilities) || {}
      const value = probabilities[check.result]
      const confidence = value == null ? check.confidence : value
      return confidence == null ? '-' : this.formatConfidence(confidence)
    },
    fallbackText (row) {
      return this.$t(row.provider === 'llm'
        ? 'aiDecisionFilter.fallbackToLlm'
        : 'aiDecisionFilter.providerUnavailable')
    }
  }
}
</script>

<style lang="less" scoped>
.ai-decision-records { min-height: 260px; padding: 18px 20px; }
.ai-decision-records__head { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 22px; }
.ai-decision-records__head h3 { margin: 0; font-size: 16px; }
.ai-decision-records__head p { margin: 5px 0 0; color: #8c8c8c; }
.ai-decision-record { padding: 0 0 8px; }
.ai-decision-record__top { display: flex; align-items: center; gap: 9px; }
.ai-decision-record__top span:last-child { margin-left: auto; color: #8c8c8c; font-size: 12px; }
.ai-decision-record__meta { display: flex; flex-wrap: wrap; gap: 12px; margin: 7px 0; color: #8c8c8c; font-size: 12px; }
.ai-decision-record__checks { display: flex; flex-wrap: wrap; gap: 6px; margin: 8px 0; }
.ai-decision-record p { margin: 4px 0 0; }
.ai-decision-record__fallback { color: #d48806; font-size: 12px; }
.theme-dark { color: #e5e7eb; }
</style>
