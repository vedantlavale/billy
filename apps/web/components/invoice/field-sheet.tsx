'use client'

import * as React from "react"

import { CheckIcon, XIcon } from "@/components/icons/rune"

/**
 * On a phone the page is scaled to fit the screen (around 40%), so editing a
 * field in place means typing into 5px text. When the canvas says editing is
 * "compact", EditableText and EditableNumber hand the edit to this bar instead:
 * a full-size input pinned above the keyboard, labelled with the field it is
 * editing. The page itself never changes, so the preview and PDF are untouched.
 *
 * iOS only raises the keyboard when focus() runs inside the tap itself, so the
 * inputs are always mounted and focused synchronously from `open`.
 */

export interface FieldEdit {
  label: string
  value: string
  multiline?: boolean
  inputType?: React.HTMLInputTypeAttribute
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"]
  placeholder?: string
  onCommit: (value: string) => void
}

interface FieldSheetApi {
  open: (edit: FieldEdit, owner: object) => void
  activeOwner: object | null
}

const FieldSheetContext = React.createContext<FieldSheetApi | null>(null)

/** Null outside the canvas (preview, PDF export) and when editing in place. */
export function useFieldSheet() {
  return React.useContext(FieldSheetContext)
}

/** Lifts the bar above the on-screen keyboard. */
function useKeyboardInset(active: boolean) {
  const [inset, setInset] = React.useState(0)
  React.useEffect(() => {
    const vv = window.visualViewport
    if (!active || !vv) return
    const update = () => setInset(Math.max(0, window.innerHeight - vv.height - vv.offsetTop))
    update()
    vv.addEventListener("resize", update)
    vv.addEventListener("scroll", update)
    return () => {
      vv.removeEventListener("resize", update)
      vv.removeEventListener("scroll", update)
      setInset(0)
    }
  }, [active])
  return inset
}

export function FieldSheetProvider({
  enabled,
  children,
}: {
  enabled: boolean
  children: React.ReactNode
}) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)
  const editRef = React.useRef<FieldEdit | null>(null)
  const [edit, setEdit] = React.useState<FieldEdit | null>(null)
  const [activeOwner, setActiveOwner] = React.useState<object | null>(null)
  const inset = useKeyboardInset(edit !== null)

  const close = React.useCallback((save: boolean) => {
    const current = editRef.current
    if (!current) return
    editRef.current = null
    const field = current.multiline ? textareaRef.current : inputRef.current
    const next = field?.value ?? current.value
    field?.blur()
    setEdit(null)
    setActiveOwner(null)
    if (save && next !== current.value) current.onCommit(next)
  }, [])

  const open = React.useCallback(
    (next: FieldEdit, owner: object) => {
      // Tapping another field while one is open saves the first.
      if (editRef.current) close(true)
      const field = next.multiline ? textareaRef.current : inputRef.current
      if (!field) return
      if (field instanceof HTMLInputElement) {
        field.type = next.inputType ?? "text"
        field.inputMode = next.inputMode ?? ""
      }
      field.value = next.value
      field.placeholder = next.placeholder ?? ""
      editRef.current = next
      field.focus({ preventScroll: true })
      if (next.inputType !== "date") field.select()
      setEdit(next)
      setActiveOwner(owner)
    },
    [close],
  )

  const api = React.useMemo(() => ({ open, activeOwner }), [open, activeOwner])

  // Keep focus in the field when the buttons are pressed, so the keyboard
  // stays up and blur doesn't commit before the click lands.
  const keepFocus = (event: React.PointerEvent | React.MouseEvent) => event.preventDefault()

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (event.key === "Escape") {
      event.preventDefault()
      close(false)
    } else if (event.key === "Enter" && (!edit?.multiline || event.metaKey || event.ctrlKey)) {
      event.preventDefault()
      close(true)
    }
  }

  return (
    <FieldSheetContext.Provider value={enabled ? api : null}>
      {children}
      {/* Stays mounted while an edit is open, so rotating the phone out of
          compact mode can't drop what was typed. */}
      {(enabled || edit) && (
        <div
          className="ed-sheet ed-chrome"
          data-open={edit ? "true" : "false"}
          style={{ transform: edit ? `translateY(${-inset}px)` : undefined }}
          role="dialog"
          aria-label={edit ? `Edit ${edit.label}` : undefined}
          aria-hidden={!edit}
        >
          <div className="ed-sheet-head">
            <span className="ed-sheet-label">{edit?.label}</span>
            <button
              type="button"
              className="ed-btn ed-btn--ghost ed-btn--icon"
              onPointerDown={keepFocus}
              onMouseDown={keepFocus}
              onClick={() => close(false)}
              aria-label="Cancel edit"
              tabIndex={edit ? 0 : -1}
            >
              <XIcon size={16} aria-hidden />
            </button>
          </div>
          <div className="ed-sheet-row">
            <input
              ref={inputRef}
              className="ed-sheet-input"
              // Set imperatively in open() too, so the right keyboard shows on
              // the first focus; these props keep React from resetting them.
              type={edit?.inputType ?? "text"}
              inputMode={edit?.inputMode}
              data-active={edit && !edit.multiline ? "true" : "false"}
              onKeyDown={onKeyDown}
              onBlur={() => editRef.current && !editRef.current.multiline && close(true)}
              enterKeyHint="done"
              autoComplete="off"
              tabIndex={edit && !edit.multiline ? 0 : -1}
              aria-label={edit?.label}
            />
            <textarea
              ref={textareaRef}
              className="ed-sheet-input ed-sheet-input--multi"
              data-active={edit?.multiline ? "true" : "false"}
              onKeyDown={onKeyDown}
              onBlur={() => editRef.current?.multiline && close(true)}
              rows={3}
              tabIndex={edit?.multiline ? 0 : -1}
              aria-label={edit?.label}
            />
            <button
              type="button"
              className="ed-btn ed-btn--primary ed-sheet-done"
              onPointerDown={keepFocus}
              onMouseDown={keepFocus}
              onClick={() => close(true)}
              tabIndex={edit ? 0 : -1}
            >
              <CheckIcon size={16} aria-hidden />
              Done
            </button>
          </div>
        </div>
      )}
    </FieldSheetContext.Provider>
  )
}
