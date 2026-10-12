import Logo from '../Logo/Logo';
import Arrow from '../Arrow/Arrow';
import { useCallback, useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { Link } from 'react-router-dom';
import MagneticButton from '../MagneticButton/MagneticButton';
import ThemeToggle from '../ThemeToggle/ThemeToggle';
import PaletteSwatches from '../PaletteSwatches/PaletteSwatches';
import MobileMenu from '../MobileMenu/MobileMenu';
import './header.scss';

const links = [
  { label: 'Work', to: '/work' },
  { label: 'Approach', to: '/approach' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  const rowRef = useRef(null);

  // Entrance on first load: the bar eases down, then its contents fade in.
  useEffect(() => {
    const row = rowRef.current;
    if (!row || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const ctx = gsap.context(() => {
      gsap.from(row, { yPercent: -100, opacity: 0, duration: 1, delay: 0.1, ease: 'power3.out' });
      gsap.from(row.children, { opacity: 0, y: -8, duration: 0.7, delay: 0.35, stagger: 0.08, ease: 'power2.out' });
    });
    return () => ctx.revert();
  }, []);

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
    <header className={`site-header ${scrolled ? 'is-scrolled' : ''} ${open ? 'is-menu-open' : ''}`}>
      <div className="site-header__row" ref={rowRef}>
        <Link to="/" className="site-header__logo" data-cursor="Home">
          <Logo className="site-header__logo-mark" />
          <span className="sr-only">AG.</span>
        </Link>

        <nav className="site-header__nav">
          {links.map((l) => (
            <MagneticButton as={Link} to={l.to} key={l.to} className="site-header__link">
              {l.label}
              <Arrow className="arrow" />
            </MagneticButton>
          ))}
        </nav>

        <div className="site-header__right">
          <PaletteSwatches />
          <ThemeToggle />
          <button
            type="button"
            className={`burger ${open ? 'is-open' : ''}`}
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="mobile-menu"
            data-cursor={open ? 'Close' : 'Menu'}
          >
            <span />
            <span />
          </button>
        </div>
      </div>

      <MobileMenu open={open} onClose={close} links={links} />
    </header>
  );
}
