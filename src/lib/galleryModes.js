const TAU = Math.PI * 2;

// Kept apart from gallery3d.js so pages can read the mode labels without
// pulling Three.js into their bundle.
// `portrait` = group scale on portrait stages (phones). Larger than the
// aspect-fit the desktop uses, so cards read big and the layout is allowed
// to crop off the left / right edges; tuned per mode so nothing crops
// vertically.
export const GALLERY_MODES = {
  ring: { label: 'Ring', step: TAU / 10, drag: 0.006, drift: 0.0012, bend: 0.04, cam: [0, 2.4, 13.5], look: [0, -0.2, 0], portrait: 0.85 },
  arc: { label: 'Arc', step: 1, drag: 0.012, drift: 0.004, bend: -0.07, cam: [0, 0.3, 12], look: [0, 0, 0], portrait: 1.05 },
  pile: { label: 'Pile', step: TAU / 20, drag: 0.004, drift: 0.0008, bend: 0, cam: [0, 0, 12], look: [0, 0, 0], portrait: 0.75 },
};
