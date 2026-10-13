
<script setup lang="ts">
import { ref } from 'vue'
import {
  login as loginUser,
  type LoginPayload,
} from '../../features/auth/api/authApi'

definePageMeta({
  layout: false,
})

const email = ref('')
const password = ref('')
const loading = ref(false)
const errorMessage = ref('')
const showPassword = ref(false)

async function handleLogin() {
  errorMessage.value = ''

  if (!email.value.trim() || !password.value) {
    errorMessage.value = 'Email dan kata sandi wajib diisi.'
    return
  }

  loading.value = true

  try {
    const payload: LoginPayload = {
      email: email.value.trim(),
      password: password.value,
    }

    await loginUser(payload)
    await navigateTo('/')
  } catch (error: unknown) {
    errorMessage.value =
      error instanceof Error
        ? error.message
        : 'Login gagal. Periksa kembali email dan kata sandi Anda.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <main class="login-page">
    <section class="login-card">
      <header class="login-header">
        <div class="brand-icon" aria-hidden="true">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="30"
            height="30"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <path d="M3 9h18" />
            <path d="M16 14h2" />
          </svg>
        </div>

        <h1>Delcom Cash Flow</h1>
        <p>Masuk untuk mengelola arus kas Anda.</p>
      </header>

      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="login-email-input">
            Alamat Email
          </label>

          <input
            id="login-email-input"
            v-model="email"
            name="email"
            type="email"
            placeholder="nama@email.com"
            autocomplete="username"
            required
            :disabled="loading"
          />
        </div>

        <div class="form-group">
          <label for="login-password-input">
            Kata Sandi
          </label>

          <div class="password-wrapper">
            <input
              id="login-password-input"
              v-model="password"
              name="password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Masukkan kata sandi"
              autocomplete="current-password"
              required
              :disabled="loading"
            />

            <button
              class="password-toggle"
              type="button"
              :disabled="loading"
              :aria-label="
                showPassword
                  ? 'Sembunyikan kata sandi'
                  : 'Lihat kata sandi'
              "
              @click="showPassword = !showPassword"
            >
              {{ showPassword ? 'Sembunyikan' : 'Lihat' }}
            </button>
          </div>
        </div>

        <p
          v-if="errorMessage"
          class="error-message"
          role="alert"
          aria-live="polite"
        >
          {{ errorMessage }}
        </p>

        <button
          id="login-submit-button"
          class="login-button"
          type="submit"
          :disabled="loading"
        >
          <span v-if="loading">Sedang masuk...</span>
          <span v-else>Masuk Sekarang</span>
        </button>
      </form>

      <footer class="login-footer">
        <p>Delcom Cash Flow</p>
        <p>Pengelolaan arus kas dengan lebih mudah.</p>
      </footer>
    </section>
  </main>
</template>

<style scoped>
.login-page {
  box-sizing: border-box;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: #f3f6fb;
  color: #172b4d;
}

.login-card {
  box-sizing: border-box;
  width: 100%;
  max-width: 440px;
  padding: 32px;
  background: #ffffff;
  border: 1px solid #dfe6f0;
  border-radius: 16px;
  box-shadow: 0 8px 28px rgb(20 40 80 / 8%);
}

.login-header {
  margin-bottom: 28px;
  text-align: center;
}

.brand-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  margin: 0 auto 16px;
  border-radius: 14px;
  background: #175cff;
  color: #ffffff;
}

.login-header h1 {
  margin: 0 0 8px;
  color: #172b4d;
  font-size: 26px;
  font-weight: 700;
}

.login-header p {
  margin: 0;
  color: #52647d;
  font-size: 14px;
  line-height: 1.6;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #26364d;
  font-size: 14px;
  font-weight: 600;
}

.form-group input {
  box-sizing: border-box;
  display: block;
  width: 100%;
  min-height: 46px;
  padding: 12px;
  border: 1px solid #bdc9d9;
  border-radius: 8px;
  background: #ffffff;
  color: #172b4d;
  font-family: inherit;
  font-size: 15px;
}

.form-group input::placeholder {
  color: #64748b;
  opacity: 1;
}

.form-group input:focus {
  border-color: #175cff;
  outline: 2px solid #175cff;
  outline-offset: 2px;
}

.form-group input:disabled {
  background: #f1f5f9;
  cursor: not-allowed;
}

.password-wrapper {
  position: relative;
}

.password-wrapper input {
  padding-right: 100px;
}

.password-toggle {
  position: absolute;
  top: 50%;
  right: 8px;
  padding: 7px;
  transform: translateY(-50%);
  border: 0;
  border-radius: 5px;
  background: transparent;
  color: #174fc4;
  font-family: inherit;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
}

.password-toggle:hover:not(:disabled) {
  background: #eff6ff;
}

.password-toggle:focus-visible {
  outline: 2px solid #174fc4;
  outline-offset: 2px;
}

.password-toggle:disabled {
  cursor: not-allowed;
}

.error-message {
  margin: 0 0 16px;
  padding: 12px;
  border: 1px solid #fecaca;
  border-radius: 8px;
  background: #fef2f2;
  color: #b91c1c;
  font-size: 14px;
  line-height: 1.5;
  overflow-wrap: anywhere;
}

.login-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 48px;
  padding: 12px 16px;
  border: 0;
  border-radius: 8px;
  background: #175cff;
  color: #ffffff;
  font-family: inherit;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
}

.login-button:hover:not(:disabled) {
  background: #104bd6;
}

.login-button:focus-visible {
  outline: 2px solid #174fc4;
  outline-offset: 3px;
}

.login-button:disabled {
  cursor: not-allowed;
  opacity: 0.7;
}

.login-footer {
  margin-top: 24px;
  text-align: center;
}

.login-footer p {
  margin: 5px 0;
  color: #52647d;
  font-size: 12px;
  line-height: 1.5;
}

@media (max-width: 480px) {
  .login-page {
    padding: 16px;
  }

  .login-card {
    padding: 24px 20px;
  }

  .login-header h1 {
    font-size: 23px;
  }
}
</style>
