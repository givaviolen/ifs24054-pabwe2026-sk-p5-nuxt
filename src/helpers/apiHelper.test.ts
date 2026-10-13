import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest'

import {
  apiRequest,
  getAccessToken,
  putAccessToken,
} from './apiHelper'

describe('apiHelper', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.restoreAllMocks()
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  describe('getAccessToken', () => {
    it('mengembalikan null jika token belum tersedia', () => {
      expect(getAccessToken()).toBeNull()
    })

    it('mengembalikan token yang tersimpan', () => {
      localStorage.setItem(
        'delcom_access_token',
        'token-pengujian',
      )

      expect(getAccessToken()).toBe('token-pengujian')
    })

    it('mengembalikan null jika localStorage bernilai undefined', () => {
      const originalLocalStorage = global.localStorage
      Object.defineProperty(global, 'localStorage', {
        value: undefined,
        configurable: true,
      })
      expect(getAccessToken()).toBeNull()
      Object.defineProperty(global, 'localStorage', {
        value: originalLocalStorage,
        configurable: true,
      })
    })
  })

  describe('putAccessToken', () => {
    it('menyimpan token ke localStorage', () => {
      putAccessToken('token-pengujian')

      expect(
        localStorage.getItem('delcom_access_token'),
      ).toBe('token-pengujian')
    })

    it('menghapus token jika nilainya null', () => {
      putAccessToken('token-pengujian')
      putAccessToken(null)

      expect(
        localStorage.getItem('delcom_access_token'),
      ).toBeNull()
    })

    it('tidak melakukan apa-apa jika localStorage bernilai undefined', () => {
      const originalLocalStorage = global.localStorage
      Object.defineProperty(global, 'localStorage', {
        value: undefined,
        configurable: true,
      })
      putAccessToken('token-pengujian')
      Object.defineProperty(global, 'localStorage', {
        value: originalLocalStorage,
        configurable: true,
      })
    })
  })

  describe('apiRequest', () => {
    it('mengirim permintaan dengan header JSON', async () => {
      const fetchMock = vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({ message: 'Berhasil' }),
          {
            status: 200,
            headers: {
              'Content-Type': 'application/json',
            },
          },
        ),
      )

      vi.stubGlobal('fetch', fetchMock)

      const result = await apiRequest<{ message: string }>(
        '/test',
      )

      expect(result.message).toBe('Berhasil')
      expect(fetchMock).toHaveBeenCalledTimes(1)

      const requestOptions = fetchMock.mock.calls[0][1] as RequestInit
      const headers = new Headers(requestOptions.headers)

      expect(headers.get('Accept')).toBe('application/json')
    })

    it('menangani path yang tidak diawali garis miring', async () => {
      const fetchMock = vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ message: 'Berhasil' }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      )

      vi.stubGlobal('fetch', fetchMock)

      await apiRequest('test-path')
      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringMatching(/\/test-path$/),
        expect.any(Object),
      )
    })

    it('menambahkan Content-Type application/json jika body dikirimkan', async () => {
      const fetchMock = vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ success: true }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      )

      vi.stubGlobal('fetch', fetchMock)

      await apiRequest('/test', {
        body: JSON.stringify({ name: 'Testing' }),
      })

      const requestOptions = fetchMock.mock.calls[0][1] as RequestInit
      const headers = new Headers(requestOptions.headers)

      expect(headers.get('Content-Type')).toBe('application/json')
    })

    it('tidak menimpa Content-Type jika header Content-Type sudah disetel', async () => {
      const fetchMock = vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ success: true }), {
          status: 200,
        }),
      )

      vi.stubGlobal('fetch', fetchMock)

      const customHeaders = new Headers()
      customHeaders.set('Content-Type', 'text/plain')

      await apiRequest('/test', {
        body: 'plain text',
        headers: customHeaders,
      })

      const requestOptions = fetchMock.mock.calls[0][1] as RequestInit
      const headers = new Headers(requestOptions.headers)

      expect(headers.get('Content-Type')).toBe('text/plain')
    })

    it('menambahkan Bearer Token ketika token tersedia', async () => {
      putAccessToken('token-pengujian')

      const fetchMock = vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ data: [] }), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
        }),
      )

      vi.stubGlobal('fetch', fetchMock)

      await apiRequest('/test')

      const requestOptions = fetchMock.mock.calls[0][1] as RequestInit
      const headers = new Headers(requestOptions.headers)

      expect(headers.get('Authorization')).toBe(
        'Bearer token-pengujian',
      )
    })

    it('melempar error jika server mengembalikan status gagal dengan message', async () => {
      const fetchMock = vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({ message: 'Akses ditolak' }),
          {
            status: 401,
            headers: {
              'Content-Type': 'application/json',
            },
          },
        ),
      )

      vi.stubGlobal('fetch', fetchMock)

      await expect(
        apiRequest('/test'),
      ).rejects.toThrow('Akses ditolak')
    })

    it('melempar error jika server mengembalikan status gagal dengan error key', async () => {
      const fetchMock = vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({ error: 'Terjadi kesalahan sistem' }),
          {
            status: 400,
            headers: {
              'Content-Type': 'application/json',
            },
          },
        ),
      )

      vi.stubGlobal('fetch', fetchMock)

      await expect(
        apiRequest('/test'),
      ).rejects.toThrow('Terjadi kesalahan sistem')
    })

    it('menangani respons yang bukan JSON', async () => {
      const fetchMock = vi.fn().mockResolvedValue(
        new Response('Server error', {
          status: 500,
        }),
      )

      vi.stubGlobal('fetch', fetchMock)

      await expect(
        apiRequest('/test'),
      ).rejects.toThrow('Permintaan gagal (500)')
    })
  })
})
