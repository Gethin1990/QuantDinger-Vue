<template>
  <div class="setting-drawer" :class="{ 'setting-drawer--dark': isDarkDrawer }">
    <a-drawer
      v-if="visible"
      :width="drawerWidth"
      placement="right"
      @close="onClose"
      :closable="true"
      :visible="visible"
      :get-container="false"
      :destroy-on-close="true"
    >
      <div class="setting-drawer-index-content">

        <section class="setting-section">
          <div class="setting-section__heading">
            <span class="setting-section__icon"><a-icon type="layout" /></span>
            <h3 class="setting-drawer-index-title">{{ $t('app.setting.pagestyle') }}</h3>
          </div>

          <div class="setting-drawer-index-blockChecbox">
            <a-tooltip>
              <template slot="title">
                {{ $t('app.setting.pagestyle.dark') }}
              </template>
              <button
                type="button"
                class="setting-drawer-index-item"
                :class="{ 'setting-drawer-index-item--active': isDarkNavTheme }"
                :aria-label="$t('app.setting.pagestyle.dark')"
                @click="handleMenuTheme('realdark')"
              >
                <img src="https://gw.alipayobjects.com/zos/rmsportal/LCkqqYNmvBEbokSDscrm.svg" alt="dark" />
                <span>{{ $t('app.setting.pagestyle.dark') }}</span>
                <div class="setting-drawer-index-selectIcon" v-if="isDarkNavTheme">
                  <a-icon type="check"/>
                </div>
              </button>
            </a-tooltip>

            <a-tooltip>
              <template slot="title">
                {{ $t('app.setting.pagestyle.light') }}
              </template>
              <button
                type="button"
                class="setting-drawer-index-item"
                :class="{ 'setting-drawer-index-item--active': currentNavTheme === 'light' }"
                :aria-label="$t('app.setting.pagestyle.light')"
                @click="handleMenuTheme('light')"
              >
                <img src="https://gw.alipayobjects.com/zos/rmsportal/jpRkZQMyYRryryPNtyIC.svg" alt="light" />
                <span>{{ $t('app.setting.pagestyle.light') }}</span>
                <div class="setting-drawer-index-selectIcon" v-if="currentNavTheme === 'light'">
                  <a-icon type="check"/>
                </div>
              </button>
            </a-tooltip>
          </div>
        </section>

        <!-- Theme color selector controls app-level accent styles. -->
        <section class="setting-section">
          <div class="setting-section__heading">
            <span class="setting-section__icon"><a-icon type="bg-colors" /></span>
            <h3 class="setting-drawer-index-title">{{ $t('app.setting.themecolor') }}</h3>
          </div>

          <div class="setting-drawer-theme-color-list">
            <a-tooltip class="setting-drawer-theme-color-colorBlock" v-for="(item, index) in colorList" :key="index">
              <template slot="title">
                {{ item.key }}
              </template>
              <button
                type="button"
                class="setting-drawer-theme-color-swatch"
                :class="{ 'setting-drawer-theme-color-swatch--active': item.color === currentPrimaryColor }"
                :style="{ backgroundColor: item.color }"
                @click="changeColor(item.color)"
              >
                <a-icon type="check" v-if="item.color === currentPrimaryColor"></a-icon>
              </button>
            </a-tooltip>

          </div>
        </section>

        <!-- Navigation Mode and Content Width are hidden -->
        <div :style="{ marginBottom: '24px', display: 'none' }">
          <h3 class="setting-drawer-index-title">{{ $t('app.setting.navigationmode') }}</h3>

          <div class="setting-drawer-index-blockChecbox">
            <a-tooltip>
              <template slot="title">
                {{ $t('app.setting.sidemenu.nav') }}
              </template>
              <div class="setting-drawer-index-item" @click="handleLayout('sidemenu')">
                <img src="https://gw.alipayobjects.com/zos/rmsportal/JopDzEhOqwOjeNTXkoje.svg" alt="sidemenu" />
                <div class="setting-drawer-index-selectIcon" v-if="layoutMode === 'sidemenu'">
                  <a-icon type="check"/>
                </div>
              </div>
            </a-tooltip>

            <a-tooltip>
              <template slot="title">
                {{ $t('app.setting.topmenu.nav') }}
              </template>
              <div class="setting-drawer-index-item" @click="handleLayout('topmenu')">
                <img src="https://gw.alipayobjects.com/zos/rmsportal/KDNDBbriJhLwuqMoxcAr.svg" alt="topmenu" />
                <div class="setting-drawer-index-selectIcon" v-if="layoutMode !== 'sidemenu'">
                  <a-icon type="check"/>
                </div>
              </div>
            </a-tooltip>
          </div>
          <div :style="{ marginTop: '24px' }">
            <a-list :split="false">
              <a-list-item>
                <a-tooltip slot="actions">
                  <template slot="title">
                    {{ $t('app.setting.content-width.tooltip') }}
                  </template>
                  <a-select size="small" style="width: 80px;" :defaultValue="currentContentWidth" @change="handleContentWidthChange">
                    <a-select-option value="Fixed">{{ $t('app.setting.content-width.fixed') }}</a-select-option>
                    <a-select-option value="Fluid" v-if="layoutMode !== 'sidemenu'">{{ $t('app.setting.content-width.fluid') }}</a-select-option>
                  </a-select>
                </a-tooltip>
                <a-list-item-meta>
                  <div slot="title">{{ $t('app.setting.content-width') }}</div>
                </a-list-item-meta>
              </a-list-item>
              <a-list-item>
                <a-switch slot="actions" size="small" :defaultChecked="currentFixedHeader" @change="handleFixedHeader" />
                <a-list-item-meta>
                  <div slot="title">{{ $t('app.setting.fixedheader') }}</div>
                </a-list-item-meta>
              </a-list-item>
              <a-list-item>
                <a-switch slot="actions" size="small" :disabled="!currentFixedHeader" :defaultChecked="currentAutoHideHeader" @change="handleFixedHeaderHidden" />
                <a-list-item-meta>
                  <a-tooltip slot="title" placement="left">
                    <template slot="title">{{ $t('app.setting.fixedheader.tooltip') }}</template>
                    <div :style="{ opacity: !currentFixedHeader ? '0.5' : '1' }">{{ $t('app.setting.autoHideHeader') }}</div>
                  </a-tooltip>
                </a-list-item-meta>
              </a-list-item>
              <a-list-item >
                <a-switch slot="actions" size="small" :disabled="(layoutMode === 'topmenu')" :defaultChecked="fixSiderbar" @change="handleFixSiderbar" />
                <a-list-item-meta>
                  <div slot="title" :style="{ textDecoration: layoutMode === 'topmenu' ? 'line-through' : 'unset' }">{{ $t('app.setting.fixedsidebar') }}</div>
                </a-list-item-meta>
              </a-list-item>
            </a-list>
          </div>
        </div>
        <section class="setting-section setting-section--compact">
          <div class="setting-section__heading">
            <span class="setting-section__icon"><a-icon type="sliders" /></span>
            <h3 class="setting-drawer-index-title">{{ $t('app.setting.othersettings') }}</h3>
          </div>
          <div>
            <a-list :split="false">
              <a-list-item>
                <a-switch slot="actions" size="small" :defaultChecked="currentColorWeak" @change="onColorWeak" />
                <a-list-item-meta>
                  <div slot="title">{{ $t('app.setting.weakmode') }}</div>
                </a-list-item-meta>
              </a-list-item>
              <a-list-item>
                <a-switch slot="actions" size="small" :defaultChecked="currentMultiTab" @change="onMultiTab" />
                <a-list-item-meta>
                  <div slot="title">{{ $t('app.setting.multitab') }}</div>
                </a-list-item-meta>
              </a-list-item>
            </a-list>
          </div>
        </section>
        <slot />
      </div>
    </a-drawer>
  </div>
</template>

<script>
import SettingItem from './SettingItem'
import config from '@/config/defaultSettings'
import { updateColorWeak, getColorList } from './settingConfig'
import { baseMixin } from '@/store/app-mixin'

export default {
  components: {
    SettingItem
  },
  props: {
    settings: {
      type: Object,
      default: () => ({})
    }
  },
  mixins: [baseMixin],
  data () {
    return {
      visible: false
    }
  },
  computed: {
    colorList () {
      return getColorList()
    },
    layoutMode () {
      return this.settings.layout || this.layout || 'sidemenu'
    },
    fixSiderbar () {
      return this.settings.fixSiderbar !== undefined ? this.settings.fixSiderbar : (this.fixedSidebar || false)
    },
    currentNavTheme () {
      return this.settings.theme || this.navTheme || config.navTheme || 'realdark'
    },
    currentPrimaryColor () {
      return this.settings.primaryColor || this.primaryColor || config.primaryColor || '#1890ff'
    },
    currentFixedHeader () {
      return this.settings.fixedHeader !== undefined ? this.settings.fixedHeader : (this.fixedHeader || false)
    },
    currentContentWidth () {
      return this.settings.contentWidth || this.contentWidth || 'Fluid'
    },
    currentAutoHideHeader () {
      return this.settings.autoHideHeader !== undefined ? this.settings.autoHideHeader : (this.autoHideHeader || false)
    },
    currentColorWeak () {
      return this.settings.colorWeak !== undefined ? this.settings.colorWeak : (this.colorWeak || false)
    },
    currentMultiTab () {
      return this.settings.multiTab !== undefined ? this.settings.multiTab : (this.multiTab || false)
    },
    isDarkDrawer () {
      return this.isDarkNavTheme
    },
    drawerWidth () {
      return this.isMobile ? '100%' : 420
    },
    isDarkNavTheme () {
      return this.currentNavTheme === 'dark' || this.currentNavTheme === 'realdark'
    }
  },
  watch: {

  },
  mounted () {
    if (this.currentColorWeak !== config.colorWeak) {
      updateColorWeak(this.currentColorWeak)
    }
  },
  methods: {
    showDrawer () {
      this.visible = true
    },
    onClose () {
      this.visible = false
    },
    toggle () {
      this.visible = !this.visible
    },
    onColorWeak (checked) {
      this.$emit('change', { type: 'colorWeak', value: checked })
      updateColorWeak(checked)
    },
    onMultiTab (checked) {
      this.$emit('change', { type: 'multiTab', value: checked })
    },
    handleMenuTheme (theme) {
      this.$emit('change', { type: 'theme', value: theme })
    },
    doCopy () {
      // get current settings from mixin or this.$store.state.app, pay attention to the property name
      const text = `export default {
  primaryColor: '${this.currentPrimaryColor}', // primary color of ant design
  navTheme: '${this.currentNavTheme}', // theme for nav menu
  layout: '${this.layoutMode}', // nav menu position: sidemenu or topmenu
  contentWidth: '${this.currentContentWidth}', // layout of content: Fluid or Fixed, only works when layout is topmenu
  fixedHeader: ${this.currentFixedHeader}, // sticky header
  fixSiderbar: ${this.fixSiderbar}, // sticky siderbar
  autoHideHeader: ${this.currentAutoHideHeader}, //  auto hide header
  colorWeak: ${this.currentColorWeak},
  multiTab: ${this.currentMultiTab},
  production: process.env.NODE_ENV === 'production' && process.env.VUE_APP_PREVIEW !== 'true'
}`
      // Native clipboard with execCommand fallback (vue-clipboard2 was
      // removed from the bundle — see package.json change history).
      const okMsg = this.$t('app.setting.copy.success')
      const failMsg = this.$t('app.setting.copy.fail')
      const fallback = () => {
        try {
          const ta = document.createElement('textarea')
          ta.value = text
          ta.setAttribute('readonly', '')
          ta.style.position = 'fixed'
          ta.style.left = '-1000px'
          ta.style.top = '-1000px'
          ta.style.opacity = '0'
          document.body.appendChild(ta)
          ta.focus()
          ta.select()
          const ok = document.execCommand && document.execCommand('copy')
          document.body.removeChild(ta)
          if (ok) this.$message.success(okMsg)
          else this.$message.error(failMsg)
        } catch (_) {
          this.$message.error(failMsg)
        }
      }
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text)
          .then(() => this.$message.success(okMsg))
          .catch(fallback)
      } else {
        fallback()
      }
    },
    handleLayout (mode) {
      this.$emit('change', { type: 'layout', value: mode })
      if (mode === 'topmenu') {
        this.$emit('change', { type: 'fixSiderbar', value: false })
      }
    },
    handleContentWidthChange (type) {
      this.$emit('change', { type: 'contentWidth', value: type })
    },
    changeColor (color) {
      if (this.currentPrimaryColor !== color) {
        this.$emit('change', { type: 'primaryColor', value: color })
      }
    },
    handleFixedHeader (fixed) {
      this.$emit('change', { type: 'fixedHeader', value: fixed })
    },
    handleFixedHeaderHidden (autoHidden) {
      this.$emit('change', { type: 'autoHideHeader', value: autoHidden })
    },
    handleFixSiderbar (fixed) {
      if (this.layoutMode === 'topmenu') {
        this.$emit('change', { type: 'fixSiderbar', value: false })
        return
      }
      this.$emit('change', { type: 'fixSiderbar', value: fixed })
    }
  }
}
</script>

<style lang="less" scoped>
  :deep(.ant-drawer-handle),
  :deep(.setting-drawer-index-handle) {
    display: none !important;
  }

  :deep(.ant-drawer-content),
  :deep(.ant-drawer-wrapper-body),
  :deep(.ant-drawer-body) {
    color: #1f2937;
    background: #f5f6f8;
  }

  :deep(.ant-drawer-body) {
    padding: 20px 18px 28px !important;
  }

  :deep(.ant-drawer-close) {
    top: 14px;
    right: 14px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    padding: 0;
    color: #64748b;
    background: rgba(15, 23, 42, 0.05);
    border-radius: 9px;

    &:hover {
      color: var(--primary-color, #1890ff);
      background: color-mix(in srgb, var(--primary-color, #1890ff) 9%, #fff);
    }
  }

  .setting-drawer-index-content {
    display: grid;
    gap: 16px;
    padding-top: 4px;
  }

  .setting-section {
    padding: 16px;
    background: #fff;
    border: 1px solid #e6e9ee;
    border-radius: 12px;
    box-shadow: 0 5px 18px rgba(15, 23, 42, 0.045);
  }

  .setting-section__heading {
    display: flex;
    align-items: center;
    gap: 9px;
    min-height: 30px;
    margin-bottom: 14px;
    padding-right: 34px;
  }

  .setting-section__icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    flex: 0 0 28px;
    color: var(--primary-color, #1890ff);
    background: color-mix(in srgb, var(--primary-color, #1890ff) 10%, #fff);
    border-radius: 8px;
  }

  .setting-drawer-index-title {
    margin: 0;
    color: #1f2937;
    font-size: 14px;
    font-weight: 700;
    line-height: 1.4;
  }

  .setting-drawer-index-blockChecbox {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;
  }

  .setting-drawer-index-item {
    position: relative;
    display: grid;
    grid-template-columns: 58px minmax(0, 1fr);
    align-items: center;
    gap: 9px;
    min-width: 0;
    min-height: 72px;
    padding: 10px;
    color: #64748b;
    font: inherit;
    font-size: 12px;
    line-height: 1.35;
    text-align: left;
    background: #f8fafc;
    border: 1px solid #e5e9ef;
    border-radius: 10px;
    cursor: pointer;
    transition: border-color 0.16s ease, background 0.16s ease, box-shadow 0.16s ease, transform 0.16s ease;

    &:hover {
      border-color: color-mix(in srgb, var(--primary-color, #1890ff) 38%, #dce2ea);
      transform: translateY(-1px);
    }

    &--active {
      color: #1f2937;
      background: color-mix(in srgb, var(--primary-color, #1890ff) 6%, #fff);
      border-color: color-mix(in srgb, var(--primary-color, #1890ff) 52%, #dce2ea);
      box-shadow: 0 0 0 2px color-mix(in srgb, var(--primary-color, #1890ff) 10%, transparent);
    }

    img {
      width: 58px;
      height: 44px;
      object-fit: cover;
      border-radius: 6px;
    }

    > span {
      min-width: 0;
      font-weight: 600;
      white-space: nowrap;
    }
  }

  .setting-drawer-index-selectIcon {
    position: absolute;
    top: 7px;
    right: 7px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 18px;
    height: 18px;
    color: #fff;
    font-size: 10px;
    background: var(--primary-color, #1890ff);
    border: 2px solid #fff;
    border-radius: 50%;
    box-shadow: 0 2px 6px rgba(15, 23, 42, 0.2);
  }

  .setting-drawer-theme-color-list {
    display: grid;
    grid-template-columns: repeat(8, minmax(0, 1fr));
    align-items: center;
    gap: 8px;
  }

  .setting-drawer-theme-color-colorBlock {
    display: inline-flex;
    justify-content: center;
  }

  .setting-drawer-theme-color-swatch {
    position: relative;
    width: 28px;
    height: 28px;
    padding: 0;
    color: #fff;
    font-weight: 700;
    line-height: 26px;
    text-align: center;
    border: 2px solid transparent;
    border-radius: 8px;
    box-shadow: 0 2px 6px rgba(15, 23, 42, 0.14);
    cursor: pointer;
    transition: transform 0.16s ease, box-shadow 0.16s ease;

    &:hover {
      transform: translateY(-2px) scale(1.04);
      box-shadow: 0 6px 14px rgba(15, 23, 42, 0.18);
    }

    &--active {
      border-color: #fff;
      box-shadow: 0 0 0 2px currentColor, 0 5px 12px rgba(15, 23, 42, 0.2);
    }

    i {
      font-size: 13px;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.28);
    }
  }

  .setting-section--compact {
    :deep(.ant-list-item) {
      min-height: 42px;
      padding: 10px 11px;
      background: #f8fafc;
      border: 1px solid #e8ebf0;
    }

    :deep(.ant-list-item:first-child) {
      border-radius: 9px 9px 0 0;
    }

    :deep(.ant-list-item:last-child) {
      margin-top: -1px;
      border-radius: 0 0 9px 9px;
    }

    :deep(.ant-list-item-meta-title) {
      margin: 0;
      color: #475569;
      font-size: 12px;
    }
  }

  &.setting-drawer--dark {
    :deep(.ant-drawer-content),
    :deep(.ant-drawer-wrapper-body),
    :deep(.ant-drawer-body) {
      background: #080808 !important;
      color: rgba(226, 232, 240, 0.86) !important;
    }
  }

  body.dark &,
  body.realdark &,
  .basic-layout-wrapper.dark &,
  .basic-layout-wrapper.realdark & {
    :deep(.ant-drawer-content),
    :deep(.ant-drawer-wrapper-body),
    :deep(.ant-drawer-body) {
      color: #e6e6e6 !important;
      background: #080808 !important;
    }

    :deep(.ant-drawer-close) {
      color: #a8a8a8 !important;
      background: #171717;

      &:hover {
        color: var(--primary-color, #1890ff) !important;
        background: color-mix(in srgb, var(--primary-color, #1890ff) 13%, #171717);
      }
    }

    .setting-section {
      background: #111;
      border-color: #2d2d2d;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.22);
    }

    .setting-section__icon {
      background: color-mix(in srgb, var(--primary-color, #1890ff) 14%, #151515);
    }

    .setting-drawer-index-title {
      color: #ededed;
    }

    .setting-drawer-index-item {
      color: #a8a8a8;
      background: #181818;
      border-color: #303030;

      &:hover {
        border-color: color-mix(in srgb, var(--primary-color, #1890ff) 46%, #303030);
      }

      &--active {
        color: #ededed;
        background: color-mix(in srgb, var(--primary-color, #1890ff) 10%, #171717);
        border-color: color-mix(in srgb, var(--primary-color, #1890ff) 58%, #303030);
      }

      img {
        opacity: 0.92;
      }
    }

    .setting-drawer-index-selectIcon {
      border-color: #111;
    }

    .setting-drawer-theme-color-swatch {
      box-shadow: 0 3px 9px rgba(0, 0, 0, 0.42);

      &--active {
        border-color: #111;
      }
    }

    .setting-section--compact {
      :deep(.ant-list-item) {
        color: #b8b8b8 !important;
        background: #181818;
        border-color: #2d2d2d;
      }

      :deep(.ant-list-item-meta-title),
      :deep(.ant-list-item-meta-title > div) {
        color: #b8b8b8 !important;
      }
    }
  }

  @media (max-width: 520px) {
    :deep(.ant-drawer-body) {
      padding: 18px 14px 24px !important;
    }

    .setting-section {
      padding: 14px;
    }

    .setting-drawer-index-item {
      grid-template-columns: 50px minmax(0, 1fr);
      min-height: 66px;
      padding: 8px;

      img {
        width: 50px;
        height: 38px;
      }
    }
  }

</style>

<style lang="less">
body.dark .setting-drawer,
body.realdark .setting-drawer,
.setting-drawer.setting-drawer--dark {
  --setting-drawer-bg: #080808;
  --setting-drawer-panel: #111111;
  --setting-drawer-panel-soft: #181818;
  --setting-drawer-border: #2d2d2d;
  --setting-drawer-text: #e6e6e6;
  --setting-drawer-muted: #a8a8a8;
  --setting-drawer-subtle: #737373;
}

body.dark .setting-drawer .ant-drawer-content,
body.dark .setting-drawer .ant-drawer-wrapper-body,
body.dark .setting-drawer .ant-drawer-body,
body.realdark .setting-drawer .ant-drawer-content,
body.realdark .setting-drawer .ant-drawer-wrapper-body,
body.realdark .setting-drawer .ant-drawer-body,
.setting-drawer.setting-drawer--dark .ant-drawer-content,
.setting-drawer.setting-drawer--dark .ant-drawer-wrapper-body,
.setting-drawer.setting-drawer--dark .ant-drawer-body {
  background: var(--setting-drawer-bg) !important;
  color: var(--setting-drawer-text) !important;
}

body.dark .setting-drawer .ant-drawer-body,
body.realdark .setting-drawer .ant-drawer-body,
.setting-drawer.setting-drawer--dark .ant-drawer-body {
  border-left: 1px solid var(--setting-drawer-border);
}

body.dark .setting-drawer .ant-drawer-close,
body.realdark .setting-drawer .ant-drawer-close,
.setting-drawer.setting-drawer--dark .ant-drawer-close {
  color: var(--setting-drawer-muted) !important;
}

body.dark .setting-drawer .ant-drawer-close:hover,
body.realdark .setting-drawer .ant-drawer-close:hover,
.setting-drawer.setting-drawer--dark .ant-drawer-close:hover {
  color: var(--primary-color, #1890ff) !important;
}

body.dark .setting-drawer .setting-drawer-index-title,
body.realdark .setting-drawer .setting-drawer-index-title,
.setting-drawer.setting-drawer--dark .setting-drawer-index-title {
  color: var(--setting-drawer-text) !important;
}

body.dark .setting-drawer .ant-divider,
body.realdark .setting-drawer .ant-divider,
.setting-drawer.setting-drawer--dark .ant-divider {
  background: var(--setting-drawer-border) !important;
}

body.dark .setting-drawer .ant-list-item,
body.dark .setting-drawer .ant-list-item-meta-title,
body.dark .setting-drawer .ant-list-item-meta-title > div,
body.realdark .setting-drawer .ant-list-item,
body.realdark .setting-drawer .ant-list-item-meta-title,
body.realdark .setting-drawer .ant-list-item-meta-title > div,
.setting-drawer.setting-drawer--dark .ant-list-item,
.setting-drawer.setting-drawer--dark .ant-list-item-meta-title,
.setting-drawer.setting-drawer--dark .ant-list-item-meta-title > div {
  color: var(--setting-drawer-muted) !important;
}

body.dark .setting-drawer .setting-drawer-index-item,
body.realdark .setting-drawer .setting-drawer-index-item,
.setting-drawer.setting-drawer--dark .setting-drawer-index-item {
  background: var(--setting-drawer-panel-soft);
  box-shadow: inset 0 0 0 1px var(--setting-drawer-border);
}

body.dark .setting-drawer .setting-drawer-index-selectIcon,
body.realdark .setting-drawer .setting-drawer-index-selectIcon,
.setting-drawer.setting-drawer--dark .setting-drawer-index-selectIcon {
  color: var(--primary-color, #1890ff) !important;
}

body.dark .setting-drawer .setting-drawer-theme-color-swatch,
body.realdark .setting-drawer .setting-drawer-theme-color-swatch,
.setting-drawer.setting-drawer--dark .setting-drawer-theme-color-swatch {
  border-color: rgba(255, 255, 255, 0.16) !important;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.35);
}

body.dark .setting-drawer .setting-drawer-support,
body.realdark .setting-drawer .setting-drawer-support,
.setting-drawer.setting-drawer--dark .setting-drawer-support {
  border-top-color: var(--setting-drawer-border) !important;
  color: var(--setting-drawer-muted) !important;
}

body.dark .setting-drawer .setting-drawer-support .support-title,
body.realdark .setting-drawer .setting-drawer-support .support-title,
.setting-drawer.setting-drawer--dark .setting-drawer-support .support-title {
  color: var(--setting-drawer-text) !important;
}

body.dark .setting-drawer .setting-drawer-support a,
body.realdark .setting-drawer .setting-drawer-support a,
.setting-drawer.setting-drawer--dark .setting-drawer-support a {
  color: var(--primary-color, #1890ff) !important;
}

body.dark .setting-drawer .setting-drawer-support .separator,
body.dark .setting-drawer .setting-drawer-support .support-copy,
body.dark .setting-drawer .setting-drawer-support .support-version,
body.realdark .setting-drawer .setting-drawer-support .separator,
body.realdark .setting-drawer .setting-drawer-support .support-copy,
body.realdark .setting-drawer .setting-drawer-support .support-version,
.setting-drawer.setting-drawer--dark .setting-drawer-support .separator,
.setting-drawer.setting-drawer--dark .setting-drawer-support .support-copy,
.setting-drawer.setting-drawer--dark .setting-drawer-support .support-version {
  color: var(--setting-drawer-subtle) !important;
}

body.dark .setting-drawer .setting-drawer-support .support-social,
body.realdark .setting-drawer .setting-drawer-support .support-social,
.setting-drawer.setting-drawer--dark .setting-drawer-support .support-social {
  background: var(--setting-drawer-panel);
  border-color: var(--setting-drawer-border);
  color: var(--setting-drawer-muted);
}
</style>
