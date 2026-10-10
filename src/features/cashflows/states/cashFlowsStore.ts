import { defineStore } from 'pinia'
import { getCashFlows, type CashFlow, type CashFlowStats, type CashFlowQueryParams } from '../api/cashFlowApi'

interface CashFlowsState {
  cashFlows: CashFlow[]
  cashFlow: CashFlow | null
  labels: string[]
  stats: CashFlowStats
  loading: boolean
  error: string | null
}
export const useCashFlowsStore = defineStore('cashFlows', {
  state: (): CashFlowsState => ({
    cashFlows: [], cashFlow: null, labels: [],
    stats: { totalInflow: 0, totalOutflow: 0, cash: 0, savings: 0, loans: 0 },
    loading: false, error: null,
  }),
  actions: {
    async fetchCashFlows(params: CashFlowQueryParams = {}) {
      this.loading = true; this.error = null
      try {
        this.cashFlows = await getCashFlows(params)
        this.stats.totalInflow = this.cashFlows.filter(item => item.type === 'inflow').reduce((sum, item) => sum + Number(item.nominal || 0), 0)
        this.stats.totalOutflow = this.cashFlows.filter(item => item.type === 'outflow').reduce((sum, item) => sum + Number(item.nominal || 0), 0)
        this.stats.cash = this.cashFlows.filter(item => item.source === 'cash').reduce((sum, item) => sum + (item.type === 'inflow' ? 1 : -1) * Number(item.nominal || 0), 0)
        this.stats.savings = this.cashFlows.filter(item => item.source === 'savings').reduce((sum, item) => sum + (item.type === 'inflow' ? 1 : -1) * Number(item.nominal || 0), 0)
        this.stats.loans = this.cashFlows.filter(item => item.source === 'loans').reduce((sum, item) => sum + (item.type === 'inflow' ? 1 : -1) * Number(item.nominal || 0), 0)
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Gagal mengambil data arus kas.'
        throw error
      } finally { this.loading = false }
    },
  },
})
