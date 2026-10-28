import { useEffect, useRef } from 'react'
import { CONFIG } from '../config'

/**
 * Full-bleed canvas. Cursor X (left -> right) is mapped onto the frame sequence,
 * eased with a lerp, and neighbouring frames are cross-faded so a low frame
 * count still feels perfectly smooth.
 */
export default function FrameScrubber({ frames, meta }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const last = frames.length - 1
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let target = 0.5 // 0..1 progress through the clip
    let current = target
    let raf = 0
    let lastDrawn = -1
    let w = 0
    let h = 0

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = canvas.clientWidth
      h = canvas.clientHeight
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.imageSmoothingQuality = 'high'
      lastDrawn = -1
    }

    const drawImage = (img, alpha) => {
      if (!img || !img.naturalWidth) return
      const s = Math.max(w / img.naturalWidth, h / img.naturalHeight)
      const dw = img.naturalWidth * s
      const dh = img.naturalHeight * s
      ctx.globalAlpha = alpha
      ctx.drawImage(img, (w - dw) * CONFIG.focalX, (h - dh) * CONFIG.focalY, dw, dh)
    }

    const draw = (p) => {
      const pos = p * last
      const a = Math.floor(pos)
      const b = Math.min(last, a + 1)
      const t = pos - a
      ctx.clearRect(0, 0, w, h)
      drawImage(frames[a], 1)
      if (t > 0.001 && b !== a) drawImage(frames[b], t)
      ctx.globalAlpha = 1
    }

    // cursor on the right should make the cat look right
    const toProgress = (x01) => (CONFIG.firstFrameFacing === 'right' ? 1 - x01 : x01)

    const onMove = (e) => {
      const x01 = Math.min(1, Math.max(0, e.clientX / window.innerWidth))
      target = toProgress(x01)
    }

    const tick = () => {
      current += (target - current) * (reduced ? 1 : CONFIG.smoothing)
      if (Math.abs(target - current) < 0.0002) current = target
      if (Math.abs(current - lastDrawn) > 0.0001) {
        draw(current)
        lastDrawn = current
      }
      raf = requestAnimationFrame(tick)
    }

    resize()
    draw(current)
    window.addEventListener('resize', resize)
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerdown', onMove, { passive: true })
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerdown', onMove)
    }
  }, [frames, meta])

  return <canvas ref={canvasRef} className="scrubber" aria-label="A cat that follows your cursor with its eyes" />
}
