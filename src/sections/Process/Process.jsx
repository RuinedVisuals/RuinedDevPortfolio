import SplitReveal from '../../components/SplitReveal/SplitReveal';
import './process.scss';

const steps = [
  { n: '01', title: 'Discover', note: 'We align on goals, audience and opportunities.' },
  { n: '02', title: 'Design', note: 'I craft clear, elegant solutions that feel right.' },
  { n: '03', title: 'Develop', note: 'I build fast, flexible and future-ready websites.' },
];

export default function Process() {
  return (
    <section className="process">
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
