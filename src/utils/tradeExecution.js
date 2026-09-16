export function formatExecutionNumber (value) {
  if (value === null || value === undefined || value === '') return '--'
  const number = Number(value)
  if (!Number.isFinite(number)) return '--'
  return new Intl.NumberFormat('en-US', { maximumSignificantDigits: 15 }).format(number)
}

export function formatPriceDeviation (value) {
  if (value === null || value === undefined || value === '') return '--'
  const number = Number(value)
  if (!Number.isFinite(number)) return '--'
  return `${number > 0 ? '+' : ''}${formatExecutionNumber(number)}%`
}
