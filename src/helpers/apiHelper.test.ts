import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getAccessToken, putAccessToken, apiRequest } from './apiHelper'

describe('apiHelper', () => {
  beforeEach(() => {
    vi.unstubAllGlobals()
    localStorage.clear()
    vi.restoreAllMocks()
  })

  describe('getAccessToken', () => {
    it('returns null if localStorage is undefined', () => {
      const originalLocalStorage = global.localStorage
      Object.defineProperty(global, 'localStorage', { value: undefined, configurable: true })
      expect(getAccessToken()).toBeNull()
      Object.defineProperty(global, 'localStorage', { value: originalLocalStorage, configurable: true })
    })

    it('returns token from localStorage', () => {
      localStorage.setItem('delcom_access_token', 'test-token')
      expect(getAccessToken()).toBe('test-token')
    })

    it('returns null if token is not set', () => {
      expect(getAccessToken()).toBeNull()
    })
  })

  describe('putAccessToken', () => {
    it('does nothing if localStorage is undefined', () => {
      const originalLocalStorage = global.localStorage
      Object.defineProperty(global, 'localStorage', { value: undefined, configurable: true })
      putAccessToken('token')
      // No error thrown
      Object.defineProperty(global, 'localStorage', { value: originalLocalStorage, configurable: true })
    })

    it('sets token if token is provided', () => {
      putAccessToken('new-token')
      expect(localStorage.getItem('delcom_access_token')).toBe('new-token')
    })

    it('removes token if token is null', () => {
      localStorage.setItem('delcom_access_token', 'test')
      putAccessToken(null)
      expect(localStorage.getItem('delcom_access_token')).toBeNull()
    })
  })

  describe('apiRequest', () => {
    let fetchMock: any

    beforeEach(() => {
      fetchMock = vi.fn()
      vi.stubGlobal('fetch', fetchMock)
      vi.stubGlobal('import', { meta: { env: { VITE_DELCOM_BASEURL: 'http://test' } } })
    })

    it('sends request and returns data on success', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true })
      })

      const res = await apiRequest('/test')
      expect(res).toEqual({ success: true })
      expect(fetchMock).toHaveBeenCalledWith('https://open-api.delcom.org/api/v1/test', expect.objectContaining({
        headers: expect.any(Headers)
      }))
    })

    it('sets Content-Type to application/json if body is provided', async () => {
      fetchMock.mockResolvedValueOnce({ ok: true, json: async () => ({}) })
      await apiRequest('/test', { body: JSON.stringify({ a: 1 }) })
      const callArgs = fetchMock.mock.calls[0]
      const headers = callArgs[1].headers as Headers
      expect(headers.get('Content-Type')).toBe('application/json')
    })

    it('does not overwrite Content-Type if already provided', async () => {
      fetchMock.mockResolvedValueOnce({ ok: true, json: async () => ({}) })
      const customHeaders = new Headers()
      customHeaders.set('Content-Type', 'text/plain')
      await apiRequest('/test', { body: JSON.stringify({ a: 1 }), headers: customHeaders })
      const callArgs = fetchMock.mock.calls[0]
      const headers = callArgs[1].headers as Headers
      expect(headers.get('Content-Type')).toBe('text/plain')
    })

    it('sets Authorization header if token exists', async () => {
      localStorage.setItem('delcom_access_token', 'my-token')
      fetchMock.mockResolvedValueOnce({ ok: true, json: async () => ({}) })
      await apiRequest('/test')
      const callArgs = fetchMock.mock.calls[0]
      const headers = callArgs[1].headers as Headers
      expect(headers.get('Authorization')).toBe('Bearer my-token')
    })

    it('formats path correctly without double slash', async () => {
      fetchMock.mockResolvedValueOnce({ ok: true, json: async () => ({}) })
      await apiRequest('test')
      expect(fetchMock).toHaveBeenCalledWith('https://open-api.delcom.org/api/v1/test', expect.any(Object))
    })

    it('throws error with payload message on failure', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({ message: 'Bad Request' })
      })
      await expect(apiRequest('/test')).rejects.toThrow('Bad Request')
    })

    it('throws error with payload error on failure', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({ error: 'Unauthorized' })
      })
      await expect(apiRequest('/test')).rejects.toThrow('Unauthorized')
    })

    it('throws default error on failure with invalid json', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => { throw new Error('invalid') }
      })
      await expect(apiRequest('/test')).rejects.toThrow('Permintaan gagal (500)')
    })
  })
})
