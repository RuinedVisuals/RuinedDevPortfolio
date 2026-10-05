import SplitReveal from '../../components/SplitReveal/SplitReveal';
import Pattern from '../../components/Pattern/Pattern';
import './process.scss';

const steps = [
  { n: '01', title: 'Discover', note: 'We align on goals, audience and opportunities.' },
  { n: '02', title: 'Design', note: 'I craft clear, elegant solutions that feel right.' },
  { n: '03', title: 'Develop', note: 'I build fast, flexible and future-ready websites.' },
];

/**
 * `surface="a"` (Home) sits on the red surface with a masked moiré
 * background; the default `"b"` is the plain dark band (About).
 */
export default function Process({ surface = 'b' }) {
  return (
    <section className={`process process--${surface}`}>
      {surface === 'a' && (
        <Pattern type="moire" transparent alpha={0.3} gap={11} lw={1.2} className="pattern process__pattern" />
      )}
      <span className="eyebrow process__tag">The process</span>
      <div className="process__grid">
        {steps.map((s) => (
          <div key={s.n} className="process__col">
            <span className="process__n">{s.n}</span>
            <SplitReveal as="h3" type="lines" className="process__title">
              {s.title}
            </SplitReveal>
            <p className="process__note">{s.note}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
