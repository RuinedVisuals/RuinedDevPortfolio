import SplitReveal from '../components/SplitReveal/SplitReveal';
import Process from '../sections/Process/Process';
import './about.scss';

export default function About() {
  return (
    <>
      <section className="about-page">
        <p className="eyebrow">About</p>
        <SplitReveal as="h1" type="lines" immediate className="about-page__title">
          I build the web,
          <br />
          cinematically.
        </SplitReveal>
        <p className="about-page__lead">
          I&rsquo;m Apostolis — an independent creative developer and UI/UX
          designer based in Athens. I partner with founders, studios and
          agencies to turn ideas into distinctive, fast, intuitive websites —
          from brochure sites to full e-commerce builds.
        </p>
      </section>
      <Process />
    </>
  );
}
