import { Link } from 'react-router-dom';
import SplitReveal from '../../components/SplitReveal/SplitReveal';
import Arrow from '../../components/Arrow/Arrow';
import Pattern from '../../components/Pattern/Pattern';
import './intro.scss';

const services = [
  {
    n: '01',
    title: 'UI & UX design',
    note: 'Research, flows and interfaces designed around how people actually use your site.',
  },
  {
    n: '02',
    title: 'Websites & e-commerce',
    note: 'Custom WordPress, WooCommerce and headless builds that are fast and easy to manage.',
  },
  {
    n: '03',
    title: 'Creative development',
    note: 'Motion, WebGL and interaction in React and GSAP, built from your designs or mine.',
  },
];

export default function Intro() {
  return (
    <section className="intro">
      <Pattern type="ascii" transparent alpha={0.22} cell={13} className="pattern intro__pattern" />
      <div className="intro__head">
        <SplitReveal as="h2" type="lines" className="intro__title">
          Creative thinking.
          <br />
          Solid execution.
        </SplitReveal>
        <p className="intro__desc">
          Independent creative developer and UI/UX designer based in Athens.
          I turn ideas into distinctive, intuitive websites.
          <Link to="/approach" className="intro__link" data-cursor="Approach">
            See my approach <Arrow className="arrow" />
          </Link>
        </p>
      </div>

      <ul className="intro__list">
        {services.map((s) => (
          <li key={s.n} className="intro__row" data-cursor="＋">
            <span className="intro__index">{s.n}</span>
            <h3 className="intro__row-title">{s.title}</h3>
            <p className="intro__row-note">{s.note}</p>
            <Arrow className="intro__row-arrow" />
          </li>
        ))}
      </ul>
    </section>
  );
}
