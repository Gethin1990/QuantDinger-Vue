import { formatStrategyInstrumentIdentity, parseStrategyInstrumentIdentity } from './strategyInstrument.js'

export function resolveIndicatorStrategyContext (context = {}, route = {}, config = {}) {
  const market = String(context.market || route.market || config.market_category || config.marketCategory || '').trim()
  const symbol = String(context.symbol || route.symbol || config.symbol || '').trim()
  const exchangeId = String(context.exchange_id || route.exchange_id || config.exchange_id || '').trim().toLowerCase()
  const requestedMarketType = String(context.market_type || route.market_type || config.market_type || 'spot').trim().toLowerCase()
  const marketType = requestedMarketType === 'swap' ? 'swap' : 'spot'
  const timeframe = String(context.timeframe || route.timeframe || config.timeframe || '').trim()
  let instrument = String(context.instrument || route.instrument || '').trim()
  let resolvedIdentity = null
  const storedInstrumentId = String(context.instrument_id || route.instrument_id || '').trim()
  if (!instrument && /^(?:CNStock|Crypto|Forex|Future|Futures|USStock|HKStock):/i.test(storedInstrumentId)) {
    instrument = storedInstrumentId
  }

  if (!instrument && symbol) {
    instrument = /^(?:CNStock|Crypto|Forex|Future|Futures|USStock|HKStock|MOEX):/i.test(symbol) || symbol.includes('@')
      ? parseStrategyInstrumentIdentity(symbol, {
        market_category: market,
        market_type: marketType
      }).instrument
      : formatStrategyInstrumentIdentity({
        market_category: market,
        symbol,
        exchange_id: exchangeId,
        market_type: marketType
      }, { includeConfigExchange: market.toLowerCase() === 'crypto' })
  }
  if (instrument) {
    resolvedIdentity = parseStrategyInstrumentIdentity(instrument, {
      market_category: market,
      market_type: marketType
    })
    instrument = resolvedIdentity.instrument
  }

  return {
    market: (resolvedIdentity && resolvedIdentity.market) || market,
    symbol: (resolvedIdentity && resolvedIdentity.symbol) || symbol,
    exchangeId: (resolvedIdentity && resolvedIdentity.exchangeId) || exchangeId,
    marketType: (resolvedIdentity && resolvedIdentity.marketType) || marketType,
    timeframe,
    instrument
  }
}
