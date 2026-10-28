const FACES = [
  ['#ff7a59', '🐱'],
  ['#7c5cff', '😼'],
  ['#2ec4b6', '😸'],
  ['#ffd23f', '😺'],
  ['#ff5d8f', '😻'],
]

export default function SocialProof() {
  return (
    <aside className="proof" aria-label="Community">
      <div className="proof__stack">
        {FACES.map(([bg, face], i) => (
          <span key={i} className="proof__face" style={{ background: bg, zIndex: FACES.length - i }}>
            {face}
          </span>
        ))}
        <span className="proof__count">+12k</span>
      </div>
      <p className="proof__title">The Mochi watch<br />starts now</p>
      <p className="proof__sub">no yarn left unchased</p>
    </aside>
  )
}
