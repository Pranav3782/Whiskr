import { useEffect, useRef } from 'react'

/** A trailing ring + dot that follow the pointer. Hidden on touch devices via CSS. */
export default function CursorFollower() {
  const ring = useRef(null)
  const dot = useRef(null)

  useEffect(() => {
    let x = window.innerWidth / 2
    let y = window.innerHeight / 2
    let rx = x
    let ry = y
    let raf = 0

    const onMove = (e) => {
      x = e.clientX
      y = e.clientY
      if (dot.current) dot.current.style.transform = `translate(${x}px, ${y}px)`
    }
    const tick = () => {
      rx += (x - rx) * 0.16
      ry += (y - ry) * 0.16
      if (ring.current) ring.current.style.transform = `translate(${rx}px, ${ry}px)`
      raf = requestAnimationFrame(tick)
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
    }
  }, [])

  return (
    <>
      <div className="follower follower--ring" ref={ring} aria-hidden="true" />
      <div className="follower follower--dot" ref={dot} aria-hidden="true" />
    </>
  )
}
