const WEIGHT_DISPLAY_SCALE = 10000

export function formatVisibleWeights (value, formatRate) {
  if (!value || typeof value !== 'object') return '-'

  const entries = Object.entries(value)
    .map(([symbol, weight]) => [symbol, Number(weight)])
    .filter(([, weight]) => Number.isFinite(weight) && Math.round(Math.abs(weight) * WEIGHT_DISPLAY_SCALE) > 0)
    .sort((left, right) => Math.abs(right[1]) - Math.abs(left[1]) || left[0].localeCompare(right[0]))

  return entries
    .map(([symbol, weight]) => {
      const marketSeparator = symbol.indexOf(':')
      const instrument = marketSeparator >= 0 ? symbol.slice(marketSeparator + 1) : symbol
      return `${instrument.split('@')[0]} ${formatRate(weight)}`
    })
    .join(' · ') || '-'
}
