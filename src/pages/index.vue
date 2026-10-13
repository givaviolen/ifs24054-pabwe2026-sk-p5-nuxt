
<script setup lang="ts">
import {
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
  Plus,
  RefreshCw,
  LogOut,
  Pencil,
  Trash2,
  X,
} from 'lucide-vue-next'

import {
  getAccessToken,
} from '~/helpers/apiHelper'

import {
  login as unusedLogin,
  logout,
} from '~/features/auth/api/authApi'

import {
  createCashFlow,
  updateCashFlow,
  deleteCashFlow,
  type CashFlow,
} from '~/features/cashflows/api/cashFlowApi'

import { useCashFlowsStore } from '~/features/cashflows/states/cashFlowsStore'
import {
  showConfirmDialog,
  showErrorDialog,
  showSuccessDialog,
  formatRupiah,
  formatDate,
} from '~/helpers/toolsHelper'

const store = useCashFlowsStore()
const router = useRouter()

const loading = ref(false)
const saving = ref(false)
const errorMessage = ref('')
const showForm = ref(false)
const editingId = ref<string | null>(null)

const form = reactive({
  type: 'inflow' as 'inflow' | 'outflow',
  source: 'cash' as 'cash' | 'savings' | 'loans',
  label: '',
  nominal: 0,
  description: '',
})

function resetForm() {
  editingId.value = null
  form.type = 'inflow'
  form.source = 'cash'
  form.label = ''
  form.nominal = 0
  form.description = ''
}

function openAddForm() {
  resetForm()
  showForm.value = true
}

function openEditForm(item: CashFlow) {
  editingId.value = String(item.id)
  form.type = item.type
  form.source = item.source
  form.label = item.label
  form.nominal = Number(item.nominal)
  form.description = item.description || ''
  showForm.value = true
}

async function refresh() {
  if (!getAccessToken()) {
    await router.replace('/login')
    return
  }

  loading.value = true
  errorMessage.value = ''

  try {
    await store.fetchCashFlows()
  } catch (error) {
    errorMessage.value =
      error instanceof Error
        ? error.message
        : 'Gagal mengambil data arus kas.'

    if (
      errorMessage.value.includes('401') ||
      errorMessage.value.toLowerCase().includes('unauthorized')
    ) {
      await router.replace('/login')
    }
  } finally {
    loading.value = false
  }
}

async function saveCashFlow() {
  if (!form.label.trim()) {
    await showErrorDialog('Kategori transaksi harus diisi.')
    return
  }

  if (!Number.isFinite(form.nominal) || form.nominal <= 0) {
    await showErrorDialog('Nominal harus lebih besar dari nol.')
    return
  }

  saving.value = true

  try {
    const payload = {
      type: form.type,
      source: form.source,
      label: form.label.trim(),
      nominal: Number(form.nominal),
      description: form.description.trim(),
    }

    if (editingId.value) {
      await updateCashFlow(editingId.value, payload)
      await showSuccessDialog('Transaksi berhasil diperbarui.')
    } else {
      await createCashFlow(payload)
      await showSuccessDialog('Transaksi berhasil ditambahkan.')
    }

    showForm.value = false
    resetForm()
    await refresh()
  } catch (error) {
    await showErrorDialog(
      error instanceof Error
        ? error.message
        : 'Gagal menyimpan transaksi.',
    )
  } finally {
    saving.value = false
  }
}

async function removeCashFlow(item: CashFlow) {
  const confirmed = await showConfirmDialog(
    `Hapus transaksi "${item.label}"?`,
  )

  if (!confirmed) return

  try {
    await deleteCashFlow(String(item.id))
    await showSuccessDialog('Transaksi berhasil dihapus.')
    await refresh()
  } catch (error) {
    await showErrorDialog(
      error instanceof Error
        ? error.message
        : 'Gagal menghapus transaksi.',
    )
  }
}

async function doLogout() {
  try {
    await logout()
  } catch {
    // Token tetap dibersihkan oleh fungsi logout.
  } finally {
    await router.replace('/login')
  }
}

onMounted(refresh)

const totalInflow = computed(() =>
  store.cashFlows
    .filter(item => item.type === 'inflow')
    .reduce((total, item) => total + Number(item.nominal || 0), 0),
)

const totalOutflow = computed(() =>
  store.cashFlows
    .filter(item => item.type === 'outflow')
    .reduce((total, item) => total + Number(item.nominal || 0), 0),
)

const balance = computed(() => totalInflow.value - totalOutflow.value)
</script>

<template>
  <main class="min-h-screen bg-slate-50">
    <header
      class="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4 md:px-10"
    >
      <div class="flex items-center gap-3">
        <div class="rounded-xl bg-blue-600 p-2 text-white">
          <Wallet :size="24" />
        </div>
        <div>
          <p class="font-extrabold">Delcom Cash Flow</p>
          <p class="text-xs text-slate-500">Pengelolaan arus kas</p>
        </div>
      </div>

      <div class="flex gap-2">
        <button
          class="rounded-xl border border-slate-200 px-4 py-2 hover:bg-slate-50 disabled:opacity-50"
          :disabled="loading"
          @click="refresh"
        >
          <RefreshCw class="mr-2 inline" :size="16" />
          Muat ulang
        </button>

        <button
          class="rounded-xl border border-rose-200 px-4 py-2 text-rose-600 hover:bg-rose-50"
          @click="doLogout"
        >
          <LogOut class="mr-2 inline" :size="16" />
          Keluar
        </button>
      </div>
    </header>

    <section class="mx-auto max-w-7xl px-5 py-10 md:px-8">
      <div class="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p class="mb-2 text-sm font-bold uppercase tracking-widest text-blue-600">
            Ringkasan keuangan
          </p>
          <h1 class="text-3xl font-extrabold md:text-4xl">
            Dashboard Arus Kas
          </h1>
          <p class="mt-2 text-slate-500">
            Pantau pemasukan dan pengeluaran Anda dalam satu tempat.
          </p>
        </div>

        <button
          class="rounded-xl bg-blue-600 px-5 py-3 font-bold text-white shadow-lg hover:bg-blue-700"
          @click="openAddForm"
        >
          <Plus class="mr-2 inline" :size="18" />
          Tambah transaksi
        </button>
      </div>

      <div
        v-if="errorMessage"
        class="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
      >
        {{ errorMessage }}
        <NuxtLink to="/login" class="ml-2 font-bold underline">
          Ke Halaman Login
        </NuxtLink>
      </div>

      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <article class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div class="mb-5 flex items-center justify-between">
            <span class="text-sm text-slate-500">Saldo bersih</span>
            <Wallet class="text-blue-600" />
          </div>
          <p class="text-2xl font-extrabold">{{ formatRupiah(balance) }}</p>
          <p class="mt-2 text-xs text-slate-500">
            Pemasukan dikurangi pengeluaran
          </p>
        </article>

        <article class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div class="mb-5 flex items-center justify-between">
            <span class="text-sm text-slate-500">Total pemasukan</span>
            <ArrowDownLeft class="text-emerald-600" />
          </div>
          <p class="text-2xl font-extrabold">
            {{ formatRupiah(totalInflow) }}
          </p>
          <p class="mt-2 text-xs text-emerald-700">Dana masuk</p>
        </article>

        <article class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div class="mb-5 flex items-center justify-between">
            <span class="text-sm text-slate-500">Total pengeluaran</span>
            <ArrowUpRight class="text-rose-600" />
          </div>
          <p class="text-2xl font-extrabold">
            {{ formatRupiah(totalOutflow) }}
          </p>
          <p class="mt-2 text-xs text-rose-700">Dana keluar</p>
        </article>
      </div>

      <section class="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div class="flex items-center justify-between border-b border-slate-100 px-6 py-5">
          <div>
            <h2 class="font-extrabold">Transaksi terbaru</h2>
            <p class="mt-1 text-sm text-slate-500">
              Daftar catatan arus kas dari API Delcom
            </p>
          </div>
          <span class="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold">
            {{ store.cashFlows.length }} transaksi
          </span>
        </div>

        <div v-if="loading" class="p-10 text-center text-slate-500">
          Memuat data transaksi...
        </div>

        <div
          v-else-if="store.cashFlows.length === 0"
          class="p-10 text-center"
        >
          <Wallet class="mx-auto mb-3 text-slate-300" :size="32" />
          <p class="font-bold">Belum ada transaksi untuk ditampilkan</p>
          <p class="mt-1 text-sm text-slate-500">
            Tambahkan transaksi atau periksa akun dan koneksi API.
          </p>
          <button
            class="mt-4 rounded-xl bg-blue-600 px-4 py-2 font-bold text-white"
            @click="openAddForm"
          >
            Tambah transaksi pertama
          </button>
        </div>

        <div v-else class="overflow-x-auto">
          <table class="w-full text-left text-sm">
            <thead class="bg-slate-50 text-slate-500">
              <tr>
                <th class="px-6 py-3">Kategori</th>
                <th class="px-6 py-3">Jenis</th>
                <th class="px-6 py-3">Sumber</th>
                <th class="px-6 py-3 text-right">Nominal</th>
                <th class="px-6 py-3">Tanggal</th>
                <th class="px-6 py-3 text-center">Aksi</th>
              </tr>
            </thead>

            <tbody>
              <tr
                v-for="item in store.cashFlows"
                :key="item.id"
                class="border-t border-slate-100"
              >
                <td class="px-6 py-4">
                  <p class="font-bold">{{ item.label }}</p>
                  <p class="text-xs text-slate-500">
                    {{ item.description || '-' }}
                  </p>
                </td>
                <td class="px-6 py-4">
                  <span
                    class="rounded-full px-3 py-1 text-xs font-bold"
                    :class="item.type === 'inflow'
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-rose-50 text-rose-700'"
                  >
                    {{ item.type === 'inflow' ? 'Pemasukan' : 'Pengeluaran' }}
                  </span>
                </td>
                <td class="px-6 py-4 text-slate-500">
                  {{ item.source }}
                </td>
                <td class="px-6 py-4 text-right font-bold">
                  {{ formatRupiah(Number(item.nominal)) }}
                </td>
                <td class="px-6 py-4 text-slate-500">
                  {{ item.created_at ? formatDate(item.created_at) : '-' }}
                </td>
                <td class="px-6 py-4">
                  <div class="flex justify-center gap-2">
                    <button
                      class="rounded-lg border border-blue-200 p-2 text-blue-600 hover:bg-blue-50"
                      title="Ubah transaksi"
                      @click="openEditForm(item)"
                    >
                      <Pencil :size="16" />
                    </button>
                    <button
                      class="rounded-lg border border-rose-200 p-2 text-rose-600 hover:bg-rose-50"
                      title="Hapus transaksi"
                      @click="removeCashFlow(item)"
                    >
                      <Trash2 :size="16" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </section>

    <div
      v-if="showForm"
      class="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-slate-900/50 p-4"
      @click.self="showForm = false"
    >
      <section class="my-8 w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
        <div class="mb-6 flex items-center justify-between">
          <h2 class="text-xl font-extrabold">
            {{ editingId ? 'Ubah transaksi' : 'Tambah transaksi' }}
          </h2>
          <button
            class="rounded-lg p-2 hover:bg-slate-100"
            @click="showForm = false"
          >
            <X :size="20" />
          </button>
        </div>

        <form class="space-y-4" @submit.prevent="saveCashFlow">
          <div>
            <label class="mb-1 block text-sm font-semibold">Jenis transaksi</label>
            <select v-model="form.type" class="w-full rounded-xl border border-slate-300 px-3 py-2">
              <option value="inflow">Pemasukan</option>
              <option value="outflow">Pengeluaran</option>
            </select>
          </div>

          <div>
            <label class="mb-1 block text-sm font-semibold">Sumber dana</label>
            <select v-model="form.source" class="w-full rounded-xl border border-slate-300 px-3 py-2">
              <option value="cash">Tunai</option>
              <option value="savings">Tabungan</option>
              <option value="loans">Pinjaman</option>
            </select>
          </div>

          <div>
            <label class="mb-1 block text-sm font-semibold">Kategori</label>
            <input
              v-model="form.label"
              required
              class="w-full rounded-xl border border-slate-300 px-3 py-2"
              placeholder="Contoh: Makanan"
            />
          </div>

          <div>
            <label class="mb-1 block text-sm font-semibold">Nominal (Rp)</label>
            <input
              v-model.number="form.nominal"
              type="number"
              min="1"
              required
              class="w-full rounded-xl border border-slate-300 px-3 py-2"
              placeholder="Contoh: 50000"
            />
          </div>

          <div>
            <label class="mb-1 block text-sm font-semibold">Deskripsi</label>
            <textarea
              v-model="form.description"
              rows="3"
              class="w-full rounded-xl border border-slate-300 px-3 py-2"
              placeholder="Keterangan transaksi"
            />
          </div>

          <div class="flex justify-end gap-3 pt-2">
            <button
              type="button"
              class="rounded-xl border border-slate-300 px-4 py-2"
              @click="showForm = false"
            >
              Batal
            </button>
            <button
              type="submit"
              :disabled="saving"
              class="rounded-xl bg-blue-600 px-5 py-2 font-bold text-white disabled:opacity-50"
            >
              {{ saving ? 'Menyimpan...' : 'Simpan transaksi' }}
            </button>
          </div>
        </form>
      </section>
    </div>
  </main>
</template>
