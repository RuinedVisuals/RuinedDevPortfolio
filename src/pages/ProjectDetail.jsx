import { useParams, Link, Navigate } from 'react-router-dom';
import SplitReveal from '../components/SplitReveal/SplitReveal';
import { getProjectBySlug, projects } from '../data/projects';
import './project-detail.scss';

export default function ProjectDetail() {
  const { slug } = useParams();
  const project = getProjectBySlug(slug);

  if (!project) return <Navigate to="/work" replace />;

  const currentIndex = projects.findIndex((p) => p.slug === slug);
  const next = projects[(currentIndex + 1) % projects.length];

  return (
    <section className="project-detail">
      <div
        className="project-detail__hero"
        style={{
          backgroundColor: project.color,
          backgroundImage: project.image ? `url(${project.image})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="project-detail__hero-inner">
          <p className="eyebrow">{project.category} — {project.year}</p>
          <SplitReveal as="h1" type="lines" immediate className="project-detail__title">
            {project.name}
          </SplitReveal>
          <p className="project-detail__tagline">{project.tagline}</p>
        </div>
      </div>

      <div className="project-detail__body">
        <div className="project-detail__meta">
          <div>
            <span className="eyebrow">Client</span>
            <p>{project.client}</p>
          </div>
          <div>
            <span className="eyebrow">Services</span>
            <p>{project.services.join(', ')}</p>
          </div>
          <div>
            <span className="eyebrow">Year</span>
            <p>{project.year}</p>
          </div>
        </div>
        <p className="project-detail__desc">{project.description}</p>
      </div>

      <Link to={`/work/${next.slug}`} className="project-detail__next" data-cursor="Next project">
        <span className="eyebrow">Next project</span>
        <span className="project-detail__next-name">{next.name} ↗</span>
      </Link>
    </section>
  );
}
