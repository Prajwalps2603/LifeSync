import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { store, taskService } from '../../services';
import {
  CheckSquare, Sun, Target, Repeat, Calendar as CalIcon,
  Layers, ArrowRight, Bookmark, Clock, Flame, ChevronRight,
  TrendingUp, CheckCircle2, Circle
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { AiCreativeIcon } from '../../components/icons/AiCreativeIcon';
import { Badge } from '../../components/ui/Badge';

export const HomeDashboard: React.FC = () => {
  const { openQuickAdd, showToast, triggerConfetti, refreshKey } = useApp();
  const navigate = useNavigate();

  const [aiDismissed, setAiDismissed] = useState(false);
  const [proactiveDismissed, setProactiveDismissed] = useState(false);

  const tasks = store.tasks;
  const projects = store.projects;
  const goals = store.goals;
  const habits = store.habits;
  const memories = store.memories;
  const calendarEvents = store.calendarEvents;
  const pages = store.pages;

  const todayTasks = tasks.filter(t => t.status !== 'completed').slice(0, 4);
  const completedToday = tasks.filter(t => t.status === 'completed').length;
  const activeHabitsDoneCount = habits.filter(h => !!h.completionHistory['2026-08-30']).length;

  const handleToggleTask = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = await taskService.toggleTask(id);
    if (updated.status === 'completed') {
      triggerConfetti();
      showToast('Task completed! Great progress.', 'success');
    } else {
      showToast('Task marked incomplete.', 'info');
    }
  };

  const handleBreakDownTask = async () => {
    await taskService.createTask({
      title: 'Update Portfolio: Select top 3 projects',
      status: 'todo',
      priority: 'medium',
      dueDate: '2026-08-31',
      tags: ['Portfolio', 'Design'],
      estimatedMinutes: 15
    });
    await taskService.createTask({
      title: 'Update Portfolio: Write LifeSync architecture summary',
      status: 'todo',
      priority: 'high',
      dueDate: '2026-08-31',
      tags: ['Portfolio', 'Architecture'],
      estimatedMinutes: 15
    });
    setProactiveDismissed(true);
    triggerConfetti();
    showToast('AI broke down the task into 15m actionable steps!', 'success');
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      {/* Greeting Header */}
      <div className="page-header" style={{ marginBottom: 0 }}>
        <div className="page-title-group">
          <h1>Good morning, Prajwal</h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Here’s what’s happening in your connected life today.
          </p>
        </div>
        <div className="page-actions">
          <Button variant="ghost" size="sm" icon={<Sun size={15} />} onClick={() => navigate('/my-day')}>
            View My Day
          </Button>
          <Button variant="primary" size="sm" icon={<AiCreativeIcon size={14} />} onClick={() => openQuickAdd('natural')}>
            Tell LifeSync
          </Button>
        </div>
      </div>

      {/* Morning Clarity Card (AI Insight) */}
      {!aiDismissed && (
        <div className="ai-card" style={{ padding: '20px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div className="ai-pill">
                <AiCreativeIcon size={13} /> Morning Clarity
              </div>
              <span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>Contextual Intelligence</span>
            </div>
            <button
              onClick={() => setAiDismissed(true)}
              style={{ fontSize: 12, color: 'var(--text-tertiary)', background: 'none', border: 'none' }}
            >
              Dismiss
            </button>
          </div>
          <p style={{ fontSize: 15, color: 'var(--text-primary)', lineHeight: 1.6, marginBottom: 16 }}>
            You have a busy afternoon with recruiter outreach, but your morning is relatively clear between 8:30 AM and 11:00 AM. Consider completing your highest-priority Spring Boot REST module before lunch.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Button
              variant="primary"
              size="sm"
              icon={<CalIcon size={14} />}
              onClick={() => navigate('/calendar')}
            >
              View Schedule Timeline
            </Button>
            <Button
              variant="ghost"
              size="sm"
              icon={<AiCreativeIcon size={14} />}
              onClick={() => navigate('/ai')}
            >
              Ask AI Companion
            </Button>
          </div>
        </div>
      )}

      {/* Summary Stat Cards Grid */}
      <div className="grid-4">
        {/* Tasks Due Today */}
        <div className="card card-interactive" onClick={() => navigate('/tasks')}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500 }}>Tasks Due Today</span>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: 'var(--primary-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckSquare size={15} color="var(--primary)" />
            </div>
          </div>
          <div style={{ fontSize: 26, fontWeight: 800, fontFamily: 'var(--font-heading)' }}>
            {todayTasks.length} <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-tertiary)' }}>pending</span>
          </div>
          <div style={{ fontSize: 12, color: 'var(--success)', marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
            <CheckCircle2 size={12} /> {completedToday} completed today
          </div>
        </div>

        {/* Next Scheduled Event */}
        <div className="card card-interactive" onClick={() => navigate('/calendar')}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500 }}>Next Up</span>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: '#E0F2FE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Clock size={15} color="#0284C7" />
            </div>
          </div>
          <div style={{ fontSize: 18, fontWeight: 700, fontFamily: 'var(--font-heading)' }} className="truncate">
            11:00 AM Screening
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 4 }} className="truncate">
            TechCorp Lead Interview
          </div>
        </div>

        {/* Habit Streak */}
        <div className="card card-interactive" onClick={() => navigate('/habits')}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500 }}>Habits Progress</span>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Flame size={15} color="#D97706" />
            </div>
          </div>
          <div style={{ fontSize: 26, fontWeight: 800, fontFamily: 'var(--font-heading)' }}>
            {activeHabitsDoneCount} / {habits.length}
          </div>
          <div style={{ fontSize: 12, color: '#D97706', marginTop: 4 }}>
            14-day study streak active 🔥
          </div>
        </div>

        {/* Active Goals */}
        <div className="card card-interactive" onClick={() => navigate('/goals')}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500 }}>Primary Goal</span>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: '#E6F6ED', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Target size={15} color="#059669" />
            </div>
          </div>
          <div style={{ fontSize: 26, fontWeight: 800, fontFamily: 'var(--font-heading)' }}>
            68% <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-tertiary)' }}>Full Stack</span>
          </div>
          <div style={{ fontSize: 12, color: '#059669', marginTop: 4 }}>
            Pacing 10 days ahead of schedule
          </div>
        </div>
      </div>

      {/* Main 2-Column Section */}
      <div className="grid-2" style={{ alignItems: 'start' }}>
        {/* Left Column: Priority Tasks */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
            <div>
              <h3 style={{ fontSize: 17, fontWeight: 700 }}>Priority Tasks</h3>
              <p style={{ fontSize: 13, color: 'var(--text-tertiary)' }}>High impact tasks scheduled for today</p>
            </div>
            <Button variant="ghost" size="sm" icon={<ArrowRight size={14} />} onClick={() => navigate('/tasks')}>
              All Tasks
            </Button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {todayTasks.map(task => (
              <div
                key={task.id}
                onClick={() => navigate('/tasks')}
                style={{
                  padding: '12px 14px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--surface-soft)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  cursor: 'pointer',
                  transition: 'background var(--transition-fast)'
                }}
              >
                <button
                  onClick={e => handleToggleTask(task.id, e)}
                  style={{ color: 'var(--text-tertiary)', padding: 2 }}
                >
                  <Circle size={18} />
                </button>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }} className="truncate">
                    {task.title}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                    <span style={{ fontSize: 12, color: task.projectColor || 'var(--primary)', fontWeight: 600 }}>
                      {task.projectName || 'General'}
                    </span>
                    {task.dueTime && (
                      <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>
                        · {task.dueTime}
                      </span>
                    )}
                  </div>
                </div>
                <Badge variant={task.priority === 'urgent' ? 'error' : task.priority === 'high' ? 'warning' : 'primary'}>
                  {task.priority}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Today's Timeline & Schedule */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
            <div>
              <h3 style={{ fontSize: 17, fontWeight: 700 }}>Today's Timeline</h3>
              <p style={{ fontSize: 13, color: 'var(--text-tertiary)' }}>Synced calendar, habits & focus blocks</p>
            </div>
            <Button variant="ghost" size="sm" icon={<CalIcon size={14} />} onClick={() => navigate('/calendar')}>
              Full Calendar
            </Button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, position: 'relative', paddingLeft: 12 }}>
            <div style={{
              position: 'absolute',
              left: 17,
              top: 10,
              bottom: 10,
              width: 2,
              background: 'var(--outline-subtle)'
            }} />

            {calendarEvents.slice(0, 4).map(evt => (
              <div key={evt.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 16, position: 'relative' }}>
                <div style={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  background: evt.color || 'var(--primary)',
                  marginTop: 4,
                  boxShadow: '0 0 0 3px var(--surface-white)'
                }} />
                <div style={{
                  flex: 1,
                  background: 'var(--surface-soft)',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-sm)',
                  borderLeft: `3px solid ${evt.color || 'var(--primary)'}`
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{evt.title}</span>
                    <span style={{ fontSize: 11, color: 'var(--text-tertiary)', fontWeight: 600 }}>
                      {evt.start.split('T')[1]?.slice(0, 5)}
                    </span>
                  </div>
                  {evt.description && (
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>
                      {evt.description}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Proactive Card */}
      {!proactiveDismissed && (
        <div className="card" style={{
          background: 'linear-gradient(135deg, rgba(238, 237, 253, 0.7) 0%, rgba(255, 255, 255, 0.9) 100%)',
          border: '1px solid var(--primary-soft)'
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              flexShrink: 0
            }}>
              <AiCreativeIcon size={18} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{ fontWeight: 700, fontSize: 14 }}>LifeSync Proactive Suggestion</span>
                <span className="badge badge-primary">Pattern Detected</span>
              </div>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 14 }}>
                You've postponed "Update Portfolio case study" 3 times this week. Would you like me to break it down into two 15-minute micro-tasks so you can gain immediate momentum?
              </p>
              <div style={{ display: 'flex', gap: 10 }}>
                <Button variant="primary" size="sm" onClick={handleBreakDownTask}>
                  Yes, break it down
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setProactiveDismissed(true)}>
                  Dismiss
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Section: Recent Memories & Continue Where You Left Off */}
      <div className="grid-2">
        {/* Recent Memories */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <AiCreativeIcon size={16} color="#8B5CF6" />
              <h3 style={{ fontSize: 16, fontWeight: 700 }}>Recent Memories</h3>
            </div>
            <Button variant="ghost" size="sm" onClick={() => navigate('/memories')}>
              View All
            </Button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {memories.slice(0, 2).map(mem => (
              <div
                key={mem.id}
                onClick={() => navigate('/memories')}
                className="card-interactive"
                style={{
                  padding: '12px 14px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--surface-soft)',
                  border: '1px solid transparent'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 13, fontWeight: 700 }}>{mem.title}</span>
                  <span className="badge badge-neutral" style={{ fontSize: 11 }}>{mem.category}</span>
                </div>
                <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.4 }}>{mem.content}</p>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 6 }}>
                  Source: {mem.source}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Continue Where You Left Off */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Layers size={16} color="var(--primary)" />
              <h3 style={{ fontSize: 16, fontWeight: 700 }}>Continue Where You Left Off</h3>
            </div>
            <Button variant="ghost" size="sm" onClick={() => navigate('/workspace/pages')}>
              All Pages
            </Button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {pages.slice(0, 3).map(page => (
              <div
                key={page.id}
                onClick={() => navigate(`/workspace/pages/${page.id}`)}
                className="card-interactive"
                style={{
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--surface-soft)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 18 }}>{page.icon || '📄'}</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{page.title}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>Updated recently</div>
                  </div>
                </div>
                <ChevronRight size={16} color="var(--text-tertiary)" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
