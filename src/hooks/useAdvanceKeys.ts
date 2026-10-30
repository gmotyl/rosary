import {useEffect, useRef} from 'react'

export const ADVANCE_KEYS = [
  'ArrowRight',
  'ArrowDown',
  ' ',
  'PageDown',
  'Enter',
] as const

// Space/Enter on these already fire a native click (or type); handling the key
// too would advance twice
const INTERACTIVE =
  'button, a[href], input, select, textarea, [contenteditable]:not([contenteditable="false"]), [role=button]'
// Arrows/PageDown move the caret or the selection inside these
const TEXT_FIELD =
  'input, select, textarea, [contenteditable]:not([contenteditable="false"])'
// Open modals/drawers/menus and composite widgets own their keys
const OVERLAY =
  '[role=presentation], [role=dialog], [role=menu], [role=listbox], [role=combobox]'

const isAdvanceKey = (key: string) =>
  (ADVANCE_KEYS as readonly string[]).includes(key)

const targetMatches = (target: EventTarget | null, selector: string) =>
  target instanceof Element && target.closest(selector) !== null

export const useAdvanceKeys = (advance: () => void, enabled: boolean) => {
  // Keep the latest advance so the listener never acts on a stale intention
  const advanceRef = useRef(advance)
  advanceRef.current = advance

  useEffect(() => {
    if (!enabled) return

    const onKeyDown = (e: KeyboardEvent) => {
      if (!isAdvanceKey(e.key)) return
      // A component handler (React's root listener runs before window) took it
      if (e.defaultPrevented) return
      if (targetMatches(e.target, OVERLAY)) return
      if (e.repeat || e.ctrlKey || e.altKey || e.metaKey) return
      const activates = e.key === ' ' || e.key === 'Enter'
      if (targetMatches(e.target, activates ? INTERACTIVE : TEXT_FIELD)) return
      // Space/PageDown must not scroll the page
      e.preventDefault()
      advanceRef.current()
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [enabled])
}
