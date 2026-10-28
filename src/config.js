// Tweak the hero behaviour here.
export const CONFIG = {
  // Which way the cat looks in the FIRST frame of the video.
  // Your clip turns right -> left, so frame 1 faces right.
  // If the cat ever looks the wrong way, flip this to 'left'.
  firstFrameFacing: 'right',

  // 0.06 = slow & silky, 0.25 = snappy
  smoothing: 0.1,

  // Where the cat sits when drawn "cover"-fitted: 0 = left/top, 1 = right/bottom
  focalX: 0.5,
  focalY: 0.4,

  // Max parallel image loads
  loadBatch: 16,
}
