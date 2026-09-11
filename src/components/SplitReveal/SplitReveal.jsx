import { useSplitReveal } from '../../hooks/useSplitReveal';

/**
 * <SplitReveal as="h1" type="lines">Creative developer.</SplitReveal>
 */
export default function SplitReveal({
  as: Tag = 'div',
  type = 'lines',
  delay = 0,
  stagger = 0.08,
  start = 'top 85%',
  immediate = false,
  className = '',
  children,
  ...rest
}) {
  const ref = useSplitReveal({ type, delay, stagger, start, immediate });

  return (
    <Tag ref={ref} className={className} {...rest}>
      {children}
    </Tag>
  );
}
