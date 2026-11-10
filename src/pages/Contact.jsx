import SplitReveal from '../components/SplitReveal/SplitReveal';
import { usePageMeta } from '../components/Seo/usePageMeta';
import { pages } from '../data/seo';
import Arrow from '../components/Arrow/Arrow';
import MagneticButton from '../components/MagneticButton/MagneticButton';
import Pattern from '../components/Pattern/Pattern';
import './contact.scss';

// shortcut: opens a pre-filled email; swap `href` for a Calendly link once there is one.
const links = [
  { label: 'Free 15 min call', detail: 'Book a slot', href: 'mailto:hello@weareruined.com?subject=Free%2015%20min%20call&body=Hi%20Apostolis%2C%20I%27d%20like%20a%20quick%20call.%20Good%20times%20for%20me%3A%20', cursor: 'Book' },
  { label: 'Email', detail: 'hello@weareruined.com', href: 'mailto:hello@weareruined.com', cursor: 'Write' },
  { label: 'Phone', detail: '+30 698 033 4090', href: 'tel:+306980334090', cursor: 'Call' },
  { label: 'Instagram', href: 'https://www.instagram.com/jean_pierre_gana/', cursor: 'Follow', external: true },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/apostolis-ganatsios/', cursor: 'Connect', external: true },
];

export default function Contact() {
  usePageMeta(pages['/contact']);
  return (
    <section className="contact-page">
      <Pattern type="moire" transparent alpha={0.35} className="pattern contact-page__pattern" />
      <div className="above-pattern">
        <p className="eyebrow">Contact</p>
        <SplitReveal as="h1" type="lines" immediate stagger={0.11} className="contact-page__title">
          Tell me about
          <br />
          your project.
        </SplitReveal>
        <p className="contact-page__lead">
          A launch, a store, or something a little experimental: write to me. I read every message and usually
          reply within a day.
        </p>
        <div className="contact-page__links">
          {links.map((l) => (
            <MagneticButton
              key={l.label}
              href={l.href}
              cursorLabel={l.cursor}
              className="contact-page__link"
              {...(l.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            >
              {l.label}
              {l.detail && <span className="contact-page__detail">{l.detail}</span>}
              <Arrow className="arrow" />
            </MagneticButton>
          ))}
        </div>
      </div>
      <div className="contact-page__foot above-pattern">
        <span>Independent design &amp; development</span>
        <span>Athens, GR</span>
      </div>
    </section>
  );
}
