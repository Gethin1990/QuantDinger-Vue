<template>
  <a-spin :spinning="loading">
    <div v-if="error && !loading" class="bp-error" :class="{ 'theme-dark': isDarkTheme }">
      <a-icon type="warning" /> <span>{{ error }}</span>
      <a-button size="small" type="link" @click="load">{{ $t('brokerAccounts.refresh') }}</a-button>
    </div>
    <div v-else-if="!loading && (!info || isEmpty)" class="bp-empty" :class="{ 'theme-dark': isDarkTheme }">
      <a-icon type="inbox" /> <span>{{ $t('brokerAccounts.noAccount') }}</span>
    </div>
    <div v-else-if="info" class="account-grid" :class="{ 'theme-dark': isDarkTheme }">
      <div
        v-for="metric in metrics"
        :key="metric.key"
        class="metric-card"
        :class="metric.tone || ''"
      >
        <div class="metric-label">{{ metric.label }}</div>
        <div class="metric-value">{{ metric.value }}</div>
        <div v-if="metric.sub" class="metric-sub">{{ metric.sub }}</div>
      </div>
    </div>
  </a-spin>
</template>

<script>
import { broker } from '@/api/broker'

function num (v) {
  const n = Number(v)
  return isFinite(n) ? n : null
}
function money (v, ccy = 'USD') {
  const n = num(v)
  if (n == null) return '--'
  const sign = n < 0 ? '-' : ''
  const abs = Math.abs(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  return `${sign}${ccy === 'USD' ? '$' : ''}${abs}${ccy && ccy !== 'USD' ? ' ' + ccy : ''}`
}

export default {
  name: 'BrokerAccountCard',
  props: {
    brokerId: { type: String, required: true },
    isDarkTheme: { type: Boolean, default: false }
  },
  data () {
    return {
      info: null,
      positions: [],
      loading: false,
      error: null,
      timer: null
    }
  },
  computed: {
    isEmpty () {
      return !this.info || Object.keys(this.info).length === 0
    },
    metrics () {
      if (!this.info) return []
      const i = this.info
      const ccy = i.currency || i.account_currency || 'USD'
      const positionCount = this.resolvePositionCount(i, this.positions)
      if (this.brokerId === 'alpaca') {
        return [
          { key: 'equity', label: this.$t('brokerAccounts.kpi.equity'), value: money(i.equity || i.portfolio_value || i.summary?.Equity?.value, ccy) },
          { key: 'cash', label: this.$t('brokerAccounts.kpi.cash'), value: money(i.cash || i.summary?.Cash?.value, ccy) }, 
          { key: 'bp', label: this.$t('brokerAccounts.kpi.buyingPower'), value: money(i.buying_power || i.summary?.BuyingPower?.value, ccy), tone: 'accent' },
          { key: 'positions', label: this.$t('brokerAccounts.kpi.positionsCount'), value: positionCount == null ? '--' : String(positionCount) },
          { key: 'daytrades', label: this.$t('brokerAccounts.kpi.dayTrades'), value: String(i.daytrade_count || i.summary?.DayTradeCount?.value || '--') },
          { key: 'status', label: this.$t('brokerAccounts.kpi.accountStatus'), value: String(i.status || i.summary?.Status?.value?.replace('AccountStatus.', '') || 'ACTIVE'), tone: 'positive' }
        ]
      }
      if (this.brokerId === 'ibkr') {
        return [
          { key: 'nav', label: this.$t('brokerAccounts.kpi.netLiq'), value: money(i.net_liquidation || i.summary?.NetLiquidation?.value, ccy) },
          { key: 'cash', label: this.$t('brokerAccounts.kpi.cash'), value: money(i.total_cash_value || i.summary?.TotalCashValue?.value, ccy) },
          { key: 'bp', label: this.$t('brokerAccounts.kpi.buyingPower'), value: money(i.buying_power || i.summary?.BuyingPower?.value, ccy), tone: 'accent' },
          { key: 'init', label: this.$t('brokerAccounts.kpi.initMargin'), value: money(i.init_margin_req || i.summary?.InitMarginReq?.value, ccy) },
          { key: 'maint', label: this.$t('brokerAccounts.kpi.maintMargin'), value: money(i.maint_margin_req || i.summary?.MaintMarginReq?.value, ccy) },
          { key: 'account', label: this.$t('brokerAccounts.kpi.account'), value: String(i.account || i.summary?.AccountCode || '--') }
        ]
      }
      // mt5
      return [
        { key: 'balance', label: this.$t('brokerAccounts.kpi.balance'), value: money(i.balance, ccy) },
        { key: 'equity', label: this.$t('brokerAccounts.kpi.equity'), value: money(i.equity, ccy) },
        { key: 'margin', label: this.$t('brokerAccounts.kpi.margin'), value: money(i.margin, ccy) },
        { key: 'free', label: this.$t('brokerAccounts.kpi.freeMargin'), value: money(i.margin_free, ccy), tone: 'accent' },
        { key: 'leverage', label: this.$t('brokerAccounts.kpi.leverage'), value: i.leverage ? `1:${i.leverage}` : '--' },
        { key: 'profit', label: this.$t('brokerAccounts.kpi.openPnl'), value: money(i.profit, ccy), tone: num(i.profit) >= 0 ? 'positive' : 'negative' }
      ]
    }
  },
  mounted () {
    this.load()
  },
  beforeDestroy () {
    if (this.timer) clearTimeout(this.timer)
  },
  methods: {
    resolvePositionCount (info, positions) {
      const direct = info && (info.position_count || info.positions_count || info.open_position_count || info.open_positions)
      if (direct != null && direct !== '') return Number(direct)
      if (Array.isArray(positions)) return positions.length
      return null
    },
    async load () {
      this.loading = true
      this.error = null
      try {
        const [accountRes, positionsRes] = await Promise.allSettled([
          broker[this.brokerId].account(),
          broker[this.brokerId].positions()
        ])

        // Handle account response
        if (accountRes.status === 'rejected') {
          const reason = accountRes.reason
          this.error = (reason && (reason.response && reason.response.data && reason.response.data.error || reason.message)) || 'Account request failed'
          this.info = null
        } else {
          const raw = accountRes.value || {}
          const payload = raw.data || raw
          // IBKR returns { success, data: { account, summary } }
          // The summary dict has { NetLiquidation: { value, currency }, ... }
          // Flatten it so the metrics computed prop can read both:
          //   i.summary.NetLiquidation.value  AND  i.net_liquidation (top-level)
          let accountInner = payload
          // If payload has nested "data" (double-wrapped), unwrap once more
          if (payload && payload.data && typeof payload.data === 'object' && !payload.connected) {
            accountInner = payload.data
          }
          // For IBKR: flatten summary tags into top-level snake_case keys
          if (accountInner && accountInner.summary && typeof accountInner.summary === 'object') {
            const flat = { ...accountInner }
            for (const [tag, val] of Object.entries(accountInner.summary)) {
              // e.g. NetLiquidation → net_liquidation
              const snakeKey = tag.replace(/([A-Z])/g, (m, off) => (off ? '_' : '') + m.toLowerCase())
              flat[snakeKey] = typeof val === 'object' ? val.value : val
            }
            flat.currency = flat.currency || (accountInner.summary.NetLiquidation && accountInner.summary.NetLiquidation.currency) || 'USD'
            accountInner = flat
          }
          this.info = accountInner && Object.keys(accountInner).length ? accountInner : null
        }

        const positionsPayload = positionsRes.status === 'fulfilled'
          ? ((positionsRes.value && (positionsRes.value.data || positionsRes.value)) || {})
          : {}
        const list = Array.isArray(positionsPayload)
          ? positionsPayload
          : (Array.isArray(positionsPayload.data)
              ? positionsPayload.data
              : (positionsPayload.positions || []))
        this.positions = Array.isArray(list) ? list : []
      } catch (e) {
        this.info = null
        this.error = (e && e.message) || 'Failed to load account'
        this.positions = []
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style lang="less" scoped>
.account-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 12px;
}
.metric-card {
  padding: 14px 16px;
  border-radius: 10px;
  border: 1px solid #eef0f3;
  background: linear-gradient(165deg, #ffffff 0%, #f9fbff 100%);
  &.accent { border-color: rgba(24, 144, 255, 0.25); background: linear-gradient(165deg, rgba(24, 144, 255, 0.04) 0%, #fff 100%); }
  &.positive { border-color: rgba(82, 196, 26, 0.3); }
  &.negative { border-color: rgba(245, 34, 45, 0.3); }
}
.metric-label { font-size: 11px; color: #8c8c8c; text-transform: uppercase; letter-spacing: 0.3px; }
.metric-value {
  margin-top: 8px;
  font-size: 20px;
  font-weight: 700;
  color: #1f1f1f;
  font-variant-numeric: tabular-nums;
}
.metric-card.positive .metric-value { color: #389e0d; }
.metric-card.negative .metric-value { color: #cf1322; }
.metric-card.accent .metric-value { color: #1890ff; }
.metric-sub { margin-top: 4px; font-size: 11px; color: #8c8c8c; }
.account-grid.theme-dark {
  .metric-card {
    background: linear-gradient(165deg, #1b1f24 0%, #151719 100%);
    border-color: #30363d;

    &.accent {
      background: linear-gradient(165deg, rgba(24, 144, 255, 0.14) 0%, #171b20 100%);
      border-color: rgba(88, 166, 255, 0.45);
    }

    &.positive {
      background: linear-gradient(165deg, rgba(82, 196, 26, 0.12) 0%, #171b18 100%);
      border-color: rgba(82, 196, 26, 0.35);
    }

    &.negative {
      background: linear-gradient(165deg, rgba(245, 34, 45, 0.12) 0%, #1d1718 100%);
      border-color: rgba(245, 34, 45, 0.35);
    }
  }

  .metric-label,
  .metric-sub {
    color: rgba(255, 255, 255, 0.5);
  }

  .metric-value {
    color: rgba(255, 255, 255, 0.9);
  }
}
.bp-empty {
  padding: 32px;
  text-align: center;
  color: #8c8c8c;
  font-size: 13px;
  i { font-size: 22px; display: block; margin-bottom: 8px; }
}
.bp-error {
  padding: 24px;
  text-align: center;
  color: #cf1322;
  font-size: 13px;
  i { font-size: 22px; display: block; margin-bottom: 8px; }
  .ant-btn-link { color: #1890ff; font-size: 13px; }
}
.bp-empty.theme-dark {
  color: rgba(255, 255, 255, 0.5);
}
.bp-error.theme-dark {
  color: rgba(245, 34, 45, 0.8);
  .ant-btn-link { color: #40a9ff; }
}
</style>
