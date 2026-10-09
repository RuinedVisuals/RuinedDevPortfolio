import SplitReveal from '../components/SplitReveal/SplitReveal';
import Arrow from '../components/Arrow/Arrow';
import MagneticButton from '../components/MagneticButton/MagneticButton';
import Pattern from '../components/Pattern/Pattern';
import './contact.scss';

// TODO: phone / Instagram / LinkedIn are placeholders from the design handoff.
const links = [
  { label: 'Email', detail: 'hello@apostolisgkanatsios.com', href: 'mailto:hello@apostolisgkanatsios.com', cursor: 'Write' },
  { label: 'Phone', detail: '+30 690 000 0000', href: 'tel:+306900000000', cursor: 'Call' },
  { label: 'Instagram', href: 'https://instagram.com/', cursor: 'Follow', external: true },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/', cursor: 'Connect', external: true },
];

export default function Contact() {
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
          A launch, a store, or something a little experimental — write to me. I read every message and usually
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
