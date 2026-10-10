import { describe, it, expect, vi, beforeEach } from 'vitest'
import { showSuccessDialog, showErrorDialog, showConfirmDialog, formatRupiah, formatDate } from './toolsHelper'
import Swal from 'sweetalert2'

vi.mock('sweetalert2', () => ({
  default: {
    fire: vi.fn()
  }
}))

describe('toolsHelper', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('showSuccessDialog', () => {
    it('calls Swal.fire with success icon', async () => {
      await showSuccessDialog('Success msg')
      expect(Swal.fire).toHaveBeenCalledWith({
        icon: 'success',
        title: 'Berhasil',
        text: 'Success msg',
        confirmButtonText: 'Mengerti'
      })
    })
  })

  describe('showErrorDialog', () => {
    it('calls Swal.fire with error icon', async () => {
      await showErrorDialog('Error msg')
      expect(Swal.fire).toHaveBeenCalledWith({
        icon: 'error',
        title: 'Terjadi kesalahan',
        text: 'Error msg',
        confirmButtonText: 'Tutup'
      })
    })
  })

  describe('showConfirmDialog', () => {
    it('returns true if confirmed', async () => {
      (Swal.fire as any).mockResolvedValueOnce({ isConfirmed: true })
      const res = await showConfirmDialog('Are you sure?')
      expect(Swal.fire).toHaveBeenCalledWith({
        icon: 'warning',
        title: 'Konfirmasi',
        text: 'Are you sure?',
        showCancelButton: true,
        confirmButtonText: 'Ya, lanjutkan',
        cancelButtonText: 'Batal'
      })
      expect(res).toBe(true)
    })

    it('returns false if not confirmed', async () => {
      (Swal.fire as any).mockResolvedValueOnce({ isConfirmed: false })
      const res = await showConfirmDialog('Are you sure?')
      expect(res).toBe(false)
    })
  })

  describe('formatRupiah', () => {
    it('formats number to Rupiah string', () => {
      const result = formatRupiah(1500000)
      // Because depending on Node version, the space might be narrow non-breaking space (char 8239) or regular space.
      // So let's just check it contains Rp and 1.500.000
      expect(result).toMatch(/Rp/i)
      expect(result).toMatch(/1\.500\.000/)
    })
  })

  describe('formatDate', () => {
    it('formats string date correctly', () => {
      const date = new Date('2023-12-01T10:30:00Z')
      const result = formatDate(date.toISOString())
      expect(result).not.toBe('-')
    })

    it('formats Date object correctly', () => {
      const date = new Date('2023-12-01T10:30:00Z')
      const result = formatDate(date)
      expect(result).not.toBe('-')
    })

    it('returns "-" for invalid string date', () => {
      const result = formatDate('invalid date')
      expect(result).toBe('-')
    })

    it('returns "-" for invalid Date object', () => {
      const result = formatDate(new Date('invalid'))
      expect(result).toBe('-')
    })
  })
})
