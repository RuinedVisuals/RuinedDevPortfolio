import { useTheme } from '../../context/ThemeContext';
import './theme-toggle.scss';

export default function ThemeToggle() {
  const { reversed, toggle } = useTheme();

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggle}
      data-cursor="Switch"
      aria-label="Reverse color theme"
      aria-pressed={reversed}
    >
      <span className="theme-toggle__track">
        <span className="theme-toggle__thumb" />
      </span>
    </button>
  );
}
