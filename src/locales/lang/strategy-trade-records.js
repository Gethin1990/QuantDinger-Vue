const locale = {
  'trading-assistant.table.instrument': 'Instrument',
  'trading-assistant.fees.pending': 'Unconfirmed',
  'trading-assistant.execution.price': 'Fill price',
  'trading-assistant.execution.reference': 'Instruction reference',
  'trading-assistant.execution.deviation': 'Price deviation',
  'trading-assistant.execution.note': 'Live fills use venue execution reports. Missing execution details await reconciliation. P&L and price deviation are calculated by the system; historical records require verification against venue reports.',
  'trading-assistant.execution.deviationHint': 'Compared with the saved signal or instruction price (grid orders use the limit price). Positive means a worse execution price; negative means better. This includes price changes while waiting, excludes fees, and is not always slippage. Missing references are left blank.',
  'trading-assistant.execution.orderId': 'Exchange order ID'
}

const enUSFallback = locale

export default {
  'en-US': locale,
  'ar-SA': enUSFallback,
  'de-DE': enUSFallback,
  'fr-FR': enUSFallback,
  'ja-JP': enUSFallback,
  'ko-KR': enUSFallback,
  'ru-RU': enUSFallback,
  'th-TH': enUSFallback,
  'vi-VN': enUSFallback,
  'zh-CN': {
    ...enUSFallback,
    'trading-assistant.table.instrument': '交易标的',
    'trading-assistant.fees.pending': '待确认',
    'trading-assistant.execution.price': '成交价',
    'trading-assistant.execution.reference': '指令参考价',
    'trading-assistant.execution.deviation': '价格偏差',
    'trading-assistant.execution.note': '实盘成交以交易所回报为依据，成交信息缺失时等待核对。盈亏和价格偏差由系统计算；历史记录仍需与交易所回报核实。',
    'trading-assistant.execution.deviationHint': '对比保存的信号或指令参考价（网格挂单使用委托限价）。正值表示成交更不利，负值表示更有利。包含等待期间的价格变化，不含手续费，不全部等同于滑点；缺少参考价时留空。',
    'trading-assistant.execution.orderId': '交易所订单号'
  },
  'zh-TW': {
    ...enUSFallback,
    'trading-assistant.table.instrument': '交易標的',
    'trading-assistant.fees.pending': '待確認',
    'trading-assistant.execution.price': '成交價',
    'trading-assistant.execution.reference': '指令參考價',
    'trading-assistant.execution.deviation': '價格偏差',
    'trading-assistant.execution.note': '實盤成交以交易所回報為依據，成交資訊缺失時等待核對。盈虧和價格偏差由系統計算；歷史記錄仍需與交易所回報核實。',
    'trading-assistant.execution.deviationHint': '對比保存的訊號或指令參考價（網格掛單使用委託限價）。正值表示成交更不利，負值表示更有利。包含等待期間的價格變化，不含手續費，不全部等同於滑點；缺少參考價時留空。',
    'trading-assistant.execution.orderId': '交易所訂單號'
  }
}
