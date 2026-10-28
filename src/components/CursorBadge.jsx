import { useEffect, useRef } from 'react'
import { Arrow } from './Icons'

/** Rotating ring of text; the arrow in the middle always points at your cursor. */
export default function CursorBadge() {
  const ref = useRef(null)
  const arrow = useRef(null)

  useEffect(() => {
    const onMove = (e) => {
      const r = ref.current?.getBoundingClientRect()
      if (!r || !arrow.current) return
      const a = Math.atan2(e.clientY - (r.top + r.height / 2), e.clientX - (r.left + r.width / 2))
      arrow.current.style.transform = `rotate(${a}rad)`
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  return (
    <div className="badge" ref={ref} aria-hidden="true">
      <svg className="badge__ring" viewBox="0 0 120 120">
        <defs>
          <path id="ring" d="M60,60 m-46,0 a46,46 0 1,1 92,0 a46,46 0 1,1 -92,0" />
        </defs>
        <text>
          <textPath href="#ring" startOffset="0">
            YOUR CURSOR · HE&apos;S WATCHING · YOUR CURSOR · HE&apos;S WATCHING ·
          </textPath>
        </text>
      </svg>
      <span className="badge__arrow" ref={arrow}><Arrow /></span>
    </div>
  )
}
