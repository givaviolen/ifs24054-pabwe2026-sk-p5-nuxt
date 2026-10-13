
import {
  apiRequest,
  putAccessToken,
} from '../../../helpers/apiHelper'

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

export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload {
  name: string
  email: string
  password: string
  password_confirmation: string
}

export async function login(
  payload: LoginPayload,
): Promise<AuthResponse> {
  const response = await apiRequest<{ data: AuthResponse }>(
    '/auth/login',
    {
      method: 'POST',
      body: JSON.stringify(payload),
    },
  )

  const authData = response.data

  if (!authData?.token) {
    throw new Error('Token autentikasi tidak ditemukan pada respons API.')
  }

  putAccessToken(authData.token)

  return authData
}

export async function register(
  payload: RegisterPayload,
): Promise<unknown> {
  return apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function logout(): Promise<unknown> {
  try {
    return await apiRequest('/auth/logout', {
      method: 'POST',
    })
  } finally {
    putAccessToken(null)
  }
}
