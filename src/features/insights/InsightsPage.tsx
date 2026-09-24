import React, { useState } from 'react';
import { store } from '../../services';
import {
  TrendingUp, Target, Flame, BarChart3, Zap,
  Clock, CheckSquare, BrainCircuit
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, AreaChart, Area, RadarChart, PolarGrid,
  PolarAngleAxis, Radar
} from 'recharts';

/* ── Custom AI Icon ───────────────────────────────────────────────── */
const AiIcon: React.FC<{ size?: number; color?: string }> = ({ size = 16, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M13 2L4.5 13.5H11L10 22L20.5 9.5H14L13 2Z"
      fill={color}
      stroke={color}
      strokeWidth="0.5"
      strokeLinejoin="round"
    />
  </svg>
);

/* ── Stat chip ────────────────────────────────────────────────────── */
const StatChip: React.FC<{ label: string; value: string | number; color: string; icon: React.ReactNode }> = ({
  label, value, color, icon
}) => (
  <div style={{
    flex: '1 1 160px', borderRadius: 16, padding: '18px 20px',
    background: '#fff', border: '1px solid var(--outline-subtle)',
    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
    display: 'flex', flexDirection: 'column', gap: 10
  }}>
    <div style={{
      width: 36, height: 36, borderRadius: 10,
      background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      {icon}
    </div>
    <div>
      <div style={{ fontSize: 26, fontWeight: 800, color, lineHeight: 1, letterSpacing: '-0.03em' }}>{value}</div>
      <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 3, fontWeight: 500 }}>{label}</div>
    </div>
  </div>
);

/* ── Custom Tooltip ───────────────────────────────────────────────── */
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div style={{
        background: '#fff', borderRadius: 10, padding: '10px 14px',
        border: '1px solid var(--outline-subtle)', boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
        fontSize: 12
      }}>
        <div style={{ fontWeight: 700, marginBottom: 4 }}>{label}</div>
        {payload.map((p: any) => (
          <div key={p.dataKey} style={{ color: p.color }}>
            {p.name}: <strong>{p.value}</strong>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

/* ─────────────────────────────────────────────────────────────────── */
export const InsightsPage: React.FC = () => {
  const insights = store.insights;
  const goals    = store.goals;
  const habits   = store.habits;
  const [activeChart, setActiveChart] = useState<'bar' | 'area'>('bar');

  const weeklyFocusData = [
    { day: 'Mon', hours: 4.5, tasks: 5 },
    { day: 'Tue', hours: 5.2, tasks: 6 },
    { day: 'Wed', hours: 3.8, tasks: 4 },
    { day: 'Thu', hours: 6.0, tasks: 7 },
    { day: 'Fri', hours: 4.2, tasks: 4 },
    { day: 'Sat', hours: 2.5, tasks: 2 },
    { day: 'Sun', hours: 3.0, tasks: 3 },
  ];

  const radarData = [
    { subject: 'Focus',       A: 85 },
    { subject: 'Habits',      A: 72 },
    { subject: 'Goals',       A: 64 },
    { subject: 'Energy',      A: 78 },
    { subject: 'Balance',     A: 60 },
    { subject: 'Learning',    A: 80 },
  ];

  const insightGradients: Record<string, { bg: string; border: string; pill: string; dot: string }> = {
    'Productivity': { bg: 'linear-gradient(135deg,#EFF6FF,#DBEAFE)', border: '#BFDBFE', pill: '#1D4ED8', dot: '#3B82F6' },
    'Sleep':        { bg: 'linear-gradient(135deg,#F5F3FF,#EDE9FE)', border: '#DDD6FE', pill: '#6D28D9', dot: '#8B5CF6' },
    'Habits':       { bg: 'linear-gradient(135deg,#ECFDF5,#D1FAE5)', border: '#A7F3D0', pill: '#065F46', dot: '#10B981' },
    'Wellness':     { bg: 'linear-gradient(135deg,#FFF7ED,#FFEDD5)', border: '#FED7AA', pill: '#9A3412', dot: '#F97316' },
    'Goals':        { bg: 'linear-gradient(135deg,#F0EEFF,#E8E4FF)', border: '#C4B5FD', pill: '#4343D5', dot: '#6366F1' },
  };

  const totalHours = weeklyFocusData.reduce((s, d) => s + d.hours, 0).toFixed(1);
  const avgHours   = (weeklyFocusData.reduce((s, d) => s + d.hours, 0) / 7).toFixed(1);
  const topDay     = weeklyFocusData.reduce((a, b) => a.hours > b.hours ? a : b).day;
  const avgGoal    = goals.length > 0 ? Math.round(goals.reduce((s, g) => s + g.progress, 0) / goals.length) : 0;

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>

      {/* ── Hero Header ──────────────────────────────────── */}
      <div style={{
        borderRadius: 20, padding: '28px 28px 24px',
        background: 'linear-gradient(135deg, #0B0B22 0%, #101034 45%, #0E1A38 100%)',
        position: 'relative', overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', top: -60, right: -60, width: 280, height: 280, borderRadius: '50%', background: 'rgba(99,102,241,0.15)', filter: 'blur(55px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -30, left: 100, width: 180, height: 180, borderRadius: '50%', background: 'rgba(16,185,129,0.12)', filter: 'blur(40px)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: 'linear-gradient(135deg, #4343D5, #10B981)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 14px rgba(67,67,213,0.4)'
              }}>
                <BarChart3 size={18} color="#fff" />
              </div>
              <h1 style={{ fontSize: 24, fontWeight: 800, color: '#fff', letterSpacing: '-0.03em' }}>Life Insights</h1>
            </div>
            <p style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.5)', maxWidth: 440 }}>
              Holistic analytics linking your daily habits, productivity, and long-term goals.
            </p>
          </div>

          {/* AI summary chip */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px',
            background: 'rgba(255,255,255,0.07)', borderRadius: 12,
            border: '1px solid rgba(255,255,255,0.1)'
          }}>
            <div style={{
              width: 28, height: 28, borderRadius: 8,
              background: 'linear-gradient(135deg, #4343D5, #8B5CF6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <AiIcon size={14} color="#fff" />
            </div>
            <div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Weekly Summary</div>
              <div style={{ fontSize: 13, color: '#fff', fontWeight: 600 }}>{totalHours} hrs focused · {topDay} peak</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Stat Row ──────────────────────────────────────── */}
      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
        <StatChip label="Weekly Focus Hours" value={`${totalHours}h`} color="#4343D5" icon={<Clock size={16} color="#4343D5" />} />
        <StatChip label="Daily Average" value={`${avgHours}h`} color="#8B5CF6" icon={<TrendingUp size={16} color="#8B5CF6" />} />
        <StatChip label="Goals Progress" value={`${avgGoal}%`} color="#059669" icon={<Target size={16} color="#059669" />} />
        <StatChip label="Active Habits" value={habits.length} color="#D97706" icon={<Flame size={16} color="#D97706" />} />
        <StatChip label="AI Insights" value={insights.length} color="#7C3AED" icon={<AiIcon size={16} color="#7C3AED" />} />
      </div>

      {/* ── AI Insights Cards ──────────────────────────────── */}
      <div>
        <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text-tertiary)', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
          <AiIcon size={12} color="var(--text-tertiary)" />AI Observations
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 14 }}>
          {insights.map(ins => {
            const g = insightGradients[ins.category] ?? insightGradients['Goals'];
            return (
              <div key={ins.id} style={{
                borderRadius: 16, overflow: 'hidden',
                background: '#fff', border: '1px solid var(--outline-subtle)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                transition: 'box-shadow 0.18s ease',
              }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)'}
                onMouseLeave={e => e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)'}
              >
                {/* color header */}
                <div style={{ padding: '14px 16px 12px', background: g.bg, borderBottom: `1px solid ${g.border}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                      <div style={{
                        width: 22, height: 22, borderRadius: 6,
                        background: `${g.dot}22`, display: 'flex', alignItems: 'center', justifyContent: 'center'
                      }}>
                        <AiIcon size={11} color={g.dot} />
                      </div>
                      <span style={{ fontSize: 11, fontWeight: 700, color: g.pill, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                        {ins.category}
                      </span>
                    </div>
                    <span style={{ fontSize: 10.5, color: 'var(--text-tertiary)' }}>{ins.timestamp}</span>
                  </div>
                </div>

                {/* body */}
                <div style={{ padding: '14px 16px' }}>
                  <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 6, letterSpacing: '-0.01em' }}>{ins.title}</h3>
                  <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', lineHeight: 1.55 }}>{ins.message}</p>
                  {ins.actionLabel && (
                    <div style={{ marginTop: 12 }}>
                      <span style={{
                        fontSize: 12, color: g.dot, fontWeight: 700, cursor: 'pointer',
                        display: 'inline-flex', alignItems: 'center', gap: 4
                      }}>
                        {ins.actionLabel} <span style={{ fontSize: 14 }}>→</span>
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Focus Chart ───────────────────────────────────── */}
      <div style={{ borderRadius: 18, padding: '22px 22px 16px', background: '#fff', border: '1px solid var(--outline-subtle)', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20, flexWrap: 'wrap', gap: 10 }}>
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 3 }}>Weekly Deep Focus Hours</h3>
            <p style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>Peak focus: 8:00 AM – 11:30 AM</p>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {(['bar', 'area'] as const).map(type => (
              <button
                key={type}
                onClick={() => setActiveChart(type)}
                style={{
                  padding: '5px 12px', borderRadius: 8, border: 'none', cursor: 'pointer',
                  fontSize: 12, fontWeight: 600,
                  background: activeChart === type ? '#4343D5' : 'var(--surface-soft)',
                  color: activeChart === type ? '#fff' : 'var(--text-tertiary)',
                  transition: 'all 0.15s ease'
                }}
              >
                {type === 'bar' ? '◫ Bar' : '⌇ Area'}
              </button>
            ))}
          </div>
        </div>

        <div style={{ height: 240 }}>
          <ResponsiveContainer width="100%" height="100%">
            {activeChart === 'bar' ? (
              <BarChart data={weeklyFocusData} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--outline-subtle)" vertical={false} />
                <XAxis dataKey="day" stroke="var(--text-tertiary)" fontSize={11} axisLine={false} tickLine={false} />
                <YAxis stroke="var(--text-tertiary)" fontSize={11} unit="h" axisLine={false} tickLine={false} width={36} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="hours" name="Hours" fill="url(#barGradient)" radius={[6, 6, 0, 0]} />
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4343D5" />
                    <stop offset="100%" stopColor="#8B5CF6" />
                  </linearGradient>
                </defs>
              </BarChart>
            ) : (
              <AreaChart data={weeklyFocusData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--outline-subtle)" vertical={false} />
                <XAxis dataKey="day" stroke="var(--text-tertiary)" fontSize={11} axisLine={false} tickLine={false} />
                <YAxis stroke="var(--text-tertiary)" fontSize={11} unit="h" axisLine={false} tickLine={false} width={36} />
                <Tooltip content={<CustomTooltip />} />
                <defs>
                  <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4343D5" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#4343D5" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="hours" name="Hours" stroke="#4343D5" strokeWidth={2.5} fill="url(#areaGradient)" dot={{ fill: '#4343D5', r: 4 }} />
              </AreaChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Goal Velocity + Radar + Habits ────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>

        {/* Goal Velocity */}
        <div style={{ borderRadius: 18, padding: 22, background: '#fff', border: '1px solid var(--outline-subtle)', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
            <div style={{ width: 30, height: 30, borderRadius: 9, background: '#E1E0FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Target size={14} color="#4343D5" />
            </div>
            <h3 style={{ fontSize: 15, fontWeight: 700 }}>Goal Velocity</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {goals.map(g => (
              <div key={g.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, marginBottom: 5 }}>
                  <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{g.name}</span>
                  <span style={{ fontWeight: 700, color: g.progress >= 70 ? '#059669' : g.status === 'behind' ? '#D97706' : '#4343D5' }}>{g.progress}%</span>
                </div>
                <div style={{ height: 5, borderRadius: 99, background: 'var(--surface-soft)', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', width: `${g.progress}%`, borderRadius: 99,
                    background: g.progress >= 70 ? 'linear-gradient(90deg,#059669,#10B981)' : g.status === 'behind' ? 'linear-gradient(90deg,#D97706,#FBBF24)' : 'linear-gradient(90deg,#4343D5,#8B5CF6)',
                    transition: 'width 0.7s cubic-bezier(0.16,1,0.3,1)'
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Life Balance Radar */}
        <div style={{ borderRadius: 18, padding: 22, background: '#fff', border: '1px solid var(--outline-subtle)', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <div style={{ width: 30, height: 30, borderRadius: 9, background: '#F3E8FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <BrainCircuit size={14} color="#7C3AED" />
            </div>
            <h3 style={{ fontSize: 15, fontWeight: 700 }}>Life Balance Score</h3>
          </div>
          <div style={{ height: 210 }}>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData} outerRadius="70%">
                <PolarGrid stroke="var(--outline-subtle)" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: 'var(--text-tertiary)' }} />
                <Radar name="You" dataKey="A" stroke="#7C3AED" fill="#7C3AED" fillOpacity={0.18} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Habits */}
        <div style={{ borderRadius: 18, padding: 22, background: '#fff', border: '1px solid var(--outline-subtle)', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
            <div style={{ width: 30, height: 30, borderRadius: 9, background: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Flame size={14} color="#D97706" />
            </div>
            <h3 style={{ fontSize: 15, fontWeight: 700 }}>Habit Consistency</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {habits.map(h => {
              const pct = Math.min(100, Math.round((h.streak / 30) * 100));
              return (
                <div key={h.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                    <span style={{ fontSize: 12.5, fontWeight: 600 }}>{h.name}</span>
                    <span style={{ fontSize: 11.5, fontWeight: 700, color: '#D97706' }}>🔥 {h.streak}d</span>
                  </div>
                  <div style={{ height: 5, borderRadius: 99, background: 'var(--surface-soft)', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%', width: `${pct}%`, borderRadius: 99,
                      background: 'linear-gradient(90deg,#D97706,#FBBF24)',
                      transition: 'width 0.7s cubic-bezier(0.16,1,0.3,1)'
                    }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
