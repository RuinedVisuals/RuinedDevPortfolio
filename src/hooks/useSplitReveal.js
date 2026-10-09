import { useLayoutEffect, useRef } from 'react';
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

  // Layout effect: the split + hide must land before first paint.
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || disabled) return undefined;

    let split;
    const ctx = gsap.context(() => {
      // autoSplit re-splits (new nodes) on resize and when web fonts finish
      // loading. Everything must therefore be set up inside onSplit, on the
      // fresh targets, and the tween returned so GSAP carries its progress
      // over — otherwise the re-split chars appear un-hidden and un-animated
      // (a flash of the full-size title before the reveal plays).
      split = SplitText.create(el, {
        type: type === 'lines' ? 'lines' : type === 'words' ? 'lines,words' : 'lines,words,chars',
        linesClass: 'split-line',
        wordsClass: 'split-word',
        charsClass: 'split-char',
        mask: 'lines',
        autoSplit: true,
        onSplit: (self) => {
          const targets = type === 'lines' ? self.lines : type === 'words' ? self.words : self.chars;
          gsap.set(targets, { yPercent: 115, opacity: 0 });

          return gsap.to(targets, {
            yPercent: 0,
            opacity: 1,
            duration: 1.1,
            ease: 'power4.out',
            stagger,
            delay,
            // The line masks clip anything that moves past their tight box, which
            // is exactly what we want mid-reveal but would clip any interactive
            // effect (e.g. magnetic letters) added after the reveal finishes.
            onComplete: () => self.masks?.forEach((m) => (m.style.overflow = 'visible')),
            scrollTrigger: immediate ? undefined : { trigger: el, start, once: true },
          });
        },
      });
    }, el);

    return () => {
      ctx.revert();
      split?.revert?.();
    };
  }, [type, delay, stagger, start, immediate, disabled]);

  return ref;
}
