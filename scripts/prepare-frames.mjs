#!/usr/bin/env node
/**
 * Turns the cat video into a frame sequence for the cursor-scrub hero.
 * Also removes the Gemini watermark (bottom-right) while extracting.
 *
 * Usage:
 *   node scripts/prepare-frames.mjs "C:\path\to\full_trim_video.mp4"
 *
 * Options:
 *   --frames 120            number of frames to keep (evenly spread over the clip)
 *   --width 1600            output width in px (height keeps aspect ratio)
 *   --mode delogo|crop      delogo = blur-patch the watermark (default)
 *                           crop   = trim the bottom/right edge off every frame
 *   --wm x,y,w,h            watermark box as FRACTIONS of the frame (default below)
 *   --crop 0.07             fraction trimmed in crop mode
 *   --preview               only write preview-box.png / preview-clean.png to check the box
 *
 * Requires ffmpeg + ffprobe on your PATH (Windows: `winget install Gyan.FFmpeg`).
 */
import { spawnSync } from 'node:child_process'
import { mkdirSync, rmSync, writeFileSync, readdirSync, existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const outDir = path.join(root, 'public', 'frames')

// ---- args -------------------------------------------------------------
const argv = process.argv.slice(2)
const flag = (name, fallback) => {
  const i = argv.indexOf(`--${name}`)
  if (i === -1) return fallback
  const next = argv[i + 1]
  return next && !next.startsWith('--') ? next : true
}
const input = argv.find((a, i) => !a.startsWith('--') && !(argv[i - 1] || '').startsWith('--'))
if (!input) {
  console.error('Usage: node scripts/prepare-frames.mjs "<path to video>" [--preview]')
  process.exit(1)
}
const wantFrames = Number(flag('frames', 120))
const outW = Number(flag('width', 1600))
const mode = String(flag('mode', 'delogo'))
const cropFrac = Number(flag('crop', 0.07))
const preview = flag('preview', false) === true
// Gemini's sparkle sits in the bottom-right corner. Fractions of width/height.
const [fx, fy, fw, fh] = String(flag('wm', '0.89,0.89,0.10,0.10')).split(',').map(Number)

// ---- helpers ----------------------------------------------------------
const run = (cmd, args, opts = {}) => {
  const r = spawnSync(cmd, args, { encoding: 'utf8', ...opts })
  if (r.error) {
    console.error(`Could not run "${cmd}". Is ffmpeg installed and on your PATH?`)
    process.exit(1)
  }
  return r
}

const probe = JSON.parse(
  run('ffprobe', [
    '-v', 'error', '-select_streams', 'v:0',
    '-show_entries', 'stream=width,height:format=duration',
    '-of', 'json', input,
  ]).stdout || '{}',
)
const W = probe.streams?.[0]?.width
const H = probe.streams?.[0]?.height
const duration = Number(probe.format?.duration)
if (!W || !H || !duration) {
  console.error('Could not read the video. Check the path.')
  process.exit(1)
}
console.log(`Video: ${W}x${H}, ${duration.toFixed(2)}s`)

const even = (n) => Math.max(2, Math.round(n / 2) * 2)

// delogo needs the box strictly inside the frame
const box = (() => {
  const x = Math.max(1, Math.round(W * fx))
  const y = Math.max(1, Math.round(H * fy))
  const w = Math.min(W - 1 - x, Math.round(W * fw))
  const h = Math.min(H - 1 - y, Math.round(H * fh))
  return { x, y, w, h }
})()

const cleanFilter =
  mode === 'crop'
    ? `crop=${even(W * (1 - cropFrac))}:${even(H * (1 - cropFrac))}:0:0`
    : `delogo=x=${box.x}:y=${box.y}:w=${box.w}:h=${box.h}`

// ---- preview ----------------------------------------------------------
if (preview) {
  const mid = String(duration / 2)
  run('ffmpeg', ['-y', '-v', 'error', '-ss', mid, '-i', input, '-frames:v', '1',
    '-vf', `delogo=x=${box.x}:y=${box.y}:w=${box.w}:h=${box.h}:show=1`, path.join(root, 'preview-box.png')])
  run('ffmpeg', ['-y', '-v', 'error', '-ss', mid, '-i', input, '-frames:v', '1',
    '-vf', cleanFilter, path.join(root, 'preview-clean.png')])
  console.log('Wrote preview-box.png (green box = patched area) and preview-clean.png.')
  console.log('If the watermark is not inside the box, adjust --wm x,y,w,h and re-run with --preview.')
  process.exit(0)
}

// ---- extract ----------------------------------------------------------
const encoders = run('ffmpeg', ['-hide_banner', '-encoders']).stdout || ''
const useWebp = encoders.includes('libwebp')
const ext = useWebp ? 'webp' : 'jpg'
const codecArgs = useWebp ? ['-c:v', 'libwebp', '-quality', '82'] : ['-q:v', '3']

if (existsSync(outDir)) rmSync(outDir, { recursive: true, force: true })
mkdirSync(outDir, { recursive: true })

const fps = Math.max(1, wantFrames / duration)
const vf = `${cleanFilter},fps=${fps.toFixed(4)},scale=${even(outW)}:-2:flags=lanczos`
console.log(`Extracting ~${wantFrames} frames (${mode} mode, ${ext})…`)

const res = run('ffmpeg', ['-y', '-v', 'error', '-i', input, '-vf', vf, ...codecArgs,
  path.join(outDir, `frame_%04d.${ext}`)], { stdio: 'inherit' })
if (res.status !== 0) process.exit(res.status || 1)

const count = readdirSync(outDir).filter((f) => f.startsWith('frame_')).length
const probeOut = JSON.parse(
  run('ffprobe', ['-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height',
    '-of', 'json', path.join(outDir, `frame_0001.${ext}`)]).stdout || '{}',
)
const meta = {
  count,
  ext,
  pad: 4,
  width: probeOut.streams?.[0]?.width ?? outW,
  height: probeOut.streams?.[0]?.height ?? Math.round((outW * H) / W),
}
writeFileSync(path.join(outDir, 'meta.json'), JSON.stringify(meta, null, 2))
console.log(`Done: ${count} frames in public/frames  →  run "npm run dev"`)
