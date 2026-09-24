import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { store, goalService } from '../../services';
import { Target, Plus, CheckCircle2, Circle, Flame, Clock } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import AiCreativeIcon from '../../components/icons/AiCreativeIcon';

/* ── Circular arc progress ring with glow ────────────────────────────── */
const ArcProgress: React.FC<{ progress: number; size?: number; color?: string }> = ({
  progress, size = 64, color = '#4343D5'
}) => {
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (progress / 100) * circ;
  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)', flexShrink: 0, position: 'absolute', top: 0, left: 0 }}>
        <defs>
          <filter id={`glow-${color.replace('#', '')}`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        {/* Background track */}
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(0,0,0,0.04)" strokeWidth={6} />
        {/* Foreground glowing track */}
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none" stroke={color} strokeWidth={6}
          strokeDasharray={circ} strokeDashoffset={offset}
          strokeLinecap="round"
          filter={`url(#glow-${color.replace('#', '')})`}
          style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(0.16, 1, 0.3, 1)' }}
        />
      </svg>
      {/* Percentage Center */}
      <div style={{
        position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 14, fontWeight: 800, color, letterSpacing: '-0.03em'
      }}>
        {progress}%
      </div>
    </div>
  );
};

/* ── Status Pill ──────────────────────────────────────────────────────── */
const StatusPill: React.FC<{ status: string }> = ({ status }) => {
  const map: Record<string, { bg: string; color: string; label: string }> = {
    active:    { bg: 'rgba(67, 67, 213, 0.1)', color: '#4343D5', label: 'Active' },
    behind:    { bg: 'rgba(217, 119, 6, 0.1)', color: '#D97706', label: 'Behind' },
    completed: { bg: 'rgba(26, 135, 84, 0.1)', color: '#1A8754', label: 'Completed' },
    paused:    { bg: 'rgba(107, 114, 128, 0.1)', color: '#6B7280', label: 'Paused' },
  };
  const s = map[status] ?? map.active;
  return (
    <span style={{
      padding: '4px 10px', borderRadius: 999, fontSize: 11, fontWeight: 700,
      background: s.bg, color: s.color, letterSpacing: '0.04em', textTransform: 'uppercase',
      border: `1px solid ${s.color}30`
    }}>
      {s.label}
    </span>
  );
};

/* ── Category Color Mapping ───────────────────────────────────────────── */
const catColor = (cat?: string) => {
  const m: Record<string, string> = {
    Health: '#059669', Career: '#4343D5', Personal: '#D946EF',
    Learning: '#EA580C', Finance: '#0284C7', Creative: '#8B5CF6',
  };
  return m[cat ?? ''] ?? '#4343D5';
};

/* ─────────────────────────────────────────────────────────────────────── */
export const GoalsPage: React.FC = () => {
  const { openQuickAdd, showToast, triggerConfetti } = useApp();
  const [activeTab, setActiveTab] = useState<'active' | 'long_term' | 'completed'>('active');

  const goals = store.goals;

  const handleToggleMilestone = async (goalId: string, milestoneId: string) => {
    const updated = await goalService.toggleMilestone(goalId, milestoneId);
    if (updated.progress === 100) {
      triggerConfetti();
      showToast(`🎉 Goal "${updated.name}" 100% Completed!`, 'success');
    } else {
      showToast(`Milestone updated! Progress: ${updated.progress}%`, 'info');
    }
  };

  const filteredGoals = goals.filter(g => {
    if (activeTab === 'completed') return g.status === 'completed' || g.progress === 100;
    if (activeTab === 'long_term') return g.timeframe === 'yearly' || g.timeframe === 'long_term';
    return g.status === 'active' || g.status === 'behind';
  });

  const activeCount = goals.filter(g => g.status !== 'completed').length;
  const totalProgress = goals.length > 0
    ? Math.round(goals.reduce((sum, g) => sum + g.progress, 0) / goals.length)
    : 0;
  const streakMax = Math.max(...goals.map(g => g.streak || 0));

  const tabs = [
    { id: 'active',    label: `Active (${activeCount})` },
    { id: 'long_term', label: 'Long-Term' },
    { id: 'completed', label: 'Completed' },
  ];

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 28, position: 'relative' }}>
      <style>{`
        @keyframes meshGradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes pulseGlow {
          0%, 100% { filter: drop-shadow(0 0 8px rgba(154, 92, 255, 0.5)); }
          50% { filter: drop-shadow(0 0 16px rgba(154, 92, 255, 0.9)); }
        }
        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .mesh-hero {
          background: linear-gradient(-45deg, #0F0F2E, #2D1B69, #4343D5, #8B5CF6);
          background-size: 300% 300%;
          animation: meshGradient 12s ease infinite;
        }
        .glass-card {
          background: rgba(255, 255, 255, 0.06);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.15);
          box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.15);
        }
        .goal-card {
          background: #ffffff;
          border-radius: 20px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.03);
          border: 1px solid var(--outline-subtle);
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          position: relative;
          overflow: hidden;
          z-index: 1;
        }
        .goal-card:hover {
          transform: translateY(-4px) scale(1.01);
          box-shadow: 0 12px 32px rgba(0,0,0,0.08);
          z-index: 10;
        }
        .goal-card::before {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 100%);
          z-index: -1;
          pointer-events: none;
        }
        .bento-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
          gap: 20px;
        }
        .animated-progress-bar {
          background-size: 200% 100%;
          animation: meshGradient 3s linear infinite;
        }
      `}</style>

      {/* ── Hero Header: Mesh Gradient & Glassmorphism ──────────────────── */}
      <div className="mesh-hero" style={{
        borderRadius: 24, padding: '36px 32px',
        position: 'relative', overflow: 'hidden',
        boxShadow: '0 20px 40px -10px rgba(67, 67, 213, 0.3)'
      }}>
        {/* Floating Light Orbs */}
        <div style={{
          position: 'absolute', top: '-10%', right: '10%', width: 250, height: 250,
          borderRadius: '50%', background: 'rgba(217, 70, 239, 0.4)', filter: 'blur(60px)', pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute', bottom: '-20%', left: '5%', width: 300, height: 300,
          borderRadius: '50%', background: 'rgba(67, 67, 213, 0.5)', filter: 'blur(70px)', pointerEvents: 'none'
        }} />

        <div style={{ position: 'relative', zIndex: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 24 }}>
          
          <div style={{ maxWidth: 460 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <div className="glass-card" style={{
                width: 44, height: 44, borderRadius: 12,
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <Target size={22} color="#fff" />
              </div>
              <h1 style={{ fontSize: 32, fontWeight: 800, color: '#fff', letterSpacing: '-0.04em', lineHeight: 1.1, margin: 0 }}>
                Goals & Milestones
              </h1>
            </div>
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.7)', lineHeight: 1.5, fontWeight: 500, margin: 0 }}>
              Turn your vision into reality. Track meaningful objectives, smash your milestones, and get personalized AI coaching along the way.
            </p>
          </div>

          {/* Glassmorphic Summary Pills */}
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
            <div className="glass-card" style={{
              padding: '12px 18px', borderRadius: 14,
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4
            }}>
              <span style={{ fontSize: 26, fontWeight: 800, color: '#fff', lineHeight: 1, textShadow: '0 2px 10px rgba(255,255,255,0.3)' }}>{totalProgress}%</span>
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 600 }}>Avg Progress</span>
            </div>
            <div className="glass-card" style={{
              padding: '12px 18px', borderRadius: 14,
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4
            }}>
              <span style={{ fontSize: 26, fontWeight: 800, color: '#FBBF24', lineHeight: 1, textShadow: '0 2px 10px rgba(251,191,36,0.4)' }}>🔥 {streakMax}</span>
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 600 }}>Best Streak</span>
            </div>
            
            <button 
              onClick={() => openQuickAdd('goal')}
              style={{
                background: '#fff', color: '#4343D5', padding: '0 20px', height: 56, borderRadius: 14,
                border: 'none', fontWeight: 700, fontSize: 14, display: 'flex', alignItems: 'center', gap: 8,
                cursor: 'pointer', boxShadow: '0 8px 20px rgba(0,0,0,0.15)', transition: 'transform 0.2s'
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              <Plus size={18} /> New Goal
            </button>
          </div>
        </div>

        {/* Floating AI Coach Banner embedded in Hero */}
        <div className="glass-card" style={{
          marginTop: 28, padding: '16px 20px', borderRadius: 16,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12,
          background: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255,255,255,0.25)', position: 'relative'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 12,
              background: 'linear-gradient(135deg, #FF6B6B, #9A5CFF, #4343D5)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              animation: 'pulseGlow 3s infinite'
            }}>
              <AiCreativeIcon size={20} color="#fff" />
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 800, color: '#fff', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 3 }}>
                AI Goal Coach
              </div>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.9)', fontWeight: 500, lineHeight: 1.4, margin: 0 }}>
                Your "Berlin Marathon" goal is 18% behind weekly volume. Should we adjust your upcoming week schedule?
              </p>
            </div>
          </div>
          <button 
            onClick={() => { triggerConfetti(); showToast('Weekly marathon plan adjusted!', 'success'); }}
            style={{
              padding: '8px 16px', borderRadius: 10, border: 'none', cursor: 'pointer',
              background: 'rgba(255,255,255,0.2)', color: '#fff', fontWeight: 700, fontSize: 13,
              backdropFilter: 'blur(10px)', transition: 'background 0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.3)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
          >
            Adjust Plan
          </button>
        </div>
      </div>

      {/* ── Modern Tabs ──────────────────────────────────────────── */}
      <div style={{ display: 'flex', gap: 8, padding: '6px', background: 'var(--surface-soft)', borderRadius: 16, width: 'fit-content' }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            style={{
              position: 'relative',
              padding: '8px 20px', borderRadius: 12, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 700,
              background: activeTab === tab.id ? '#fff' : 'transparent',
              color: activeTab === tab.id ? 'var(--text-primary)' : 'var(--text-tertiary)',
              boxShadow: activeTab === tab.id ? '0 2px 10px rgba(0,0,0,0.06)' : 'none',
              transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Bento Grid Goals ──────────────────────────────────────── */}
      <div className="bento-grid">
        {filteredGoals.map((goal, idx) => {
          const color = catColor(goal.category);
          
          return (
            <div 
              key={goal.id} 
              className="goal-card"
              style={{ animation: `slideInUp 0.4s ease forwards ${idx * 0.05}s` }}
            >
              {/* Vibrant Top Border */}
              <div style={{ height: 6, background: `linear-gradient(90deg, ${color}, ${color}77)` }} />

              <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: 20, height: 'calc(100% - 6px)' }}>
                
                {/* Header: Name, Status, Ring */}
                <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                  <ArcProgress progress={goal.progress} size={64} color={color} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginBottom: 8 }}>
                      <h3 style={{ fontSize: 18, fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--ink)', margin: 0, lineHeight: 1.2 }}>
                        {goal.name}
                      </h3>
                      <StatusPill status={goal.status} />
                    </div>
                    
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, fontSize: 12, color: 'var(--text-tertiary)', fontWeight: 500 }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                        <Target size={12} color={color} /> {goal.category}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                        <Clock size={12} /> {goal.deadline}
                      </span>
                      {(goal.streak ?? 0) > 0 && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#D97706', fontWeight: 700 }}>
                          <Flame size={12} fill="#D97706" /> {goal.streak} Day Streak
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Progress Bar & Stats */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 8 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)' }}>Overall Progress</span>
                    <span style={{ fontSize: 13, fontWeight: 800, color }}>{goal.current} / {goal.target} {goal.unit}</span>
                  </div>
                  <div style={{ height: 8, borderRadius: 99, background: 'var(--surface-soft)', overflow: 'hidden' }}>
                    <div 
                      className="animated-progress-bar"
                      style={{
                        height: '100%', width: `${goal.progress}%`, borderRadius: 99,
                        background: `linear-gradient(90deg, ${color}, ${color}88, ${color})`,
                        transition: 'width 1s cubic-bezier(0.16,1,0.3,1)'
                      }} 
                    />
                  </div>
                </div>

                {/* Milestones as Interactive Pills */}
                {goal.milestones?.length > 0 && (
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-tertiary)', letterSpacing: '0.08em', marginBottom: 12 }}>
                      Milestones
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {goal.milestones.map(m => (
                        <div
                          key={m.id}
                          onClick={() => handleToggleMilestone(goal.id, m.id)}
                          style={{
                            display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px',
                            borderRadius: 12, cursor: 'pointer',
                            background: m.completed ? `${color}10` : '#F4F2F0',
                            border: `1px solid ${m.completed ? `${color}30` : 'transparent'}`,
                            transition: 'all 0.2s',
                            boxShadow: m.completed ? `0 2px 8px ${color}15` : 'none'
                          }}
                          onMouseEnter={e => {
                            if (!m.completed) e.currentTarget.style.background = '#EBE9E7';
                            e.currentTarget.style.transform = 'translateY(-1px)';
                          }}
                          onMouseLeave={e => {
                            if (!m.completed) e.currentTarget.style.background = '#F4F2F0';
                            e.currentTarget.style.transform = 'translateY(0)';
                          }}
                        >
                          {m.completed
                            ? <CheckCircle2 size={16} color={color} />
                            : <Circle size={16} color="#A0A0AB" />}
                          <span style={{
                            fontSize: 12.5, fontWeight: 600,
                            textDecoration: m.completed ? 'line-through' : 'none',
                            color: m.completed ? color : 'var(--ink)'
                          }}>{m.title}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Glowing AI Insight */}
                {goal.aiInsight && (
                  <div style={{
                    marginTop: 'auto',
                    display: 'flex', alignItems: 'flex-start', gap: 12,
                    padding: '14px 16px', borderRadius: 14,
                    background: 'linear-gradient(135deg, rgba(154, 92, 255, 0.05) 0%, rgba(67, 67, 213, 0.05) 100%)',
                    border: '1px solid rgba(154, 92, 255, 0.15)',
                    boxShadow: 'inset 0 2px 10px rgba(255,255,255,0.5)'
                  }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: 9, flexShrink: 0,
                      background: 'linear-gradient(135deg, #9A5CFF, #4343D5)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      boxShadow: '0 2px 8px rgba(154, 92, 255, 0.4)'
                    }}>
                      <AiCreativeIcon size={14} color="#fff" />
                    </div>
                    <span style={{ fontSize: 13, color: '#312E81', lineHeight: 1.5, fontWeight: 600 }}>
                      {goal.aiInsight}
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {filteredGoals.length === 0 && (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '80px 20px', color: 'var(--text-tertiary)' }}>
            <div style={{ 
              width: 80, height: 80, borderRadius: '50%', background: 'var(--surface-soft)', 
              display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' 
            }}>
              <Target size={36} color="var(--text-tertiary)" />
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--ink)', marginBottom: 8 }}>No Goals Found</h3>
            <p style={{ fontSize: 14, fontWeight: 500, maxWidth: 300, margin: '0 auto' }}>
              You don't have any goals in this view. Click "New Goal" to add one!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
