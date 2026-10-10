import { apiRequest } from '~/helpers/apiHelper'
export interface CashFlow {
  id: string
  type: 'inflow' | 'outflow'
  source: 'cash' | 'savings' | 'loans'
  label: string
  nominal: number
  description?: string
  created_at?: string
  updated_at?: string
}
export interface CashFlowQueryParams {
  type?: string
  source?: string
  label?: string
  start_date?: string
  end_date?: string
}
export interface CashFlowStats {
  totalInflow: number
  totalOutflow: number
  cash: number
  savings: number
  loans: number
}
type ApiEnvelope<T> = { data?: T; message?: string }
export async function getCashFlows(params: CashFlowQueryParams = {}): Promise<CashFlow[]> {
  const query = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => { if (value) query.set(key, value) })
  const suffix = query.size ? `?${query.toString()}` : ''
  const result = await apiRequest<ApiEnvelope<CashFlow[]> | CashFlow[]>(`/cash-flows${suffix}`)
  if (Array.isArray(result)) return result
  const data = result.data
  if (Array.isArray(data)) return data
  if (data && typeof data === 'object' && 'items' in data && Array.isArray((data as {items: CashFlow[]}).items)) return (data as {items: CashFlow[]}).items
  return []
}
export async function getCashFlow(id: string): Promise<CashFlow> {
  const result = await apiRequest<ApiEnvelope<CashFlow> | CashFlow>(`/cash-flows/${encodeURIComponent(id)}`)
  return 'data' in result ? result.data as CashFlow : result as CashFlow
}
export async function createCashFlow(payload: Omit<CashFlow, 'id'>): Promise<unknown> {
  return apiRequest('/cash-flows', { method: 'POST', body: JSON.stringify(payload) })
}
export async function updateCashFlow(id: string, payload: Partial<Omit<CashFlow, 'id'>>): Promise<unknown> {
  return apiRequest(`/cash-flows/${encodeURIComponent(id)}`, { method: 'PUT', body: JSON.stringify(payload) })
}
export async function deleteCashFlow(id: string): Promise<unknown> {
  return apiRequest(`/cash-flows/${encodeURIComponent(id)}`, { method: 'DELETE' })
}
export async function deleteAllCashFlows(): Promise<unknown> {
  return apiRequest('/cash-flows', { method: 'DELETE' })
}
export async function getCashFlowLabels(): Promise<string[]> {
  const result = await apiRequest<ApiEnvelope<string[]> | string[]>('/cash-flows/labels')
  return Array.isArray(result) ? result : Array.isArray(result.data) ? result.data : []
}
export async function getDailyStats(): Promise<unknown> { return apiRequest('/cash-flows/stats/daily') }
export async function getMonthlyStats(): Promise<unknown> { return apiRequest('/cash-flows/stats/monthly') }
