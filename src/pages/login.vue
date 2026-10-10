<script setup lang="ts">
import { useInput } from '~/hooks/useInput'
import { login } from '~/features/auth/api/authApi'
import { showSuccessDialog, showErrorDialog } from '~/helpers/toolsHelper'

const email = useInput('')
const password = useInput('')
const loading = ref(false)
const router = useRouter()

async function handleLogin() {
  if (!email.value.value || !password.value.value) {
    showErrorDialog('Email dan password harus diisi.')
    return
  }
  loading.value = true
  try {
    await login({ email: email.value.value, password: password.value.value })
    await showSuccessDialog('Berhasil masuk!')
    router.push('/')
  } catch (error: any) {
    showErrorDialog(error.message || 'Gagal login')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <main class="grid min-h-screen place-items-center bg-slate-50 px-6">
    <section class="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
      <div class="mb-8 text-center">
        <h1 class="text-2xl font-extrabold text-slate-900">Masuk</h1>
        <p class="mt-2 text-sm text-slate-500">Silakan masuk menggunakan akun Delcom Anda</p>
      </div>
      <form @submit.prevent="handleLogin" class="flex flex-col gap-4">
        <div>
          <label class="mb-1 block text-sm font-semibold text-slate-700">Email</label>
          <input type="email" v-model="email.value.value" class="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600" placeholder="contoh@email.com" />
        </div>
        <div>
          <label class="mb-1 block text-sm font-semibold text-slate-700">Password</label>
          <input type="password" v-model="password.value.value" class="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600" placeholder="••••••••" />
        </div>
        <button type="submit" :disabled="loading" class="mt-4 w-full rounded-xl bg-blue-600 px-5 py-3 font-bold text-white transition-colors hover:bg-blue-700 disabled:opacity-50">
          <span v-if="loading">Memproses...</span>
          <span v-else>Masuk</span>
        </button>
      </form>
    </section>
  </main>
</template>
