# AG. — Creative Developer Portfolio

A cinematic, animated React portfolio built with GSAP, Lenis, Swiper and SCSS —
modeled on the provided design reference.

## Run it

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # production build to /dist
npm run preview   # preview the production build
```

## What's inside

| Feature | Library / approach |
|---|---|
| Scroll-triggered animations | **GSAP** + `ScrollTrigger` |
| "Bottom-up" text reveal on titles | **GSAP `SplitText`** (see note below) |
| Smooth scrolling | **Lenis**, synced to GSAP's ticker so ScrollTrigger stays accurate |
| Curtain-style page transitions | Custom component built on **React Router** + GSAP (see note below) |
| Project carousel | **Swiper** (`effect="coverflow"`) |
| Styling | **SCSS**, modular per-component, tokens in `src/styles/abstracts/_variables.scss` |
| Custom cursor | Dot + lagging ring, expands with a label on any `[data-cursor]` element |
| Magnetic buttons | `useMagnetic` hook — `gsap.quickTo` toward the pointer, springs back on leave |
| Loading screen | Logo mark + animated percentage counter, slides away with `power4.inOut` |
| Global color-reverse switch | CSS custom properties swapped via `[data-theme="reversed"]` on `<html>` |

## Two deliberate substitutions (with reasons)

**Splitting.js → GSAP `SplitText`.** Splitting.js hasn't been meaningfully
maintained in years. Since April 2025, Webflow made *all* of GSAP's
previously-paid Club plugins — including `SplitText` — 100% free for
commercial use. It's purpose-built for exactly this (line/word/char
splitting for animation, with a built-in `mask` option for the reveal
effect), actively maintained, and already a dependency once you're using
GSAP — so there's no reason to add a second, unmaintained library that does
the same job worse. See `src/hooks/useSplitReveal.js`.

**Barba.js → a native React/GSAP curtain transition.** Barba's own
maintainers explicitly advise against using it inside a framework like React:
Barba re-implements SPA-style navigation (via PJAX) on top of what it expects
to be a plain multi-page site, and it ends up fighting React for control of
the DOM. Since this app already *is* a React SPA with React Router, the
idiomatic (and far more reliable) way to get the same curtain visual is to
drive a GSAP timeline off route changes directly. That's what
`src/components/Curtain/CurtainTransition.jsx` does: on navigation, colored
panels sweep up to fully cover the viewport, the outgoing page is swapped for
the incoming one underneath, then the panels sweep on off the top — same
effect as Barba's curtain demos, zero conflict with React.

## Customizing the color scheme

Everything funnels through `src/styles/abstracts/_variables.scss`:

```scss
$color-red: #ff2b16;
$color-black: #0a0a0a;
$color-cream: #f4efe9;
```

Change those three and the whole site reskins. The little switch in the
header (`ThemeToggle`) flips which of `--surface-a` / `--surface-b` is used
as background vs. ink globally — that's the "reverse" behavior — and is
independent from what colors you actually set above.

## Folder structure

```
src/
  components/     shared UI: Cursor, Loader, Header, Footer, Curtain,
                  MagneticButton, ThemeToggle, SplitReveal
  sections/       homepage sections: Hero, WorkSlider, Intro, Process, ContactCTA
  pages/          route-level views: Home, Work, ProjectDetail, About, Contact
  hooks/          useLenis, useMagnetic, useSplitReveal
  context/        ThemeContext (color-reverse switch)
  data/           fake project data — swap in your real projects here
  styles/         abstracts (tokens/mixins) + base (reset/typography/global)
```

## Content to swap in

- `src/data/projects.js` — replace the 5 fake projects with real ones
  (name, tagline, category, year, hero color, client, services, description).
  Swap the flat-color `work-card__poster` divs for real project images once
  you have them (drop an `<img>` or background-image in `WorkSlider.jsx` /
  `ProjectDetail.jsx`).
- `src/components/Footer/Footer.jsx` — real LinkedIn URL.
- `src/sections/ContactCTA/ContactCTA.jsx` — real contact email.
- `index.html` — swap the Google Fonts link if you want a different display
  typeface than Anton (the reference's condensed grotesk is a licensed font
  family — Anton is the closest free equivalent).

## Notes

- Everything respects `prefers-reduced-motion` (see `_reset.scss`).
- The custom cursor and magnetic buttons auto-disable on touch/coarse
  pointers, so mobile gets the native cursor and no magnetism, by design.
- `useLenis` shares a single Lenis instance across the app and drains it
  through `gsap.ticker` so Lenis, ScrollTrigger and the curtain transition
  all read from the same clock — avoids the classic "smooth-scroll fights
  scroll-trigger" bug.
