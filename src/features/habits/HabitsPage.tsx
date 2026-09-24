import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { store, habitService } from '../../services';
import {
  Repeat, Plus, Flame, CheckCircle2, Circle,
  BookOpen, Bookmark, Heart, Trophy, Zap, TrendingUp
} from 'lucide-react';
import { AiCreativeIcon } from '../../components/icons/AiCreativeIcon';

/* ── Day Abbreviations ──────────────────────────────────────────────── */
const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const PAST_DATES = [
  '2026-08-24', '2026-08-25', '2026-08-26', '2026-08-27',
  '2026-08-28', '2026-08-29', '2026-08-30'
];
const TODAY = '2026-08-30';

/* ── Mini Radial Streak Ring ─────────────────────────────────────────── */
const StreakRing: React.FC<{ streak: number; max: number; color: string }> = ({ streak, max, color }) => {
  const size = 52;
  const r = 20;
  const circ = 2 * Math.PI * r;
  const pct = Math.min(streak / Math.max(max, 1), 1);
  const offset = circ - pct * circ;
  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)', position: 'absolute' }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(0,0,0,0.05)" strokeWidth={5} />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none"
          stroke={color} strokeWidth={5}
          strokeDasharray={circ} strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.7s cubic-bezier(0.16,1,0.3,1)', filter: `drop-shadow(0 0 4px ${color}88)` }}
        />
      </svg>
      <div style={{
        position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', lineHeight: 1
      }}>
        <span style={{ fontSize: 13, fontWeight: 900, color, letterSpacing: '-0.03em' }}>{streak}</span>
        <span style={{ fontSize: 8, fontWeight: 700, color: 'rgba(0,0,0,0.35)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>days</span>
      </div>
    </div>
  );
};

/* ── Icon Map ────────────────────────────────────────────────────────── */
const getIcon = (iconName: string, size = 20) => {
  if (iconName === 'BookOpen') return <BookOpen size={size} />;
  if (iconName === 'Bookmark') return <Bookmark size={size} />;
  if (iconName === 'Heart') return <Heart size={size} />;
  return <Zap size={size} />;
};

/* ─────────────────────────────────────────────────────────────────────── */
export const HabitsPage: React.FC = () => {
  const { openQuickAdd, showToast, triggerConfetti } = useApp();
  const habits = store.habits;
  const [activeHabit, setActiveHabit] = useState<string | null>(null);

  const totalStreak = habits.reduce((sum, h) => sum + (h.streak || 0), 0);
  const todayDone = habits.filter(h => !!h.completionHistory?.[TODAY]).length;
  const weeklyRate = habits.length > 0
    ? Math.round((habits.reduce((sum, h) => {
        const daysHit = PAST_DATES.filter(d => h.completionHistory?.[d]).length;
        return sum + daysHit;
      }, 0) / (habits.length * 7)) * 100)
    : 0;

  const handleToggleDay = async (habitId: string, dateStr: string) => {
    const updated = await habitService.toggleHabitDate(habitId, dateStr);
    if (updated.completionHistory[dateStr]) {
      triggerConfetti();
      showToast(`Habit logged! Streak: ${updated.streak} days 🔥`, 'success');
    } else {
      showToast('Habit unlogged.', 'info');
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      <style>{`
        @keyframes habitMesh {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes flameFlicker {
          0%, 100% { transform: scaleY(1) rotate(-2deg); filter: drop-shadow(0 0 6px #F59E0B88); }
          50% { transform: scaleY(1.08) rotate(2deg); filter: drop-shadow(0 0 14px #F59E0BCC); }
        }
        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(18px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes dotPop {
          0% { transform: scale(1); }
          50% { transform: scale(1.35); }
          100% { transform: scale(1); }
        }
        .habit-hero-bg {
          background: linear-gradient(-45deg, #1a0533, #2d1b69, #0f2d5a, #1a2b2d);
          background-size: 300% 300%;
          animation: habitMesh 14s ease infinite;
        }
        .habit-glass {
          background: rgba(255,255,255,0.07);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          border: 1px solid rgba(255,255,255,0.14);
        }
        .habit-card {
          background: #ffffff;
          border-radius: 22px;
          border: 1px solid var(--outline-subtle, rgba(0,0,0,0.06));
          box-shadow: 0 2px 16px rgba(0,0,0,0.04);
          overflow: hidden;
          transition: transform 0.28s cubic-bezier(0.16,1,0.3,1), box-shadow 0.28s ease;
          cursor: pointer;
        }
        .habit-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 40px rgba(0,0,0,0.09);
        }
        .day-dot {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          padding: 10px 6px 8px;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.18s ease;
          border: 1.5px solid transparent;
        }
        .day-dot:hover {
          background: rgba(0,0,0,0.03);
        }
        .dot-circle {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 700;
          transition: all 0.2s cubic-bezier(0.16,1,0.3,1);
        }
        .dot-circle.done {
          animation: dotPop 0.3s ease;
        }
        .mark-btn {
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 8px 16px;
          border-radius: 12px;
          border: none;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .mark-btn:hover {
          transform: translateY(-1px);
        }
        .ai-insight-chip {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 12px 14px;
          border-radius: 14px;
          background: linear-gradient(135deg, rgba(154,92,255,0.06), rgba(67,67,213,0.06));
          border: 1px solid rgba(154,92,255,0.14);
        }
      `}</style>

      {/* ── Animated Hero ─────────────────────────────────────────── */}
      <div className="habit-hero-bg" style={{
        borderRadius: 24, padding: '36px 32px',
        position: 'relative', overflow: 'hidden',
        boxShadow: '0 20px 60px -12px rgba(154, 92, 255, 0.35)'
      }}>
        {/* Orbs */}
        <div style={{ position:'absolute', top:'-15%', right:'8%', width:220, height:220, borderRadius:'50%', background:'rgba(245,158,11,0.25)', filter:'blur(50px)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', bottom:'-20%', left:'3%', width:280, height:280, borderRadius:'50%', background:'rgba(99,102,241,0.35)', filter:'blur(65px)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', top:'30%', right:'30%', width:160, height:160, borderRadius:'50%', background:'rgba(16,185,129,0.2)', filter:'blur(45px)', pointerEvents:'none' }} />

        <div style={{ position:'relative', zIndex:2 }}>
          {/* Title Row */}
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:24, marginBottom:28 }}>
            <div>
              <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:10 }}>
                <div className="habit-glass" style={{ width:44, height:44, borderRadius:13, display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <Repeat size={22} color="#fff" />
                </div>
                <h1 style={{ fontSize:32, fontWeight:800, color:'#fff', letterSpacing:'-0.04em', lineHeight:1.1, margin:0 }}>
                  Habits & Streaks
                </h1>
              </div>
              <p style={{ fontSize:15, color:'rgba(255,255,255,0.65)', fontWeight:500, lineHeight:1.5, margin:0, maxWidth:460 }}>
                Build unstoppable momentum. Your daily consistency compounds into lasting transformation.
              </p>
            </div>

            {/* Stat Pills */}
            <div style={{ display:'flex', gap:10, flexWrap:'wrap', alignItems:'center' }}>
              <div className="habit-glass" style={{ padding:'12px 18px', borderRadius:14, display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
                <span style={{ fontSize:26, fontWeight:800, color:'#FBBF24', lineHeight:1, textShadow:'0 0 20px rgba(251,191,36,0.6)', animation:'flameFlicker 2.5s ease infinite' }}>🔥{totalStreak}</span>
                <span style={{ fontSize:11, color:'rgba(255,255,255,0.55)', letterSpacing:'0.06em', textTransform:'uppercase', fontWeight:600 }}>Total Streak</span>
              </div>
              <div className="habit-glass" style={{ padding:'12px 18px', borderRadius:14, display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
                <span style={{ fontSize:26, fontWeight:800, color:'#34D399', lineHeight:1, textShadow:'0 0 20px rgba(52,211,153,0.5)' }}>{weeklyRate}%</span>
                <span style={{ fontSize:11, color:'rgba(255,255,255,0.55)', letterSpacing:'0.06em', textTransform:'uppercase', fontWeight:600 }}>Weekly Rate</span>
              </div>
              <div className="habit-glass" style={{ padding:'12px 18px', borderRadius:14, display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
                <span style={{ fontSize:26, fontWeight:800, color:'#fff', lineHeight:1 }}>{todayDone}/{habits.length}</span>
                <span style={{ fontSize:11, color:'rgba(255,255,255,0.55)', letterSpacing:'0.06em', textTransform:'uppercase', fontWeight:600 }}>Done Today</span>
              </div>

              <button
                onClick={() => openQuickAdd('habit')}
                style={{
                  background:'#fff', color:'#4343D5', padding:'0 20px', height:56, borderRadius:14,
                  border:'none', fontWeight:700, fontSize:14, display:'flex', alignItems:'center', gap:8,
                  cursor:'pointer', boxShadow:'0 8px 24px rgba(0,0,0,0.18)', transition:'transform 0.2s'
                }}
                onMouseEnter={e => e.currentTarget.style.transform='scale(1.05)'}
                onMouseLeave={e => e.currentTarget.style.transform='scale(1)'}
              >
                <Plus size={18} /> New Habit
              </button>
            </div>
          </div>

          {/* AI Insight embedded in hero */}
          <div className="habit-glass" style={{
            padding:'16px 20px', borderRadius:16,
            background:'rgba(255,255,255,0.09)', border:'1px solid rgba(255,255,255,0.22)',
            display:'flex', alignItems:'center', gap:14, flexWrap:'wrap'
          }}>
            <div style={{
              width:38, height:38, borderRadius:11, flexShrink:0,
              background:'linear-gradient(135deg, #F59E0B, #EF4444, #9A5CFF)',
              display:'flex', alignItems:'center', justifyContent:'center',
              boxShadow:'0 0 20px rgba(245,158,11,0.4)'
            }}>
              <AiCreativeIcon size={18} color="#fff" />
            </div>
            <div>
              <div style={{ fontSize:11, fontWeight:800, color:'rgba(255,255,255,0.7)', letterSpacing:'0.07em', textTransform:'uppercase', marginBottom:3 }}>Habit Intelligence</div>
              <p style={{ fontSize:14, color:'rgba(255,255,255,0.88)', fontWeight:500, lineHeight:1.45, margin:0 }}>
                Your morning learning session is most consistent on <strong style={{ color:'#FBBF24' }}>Mon, Wed & Fri</strong> after meditation. Weekly consistency is at <strong style={{ color:'#34D399' }}>86%</strong> — up 4% from last week!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Habits Grid ──────────────────────────────────────────── */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(420px, 1fr))', gap:20 }}>
        {habits.map((habit, idx) => {
          const isDoneToday = !!habit.completionHistory?.[TODAY];
          const color = habit.color || '#4343D5';
          const isExpanded = activeHabit === habit.id;

          return (
            <div
              key={habit.id}
              className="habit-card"
              onClick={() => setActiveHabit(isExpanded ? null : habit.id)}
              style={{ animation:`slideInUp 0.35s ease forwards ${idx * 0.06}s` }}
            >
              {/* Color strip */}
              <div style={{ height:5, background:`linear-gradient(90deg, ${color}, ${color}66)` }} />

              <div style={{ padding:'22px 24px', display:'flex', flexDirection:'column', gap:18 }}>
                {/* Top Row: Icon + Name + Streak + CTA */}
                <div style={{ display:'flex', alignItems:'center', gap:14 }}>
                  {/* Icon */}
                  <div style={{
                    width:48, height:48, borderRadius:14, flexShrink:0,
                    background:`${color}18`, color,
                    display:'flex', alignItems:'center', justifyContent:'center',
                    boxShadow:`0 4px 14px ${color}22`
                  }}>
                    {getIcon(habit.icon, 22)}
                  </div>

                  {/* Name + Meta */}
                  <div style={{ flex:1, minWidth:0 }}>
                    <h3 style={{ fontSize:17, fontWeight:800, letterSpacing:'-0.02em', color:'var(--ink)', margin:'0 0 4px', lineHeight:1.2 }}>
                      {habit.name}
                    </h3>
                    <div style={{ fontSize:12, color:'var(--text-tertiary)', fontWeight:500 }}>
                      {habit.category} · {habit.frequency}
                      {habit.reminderTime && <span> · ⏰ {habit.reminderTime}</span>}
                    </div>
                  </div>

                  {/* Streak ring */}
                  <StreakRing streak={habit.streak || 0} max={habit.longestStreak || 30} color={color} />
                </div>

                {/* 7-Day Calendar Dots */}
                <div>
                  <div style={{ fontSize:11, fontWeight:700, color:'var(--text-tertiary)', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:10 }}>
                    This Week
                  </div>
                  <div style={{ display:'grid', gridTemplateColumns:'repeat(7, 1fr)', gap:6 }}>
                    {PAST_DATES.map((dateStr, dayIdx) => {
                      const done = !!habit.completionHistory?.[dateStr];
                      const isToday = dateStr === TODAY;
                      return (
                        <div
                          key={dateStr}
                          className="day-dot"
                          onClick={e => { e.stopPropagation(); handleToggleDay(habit.id, dateStr); }}
                          style={{
                            background: done ? `${color}12` : isToday ? 'rgba(0,0,0,0.02)' : 'transparent',
                            border: isToday ? `1.5px solid ${color}` : '1.5px solid transparent',
                          }}
                        >
                          <span style={{ fontSize:10, fontWeight:700, color: isToday ? color : 'var(--text-tertiary)' }}>
                            {DAY_LABELS[dayIdx]}
                          </span>
                          <div
                            className={`dot-circle ${done ? 'done' : ''}`}
                            style={{
                              background: done ? color : 'var(--surface-soft, #F4F2F0)',
                              border: done ? 'none' : '1.5px solid var(--outline-soft, rgba(0,0,0,0.1))',
                              boxShadow: done ? `0 2px 8px ${color}44` : 'none',
                              color: done ? '#fff' : 'var(--text-tertiary)'
                            }}
                          >
                            {done ? '✓' : ''}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Bottom: Best streak + CTA */}
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:10 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                    <Trophy size={14} color="#F59E0B" />
                    <span style={{ fontSize:12, color:'var(--text-tertiary)', fontWeight:600 }}>
                      Best: <strong style={{ color: 'var(--ink)' }}>{habit.longestStreak}d</strong>
                    </span>
                  </div>

                  <button
                    className="mark-btn"
                    onClick={e => { e.stopPropagation(); handleToggleDay(habit.id, TODAY); }}
                    style={{
                      background: isDoneToday ? `${color}15` : color,
                      color: isDoneToday ? color : '#fff',
                      border: isDoneToday ? `1.5px solid ${color}40` : 'none',
                      boxShadow: isDoneToday ? 'none' : `0 4px 12px ${color}44`,
                    }}
                  >
                    {isDoneToday
                      ? <><CheckCircle2 size={15} /> Done Today</>
                      : <><Circle size={15} /> Mark Done</>}
                  </button>
                </div>

                {/* AI Insight Row */}
                {habit.aiInsight && (
                  <div className="ai-insight-chip">
                    <div style={{
                      width:26, height:26, borderRadius:8, flexShrink:0,
                      background:'linear-gradient(135deg, #9A5CFF, #4343D5)',
                      display:'flex', alignItems:'center', justifyContent:'center',
                      boxShadow:'0 2px 8px rgba(154,92,255,0.35)'
                    }}>
                      <AiCreativeIcon size={13} color="#fff" />
                    </div>
                    <span style={{ fontSize:12.5, color:'#312E81', lineHeight:1.5, fontWeight:600 }}>
                      {habit.aiInsight}
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Empty State */}
        {habits.length === 0 && (
          <div style={{ gridColumn:'1/-1', textAlign:'center', padding:'80px 20px' }}>
            <div style={{
              width:80, height:80, borderRadius:'50%',
              background:'linear-gradient(135deg, rgba(154,92,255,0.12), rgba(67,67,213,0.12))',
              display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px'
            }}>
              <Repeat size={34} color="#9A5CFF" />
            </div>
            <h3 style={{ fontSize:18, fontWeight:700, marginBottom:8 }}>No Habits Yet</h3>
            <p style={{ fontSize:14, color:'var(--text-tertiary)', maxWidth:300, margin:'0 auto 20px' }}>
              Start building powerful routines. Click below to track your first habit!
            </p>
            <button
              onClick={() => openQuickAdd('habit')}
              style={{
                padding:'12px 28px', borderRadius:14, border:'none', fontWeight:700, fontSize:14,
                background:'linear-gradient(135deg, #9A5CFF, #4343D5)',
                color:'#fff', cursor:'pointer', boxShadow:'0 6px 20px rgba(154,92,255,0.35)'
              }}
            >
              Add First Habit
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
