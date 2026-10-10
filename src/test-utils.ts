import { createPinia, setActivePinia } from 'pinia'
export function createMockPinia() {
  const pinia = createPinia()
  setActivePinia(pinia)
  return pinia
}
