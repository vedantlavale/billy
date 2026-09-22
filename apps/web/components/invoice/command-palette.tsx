"use client"

import * as React from "react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { Search } from "lucide-react"

import { Kbd } from "@/components/invoice/editor-ui"

export interface Command {
  id: string
  group: string
  label: string
  /** Extra words to match, e.g. "gst tax" for a tax command. */
  keywords?: string
  /** Current value shown at the right, e.g. "On" for a toggle. */
  hint?: string
  /** Keyboard shortcut shown at the right, e.g. ["⌘", "P"]. */
  shortcut?: string[]
  /** Keep the palette open after running (for toggles you may flip in a row). */
  keepOpen?: boolean
  run: () => void
}

function matches(command: Command, query: string) {
  const haystack = `${command.group} ${command.label} ${command.keywords ?? ""}`.toLowerCase()
  return query
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((token) => haystack.includes(token))
}

/**
 * ⌘K palette: every editor action in one searchable list. It doubles as the
 * shortcut reference, since each row shows its key combo. Follows the
 * WAI-ARIA combobox pattern: focus stays in the input and arrow keys move
 * the active option.
 */
export function CommandPalette({
  open,
  onClose,
  commands,
}: {
  open: boolean
  onClose: () => void
  commands: Command[]
}) {
  const reduce = useReducedMotion()
  const [query, setQuery] = React.useState("")
  const [active, setActive] = React.useState(0)
  const listRef = React.useRef<HTMLDivElement>(null)
  const listId = React.useId()

  const results = React.useMemo(() => commands.filter((c) => matches(c, query)), [commands, query])
  const activeIndex = Math.min(active, Math.max(results.length - 1, 0))

  // Restore focus to wherever the user was once the palette closes.
  React.useEffect(() => {
    if (!open) return
    const previous = document.activeElement as HTMLElement | null
    return () => previous?.focus?.()
  }, [open])

  React.useEffect(() => {
    listRef.current
      ?.querySelector<HTMLElement>(`[data-index="${activeIndex}"]`)
      ?.scrollIntoView({ block: "nearest" })
  }, [activeIndex])

  const close = () => {
    setQuery("")
    setActive(0)
    onClose()
  }

  const run = (command: Command | undefined) => {
    if (!command) return
    command.run()
    if (!command.keepOpen) close()
  }

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault()
      setActive((activeIndex + 1) % Math.max(results.length, 1))
    } else if (event.key === "ArrowUp") {
      event.preventDefault()
      setActive((activeIndex - 1 + results.length) % Math.max(results.length, 1))
    } else if (event.key === "Enter") {
      event.preventDefault()
      run(results[activeIndex])
    } else if (event.key === "Escape") {
      event.preventDefault()
      close()
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="backdrop"
            className="fixed inset-0 z-50 bg-[#37352f]/25"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.12 }}
            onClick={close}
            aria-hidden
          />
          <motion.div
            key="dialog"
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
            className="ed-palette ed-chrome"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -4, scale: 0.99 }}
            transition={{ duration: reduce ? 0 : 0.16, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="ed-palette-search">
              <Search size={16} aria-hidden />
              <input
                autoFocus
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value)
                  setActive(0)
                }}
                onKeyDown={onKeyDown}
                placeholder="Type a command or search…"
                role="combobox"
                aria-expanded="true"
                aria-controls={listId}
                aria-activedescendant={results[activeIndex] ? `${listId}-${activeIndex}` : undefined}
                aria-autocomplete="list"
                spellCheck={false}
              />
              <Kbd>Esc</Kbd>
            </div>

            <div ref={listRef} id={listId} role="listbox" aria-label="Commands" className="ed-palette-list">
              {results.length === 0 && <p className="ed-palette-empty">No commands match “{query}”.</p>}
              {results.map((command, index) => {
                const header = index === 0 || results[index - 1].group !== command.group ? command.group : null
                return (
                  <React.Fragment key={command.id}>
                    {header && (
                      <div className="ed-palette-group" role="presentation">
                        {header}
                      </div>
                    )}
                    <div
                      id={`${listId}-${index}`}
                      role="option"
                      aria-selected={index === activeIndex}
                      data-index={index}
                      className="ed-palette-item"
                      onMouseMove={() => index !== activeIndex && setActive(index)}
                      onClick={() => run(command)}
                    >
                      <span className="truncate">{command.label}</span>
                      <span className="ml-auto flex shrink-0 items-center gap-1.5">
                        {command.hint && <span className="ed-palette-hint">{command.hint}</span>}
                        {command.shortcut?.map((key) => (
                          <Kbd key={key}>{key}</Kbd>
                        ))}
                      </span>
                    </div>
                  </React.Fragment>
                )
              })}
            </div>

            <div className="ed-palette-foot" aria-hidden>
              <span>
                <Kbd>↑</Kbd>
                <Kbd>↓</Kbd> to move
              </span>
              <span>
                <Kbd>↵</Kbd> to run
              </span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
