import assert from 'node:assert/strict'
import fs from 'node:fs'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

const layoutStylePath = fileURLToPath(
  new URL('../../src/layouts/BasicLayout.less', import.meta.url)
)
const source = fs.readFileSync(layoutStylePath, 'utf8')

test('sidebar navigation uses the dedicated multilingual typography stack', () => {
  assert.match(source, /--qd-navigation-font:[\s\S]*?'SF Pro Text',[\s\S]*?'Segoe UI Variable Text',[\s\S]*?'HarmonyOS Sans SC'/)
  assert.match(source, /'MiSans',[\s\S]*?'PingFang SC',[\s\S]*?'Noto Sans SC',[\s\S]*?'Microsoft YaHei UI',[\s\S]*?sans-serif;/)
  assert.match(source, /\.ant-pro-sider-menu-sider \.ant-menu-item,[\s\S]*?font-family: var\(--qd-navigation-font\) !important;[\s\S]*?font-size: 14px !important;/)
  assert.match(source, /\.basic-layout-wrapper \.ant-pro-sider-menu-sider \.ant-menu-item-selected,[\s\S]*?font-weight: 650 !important;/)
})
