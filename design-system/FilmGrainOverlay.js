'use client';

/*
 * FilmGrainOverlay — full-screen SVG turbulence layer.
 * Pairs with the `.noise-texture` body class from tokens.css.
 * Mount once near the root of your layout (above {children}).
 *
 * Usage:
 *   import FilmGrainOverlay from './design-system/FilmGrainOverlay';
 *   <body className="noise-texture">
 *     <FilmGrainOverlay />
 *     {children}
 *   </body>
 */
export default function FilmGrainOverlay() {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        pointerEvents: 'none',
        opacity: 0.18,
        mixBlendMode: 'multiply',
      }}
    >
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <filter id="film-grain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.7"
            numOctaves="4"
            stitchTiles="stitch"
          />
        </filter>
        <rect width="100%" height="100%" filter="url(#film-grain)" />
      </svg>
    </div>
  );
}
