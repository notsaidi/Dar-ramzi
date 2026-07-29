import { useEffect, useRef, useState } from 'react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { label: 'Menu', href: '#menu' },
    { label: 'Story', href: '#story' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`} ref={navRef}>
      <a href="#hero" className="navbar-logo">PIOZZA</a>

      <ul className={`navbar-links ${menuOpen ? 'navbar-links--open' : ''}`}>
        {links.map(l => (
          <li key={l.label}>
            <a href={l.href} onClick={() => setMenuOpen(false)} className="navbar-link">
              {l.label}
            </a>
          </li>
        ))}
      </ul>

      <a href="#menu" className="navbar-cta">Order Now</a>

      <button
        className="navbar-burger"
        aria-label="Toggle menu"
        onClick={() => setMenuOpen(o => !o)}
      >
        <span className={`burger-bar ${menuOpen ? 'burger-bar--open' : ''}`} />
        <span className={`burger-bar ${menuOpen ? 'burger-bar--open' : ''}`} />
        <span className={`burger-bar ${menuOpen ? 'burger-bar--open' : ''}`} />
      </button>
    </nav>
  );
}
