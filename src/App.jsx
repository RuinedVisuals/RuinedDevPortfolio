import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { useLenis } from './hooks/useLenis';
import Loader from './components/Loader/Loader';
import Cursor from './components/Cursor/Cursor';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import CurtainTransition from './components/Curtain/CurtainTransition';
import Home from './pages/Home';
import Work from './pages/Work';
import ProjectDetail from './pages/ProjectDetail';
import About from './pages/About';
import Contact from './pages/Contact';

export default function App() {
  // `loading` flips when the loader's shutters start to open (the site mounts
  // underneath so the hero reveal plays as they part); `loaderDone` removes
  // the loader once they're fully gone.
  const [loading, setLoading] = useState(true);
  const [loaderDone, setLoaderDone] = useState(false);
  useLenis({ enabled: !loading });

  return (
    <ThemeProvider>
      <Cursor />
      {!loaderDone && <Loader onReveal={() => setLoading(false)} onComplete={() => setLoaderDone(true)} />}

      <div style={{ visibility: loading ? 'hidden' : 'visible' }}>
        {/* Mounted only once the loader is done, not just hidden underneath
            it — otherwise Hero's entrance timeline and every `immediate`
            SplitReveal fire (and finish) the moment they mount, invisibly,
            long before the loader clears, so nothing appears to
            animate on a fresh load (only on later in-app navigations, which
            mount pages after loading is already false). */}
        {!loading && (
          <CurtainTransition>
            {(location) => (
              <>
                {/* Stacked above the footer so its own scroll-in parallax
                    slides in underneath the page instead of covering it. */}
                <div className="page-content">
                  <Header />
                  <Routes location={location}>
                    <Route path="/" element={<Home />} />
                    <Route path="/work" element={<Work />} />
                    <Route path="/work/:slug" element={<ProjectDetail />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="*" element={<Home />} />
                  </Routes>
                </div>
                {/* Only Home closes on the sticky grid footer; inner pages
                    render their own CtaFooter. Keyed off the *displayed*
                    location so it swaps behind the curtain, not on click. */}
                {location.pathname === '/' && <Footer ready={!loading} />}
              </>
            )}
          </CurtainTransition>
        )}
      </div>
    </ThemeProvider>
  );
}
