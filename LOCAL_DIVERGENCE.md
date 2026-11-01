# 本地定制清单（LOCAL_DIVERGENCE）· 前端

这份文件记录 `QuantDinger-Vue` fork 与上游在**语义上的差异**，不是 commit 流水账。

合并前先读它，合并后更新它。后端仓库有一份同名的、更完整的清单，两份互相独立。

约定：每条写清「本地行为 / 上游行为 / 为什么 / 合并时怎么办」。上游追平后删除该条。

> **状态说明**：本文件于 2026-11-01 建立，条目来自 `git log upstream/main..trunk` 的提交标题，
> 尚未逐条核对代码与理由。标注「待确认」的条目需要在下次同步时补全。

---

## 1. i18n 冲突必须取并集（已确认）

- **文件**：`src/locales/lang/*.js`（11 个语种）、`src/locales/generated-locale-overrides.js`
- **本地行为**：语种文件包含上游没有的键，也缺上游新增的键。
- **上游行为**：只维护上游自己用到的键。
- **为什么**：双方在同一位置各加不同键，任何单边取舍都会让一侧文案回退成 key。
- **合并时**：
  - `src/locales/lang/*.js` 逐键取并集，不要整块取一边。
  - `generated-locale-overrides.js` 是**机器生成**文件，不能手工解冲突。用 `scripts/i18n-utils.mjs` 的
    `evaluateObject` 解析两边（`execFileSync` 的 `maxBuffer` 提到 128MB），以上游为基补本地键，
    用 `renderLocaleObject` 渲染，再跑：
    ```bash
    QUANTDINGER_TRANSLATE_REBUILD_VERIFIED_ONLY=1 node scripts/translate-incomplete-locales.mjs
    ```
- **验证**：`node --test "tests/unit/*.test.mjs"`，i18n 相关用例会拦住键缺失。

## 2. 港股/美股代码校验（待确认）

- **提交**：`226edd2 Enhance stock symbol validation logic for HK and US stocks in AI analysis`
- **文件**：待补（疑似 `src/views/ai-*/` 与工具函数）
- **本地行为**：HK/US 标的代码在 AI 分析入口有一套额外校验。
- **上游行为**：待补。
- **合并时**：若上游重写 AI 分析入口的表单校验，确认这套规则是否被覆盖。

## 3. BrokerAccountCard 的 summary 数据结构适配（待确认）

- **提交**：`6655ddf`、`4450209`、`0d38818`
- **文件**：`src/components/**/BrokerAccountCard.vue`、broker 相关常量
- **本地行为**：按后端返回的 summary 结构取数；`BROKER_IDS` 有本地顺序；默认 broker 为 Alpaca。
- **上游行为**：待补。
- **合并时**：后端 `/api/dashboard/summary` 结构变化时，两侧都要跟着改，容易只改一边。

## 4. 侧栏布局与滚动（待确认）

- **提交**：`242eab7 fix(layout): improve sidebar height and scrolling behavior`
- **文件**：布局组件（待补）
- **合并时**：上游若重构布局容器，确认高度/滚动修正是否仍然生效。

## 5. 开发期 API 地址与代理（待确认）

- **提交**：`f189e2c`、`4450209`
- **文件**：`vite.config.js`、API base URL 配置
- **本地行为**：后端指向 `127.0.0.1:5000`，vite proxy 有本地配置。
- **注意**：**必须是 `127.0.0.1:5000`，不能是 `localhost:5000`**。macOS 的 AirPlay 接收器占用
  `*:5000`，`localhost` 会命中它并返回 403（响应头 `server: AirTunes`），前端表现为
  "Operation not allowed"。
- **合并时**：这是本地环境相关配置，**不要跟随上游改回 `localhost`**。

## 6. zh-CN.js 的换行与编码归一（已确认，历史遗留）

- **提交**：`5f56b7b`、`8048825`
- **文件**：`src/locales/lang/zh-CN.js`
- **本地行为**：CRLF/LF 与编码已归一，避免全文件 diff。
- **合并时**：若上游提交该文件时带回 CRLF，会制造整文件冲突。解冲突后确认 diff 只含真实改动。

---

## 已知但尚未归类的提交

以下提交标题不含语义信息，需要下次同步时对照代码确认归属：

- `6d81142 Implement feature X to enhance user experience and fix bug Y in module Z`
- `4628d03 Refactor code structure for improved readability and maintainability`
- `8114744 fix: resolve post-merge lint/parse errors and align with upstream test contracts`
