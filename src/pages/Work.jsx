import { Link } from 'react-router-dom';
import SplitReveal from '../components/SplitReveal/SplitReveal';
import { projects } from '../data/projects';
import './work.scss';

export default function Work() {
  return (
    <section className="work-page">
      <p className="eyebrow work-page__eyebrow">Selected work</p>
      <SplitReveal as="h1" type="lines" immediate className="work-page__title">
        Everything I&rsquo;ve
        <br />
        shipped, lately.
      </SplitReveal>

      <ul className="work-page__list">
        {projects.map((p, i) => (
          <li key={p.slug} className="work-page__row">
            <Link to={`/work/${p.slug}`} className="work-page__row-link" data-cursor="View">
              <span className="work-page__row-index">{String(i + 1).padStart(2, '0')}</span>
              <span className="work-page__row-name">{p.name}</span>
              <span className="work-page__row-cat">{p.category}</span>
              <span className="work-page__row-year">{p.year}</span>
              <span className="work-page__row-arrow">↗</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
