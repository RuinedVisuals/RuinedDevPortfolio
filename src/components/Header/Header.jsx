import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import MagneticButton from '../MagneticButton/MagneticButton';
import ThemeToggle from '../ThemeToggle/ThemeToggle';
import './header.scss';

const links = [
  { label: 'Work', to: '/work' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Solid dark bar once the page has scrolled a little, so the header stays
  // legible over any section color without relying on blend-mode tricks
  // (mix-blend-mode: difference reads as a color-negative, not a fixed
  // color — e.g. white-on-red comes out cyan, which is not the intent).
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="site-header__row">
        <Link to="/" className="site-header__logo" data-cursor="Home">
          AG.
        </Link>

        <nav className="site-header__nav">
          {links.map((l) => (
            <MagneticButton as={Link} to={l.to} key={l.to} className="site-header__link">
              {l.label}
              <span className="arrow">↗</span>
            </MagneticButton>
          ))}
        </nav>

        <div className="site-header__right">
          <ThemeToggle />
          <button
            type="button"
            className={`burger ${open ? 'is-open' : ''}`}
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            <span />
            <span />
          </button>
        </div>
      </div>

      <div className={`mobile-nav ${open ? 'is-open' : ''}`}>
        {links.map((l, i) => (
          <Link
            key={l.to}
            to={l.to}
            className="mobile-nav__link"
            style={{ transitionDelay: `${i * 0.05}s` }}
            onClick={() => setOpen(false)}
          >
            {l.label}
          </Link>
        ))}
      </div>
    </header>
  );
}
