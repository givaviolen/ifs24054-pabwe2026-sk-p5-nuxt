import { describe, it, expect } from 'vitest'
import { useInput } from './useInput'
import { ref } from 'vue'

describe('useInput', () => {
  it('initializes value with initialValue', () => {
    const { value } = useInput('hello')
    expect(value.value).toBe('hello')
  })

  it('updates value correctly', () => {
    const { value } = useInput(10)
    value.value = 20
    expect(value.value).toBe(20)
  })

  it('resets value to initialValue', () => {
    const { value, reset } = useInput('hello')
    value.value = 'world'
    expect(value.value).toBe('world')
    reset()
    expect(value.value).toBe('hello')
  })
})
