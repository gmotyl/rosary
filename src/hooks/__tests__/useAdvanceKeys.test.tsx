import {vi, describe, it, expect, afterEach} from 'vitest'
import {renderHook} from '@testing-library/react-hooks'
import {ADVANCE_KEYS, useAdvanceKeys} from '../useAdvanceKeys'

// Dispatch a cancelable keydown on the target; it bubbles up to window
const press = (
  key: string,
  target: EventTarget = document.body,
  init: KeyboardEventInit = {},
) => {
  const event = new KeyboardEvent('keydown', {
    key,
    bubbles: true,
    cancelable: true,
    ...init,
  })
  target.dispatchEvent(event)
  return event
}

const mount = (html: string) => {
  const host = document.createElement('div')
  host.innerHTML = html
  document.body.appendChild(host)
  return host.firstElementChild as HTMLElement
}

afterEach(() => {
  document.body.innerHTML = ''
})

describe('useAdvanceKeys', () => {
  it('each advance key advances once and prevents default', () => {
    const advance = vi.fn()
    renderHook(() => useAdvanceKeys(advance, true))
    for (const key of ADVANCE_KEYS) {
      advance.mockClear()
      const event = press(key)
      expect(advance).toHaveBeenCalledTimes(1)
      expect(event.defaultPrevented).toBe(true)
    }
  })

  it('Space and Enter on interactive targets are ignored', () => {
    const advance = vi.fn()
    renderHook(() => useAdvanceKeys(advance, true))
    const targets = [
      '<button>b</button>',
      '<a href="#x">a</a>',
      '<input />',
      '<select><option>o</option></select>',
      '<textarea></textarea>',
      '<div contenteditable="true">e</div>',
      '<div role="button">r</div>',
    ]
    for (const html of targets) {
      const el = mount(html)
      for (const key of [' ', 'Enter']) {
        const event = press(key, el)
        expect(event.defaultPrevented).toBe(false)
      }
    }
    expect(advance).not.toHaveBeenCalled()
  })

  it('arrow keys in text fields are ignored', () => {
    const advance = vi.fn()
    renderHook(() => useAdvanceKeys(advance, true))
    const targets = [
      '<input />',
      '<textarea></textarea>',
      '<select><option>o</option></select>',
      '<div contenteditable="true">e</div>',
    ]
    for (const html of targets) {
      const el = mount(html)
      for (const key of ['ArrowRight', 'ArrowDown', 'PageDown']) {
        press(key, el)
      }
    }
    expect(advance).not.toHaveBeenCalled()
    // Arrows on a button are not text editing, so they still advance
    press('ArrowRight', mount('<button>b</button>'))
    expect(advance).toHaveBeenCalledTimes(1)
  })

  it('repeat and modifier keys are ignored', () => {
    const advance = vi.fn()
    renderHook(() => useAdvanceKeys(advance, true))
    press('ArrowRight', document.body, {repeat: true})
    press('ArrowRight', document.body, {ctrlKey: true})
    press('ArrowRight', document.body, {altKey: true})
    press('ArrowRight', document.body, {metaKey: true})
    expect(advance).not.toHaveBeenCalled()
  })

  it('keys do nothing when disabled', () => {
    const advance = vi.fn()
    renderHook(() => useAdvanceKeys(advance, false))
    for (const key of ADVANCE_KEYS) {
      const event = press(key)
      expect(event.defaultPrevented).toBe(false)
    }
    expect(advance).not.toHaveBeenCalled()
  })

  it('listener is removed on unmount', () => {
    const advance = vi.fn()
    const {unmount} = renderHook(() => useAdvanceKeys(advance, true))
    unmount()
    press('ArrowRight')
    expect(advance).not.toHaveBeenCalled()
  })

  it('calls the latest advance after a re-render', () => {
    const first = vi.fn()
    const second = vi.fn()
    const {rerender} = renderHook(({fn}) => useAdvanceKeys(fn, true), {
      initialProps: {fn: first},
    })
    rerender({fn: second})
    press('ArrowRight')
    expect(first).not.toHaveBeenCalled()
    expect(second).toHaveBeenCalledTimes(1)
  })
})
