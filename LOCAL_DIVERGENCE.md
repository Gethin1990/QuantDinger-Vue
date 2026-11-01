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

## 7. 后端不在仓库内，前端测试要自己找路（已确认，2026-11-01）

- **文件**：`tests/unit/factorLibraryLocalization.test.mjs`
- **本地行为**：先试 `../quantdinger_backend/backend_api_python/...`，再试 `../backend_api_python/...`；两者都不存在时该用例 `skip`（standalone worktree 就是这种情况）。
- **上游行为**：写死 `../quantdinger_backend/backend_api_python/app/services/factors/registry.py`，读不到直接 ENOENT 让整个文件挂掉。
- **为什么改**：本仓库把后端放在 `../backend_api_python`，上游叫 `../quantdinger_backend/backend_api_python`。不改则该用例在本仓库**永远**失败，与合并无关。
- **合并时**：这条冲突会以「上游新增测试」的形式反复出现。合并后先跑 `node --test "tests/unit/*.test.mjs"`，若报 ENOENT 指向 `quantdinger_backend`，按上面候选列表补一条即可。

## 8. 编码审计的自排除判断要跨平台（已确认，2026-11-01）

- **文件**：`scripts/encoding-audit.mjs`
- **本地行为**：用 `basename(filePath) === 'encoding-audit.mjs'` 判断"正在审计自己"，跳过 mojibake 检查。
- **上游行为**：`displayPath === 'scripts\\encoding-audit.mjs'`，是 Windows 分隔符，在 macOS/Linux 上永不命中。
- **为什么改**：脚本本身要列出 mojibake 模式表，一旦表里有 CJK 正则（上游 2026-10 加了），脚本就会把自己报成乱码，`npm run i18n:audit` 恒失败。
- **合并时**：上游若再改这个自排除判断，保留 `basename` 版本即可；真正的判据是「审计脚本不得审计自己的模式表」。

## 已知但尚未归类的提交

以下提交标题不含语义信息，需要下次同步时对照代码确认归属：

- `6d81142 Implement feature X to enhance user experience and fix bug Y in module Z`
- `4628d03 Refactor code structure for improved readability and maintainability`
- `8114744 fix: resolve post-merge lint/parse errors and align with upstream test contracts`
