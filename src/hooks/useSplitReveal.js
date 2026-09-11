import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(SplitText, ScrollTrigger);

/**
 * Splits the text inside the returned ref into lines (masked) and animates
 * each line up from below on scroll-into-view (or immediately if
 * `immediate` is true, used for the hero which fires on load instead).
 *
 * type: 'lines' | 'words' | 'chars'
 */
export function useSplitReveal({
  type = 'lines',
  delay = 0,
  stagger = 0.08,
  start = 'top 85%',
  immediate = false,
  disabled = false,
} = {}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || disabled) return undefined;

    let split;
    let ctx = gsap.context(() => {
      split = SplitText.create(el, {
        type: type === 'lines' ? 'lines' : type === 'words' ? 'lines,words' : 'lines,words,chars',
        linesClass: 'split-line',
        wordsClass: 'split-word',
        charsClass: 'split-char',
        mask: 'lines',
        autoSplit: true,
      });

      const targets = type === 'lines' ? split.lines : type === 'words' ? split.words : split.chars;

      gsap.set(targets, { yPercent: 115, opacity: 0 });

      const tween = gsap.to(targets, {
        yPercent: 0,
        opacity: 1,
        duration: 1.1,
        ease: 'power4.out',
        stagger: stagger,
        delay,
        // The line masks clip anything that moves past their tight box, which
        // is exactly what we want mid-reveal but would clip any interactive
        // effect (e.g. magnetic letters) added after the reveal finishes.
        onComplete: () => split.masks?.forEach((m) => (m.style.overflow = 'visible')),
        scrollTrigger: immediate
          ? undefined
          : {
              trigger: el,
              start,
              once: true,
            },
      });

      if (immediate) tween.play();
    }, el);

    return () => {
      ctx.revert();
      split?.revert?.();
    };
  }, [type, delay, stagger, start, immediate, disabled]);

  return ref;
}
