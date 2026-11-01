import assert from 'node:assert/strict'
import fs from 'node:fs'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

const componentPath = fileURLToPath(
  new URL('../../src/views/strategy-ide/UniverseLibraryModal.vue', import.meta.url)
)
const source = fs.readFileSync(componentPath, 'utf8')

test('universe library accent states follow the configured primary color', () => {
  assert.match(source, /--universe-accent: var\(--primary-color, #1890ff\);/)
  assert.match(source, /\.universe-create-button\.ant-btn \{[\s\S]*?color: var\(--universe-accent\);/)
  assert.match(source, /\.universe-card--active \{[\s\S]*?border-color: var\(--universe-accent\);/)
  assert.match(source, /\.universe-card:hover \{[\s\S]*?border-color: var\(--universe-accent\);/)
  assert.match(source, /\.universe-card__scope--watchlist \{[\s\S]*?color: var\(--universe-accent\);/)
  assert.doesNotMatch(source, /#faad14|#ffc53d|#d48806|#ffd666|rgba\(250, 173, 20/)
  assert.doesNotMatch(source, /item\.code === 'watchlist' \? 'gold'/)
})
