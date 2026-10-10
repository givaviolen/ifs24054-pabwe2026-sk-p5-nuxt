<script setup lang="ts">
import { Wallet, ArrowDownLeft, ArrowUpRight, Plus, RefreshCw, LogOut } from 'lucide-vue-next'
import { useCashFlowsStore } from '~/features/cashflows/states/cashFlowsStore'

const store = useCashFlowsStore()
const loading = ref(false)
const errorMessage = ref('')

async function refresh() {
  loading.value = true
  errorMessage.value = ''
  try { await store.fetchCashFlows() }
  catch (error) { errorMessage.value = error instanceof Error ? error.message : 'Gagal memuat data arus kas.' }
  finally { loading.value = false }
}
onMounted(refresh)
const rupiah = (value: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value || 0)
</script>

<template>
  <main class="min-h-screen">
    <header class="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4 md:px-10">
      <div class="flex items-center gap-3"><div class="rounded-xl bg-blue-600 p-2 text-white"><Wallet :size="22" /></div><div><p class="font-extrabold">Delcom Cash Flow</p><p class="text-xs text-slate-500">Pengelolaan arus kas</p></div></div>
      <div class="flex items-center gap-2">
        <button class="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold hover:bg-slate-50" @click="refresh"><RefreshCw class="mr-2 inline" :size="16" />Muat ulang</button>
        <button class="rounded-xl border border-rose-200 px-4 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50" @click="doLogout"><LogOut class="mr-2 inline" :size="16" />Keluar</button>
      </div>
    </header>
    <section class="mx-auto max-w-7xl px-5 py-10 md:px-8">
      <div class="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end"><div><p class="mb-2 text-sm font-bold uppercase tracking-widest text-blue-600">Ringkasan keuangan</p><h1 class="text-3xl font-extrabold tracking-tight md:text-4xl">Dashboard Arus Kas</h1><p class="mt-2 text-slate-500">Pantau pemasukan dan pengeluaran Anda dalam satu tempat.</p></div><button class="rounded-xl bg-blue-600 px-5 py-3 font-bold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700" @click="refresh"><Plus class="mr-2 inline" :size="18" />Perbarui data</button></div>
      <p v-if="errorMessage" class="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        {{ errorMessage }}. Pastikan API dapat diakses dan Anda sudah mengatur autentikasi.
        <NuxtLink to="/login" class="ml-2 font-bold underline">Ke Halaman Login</NuxtLink>
      </p>
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <article class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><div class="mb-5 flex items-center justify-between"><span class="text-sm font-semibold text-slate-500">Saldo bersih</span><Wallet class="text-blue-600" /></div><p class="text-2xl font-extrabold">{{ rupiah(store.stats.totalInflow - store.stats.totalOutflow) }}</p><p class="mt-2 text-xs text-slate-500">Pemasukan dikurangi pengeluaran</p></article>
        <article class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><div class="mb-5 flex items-center justify-between"><span class="text-sm font-semibold text-slate-500">Total pemasukan</span><ArrowDownLeft class="text-emerald-600" /></div><p class="text-2xl font-extrabold">{{ rupiah(store.stats.totalInflow) }}</p><p class="mt-2 text-xs text-emerald-700">Dana masuk</p></article>
        <article class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><div class="mb-5 flex items-center justify-between"><span class="text-sm font-semibold text-slate-500">Total pengeluaran</span><ArrowUpRight class="text-rose-600" /></div><p class="text-2xl font-extrabold">{{ rupiah(store.stats.totalOutflow) }}</p><p class="mt-2 text-xs text-rose-700">Dana keluar</p></article>
      </div>
      <section class="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div class="flex items-center justify-between border-b border-slate-100 px-6 py-5"><div><h2 class="font-extrabold">Transaksi terbaru</h2><p class="mt-1 text-sm text-slate-500">Daftar catatan arus kas dari API Delcom</p></div><span class="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">{{ store.cashFlows.length }} transaksi</span></div>
        <div v-if="loading" class="p-10 text-center text-slate-500">Memuat data transaksi...</div>
        <div v-else-if="store.cashFlows.length === 0" class="p-10 text-center"><Wallet class="mx-auto mb-3 text-slate-300" :size="32" /><p class="font-bold">Belum ada transaksi untuk ditampilkan</p><p class="mt-1 text-sm text-slate-500">Data akan muncul setelah API mengembalikan catatan arus kas.</p></div>
        <div v-else class="overflow-x-auto"><table class="w-full text-left text-sm"><thead class="bg-slate-50 text-slate-500"><tr><th class="px-6 py-3">Kategori</th><th class="px-6 py-3">Jenis</th><th class="px-6 py-3">Sumber</th><th class="px-6 py-3 text-right">Nominal</th></tr></thead><tbody><tr v-for="item in store.cashFlows" :key="item.id" class="border-t border-slate-100"><td class="px-6 py-4 font-bold">{{ item.label }}</td><td class="px-6 py-4"><span :class="item.type === 'inflow' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'" class="rounded-full px-3 py-1 text-xs font-bold">{{ item.type }}</span></td><td class="px-6 py-4 text-slate-500">{{ item.source }}</td><td class="px-6 py-4 text-right font-bold">{{ rupiah(item.nominal) }}</td></tr></tbody></table></div>
      </section>
      <p class="mt-6 text-center text-xs text-slate-400">Delcom Cash Flow · PABWE 2026 · Nuxt 4 + TypeScript</p>
    </section>
  </main>
</template>
