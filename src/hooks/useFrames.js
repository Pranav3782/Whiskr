import { useEffect, useState } from 'react'
import { CONFIG } from '../config'

const base = import.meta.env.BASE_URL

/**
 * Loads /frames/meta.json and every frame in it.
 * status: 'loading' | 'ready' | 'missing'
 */
export function useFrames() {
  const [state, setState] = useState({ status: 'loading', progress: 0, frames: [], meta: null })

  useEffect(() => {
    let cancelled = false

    async function load() {
      let meta
      try {
        const res = await fetch(`${base}frames/meta.json`, { cache: 'no-cache' })
        const type = res.headers.get('content-type') || ''
        if (!res.ok || !type.includes('json')) throw new Error('no meta')
        meta = await res.json()
      } catch {
        if (!cancelled) setState({ status: 'missing', progress: 0, frames: [], meta: null })
        return
      }

      const urls = Array.from({ length: meta.count }, (_, i) => {
        const n = String(i + 1).padStart(meta.pad ?? 4, '0')
        return `${base}frames/frame_${n}.${meta.ext}`
      })

      const frames = new Array(meta.count)
      let done = 0

      const loadOne = (i) =>
        new Promise((resolve) => {
          const img = new Image()
          img.decoding = 'async'
          img.onload = img.onerror = () => {
            frames[i] = img
            done += 1
            if (!cancelled) setState((s) => ({ ...s, progress: done / meta.count }))
            resolve()
          }
          img.src = urls[i]
        })

      // load in batches so the first paint isn't starved
      for (let i = 0; i < urls.length; i += CONFIG.loadBatch) {
        if (cancelled) return
        await Promise.all(urls.slice(i, i + CONFIG.loadBatch).map((_, k) => loadOne(i + k)))
      }

      if (!cancelled) setState({ status: 'ready', progress: 1, frames, meta })
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  return state
}
