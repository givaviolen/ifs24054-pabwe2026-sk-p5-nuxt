import Swal from 'sweetalert2'

export async function showSuccessDialog(message: string): Promise<void> {
  await Swal.fire({ icon: 'success', title: 'Berhasil', text: message, confirmButtonText: 'Mengerti' })
}
export async function showErrorDialog(message: string): Promise<void> {
  await Swal.fire({ icon: 'error', title: 'Terjadi kesalahan', text: message, confirmButtonText: 'Tutup' })
}
export async function showConfirmDialog(message: string): Promise<boolean> {
  const result = await Swal.fire({ icon: 'warning', title: 'Konfirmasi', text: message, showCancelButton: true, confirmButtonText: 'Ya, lanjutkan', cancelButtonText: 'Batal' })
  return result.isConfirmed
}
export function formatRupiah(value: number): string {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value)
}
export function formatDate(value: string | Date): string {
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return '-'
  return new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium', timeStyle: 'short' }).format(date)
}
