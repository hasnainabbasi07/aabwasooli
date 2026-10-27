// Glossy light-blue "glass" look (top shine + sky-blue gradient + soft rim).
// Colors come from index.css tokens: glass-top, glass-bottom, glass-rim, glass-ink, shadow-glass.
export const glass =
  "relative overflow-hidden border border-glass-rim bg-linear-to-b from-glass-top to-glass-bottom text-glass-ink shadow-glass " +
  "before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-1/2 before:bg-linear-to-b before:from-white/70 before:to-transparent";