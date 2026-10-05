import { useEffect, useImperativeHandle, useLayoutEffect, useRef, useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { createGallery } from '../../lib/gallery3d';
import { getPosters } from '../../lib/posters';
import './gallery3d.scss';

/**
 * React wrapper around lib/gallery3d. Exposes `step(dir)` through `ref`.
 * `items` = project indices to show; `mode` = 'ring' | 'arc' | 'pile'.
 */
export default function Gallery3D({ ref, mode = 'ring', items, grain = 0.12, onActive, onOpen, className = '', children }) {
  const stageRef = useRef(null);
  const galRef = useRef(null);
  const { colors } = useTheme();
  const [ready, setReady] = useState(false);

  // Latest values for the one-time setup below, without re-creating the
  // WebGL scene whenever a parent re-renders.
  const live = useRef({ mode, items, grain, colors, onActive, onOpen });
  useLayoutEffect(() => {
    live.current = { mode, items, grain, colors, onActive, onOpen };
  });

  useEffect(() => {
    let dead = false;
    getPosters().then((posters) => {
      if (dead || !stageRef.current) return;
      const l = live.current;
      galRef.current = createGallery(stageRef.current, {
        posters,
        colors: l.colors,
        mode: l.mode,
        items: l.items,
        grain: l.grain,
        onActive: (i) => live.current.onActive?.(i),
        onOpen: (i) => live.current.onOpen?.(i),
      });
      setReady(true);
    });
    return () => {
      dead = true;
      galRef.current?.destroy();
      galRef.current = null;
    };
  }, []);

  useEffect(() => galRef.current?.setMode(mode), [mode, ready]);
  useEffect(() => galRef.current?.setGrain(grain), [grain, ready]);
  useEffect(() => galRef.current?.setColors(colors), [colors, ready]);

  const itemsKey = items?.join(',');
  const firstItems = useRef(true);
  useEffect(() => {
    if (!ready) return;
    // The initial items are already applied by createGallery.
    if (firstItems.current) {
      firstItems.current = false;
      return;
    }
    if (live.current.items?.length) galRef.current?.setItems(live.current.items);
  }, [itemsKey, ready]);

  useImperativeHandle(ref, () => ({ step: (dir) => galRef.current?.step(dir) }), []);

  return (
    <div ref={stageRef} className={`gallery3d ${className}`} data-cursor="Drag">
      {children}
    </div>
  );
}
