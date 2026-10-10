const BASE_URL = (import.meta.env.VITE_DELCOM_BASEURL || 'https://open-api.delcom.org/api/v1').replace(/\/$/, '')
const TOKEN_KEY = 'delcom_access_token'

export function getAccessToken(): string | null {
  if (typeof localStorage === 'undefined') return null
  return localStorage.getItem(TOKEN_KEY)
}
export function putAccessToken(token: string | null): void {
  if (typeof localStorage === 'undefined') return
  if (token) localStorage.setItem(TOKEN_KEY, token)
  else localStorage.removeItem(TOKEN_KEY)
}
export async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers)
  headers.set('Accept', 'application/json')
  if (options.body && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json')
  const token = getAccessToken()
  if (token) headers.set('Authorization', `Bearer ${token}`)
  const response = await fetch(`${BASE_URL}${path.startsWith('/') ? path : `/${path}`}`, { ...options, headers })
  const payload = await response.json().catch(() => null)
  if (!response.ok) {
    const message = payload?.message || payload?.error || `Permintaan gagal (${response.status})`
    throw new Error(message)
  }
  return payload as T
}
