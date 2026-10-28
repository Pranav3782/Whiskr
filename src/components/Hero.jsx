import { useFrames } from '../hooks/useFrames'
import FrameScrubber from './FrameScrubber'
import Navbar from './Navbar'
import HeroCopy from './HeroCopy'
import SocialProof from './SocialProof'
import MissionCards from './MissionCards'
import CursorBadge from './CursorBadge'
import CursorFollower from './CursorFollower'
import { Paw } from './Icons'

export default function Hero() {
  const { status, progress, frames, meta } = useFrames()

  return (
    <section className="hero" id="home">
      {status === 'ready' && <FrameScrubber frames={frames} meta={meta} />}
      <div className="hero__shade" aria-hidden="true" />

      <Navbar />
      <HeroCopy />
      <SocialProof />
      <CursorBadge />
      <MissionCards />
      <CursorFollower />

      {status === 'loading' && (
        <div className="loader" role="status">
          <Paw className="loader__paw" />
          <span>Waking Mochi… {Math.round(progress * 100)}%</span>
          <i className="loader__bar"><b style={{ transform: `scaleX(${progress})` }} /></i>
        </div>
      )}

      {status === 'missing' && (
        <div className="setup" role="status">
          <strong>No frames yet</strong>
          <span>Run this once, then refresh:</span>
          <code>npm run frames -- "C:\Users\Surya Pranav\Downloads\full_trim_video.mp4"</code>
        </div>
      )}
    </section>
  )
}
