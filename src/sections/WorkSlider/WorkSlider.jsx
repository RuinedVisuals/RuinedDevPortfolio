import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Keyboard, A11y } from 'swiper/modules';
import SplitReveal from '../../components/SplitReveal/SplitReveal';
import MagneticButton from '../../components/MagneticButton/MagneticButton';
import { projects } from '../../data/projects';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import './work-slider.scss';

// Swiper's loop mode needs more real slides than fit on screen at once, or it
// silently refuses to loop — so we repeat the project list a few times and
// map the reported index back onto the real project with modulo.
const LOOP_REPEATS = 3;
const loopedProjects = Array.from({ length: LOOP_REPEATS }, () => projects).flat();

export default function WorkSlider() {
  const swiperRef = useRef(null);
  const initialSlide = projects.length + Math.floor(projects.length / 2);
  const [active, setActive] = useState(Math.floor(projects.length / 2));

  return (
    <section className="work-slider" id="work">
      <div className="work-slider__head">
        <SplitReveal as="h2" type="lines" className="serif-line work-slider__title">
          Selected work,
          <br />a different perspective.
        </SplitReveal>
      </div>

      <Swiper
        modules={[EffectCoverflow, Keyboard, A11y]}
        onSwiper={(s) => {
          swiperRef.current = s;
          setActive(s.realIndex % projects.length);
        }}
        onSlideChange={(s) => setActive(s.realIndex % projects.length)}
        effect="coverflow"
        centeredSlides
        slidesPerView="auto"
        loop
        loopAdditionalSlides={3}
        initialSlide={initialSlide}
        keyboard={{ enabled: true }}
        grabCursor
        speed={650}
        coverflowEffect={{
          rotate: 34,
          depth: 260,
          stretch: -20,
          modifier: 1,
          slideShadows: false,
        }}
        className="work-slider__swiper"
      >
        {loopedProjects.map((p, i) => (
          <SwiperSlide key={`${p.slug}-${i}`} className="work-card">
            <Link to={`/work/${p.slug}`} data-cursor="View" className="work-card__link">
              <div
                className="work-card__poster"
                style={{
                  backgroundColor: p.color,
                  backgroundImage: p.image ? `url(${p.image})` : undefined,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                <div className="work-card__top">
                  <span className="work-card__logo">{p.name}</span>
                </div>
                <div className="work-card__bottom">
                  <p className="work-card__tagline">{p.tagline}</p>
                </div>
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="work-slider__caption">
        <span className="work-slider__caption-title">{projects[active].name}</span>
        <span className="work-slider__caption-sub">{projects[active].category}</span>
      </div>

      <div className="work-slider__controls">
        <button
          type="button"
          className="work-slider__arrow"
          onClick={() => swiperRef.current?.slidePrev()}
          data-cursor="Prev"
          aria-label="Previous project"
        >
          ←
        </button>
        <span className="work-slider__count">
          {String(active + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}
        </span>
        <button
          type="button"
          className="work-slider__arrow"
          onClick={() => swiperRef.current?.slideNext()}
          data-cursor="Next"
          aria-label="Next project"
        >
          →
        </button>
      </div>

      <div className="work-slider__foot">
        <MagneticButton as={Link} to="/work" cursorLabel="See all">
          View all work <span className="arrow">↗</span>
        </MagneticButton>
      </div>
    </section>
  );
}
