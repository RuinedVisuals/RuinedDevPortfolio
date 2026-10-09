import { useEffect } from 'react';
import { usePageMeta } from '../components/Seo/usePageMeta';
import { useLocation } from 'react-router-dom';
import Hero from '../sections/Hero/Hero';
import WorkSlider from '../sections/WorkSlider/WorkSlider';
import Intro from '../sections/Intro/Intro';
import Lab from '../sections/Lab/Lab';
import Process from '../sections/Process/Process';
import { getLenis } from '../hooks/useLenis';

export default function Home() {
  usePageMeta({
    title: null,
    description:
      'Independent creative developer and UI/UX designer in Athens, GR. Distinctive, fast websites and e-commerce — designed and built end to end.',
    path: '/',
  });
  const { hash, key } = useLocation();

  // Header links like "/#lab": scroll once the section exists. Arriving from
  // another page, wait for the route curtain to clear (Lenis is stopped
  // while it runs); a same-page hash change scrolls right away.
  useEffect(() => {
    if (!hash) return undefined;
    const transitioning = document.body.classList.contains('is-transitioning');
    const id = window.setTimeout(
      () => {
        const el = document.querySelector(hash);
        if (!el) return;
        const lenis = getLenis();
        if (lenis) lenis.scrollTo(el, { force: true });
        else el.scrollIntoView({ behavior: 'smooth' });
      },
      transitioning ? 900 : 0
    );
    return () => window.clearTimeout(id);
  }, [hash, key]);

  return (
    <>
      <Hero />
      <WorkSlider />
      <Intro />
      <Lab />
      <Process surface="a" />
    </>
  );
}
