# Whiskr

Cursor-scrub hero: the cat's head follows your mouse. Cursor on the right → cat looks right, cursor on the left → cat looks left.

Built with React + Vite. The video is converted to a frame sequence and drawn on a `<canvas>` (much smoother to scrub than a `<video>` element).

## Setup

```bash
npm install
```

### 1. Turn the video into frames (and remove the Gemini watermark)

Needs `ffmpeg` on your PATH (Windows: `winget install Gyan.FFmpeg`, then reopen the terminal).

First check the watermark box:

```bash
npm run frames -- "C:\Users\Surya Pranav\Downloads\full_trim_video.mp4" --preview
```

Open `preview-box.png` — the green rectangle is the area that gets patched. If the watermark isn't fully inside it,
adjust the box (fractions of width,height: `x,y,w,h`) and preview again:

```bash
npm run frames -- "C:\Users\Surya Pranav\Downloads\full_trim_video.mp4" --preview --wm 0.88,0.88,0.11,0.11
```

When `preview-clean.png` looks right, extract for real (same `--wm` if you changed it):

```bash
npm run frames -- "C:\Users\Surya Pranav\Downloads\full_trim_video.mp4"
```

If the patch is still visible on the fur, use crop mode instead (trims 7% off the bottom/right, the hero re-fits it to fill the screen):

```bash
npm run frames -- "C:\Users\Surya Pranav\Downloads\full_trim_video.mp4" --mode crop --crop 0.07
```

Other options: `--frames 120` (more = smoother, heavier), `--width 1600`.

### 2. Run

```bash
npm run dev
```

## Tuning (`src/config.js`)

- `firstFrameFacing` — `'right'` for your clip (it turns right → left). If the cat looks away from the cursor, flip it to `'left'`.
- `smoothing` — easing speed of the head turn.
- `focalX / focalY` — which part of the frame stays visible when the window aspect ratio differs.

## Theme

All colours live as CSS variables at the top of `src/styles.css` (`--accent`, `--pop`, `--ink`, …).
