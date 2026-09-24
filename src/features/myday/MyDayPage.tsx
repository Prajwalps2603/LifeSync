import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { store, taskService, habitService } from '../../services';
import {
  Sun, Moon, Sunrise, CheckCircle2, Circle, Clock,
  RefreshCw, Check, Calendar, ArrowRight, ShieldCheck, Flame
} from 'lucide-react';
import { AiCreativeIcon } from '../../components/icons/AiCreativeIcon';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

export const MyDayPage: React.FC = () => {
  const { openQuickAdd, showToast, triggerConfetti } = useApp();
  const [planAccepted, setPlanAccepted] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);

  const tasks = store.tasks;
  const habits = store.habits;
  const events = store.calendarEvents;

  // Split tasks & events into Morning / Afternoon / Evening
  const morningItems = [
    { type: 'habit', title: 'Morning Deep Learning Session', time: '08:00 AM', category: 'Learning', done: true },
    { type: 'task', id: 'task-1', title: 'Learn Spring Boot REST Architecture & JPA', time: '08:30 AM - 10:30 AM', priority: 'high', done: false },
    { type: 'event', title: 'Screening Interview @ TechCorp', time: '11:00 AM - 11:45 AM', location: 'Google Meet', done: false },
  ];

  const afternoonItems = [
    { type: 'habit', title: 'Lunch & 20m Nature Walk', time: '12:30 PM', category: 'Health', done: true },
    { type: 'task', id: 'task-2', title: 'Follow up with HR at Stripe & Google', time: '02:30 PM', priority: 'urgent', done: false },
    { type: 'task', id: 'task-3', title: 'Update Portfolio case study for LifeSync', time: '04:00 PM', priority: 'medium', done: false },
  ];

  const eveningItems = [
    { type: 'habit', title: 'Outdoor Running or Cardio Session (8km)', time: '06:30 PM', category: 'Health', done: false },
    { type: 'habit', title: 'Read 30 Pages of Book', time: '09:30 PM', category: 'Productivity', done: false },
  ];

  const allItemsCount = morningItems.length + afternoonItems.length + eveningItems.length;
  const completedCount = 3; // morning habit + lunch walk + 1 other
  const completionPercent = Math.round((completedCount / allItemsCount) * 100);

  const handleToggleTask = async (id: string) => {
    const updated = await taskService.toggleTask(id);
    if (updated.status === 'completed') {
      triggerConfetti();
      showToast('Completed item!', 'success');
    }
  };

  const handleAcceptPlan = () => {
    setPlanAccepted(true);
    triggerConfetti();
    showToast('AI Daily Plan accepted and synced to your schedule!', 'success');
  };

  const handleRegeneratePlan = () => {
    setIsRegenerating(true);
    setTimeout(() => {
      setIsRegenerating(false);
      showToast('Daily plan refreshed with latest calendar constraints!', 'info');
    }, 600);
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div className="page-header" style={{ marginBottom: 0 }}>
        <div className="page-title-group">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <Sun size={24} color="#EA580C" />
            <h1>My Day</h1>
          </div>
          <p style={{ color: 'var(--text-secondary)' }}>
            Tuesday, August 30, 2026 · Daily Command Center
          </p>
        </div>
        <div className="page-actions">
          <Button variant="primary" size="sm" icon={<AiCreativeIcon size={14} />} onClick={() => openQuickAdd('task')}>
            Add to My Day
          </Button>
        </div>
      </div>

      {/* Daily Progress Bar */}
      <div className="card" style={{ padding: '16px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 700 }}>Today's Completion Progress</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--primary)' }}>{completionPercent}%</span>
        </div>
        <div className="progress-bar-bg">
          <div className="progress-bar-fill" style={{ width: `${completionPercent}%` }} />
        </div>
      </div>

      {/* AI Daily Plan Card */}
      <div className="ai-card" style={{ padding: '20px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div className="ai-pill"><AiCreativeIcon size={12} /> AI Daily Optimization</div>
            {planAccepted && <Badge variant="success"><Check size={12} /> Plan Active</Badge>}
          </div>
          <Button
            variant="ghost"
            size="sm"
            icon={<RefreshCw size={13} className={isRegenerating ? 'animate-spin' : ''} />}
            onClick={handleRegeneratePlan}
          >
            Regenerate
          </Button>
        </div>

        <p style={{ fontSize: 15, color: 'var(--text-primary)', lineHeight: 1.6, marginBottom: 14 }}>
          Based on your career goals and screening interview at 11:00 AM, I recommend dedicating your 8:30–10:30 AM window to deep Spring Boot review, and scheduling batch emails for the 2:30 PM low-energy dip.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 10, marginBottom: 16 }}>
          <div style={{ background: 'var(--surface-white)', padding: '10px 14px', borderRadius: 'var(--radius-sm)', fontSize: 13, border: '1px solid var(--outline-subtle)' }}>
            🎯 <strong>Block 2h:</strong> Spring Boot Deep Dive
          </div>
          <div style={{ background: 'var(--surface-white)', padding: '10px 14px', borderRadius: 'var(--radius-sm)', fontSize: 13, border: '1px solid var(--outline-subtle)' }}>
            🌿 <strong>Take 20m walk:</strong> After interview
          </div>
          <div style={{ background: 'var(--surface-white)', padding: '10px 14px', borderRadius: 'var(--radius-sm)', fontSize: 13, border: '1px solid var(--outline-subtle)' }}>
            ✉️ <strong>Batch emails:</strong> 2:30 PM recruiter outreach
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          {!planAccepted ? (
            <Button variant="primary" size="sm" icon={<Check size={14} />} onClick={handleAcceptPlan}>
              Accept Plan
            </Button>
          ) : (
            <Button variant="secondary" size="sm" icon={<ShieldCheck size={14} color="var(--success)" />} disabled>
              Plan Synced with Timeline
            </Button>
          )}
        </div>
      </div>

      {/* Time-Divided Sections: Morning, Afternoon, Evening */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* Morning */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <Sunrise size={18} color="#EA580C" />
            <h3 style={{ fontSize: 16, fontWeight: 700 }}>Morning (8:00 AM – 12:00 PM)</h3>
            <span className="badge badge-primary" style={{ marginLeft: 'auto', fontSize: 11 }}>Peak Focus</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {morningItems.map((item, idx) => (
              <div
                key={idx}
                style={{
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--surface-soft)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12
                }}
              >
                <button
                  onClick={() => item.id && handleToggleTask(item.id)}
                  style={{ color: item.done ? 'var(--success)' : 'var(--text-tertiary)' }}
                >
                  {item.done ? <CheckCircle2 size={18} /> : <Circle size={18} />}
                </button>
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: 14, fontWeight: 600, textDecoration: item.done ? 'line-through' : 'none', color: item.done ? 'var(--text-tertiary)' : 'var(--text-primary)' }}>
                    {item.title}
                  </span>
                  <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 2 }}>
                    {item.time} {item.location && `· ${item.location}`}
                  </div>
                </div>
                {item.priority && (
                  <Badge variant={item.priority === 'urgent' ? 'error' : item.priority === 'high' ? 'warning' : 'primary'}>
                    {item.priority}
                  </Badge>
                )}
                {item.category && <Badge variant="neutral">{item.category}</Badge>}
              </div>
            ))}
          </div>
        </div>

        {/* Afternoon */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <Sun size={18} color="#D97706" />
            <h3 style={{ fontSize: 16, fontWeight: 700 }}>Afternoon (12:00 PM – 5:00 PM)</h3>
            <span className="badge badge-neutral" style={{ marginLeft: 'auto', fontSize: 11 }}>Execution & Outreach</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {afternoonItems.map((item, idx) => (
              <div
                key={idx}
                style={{
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--surface-soft)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12
                }}
              >
                <button
                  onClick={() => item.id && handleToggleTask(item.id)}
                  style={{ color: item.done ? 'var(--success)' : 'var(--text-tertiary)' }}
                >
                  {item.done ? <CheckCircle2 size={18} /> : <Circle size={18} />}
                </button>
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: 14, fontWeight: 600, textDecoration: item.done ? 'line-through' : 'none', color: item.done ? 'var(--text-tertiary)' : 'var(--text-primary)' }}>
                    {item.title}
                  </span>
                  <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 2 }}>
                    {item.time}
                  </div>
                </div>
                {item.priority && (
                  <Badge variant={item.priority === 'urgent' ? 'error' : item.priority === 'high' ? 'warning' : 'primary'}>
                    {item.priority}
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Evening */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <Moon size={18} color="#8B5CF6" />
            <h3 style={{ fontSize: 16, fontWeight: 700 }}>Evening (5:00 PM – 10:00 PM)</h3>
            <span className="badge badge-neutral" style={{ marginLeft: 'auto', fontSize: 11 }}>Recovery & Habits</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {eveningItems.map((item, idx) => (
              <div
                key={idx}
                style={{
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--surface-soft)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12
                }}
              >
                <button style={{ color: item.done ? 'var(--success)' : 'var(--text-tertiary)' }}>
                  {item.done ? <CheckCircle2 size={18} /> : <Circle size={18} />}
                </button>
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: 14, fontWeight: 600 }}>{item.title}</span>
                  <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 2 }}>
                    {item.time}
                  </div>
                </div>
                <Badge variant="neutral">{item.category}</Badge>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
