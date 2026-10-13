import { showErrorDialog, showSuccessDialog } from './toolsHelper'

/** Menjalankan aksi async, mengatur flag `busy`, dan menampilkan dialog. */
export async function runAction(busy: { value: boolean }, fn: () => Promise<any>, { success = false } = {}) {
  busy.value = true
  try {
    const response = await fn()
    if (success && response?.message) showSuccessDialog(response.message)
    busy.value = false
    return response || true
  } catch (error: any) {
    showErrorDialog(error?.message)
    busy.value = false
    return false
  }
}
