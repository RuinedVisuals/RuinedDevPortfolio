import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './chatNudge.scss';

const KEY = 'chat-nudge-min';
const read = () => {
  try { return sessionStorage.getItem(KEY) === '1'; } catch { return false; }
};

/**
 * Messenger-style nudge, bottom right: shows a typing indicator, then a short
 * message with two quick replies that both lead to /contact. The close button
 * only minimizes it to a round launcher that stays put (remembered per session);
 * hidden on the contact page.
 */
export default function ChatNudge() {
  const { pathname } = useLocation();
  const [shown, setShown] = useState(false);
  const [open, setOpen] = useState(!read());
  const [typing, setTyping] = useState(true);

  useEffect(() => {
    const show = window.setTimeout(() => setShown(true), 6000);
    return () => window.clearTimeout(show);
  }, []);

  useEffect(() => {
    if (!shown || !open) return undefined;
    setTyping(true);
    const t = window.setTimeout(() => setTyping(false), 1800);
    return () => window.clearTimeout(t);
  }, [shown, open]);

  const toggle = (next) => {
    setOpen(next);
    try { sessionStorage.setItem(KEY, next ? '' : '1'); } catch { /* private mode: resets on reload */ }
  };

  if (!shown || pathname === '/contact') return null;

  if (!open) {
    return (
      <button type="button" className="chat-nudge-fab" onClick={() => toggle(true)} aria-label="Open message from Apostolis" data-cursor="Chat">
        <img src="/images/profile-2-crop.jpg" alt="" width="52" height="52" />
        <span className="chat-nudge-fab__dot" />
      </button>
    );
  }

  return (
    <aside className="chat-nudge" aria-label="Message from Apostolis">
      <button type="button" className="chat-nudge__close" onClick={() => toggle(false)} aria-label="Minimize message" data-cursor="Minimize">
        −
      </button>
      <div className="chat-nudge__head">
        <img className="chat-nudge__avatar" src="/images/profile-2-crop.jpg" alt="" width="36" height="36" />
        <div>
          <strong>Apostolis</strong>
          <span>Replies within a day</span>
        </div>
      </div>

      <div className="chat-nudge__body" aria-live="polite">
        {typing ? (
          <p className="chat-nudge__bubble chat-nudge__typing" aria-label="Typing">
            <i /><i /><i />
          </p>
        ) : (
          <>
            <p className="chat-nudge__bubble">Hey, I&rsquo;m Apostolis. Are you an agency, or do you need a website?</p>
            <p className="chat-nudge__bubble chat-nudge__bubble--late">Tell me about it, I read every message.</p>
            <div className="chat-nudge__replies">
              <Link to="/contact" onClick={() => toggle(false)} data-cursor="Write">I&rsquo;m an agency</Link>
              <Link to="/contact" onClick={() => toggle(false)} data-cursor="Write">I need a website</Link>
            </div>
          </>
        )}
      </div>
    </aside>
  );
}
