import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';

/* ─────────────────────────────────────────────────────────
 * ThinkingState — expandable agent trace, three variants
 *
 *   Steps     step list with spinner → muted checks
 *   Reasoning prose reasoning that expands, then settles
 *   Search    web-search trace: query + sources read
 *
 * Runs once, settles, and remains expandable.
 * Ported to vanilla CSS / inline styles (no Tailwind).
 * ───────────────────────────────────────────────────────── */

const STAGES = [800, 600, 1800, 2600, 1600];

function useSequence(steps: number[]) {
  const [stage, setStage] = useState(0);
  useEffect(() => {
    if (stage >= steps.length - 1) return;
    const t = setTimeout(() => setStage(s => s + 1), steps[stage]);
    return () => clearTimeout(t);
  }, [stage, steps]);
  return stage;
}

type Row = {
  primary: string;
  secondary?: string;
  href?: string;
  dotColor?: string;
};

type VariantConfig = {
  active: string;
  done: string;
  rows: Row[];
  query?: string;
};

const VARIANTS: Record<string, VariantConfig> = {
  Steps: {
    active: 'Thinking',
    done: 'Thought for a moment',
    rows: [
      { primary: 'Reading your goals and tasks' },
      { primary: 'Analyzing your energy patterns' },
      { primary: 'Checking upcoming commitments', secondary: '4 events' },
      { primary: 'Composing personalized plan' },
    ],
  },
  Reasoning: {
    active: 'Reasoning',
    done: 'Reasoned through it',
    rows: [
      { primary: 'Your deep work peaks are between 8–11 AM based on calendar patterns.' },
      { primary: 'Marathon training is 18% behind schedule — needs a recovery plan this week.' },
      { primary: 'Job application follow-ups are overdue by 2 days — high urgency.' },
    ],
  },
  Search: {
    active: 'Searching your data',
    done: 'Searched your life graph',
    query: 'tasks, goals, calendar, memories',
    rows: [
      { primary: 'Career Development', secondary: '3 tasks due', dotColor: 'var(--primary)', href: undefined },
      { primary: 'Marathon Training', secondary: '62% complete', dotColor: '#10B981', href: undefined },
      { primary: 'Portfolio Refresh', secondary: 'overdue', dotColor: '#F59E0B', href: undefined },
    ],
  },
};

/* Colored dot for Search variant */
function Dot({ color }: { color?: string }) {
  return (
    <span style={{
      width: 10,
      height: 10,
      borderRadius: '50%',
      background: color ?? 'var(--primary)',
      flexShrink: 0,
      display: 'inline-block',
    }} />
  );
}

/* ── Shimmer label (working state) ── */
function ShimmerText({ text }: { text: string }) {
  return (
    <span style={{
      fontSize: 13,
      fontWeight: 500,
      whiteSpace: 'nowrap',
      background: 'linear-gradient(90deg, var(--text-tertiary) 35%, var(--text-primary) 50%, var(--text-tertiary) 65%)',
      backgroundSize: '200% 100%',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      animation: 'ls-shimmer-text 1.4s linear infinite',
    }}>
      {text}
    </span>
  );
}

/* ── Main export ── */
export function ThinkingState({
  variant = 'Steps',
  onSettled,
}: {
  variant?: 'Steps' | 'Reasoning' | 'Search';
  onSettled?: () => void;
}) {
  const stage = useSequence(STAGES);
  const [manualExpanded, setManualExpanded] = useState<boolean | null>(null);
  const v = VARIANTS[variant] ?? VARIANTS.Steps;

  const autoExpanded = stage >= 1 && stage < 4;
  const expanded = manualExpanded ?? autoExpanded;
  const working = stage < 3;
  const visible = stage < 2 ? 0 : stage === 2 ? Math.min(2, v.rows.length) : v.rows.length;

  const traceRef = useRef<HTMLDivElement>(null);
  const [lineHeight, setLineHeight] = useState(0);
  useLayoutEffect(() => {
    if (traceRef.current) setLineHeight(traceRef.current.offsetHeight);
  }, [visible, expanded, variant, stage]);

  const settledRef = useRef(false);
  useEffect(() => {
    if (working || settledRef.current) return;
    settledRef.current = true;
    onSettled?.();
  }, [working, onSettled]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', maxWidth: 380 }}>

      {/* ── Header button ── */}
      <button
        type="button"
        aria-expanded={expanded}
        onClick={() => setManualExpanded(cur => !(cur ?? autoExpanded))}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '5px 8px',
          margin: '0 -8px',
          borderRadius: 8,
          width: 'fit-content',
          background: 'transparent',
          transition: 'background 0.1s ease',
          cursor: 'pointer',
        }}
        onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface-hover)')}
        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
      >
        {/* Sparkle / brain icon */}
        <svg width="15" height="15" viewBox="0 0 24 24"
          fill={working ? 'var(--text-secondary)' : 'var(--text-muted)'}>
          <path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8z" />
        </svg>

        {/* Label */}
        <span role="status">
          {working
            ? <ShimmerText text={v.active} />
            : (
              <span style={{
                fontSize: 13,
                fontWeight: 500,
                whiteSpace: 'nowrap',
                color: 'var(--text-secondary)',
                animation: 'ls-fade-in 350ms ease-out both',
              }}>
                {v.done}
              </span>
            )
          }
        </span>

        {/* Chevron */}
        <svg
          width="13" height="13" viewBox="0 0 24 24"
          fill="none" stroke="var(--text-tertiary)" strokeWidth="2.2"
          strokeLinecap="round" strokeLinejoin="round"
          style={{
            transition: 'transform 0.3s ease',
            transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {/* ── Expandable trace ── */}
      <div style={{
        display: 'grid',
        gridTemplateRows: expanded ? '1fr' : '0fr',
        opacity: expanded ? 1 : 0,
        transition: 'grid-template-rows 0.35s cubic-bezier(0.23,1,0.32,1), opacity 0.35s cubic-bezier(0.23,1,0.32,1)',
      }}>
        <div style={{ overflow: 'hidden' }}>
          <div style={{ position: 'relative', marginTop: 6, marginLeft: 5, paddingLeft: 16 }}>

            {/* Vertical timeline line */}
            <span aria-hidden style={{
              position: 'absolute',
              left: 3,
              top: -8,
              width: 1,
              background: 'var(--outline-soft)',
              height: lineHeight ? lineHeight - 2 : 0,
              transition: 'height 0.5s cubic-bezier(0.23,1,0.32,1)',
            }} />

            <div ref={traceRef} style={{ display: 'flex', flexDirection: 'column', gap: 2, padding: '4px 0' }}>

              {/* Search query row */}
              {v.query && (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  height: 28, padding: '0 6px',
                  animation: expanded ? 'ls-fade-up 300ms cubic-bezier(0.23,1,0.32,1) both' : undefined,
                }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                    stroke="var(--text-tertiary)" strokeWidth="2" strokeLinecap="round">
                    <circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" />
                  </svg>
                  <span style={{ fontSize: 12.5, color: 'var(--text-secondary)' }}>{v.query}</span>
                </div>
              )}

              {/* Data rows */}
              {v.rows.slice(0, visible).map((row, i) => (
                <div
                  key={row.primary}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    minHeight: 28,
                    padding: '3px 6px',
                    borderRadius: 6,
                    animation: `ls-fade-up 320ms cubic-bezier(0.23,1,0.32,1) ${i * 120}ms both`,
                  }}
                >
                  {/* Steps: spinner or check */}
                  {variant === 'Steps' && (
                    i < visible - 1 || !working ? (
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                        stroke="var(--text-tertiary)" strokeWidth="2.5"
                        strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    ) : (
                      <span style={{
                        width: 12, height: 12, flexShrink: 0, borderRadius: '50%',
                        border: '1.5px solid var(--outline-soft)',
                        borderTopColor: 'var(--text-secondary)',
                        animation: 'ls-spin 700ms linear infinite',
                        display: 'inline-block',
                      }} />
                    )
                  )}

                  {/* Search: colored dot */}
                  {variant === 'Search' && <Dot color={row.dotColor} />}

                  {/* Primary text */}
                  <span style={{
                    fontSize: 12.5,
                    fontWeight: variant === 'Reasoning' ? 400 : 500,
                    color: variant === 'Reasoning' ? 'var(--text-secondary)' : 'var(--text-primary)',
                    lineHeight: variant === 'Reasoning' ? 1.6 : 1.4,
                    whiteSpace: variant === 'Reasoning' ? 'normal' : 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    minWidth: 0,
                    flex: 1,
                  }}>
                    {row.primary}
                  </span>

                  {/* Secondary text */}
                  {row.secondary && (
                    <span style={{
                      fontSize: 11.5,
                      color: 'var(--text-tertiary)',
                      flexShrink: 0,
                    }}>
                      {row.secondary}
                    </span>
                  )}
                </div>
              ))}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
