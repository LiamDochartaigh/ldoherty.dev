import { useEffect, useRef, useState } from 'react'
import { LinkProps } from '@tanstack/react-router'

export interface DropdownItem {
  label: string
  href?: LinkProps['to']
  onClick?: () => void
}

interface DropdownProps {
  label: string
  items: DropdownItem[]
}

export function Dropdown({ label, items }: DropdownProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div ref={ref} className="relative inline-block">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="text-sm text-muted hover:text-text transition-colors flex items-center gap-1 cursor-pointer"
      >
        {label}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <ul
          role="menu"
          className="absolute left-0 top-full mt-2 min-w-36 bg-surface border border-primary/20 rounded-sm shadow-lg z-50 overflow-hidden"
        >
          {items.map((item) => (
            <li key={item.label} role="menuitem">
              {item.href ? (
                <a
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block px-4 py-2 text-sm text-text hover:bg-primary/10 hover:text-primary transition-colors"
                >
                  {item.label}
                </a>
              ) : (
                <button
                  onClick={() => { item.onClick?.(); setOpen(false) }}
                  className="w-full text-left px-4 py-2 text-sm text-text hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer"
                >
                  {item.label}
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
