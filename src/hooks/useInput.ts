export function useInput<T>(initialValue: T) {
  const value = ref<T>(initialValue)
  const reset = () => { value.value = initialValue }
  return { value, reset }
}
