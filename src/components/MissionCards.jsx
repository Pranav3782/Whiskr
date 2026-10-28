import { Arrow } from './Icons'

const CARDS = [
  { n: '01', title: 'Face the\nlaser trials', sub: 'Red dots, ribbons, curtains. Zero mercy.', hue: '#d4ff3a' },
  { n: '02', title: 'The most\nwatched cat\nhas arrived', sub: 'no belly rub will distract him', hue: '#7c5cff' },
  { n: '03', title: 'Treat\neconomy 101', sub: 'every biscuit is a negotiation', hue: '#ff7a59' },
  { n: '04', title: 'Box season\nis open', sub: 'if it fits, he sits', hue: '#2ec4b6' },
]

export default function MissionCards() {
  return (
    <div className="cards" role="list">
      {CARDS.map((c) => (
        <article className="card" role="listitem" key={c.n} style={{ '--hue': c.hue }}>
          <span className="card__n">{c.n}</span>
          <h3 className="card__title">{c.title}</h3>
          <p className="card__sub">{c.sub}</p>
          <a className="card__go" href="#missions" aria-label={`Open mission ${c.n}`}>
            Go <Arrow />
          </a>
        </article>
      ))}
    </div>
  )
}
