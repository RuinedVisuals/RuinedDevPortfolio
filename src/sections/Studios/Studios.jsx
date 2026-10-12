import { Link } from 'react-router-dom';
import SplitReveal from '../../components/SplitReveal/SplitReveal';
import MagneticButton from '../../components/MagneticButton/MagneticButton';
import Arrow from '../../components/Arrow/Arrow';
import Pattern from '../../components/Pattern/Pattern';
import './studios.scss';

export default function Studios() {
  return (
    <section className="studios">
      <Pattern type="moire" transparent alpha={0.3} gap={11} lw={1.2} className="pattern studios__pattern" />
      <span className="eyebrow studios__tag">For studios &amp; brands</span>
      <div className="studios__row">
        <SplitReveal as="h2" type="lines" className="studios__title">
          Designs ready?
          <br />
          I&rsquo;ll build them.
        </SplitReveal>
        <div className="studios__side">
          <p className="studios__text">
            Working with an agency or studio? I join as your development partner and turn finished designs into fast,
            polished builds. Starting from scratch? I take it end to end.
          </p>
          <MagneticButton as={Link} to="/approach" cursorLabel="Approach">
            How I work <Arrow className="arrow" />
          </MagneticButton>
        </div>
      </div>
    </section>
  );
}
