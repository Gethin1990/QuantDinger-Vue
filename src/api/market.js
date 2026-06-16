import request from '@/utils/request'

const marketApi = {
  // Watchlist
  GetWatchlist: '/api/market/watchlist/get',
  AddWatchlist: '/api/market/watchlist/add',
  RemoveWatchlist: '/api/market/watchlist/remove',
  GetWatchlistPrices: '/api/market/watchlist/prices',
  // AI chat (optional)
  ChatMessage: '/api/ai/chat/message',
  GetChatHistory: '/api/ai/chat/history',
  GetChatSessions: '/api/ai/chat/sessions',
  DeleteChatSession: '/api/ai/chat/sessions',
  SaveChatHistory: '/api/ai/chat/history/save',
  SaveCopilotMessage: '/api/ai/chat/message/local',
  AgentPreflight: '/api/ai/agent/preflight',
  AgentIntent: '/api/ai/agent/intent',
  AiSkills: '/api/ai/skills',
  AiTools: '/api/ai/tools',
  UserMemory: '/api/ai/memory',
  // Public config
  GetConfig: '/api/market/config',
  GetMenuFooterConfig: '/api/market/menuFooterConfig',
  // Market metadata
  GetMarketTypes: '/api/market/types',
  // Symbol search
  SearchSymbols: '/api/market/symbols/search',
  GetHotSymbols: '/api/market/symbols/hot'
}

/**
 * 获取自选股列表
 * @param parameter { userid: number }
 * @returns {*}
 */
export function getWatchlist (parameter) {
  return request({
    url: marketApi.GetWatchlist,
    method: 'get',
    params: parameter
  })
}

/**
 * 添加自选股
 * @param parameter { userid: number, market: string, symbol: string }
 * @returns {*}
 */
export function addWatchlist (parameter) {
  return request({
    url: marketApi.AddWatchlist,
    method: 'post',
    data: parameter
  })
}

/**
 * 删除自选股
 * @param parameter { userid: number, symbol: string }
 * @returns {*}
 */
export function removeWatchlist (parameter) {
  return request({
    url: marketApi.RemoveWatchlist,
    method: 'post',
    data: parameter
  })
}

/**
 * 获取自选股价格
 * @param parameter { watchlist: array } watchlist格式：[{market: 'USStock', symbol: 'AAPL'}, ...]
 * @returns {*}
 */
export function getWatchlistPrices (parameter) {
  return request({
    url: marketApi.GetWatchlistPrices,
    method: 'get',
    params: {
      watchlist: JSON.stringify(parameter.watchlist || [])
    }
  })
}

/**
 * 发送 AI 聊天消息
 * @param parameter { userid: number, message: string, chatId?: string }
 * @returns {*}
 */
export function chatMessage (parameter) {
  return request({
    url: marketApi.ChatMessage,
    method: 'post',
    data: parameter
  })
}

/**
 * 获取聊天历史
 * @param parameter { userid: number }
 * @returns {*}
 */
export function getChatHistory (parameter) {
  return request({
    url: marketApi.GetChatHistory,
    method: 'get',
    params: parameter
  })
}

export function getChatSessions (parameter) {
  return request({
    url: marketApi.GetChatSessions,
    method: 'get',
    params: parameter
  })
}

export function deleteChatSession (sessionId) {
  return request({
    url: `${marketApi.DeleteChatSession}/${sessionId}`,
    method: 'delete'
  })
}

/**
 * 保存聊天历史
 * @param parameter { userid: number, chatHistory: array }
 * @returns {*}
 */
export function saveChatHistory (parameter) {
  return request({
    url: marketApi.SaveChatHistory,
    method: 'post',
    data: parameter
  })
}

export function saveCopilotMessage (parameter) {
  return request({
    url: marketApi.SaveCopilotMessage,
    method: 'post',
    data: parameter
  })
}

export function getAgentPreflight () {
  return request({
    url: marketApi.AgentPreflight,
    method: 'get'
  })
}

export function classifyAgentIntent (parameter) {
  return request({
    url: marketApi.AgentIntent,
    method: 'post',
    data: parameter
  })
}

export function getAiSkills (parameter) {
  return request({
    url: marketApi.AiSkills,
    method: 'get',
    params: parameter
  })
}

export function getAiSkillPrompt (skillId, parameter) {
  return request({
    url: `${marketApi.AiSkills}/${skillId}/prompt`,
    method: 'post',
    data: parameter
  })
}

export function getAiTools (parameter) {
  return request({
    url: marketApi.AiTools,
    method: 'get',
    params: parameter
  })
}

export function installAiSkill (parameter) {
  return request({
    url: `${marketApi.AiSkills}/install`,
    method: 'post',
    data: parameter
  })
}

export function updateAiSkill (skillId, parameter) {
  return request({
    url: `${marketApi.AiSkills}/${skillId}`,
    method: 'patch',
    data: parameter
  })
}

export function deleteAiSkill (skillId) {
  return request({
    url: `${marketApi.AiSkills}/${skillId}`,
    method: 'delete'
  })
}

export function getUserMemory () {
  return request({
    url: marketApi.UserMemory,
    method: 'get'
  })
}

export function saveUserMemory (parameter) {
  return request({
    url: marketApi.UserMemory,
    method: 'post',
    data: parameter
  })
}

export function deleteUserMemory (memoryId) {
  return request({
    url: `${marketApi.UserMemory}/${memoryId}`,
    method: 'delete'
  })
}

/**
 * 获取插件配置
 * @returns {*}
 */
export function getConfig () {
  return request({
    url: marketApi.GetConfig,
    method: 'get'
  })
}

/**
 * 获取菜单底部配置
 * @returns {*}
 */
export function getMenuFooterConfig () {
  return request({
    url: marketApi.GetMenuFooterConfig,
    method: 'get'
  })
}

/**
 * 获取股票类型列表
 * @returns {*}
 */
export function getMarketTypes () {
  return request({
    url: marketApi.GetMarketTypes,
    method: 'get'
  })
}

/**
 * 搜索金融产品
 * @param parameter { market: string, keyword: string, limit?: number }
 * @returns {*}
 */
export function searchSymbols (parameter) {
  return request({
    url: marketApi.SearchSymbols,
    method: 'get',
    params: parameter
  })
}

/**
 * 获取热门标的
 * @param parameter { market: string, limit?: number }
 * @returns {*}
 */
export function getHotSymbols (parameter) {
  return request({
    url: marketApi.GetHotSymbols,
    method: 'get',
    params: parameter
  })
}
