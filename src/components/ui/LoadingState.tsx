import React, { useState } from 'react';

/* ─────────────────────────────────────────────────────────
 * LOADING STATE — pixel-grid loader
 *
 * Variants:
 *   Drive  — square cells, chevron wavefront driving right
 *   Dots   — same wavefront, circular cells
 *   Orbit  — a comet lapping the grid perimeter
 *   Surfer — Drive loader paired with a meme video below
 * ───────────────────────────────────────────────────────── */

const chevron = Array.from({ length: 9 }, (_, i) => {
  const r = Math.floor(i / 3), c = i % 3;
  return (c + Math.abs(r - 1)) * 90;
});

const ORBIT_ORDER = [0, 1, 2, 5, 8, 7, 6, 3];
const orbit = Array.from({ length: 9 }, (_, i) => {
  const k = ORBIT_ORDER.indexOf(i);
  return k === -1 ? null : k * 110;
});

const PATTERNS: Record<string, { delays: (number | null)[]; dur: number; round: boolean }> = {
  Drive: { delays: chevron, dur: 650, round: false },
  Dots:  { delays: chevron, dur: 650, round: true  },
  Orbit: { delays: orbit,   dur: 950, round: false },
};

/* ── Grid ── */
function LoaderGrid({
  delays,
  dur,
  round,
}: {
  delays: (number | null)[];
  dur: number;
  round: boolean;
}) {
  return (
    <span
      aria-hidden
      style={{
        display: 'inline-grid',
        gridTemplateColumns: 'repeat(3, 4px)',
        gap: '1.5px',
        flexShrink: 0,
      }}
    >
      {delays.map((delay, index) => (
        <span
          key={index}
          style={{
            width: 4,
            height: 4,
            background: 'var(--primary)',
            borderRadius: round ? '50%' : 1,
            opacity: delay === null ? 0.07 : 0.15,
            animation:
              delay === null
                ? 'none'
                : `ls-pixel-on ${dur}ms ease-in-out ${delay}ms infinite`,
          }}
        />
      ))}
    </span>
  );
}

/* ── Shimmer label ── */
function ShimmerLabel({ text }: { text: string }) {
  return (
    <span
      style={{
        fontSize: 13,
        fontWeight: 500,
        background:
          'linear-gradient(90deg, var(--text-tertiary) 35%, var(--text-primary) 50%, var(--text-tertiary) 65%)',
        backgroundSize: '200% 100%',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        animation: 'ls-shimmer-text 1.4s linear infinite',
      }}
    >
      {text}
    </span>
  );
}

/* ── Main export ── */
export function LoadingState({
  label,
  variant = 'Drive',
  videoSrc = '/subway-surfers.mp4',
}: {
  label?: string;
  variant?: 'Drive' | 'Dots' | 'Orbit' | 'Surfer';
  videoSrc?: string;
}) {
  const surfer = variant === 'Surfer';
  const resolvedLabel = label ?? (surfer ? 'Subway surfing' : 'Loading\u2026');
  const [videoOk, setVideoOk] = useState(true);
  const { delays, dur, round } = PATTERNS[variant] ?? PATTERNS.Drive;

  if (surfer) {
    return (
      <div role="status" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: 'fit-content' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <LoaderGrid {...PATTERNS.Drive} />
          <ShimmerLabel text={resolvedLabel} />
        </div>
        <div
          style={{
            marginTop: 8,
            width: 224,
            overflow: 'hidden',
            borderRadius: 10,
            boxShadow: 'var(--shadow-lg)',
            animation: 'ls-pop-in 200ms cubic-bezier(0.16,1,0.3,1) both',
            transformOrigin: 'top left',
          }}
        >
          <div style={{ position: 'relative', aspectRatio: '16/9', width: '100%', background: 'var(--surface-soft)' }}>
            {videoOk ? (
              <video
                src={videoSrc}
                autoPlay
                muted
                loop
                playsInline
                onError={() => setVideoOk(false)}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 6 }}>
                <LoaderGrid {...PATTERNS.Drive} />
                <span style={{ fontSize: 10, fontFamily: 'monospace', color: 'var(--text-muted)', textAlign: 'center', padding: '0 12px' }}>
                  Video unavailable
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div role="status" style={{ display: 'flex', alignItems: 'center', gap: 10, width: 'fit-content' }}>
      <LoaderGrid delays={delays} dur={dur} round={round} />
      <ShimmerLabel text={resolvedLabel} />
    </div>
  );
}
