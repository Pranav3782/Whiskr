import { Paw, Search, Bag } from './Icons'

export default function Navbar() {
  return (
    <header className="nav">
      <nav className="nav__side" aria-label="Primary">
        <a className="pill pill--solid" href="#home">Home</a>
        <a className="pill" href="#story">Story</a>
        <a className="pill" href="#squad">Squad</a>
      </nav>

      <a className="nav__logo" href="#home" aria-label="Whiskr home">
        <Paw className="nav__paw" />
        <span>whiskr</span>
      </a>

      <div className="nav__side nav__side--right">
        <a className="pill nav__hide-sm" href="#missions">Missions</a>
        <a className="pill nav__hide-sm" href="#playground">Playground</a>
        <button className="icon-btn" aria-label="Search"><Search /></button>
        <button className="icon-btn" aria-label="Bag"><Bag /></button>
      </div>
    </header>
  )
}
