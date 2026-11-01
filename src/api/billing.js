import request from '@/utils/request'

const billingApi = {
  Plans: '/api/billing/plans',
  CommunityIndicators: '/api/community/indicators',
  CryptoChains: '/api/billing/crypto/chains',
  CryptoCreate: '/api/billing/crypto/create',
  CryptoOrder: (id) => `/api/billing/crypto/order/${id}`,
  StripeCreate: '/api/billing/stripe/create',
  AdminPlans: '/api/billing/admin/plans',
  AdminPlan: (code) => `/api/billing/admin/plans/${encodeURIComponent(code)}`,
  ReferralRewards: '/api/billing/referral-rewards',
  ReferralWithdrawals: '/api/billing/referral-rewards/withdrawals',
  AdminReferralWithdrawals: '/api/billing/admin/referral-withdrawals',
  AdminReferralWithdrawalReview: (id) => `/api/billing/admin/referral-withdrawals/${id}/review`,
  UsdtChains: '/api/billing/usdt/chains',
  UsdtCreate: '/api/billing/usdt/create',
  UsdtOrder: (id) => `/api/billing/usdt/order/${id}`
}

export function getFreeMarketAssetCounts () {
  const baseParams = { page: 1, page_size: 1, sort_by: 'newest' }
  return Promise.all([
    request({
      url: billingApi.CommunityIndicators,
      method: 'get',
      params: { ...baseParams, pricing_type: 'free' }
    }),
    request({
      url: billingApi.CommunityIndicators,
      method: 'get',
      params: { ...baseParams, pricing_type: 'paid', vip_free: 1 }
    })
  ]).then(([freeResponse, vipFreeResponse]) => {
    const freeCounts = freeResponse?.data?.asset_type_counts || {}
    const vipFreeCounts = vipFreeResponse?.data?.asset_type_counts || {}
    return {
      code: 1,
      data: {
        strategy_count: Number(freeCounts.script_template || 0) + Number(vipFreeCounts.script_template || 0),
        indicator_count: Number(freeCounts.indicator || 0) + Number(vipFreeCounts.indicator || 0)
      }
    }
  })
}

export function listCryptoChains (currency) {
  return request({ url: billingApi.CryptoChains, method: 'get', params: { currency } })
}

export function createCryptoOrder (plan, chain, currency) {
  return request({ url: billingApi.CryptoCreate, method: 'post', data: { plan, chain, currency } })
}

export function getCryptoOrder (orderId, refresh = true) {
  return request({ url: billingApi.CryptoOrder(orderId), method: 'get', params: { refresh: refresh ? 1 : 0 } })
}

export function createStripeCheckout (plan) {
  return request({ url: billingApi.StripeCreate, method: 'post', data: { plan } })
}

export function getAdminMembershipPlans () {
  return request({ url: billingApi.AdminPlans, method: 'get' })
}

export function saveAdminMembershipPlans (plans) {
  return request({ url: billingApi.AdminPlans, method: 'put', data: { plans } })
}

export function deleteAdminMembershipPlan (code) {
  return request({ url: billingApi.AdminPlan(code), method: 'delete' })
}

export function getReferralRewards (params = {}) {
  return request({ url: billingApi.ReferralRewards, method: 'get', params })
}

export function createReferralWithdrawal (data) {
  return request({ url: billingApi.ReferralWithdrawals, method: 'post', data })
}

export function getAdminReferralWithdrawals (params = {}) {
  return request({ url: billingApi.AdminReferralWithdrawals, method: 'get', params })
}

export function reviewAdminReferralWithdrawal (id, data) {
  return request({ url: billingApi.AdminReferralWithdrawalReview(id), method: 'post', data })
}

export function getMembershipPlans () {
  return request({
    url: billingApi.Plans,
    method: 'get'
  })
}

// v3.0.6+ : list enabled USDT chains so the frontend can render the chain
// picker. Chains without a configured receiving address are hidden by the
// backend, so the response can be rendered verbatim.
