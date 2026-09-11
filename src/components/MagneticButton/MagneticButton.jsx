import { useMagnetic } from '../../hooks/useMagnetic';
import './magnetic-button.scss';

/**
 * Wraps its children in a magnetic anchor/button. Pass `as="button"` to
 * render a <button> instead of an <a>, and any other native props through.
 */
export default function MagneticButton({
  as: Tag = 'a',
  children,
  className = '',
  cursorLabel,
  strength = 0.35,
  ...rest
}) {
  const ref = useMagnetic({ strength });

  return (
    <Tag
      ref={ref}
      className={`magnetic ${className}`}
      data-cursor={cursorLabel}
      {...rest}
    >
      <span className="magnetic__inner">{children}</span>
    </Tag>
  );
}
