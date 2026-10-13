
<script setup lang="ts">
import { ref } from 'vue'
import {
  login as loginUser,
  type LoginPayload,
} from '../features/auth/api/authApi'

const email = ref('')
const password = ref('')
const loading = ref(false)
const errorMessage = ref('')
const showPassword = ref(false)

async function handleLogin() {
  errorMessage.value = ''

  if (!email.value.trim() || !password.value) {
    errorMessage.value = 'Email dan password wajib diisi.'
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
        : 'Login gagal. Silakan periksa kembali akun Anda.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <main class="login-page">
    <section class="login-card">
      <header class="login-header">
        <div class="brand-icon" aria-hidden="true">Rp</div>
        <h1>Delcom Cash Flow</h1>
        <p>Masuk untuk mengelola arus kas Anda.</p>
      </header>

      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="login-email-input">
            Email
          </label>

          <input
            id="login-email-input"
            v-model="email"
            name="email"
            type="email"
            placeholder="Masukkan email Anda"
            autocomplete="username"
            required
            :disabled="loading"
          />
        </div>

        <div class="form-group">
          <label for="login-password-input">
            Password
          </label>

          <div class="password-wrapper">
            <input
              id="login-password-input"
              v-model="password"
              name="password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Masukkan password"
              autocomplete="current-password"
              required
              :disabled="loading"
            />

            <button
              class="password-toggle"
              type="button"
              :aria-label="showPassword ? 'Sembunyikan password' : 'Lihat password'"
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
        >
          {{ errorMessage }}
        </p>

        <button
          id="login-submit-button"
          class="login-button"
          type="submit"
          :disabled="loading"
        >
          {{ loading ? 'Sedang masuk...' : 'Masuk' }}
        </button>
      </form>

      <footer class="login-footer">
        <p>Delcom Cash Flow · Pengelolaan arus kas</p>
      </footer>
    </section>
  </main>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: #f3f6fb;
  color: #172b4d;
}

.login-card {
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
  font-size: 20px;
  font-weight: 700;
}

.login-header h1 {
  margin: 0 0 8px;
  font-size: 26px;
  font-weight: 700;
}

.login-header p,
.login-footer p {
  color: #5b6b82;
  font-size: 14px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 600;
}

.form-group input {
  box-sizing: border-box;
  width: 100%;
  min-height: 46px;
  padding: 12px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  background: #ffffff;
  color: #172b4d;
  font: inherit;
}

.form-group input:focus {
  border-color: #175cff;
  outline: 2px solid #175cff;
  outline-offset: 2px;
}

.form-group input:disabled {
  background: #f1f5f9;
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
  padding: 6px;
  transform: translateY(-50%);
  border: 0;
  background: transparent;
  color: #174fc4;
  font-size: 12px;
  cursor: pointer;
}

.error-message {
  margin: 0 0 16px;
  padding: 12px;
  border: 1px solid #fecaca;
  border-radius: 8px;
  background: #fef2f2;
  color: #b91c1c;
  font-size: 14px;
  overflow-wrap: anywhere;
}

.login-button {
  width: 100%;
  min-height: 48px;
  padding: 12px 16px;
  border: 0;
  border-radius: 8px;
  background: #175cff;
  color: #ffffff;
  font: inherit;
  font-weight: 600;
  cursor: pointer;
}

.login-button:hover:not(:disabled) {
  background: #104bd6;
}

.login-button:focus-visible,
.password-toggle:focus-visible {
  outline: 2px solid #174fc4;
  outline-offset: 3px;
}

.login-button:disabled {
  cursor: not-allowed;
  opacity: 0.65;
}

.login-footer {
  margin-top: 24px;
  text-align: center;
}

.login-footer p {
  margin-bottom: 0;
}
</style>
