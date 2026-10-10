import { apiRequest, putAccessToken } from '~/helpers/apiHelper'

export interface User {
  id: number
  name: string
  email: string
  email_verified_at: string | null
  created_at: string
  updated_at: string
}

export interface AuthResponse {
  user: User
  token: string
}

export async function login(payload: any): Promise<AuthResponse> {
  const res = await apiRequest<{ data: AuthResponse }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload)
  })
  putAccessToken(res.data.token)
  return res.data
}

export async function register(payload: any): Promise<unknown> {
  return apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload)
  })
}

export async function logout(): Promise<unknown> {
  const res = await apiRequest('/auth/logout', { method: 'POST' })
  putAccessToken(null)
  return res
}
