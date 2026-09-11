import SplitReveal from '../../components/SplitReveal/SplitReveal';
import './intro.scss';

const services = [
  {
    n: '01',
    title: 'UI & UX design',
    note: 'Thoughtful experiences, from idea to interface.',
  },
  {
    n: '02',
    title: 'Websites & e-commerce',
    note: 'Distinctive, high-performing websites that convert.',
  },
  {
    n: '03',
    title: 'Creative development',
    note: 'Clean, flexible solutions built for what\u2019s next.',
  },
];

export default function Intro() {
  return (
    <section className="intro">
      <div className="intro__head">
        <SplitReveal as="h2" type="lines" className="intro__title">
          Creative thinking.
          <br />
          Solid execution.
        </SplitReveal>
        <p className="intro__desc">
          Independent creative developer and UI/UX designer based in Athens.
          I turn ideas into distinctive, intuitive websites.
        </p>
      </div>

      <ul className="intro__list">
        {services.map((s) => (
          <li key={s.n} className="intro__row" data-cursor="＋">
            <span className="intro__index">{s.n}</span>
            <h3 className="intro__row-title">{s.title}</h3>
            <p className="intro__row-note">{s.note}</p>
            <span className="intro__row-arrow">↗</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
