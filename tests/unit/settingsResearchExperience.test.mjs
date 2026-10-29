import assert from 'node:assert/strict'
import test from 'node:test'
import { readFileSync } from 'node:fs'

import settingsResearchOverrides from '../../src/locales/settings-research-overrides.js'

const locales = Object.keys(settingsResearchOverrides)

const researchExperienceKeys = [
  'settings.research.zeroConfigTitle',
  'settings.research.zeroConfigDesc',
  'settings.research.marketMap',
  'settings.research.market.shared',
  'settings.research.market.sharedDesc',
  'settings.research.market.macro',
  'settings.research.market.macroDesc',
  'settings.research.market.us',
  'settings.research.market.usDesc',
  'settings.research.market.hk',
  'settings.research.market.hkDesc',
  'settings.research.market.crypto',
  'settings.research.market.cryptoDesc',
  'settings.research.market.futures',
  'settings.research.market.futuresDesc',
  'settings.research.market.forex',
  'settings.research.market.forexDesc',
  'settings.research.badge.recommended',
  'settings.research.badge.optional',
  'settings.research.badge.keyOptional',
  'settings.research.badge.publicReady',
  'settings.research.badge.noSetup',
  'settings.research.section.community',
  'settings.search.section.primary',
  'settings.search.section.primaryDesc',
  'settings.search.section.optional',
  'settings.search.section.optionalDesc',
  'settings.search.sharedTitle',
  'settings.search.sharedDesc',
  'settings.agent.optionalTitle',
  'settings.agent.optionalDesc',
  'settings.agent.section.deployment',
  'settings.agent.section.deploymentDesc',
  'settings.agent.section.quality',
  'settings.agent.section.qualityDesc',
  'settings.agent.section.calibration',
  'settings.agent.section.calibrationDesc',
  'settings.agent.badge.shared',
  'settings.agent.badge.needsSamples',
  'settings.advanced.show',
  'settings.advanced.hide',
  'settings.advanced.description',
  'settings.desc.ALPHA_VANTAGE_API_KEY'
]

const canonicalLabels = {
  'settings.option.LLM_PROVIDER.atlascloud': 'AtlasCloud',
  'settings.option.LLM_PROVIDER.deepseek': 'DeepSeek',
  'settings.option.LLM_PROVIDER.grok': 'xAI Grok',
  'settings.option.LLM_PROVIDER.minimax': 'MiniMax',
  'settings.option.SEARCH_PROVIDER.tavily': 'Tavily',
  'settings.option.SEARCH_PROVIDER.searxng': 'SearXNG',
  'settings.option.SEARCH_PROVIDER.duckduckgo': 'DuckDuckGo',
  'settings.field.OPENROUTER_API_URL': 'OpenRouter API URL',
  'settings.field.GROK_BASE_URL': 'xAI Grok Base URL',
  'settings.field.TWELVE_DATA_API_KEY': 'Twelve Data API Key',
  'settings.field.COINGLASS_API_KEY': 'CoinGlass API Key',
  'settings.field.CRYPTOQUANT_API_KEY': 'CryptoQuant API Key',
  'settings.field.TRADING_ECONOMICS_KEY': 'Trading Economics API Key',
  'settings.field.GOOGLE_CLIENT_ID': 'Google OAuth Client ID',
  'settings.field.TURNSTILE_SITE_KEY': 'Cloudflare Turnstile Site Key'
}

test('provider and API brands keep canonical names in every locale', () => {
  for (const locale of locales) {
    const messages = settingsResearchOverrides[locale]
    for (const [key, expected] of Object.entries(canonicalLabels)) {
      assert.equal(messages[key], expected, `${locale}.${key}`)
    }
  }
})

test('research settings have complete copy in every supported locale', () => {
  assert.deepEqual(locales.sort(), [
    'ar-SA', 'de-DE', 'en-US', 'fr-FR', 'ja-JP', 'ko-KR',
    'ru-RU', 'th-TH', 'vi-VN', 'zh-CN', 'zh-TW'
  ])
  for (const locale of locales) {
    const messages = settingsResearchOverrides[locale]
    for (const key of researchExperienceKeys) {
      assert.equal(typeof messages[key], 'string', `${locale}.${key}`)
      assert.ok(messages[key].trim(), `${locale}.${key} is not empty`)
    }
  }
})

test('research settings are grouped by market and advanced controls start collapsed', () => {
  const source = readFileSync(
    new URL('../../src/views/settings/index.vue', import.meta.url),
    'utf8'
  )
  assert.match(source, /dataSourceSectionDefinitions \(\)/)
  assert.match(source, /searchSectionDefinitions \(\)/)
  assert.match(source, /agentSectionDefinitions \(\)/)
  for (const market of ['shared', 'us', 'hk', 'crypto', 'futures', 'forex']) {
    assert.match(source, new RegExp(`settings\\.research\\.market\\.${market}`))
  }
  assert.match(source, /advancedKeys/)
  assert.match(source, /advancedExpanded: \{\}/)
  assert.match(source, /settings\.research\.zeroConfigTitle/)
  assert.match(source, /settings\.search\.sharedTitle/)
  assert.match(source, /settings\.agent\.optionalTitle/)
})

test('market-specific credentials appear only in their intended research sections', () => {
  const source = readFileSync(
    new URL('../../src/views/settings/index.vue', import.meta.url),
    'utf8'
  )
  for (const key of [
    'FINNHUB_API_KEY',
    'ALPHA_VANTAGE_API_KEY',
    'TWELVE_DATA_API_KEY',
    'COINGLASS_API_KEY',
    'CRYPTOQUANT_API_KEY',
    'TIINGO_API_KEY'
  ]) {
    assert.match(source, new RegExp(key))
  }
  assert.match(source, /CFTC positioning and public contract data are built in/)
  assert.match(source, /'FINNHUB_FREE_ONLY',\s*'ALPHA_VANTAGE_API_KEY'/)
  assert.match(source, /'ALPHA_VANTAGE_BASE_URL',\s*'ALPHA_VANTAGE_TIMEOUT',\s*'ALPHA_VANTAGE_NEWS_LIMIT'/)
})

test('professional report runtime controls are represented in the settings UI', () => {
  const source = readFileSync(
    new URL('../../src/views/settings/index.vue', import.meta.url),
    'utf8'
  )
  for (const key of [
    'PROFESSIONAL_REPORT_DATA_TIER',
    'PROFESSIONAL_REPORT_RISK_BUDGET_PCT'
  ]) {
    assert.match(source, new RegExp(key))
  }

  for (const locale of locales) {
    assert.ok(
      settingsResearchOverrides[locale]['settings.field.FAST_ANALYSIS_INCLUDE_GLOBAL_NEWS'],
      `${locale} exposes the global-news control returned by the backend schema`
    )
  }
})
