import { Arrow, Check, Play } from './Icons'

export default function HeroCopy() {
  return (
    <div className="copy">
      <div className="eyebrow">
        <span className="eyebrow__tick"><Check /></span>
        A seriously curious cat
      </div>

      <h1 className="title">
        <span>Watch.</span>
        <span>Wait.</span>
        <span className="title__accent">Pounce.</span>
      </h1>

      <p className="lede">
        Meet Mochi — one very small cat with one very large attention span. He tracks
        laser dots, loose threads and your every move. Move your cursor. He&rsquo;s following.
      </p>

      <div className="cta">
        <a className="btn btn--primary" href="#start">
          Start now <Arrow />
        </a>
        <a className="btn btn--ghost" href="#watch">
          <span className="btn__play"><Play /></span>
          Watch him
        </a>
      </div>
    </div>
  )
}
