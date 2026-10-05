import MagneticButton from '../MagneticButton/MagneticButton';
import Pattern from '../Pattern/Pattern';
import './cta-footer.scss';

/** Compact "Let's talk" closer used on inner pages (Home keeps the sticky grid Footer). */
export default function CtaFooter({ description = true, short = false }) {
  return (
    <footer className={`cta-footer ${short ? 'cta-footer--short' : ''}`} id="contact">
      <Pattern type="ascii" on="b" transparent alpha={0.28} cell={14} />
      <div className="cta-footer__content">
        <p className="eyebrow cta-footer__eyebrow">Got a project in mind?</p>
        <h2 className="cta-footer__title">Let&rsquo;s talk.</h2>
        {description && (
          <p className="cta-footer__description">
            Tell me about it — I read every message and usually reply within a day.
          </p>
        )}
        <div className="cta-footer__button-wrap">
          <MagneticButton href="mailto:hello@apostolisgkanatsios.com" cursorLabel="Say hi" className="cta-footer__link">
            Contact <span className="arrow">↗</span>
          </MagneticButton>
        </div>
      </div>
    </footer>
  );
}
