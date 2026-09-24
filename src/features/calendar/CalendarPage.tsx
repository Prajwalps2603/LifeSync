import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { store, calendarService } from '../../services';
import { CalendarEvent } from '../../types';
import {
  Calendar as CalIcon, Plus, ChevronLeft, ChevronRight, Clock,
  CheckCircle2, MapPin, Layers, CheckSquare, Zap,
  Activity, CalendarDays, Trash2, Video, Tag, Check, X,
  ArrowRight, Compass
} from 'lucide-react';
import { AiCreativeIcon } from '../../components/icons/AiCreativeIcon';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import './Calendar.css';

export const CalendarPage: React.FC = () => {
  const { openQuickAdd, showToast, refreshKey } = useApp();
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');
  
  // Current view date state: defaulting to August 2026
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [selectedMonth, setSelectedMonth] = useState<number>(7); // 0-indexed: 7 is August
  const [selectedDateStr, setSelectedDateStr] = useState<string>('2026-08-30');
  
  // Category filter
  const [filterCategory, setFilterCategory] = useState<string>('all');
  
  // Selected event modal
  const [activeEvent, setActiveEvent] = useState<CalendarEvent | null>(null);

  const events = store.calendarEvents;
  const tasks = store.tasks;

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const monthName = months[selectedMonth];
  const formattedHeaderDate = `${monthName} ${selectedYear}`;

  /* ── Month Grid Computation ── */
  const firstDayOfMonth = new Date(selectedYear, selectedMonth, 1);
  const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
  
  // Sunday = 0, Monday = 1 ... map so Monday is 0
  const startDayOfWeek = (firstDayOfMonth.getDay() + 6) % 7; 
  
  // Previous month trailing days
  const daysInPrevMonth = new Date(selectedYear, selectedMonth, 0).getDate();
  const prevMonthDays = Array.from({ length: startDayOfWeek }, (_, i) => {
    const day = daysInPrevMonth - startDayOfWeek + i + 1;
    const m = selectedMonth === 0 ? 12 : selectedMonth;
    const y = selectedMonth === 0 ? selectedYear - 1 : selectedYear;
    const dateStr = `${y}-${String(m).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return { day, isCurrentMonth: false, dateStr };
  });

  // Current month days
  const currentMonthDays = Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;
    const m = selectedMonth + 1;
    const dateStr = `${selectedYear}-${String(m).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return { day, isCurrentMonth: true, dateStr };
  });

  // Next month leading days to complete grid (42 cells = 6 weeks)
  const totalCells = prevMonthDays.length + currentMonthDays.length;
  const nextMonthDaysCount = totalCells <= 35 ? 35 - totalCells : 42 - totalCells;
  const nextMonthDays = Array.from({ length: nextMonthDaysCount }, (_, i) => {
    const day = i + 1;
    const m = selectedMonth === 11 ? 1 : selectedMonth + 2;
    const y = selectedMonth === 11 ? selectedYear + 1 : selectedYear;
    const dateStr = `${y}-${String(m).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return { day, isCurrentMonth: false, dateStr };
  });

  const allGridDays = [...prevMonthDays, ...currentMonthDays, ...nextMonthDays];

  /* ── Event Navigation & Handlers ── */
  const handlePrevMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear(y => y - 1);
    } else {
      setSelectedMonth(m => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear(y => y + 1);
    } else {
      setSelectedMonth(m => m + 1);
    }
  };

  const handleJumpToToday = () => {
    setSelectedYear(2026);
    setSelectedMonth(7);
    setSelectedDateStr('2026-08-30');
  };

  const handleDeleteEvent = async (id: string) => {
    await calendarService.deleteEvent(id);
    setActiveEvent(null);
    showToast('Event removed from calendar', 'info');
  };

  const handleScheduleFreeWindow = async () => {
    await calendarService.createEvent({
      title: 'Focus Block: Update Portfolio Architecture',
      type: 'focus',
      start: '2026-08-30T14:00:00',
      end: '2026-08-30T16:00:00',
      color: '#4343D5',
      description: 'Scheduled into 2-hour afternoon free window by LifeSync AI.'
    });
    showToast('Scheduled focus block (2:00 PM - 4:00 PM)', 'success');
  };

  // Filter events
  const filteredEvents = events.filter(e => {
    if (filterCategory === 'all') return true;
    return e.type === filterCategory;
  });

  // Selected Day Events for the Inspector
  const selectedDayEvents = events.filter(e => e.start.startsWith(selectedDateStr));

  // Category counts
  const categoryCounts = {
    all: events.length,
    focus: events.filter(e => e.type === 'focus').length,
    event: events.filter(e => e.type === 'event').length,
    habit: events.filter(e => e.type === 'habit').length,
    task: events.filter(e => e.type === 'task').length,
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'focus': return <Zap size={10} />;
      case 'habit': return <Activity size={10} />;
      case 'task': return <CheckSquare size={10} />;
      default: return <CalIcon size={10} />;
    }
  };

  const formatEventTime = (isoString: string) => {
    try {
      const parts = isoString.split('T')[1];
      if (!parts) return '';
      const [hStr, mStr] = parts.split(':');
      let h = parseInt(hStr, 10);
      const ampm = h >= 12 ? 'PM' : 'AM';
      h = h % 12 || 12;
      return `${h}:${mStr} ${ampm}`;
    } catch {
      return '';
    }
  };

  const hours = [
    '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM',
    '06:00 PM', '07:00 PM', '08:00 PM'
  ];

  return (
    <div className="calendar-root animate-fade-in">
      
      {/* ── Page Header (compact) ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>Calendar &amp; Schedule</h1>
          <p style={{ color: 'var(--text-secondary)', margin: '2px 0 0 0', fontSize: 12.5 }}>
            Unified intelligent schedule — focus blocks, interviews, habits &amp; tasks.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Button variant="primary" size="sm" icon={<Plus size={15} />} onClick={() => openQuickAdd('event')}>
            Add Event
          </Button>
        </div>
      </div>

      {/* ── Month Controls & Filters Bar ── */}
      <div className="card" style={{ padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
        
        {/* Date Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ display: 'flex', gap: 4, background: 'var(--surface-soft)', padding: 3, borderRadius: 8 }}>
            <button className="btn-icon" style={{ width: 30, height: 30 }} onClick={handlePrevMonth} title="Previous Month">
              <ChevronLeft size={16} />
            </button>
            <button className="btn-icon" style={{ width: 30, height: 30 }} onClick={handleNextMonth} title="Next Month">
              <ChevronRight size={16} />
            </button>
          </div>

          <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0, fontFamily: 'var(--font-heading)' }}>
            {formattedHeaderDate}
          </h2>

          <button
            className="btn btn-ghost btn-sm"
            style={{ fontSize: 12, padding: '4px 10px', borderRadius: 'var(--radius-full)' }}
            onClick={handleJumpToToday}
          >
            Today
          </button>
        </div>

        {/* Category Filters */}
        <div className="calendar-filter-bar">
          {[
            { key: 'all', label: 'All Events', count: categoryCounts.all },
            { key: 'focus', label: '⚡ Focus Blocks', count: categoryCounts.focus },
            { key: 'event', label: '💼 Work & Meetings', count: categoryCounts.event },
            { key: 'habit', label: '🏃 Habits', count: categoryCounts.habit },
            { key: 'task', label: '🎯 Tasks', count: categoryCounts.task },
          ].map(filter => (
            <button
              key={filter.key}
              className={`calendar-filter-chip ${filterCategory === filter.key ? 'active' : ''}`}
              onClick={() => setFilterCategory(filter.key)}
            >
              <span>{filter.label}</span>
              <span className="chip-count">{filter.count}</span>
            </button>
          ))}
        </div>

        {/* View Switcher */}
        <div style={{ display: 'flex', background: 'var(--surface-soft)', padding: 3, borderRadius: 'var(--radius-sm)', gap: 2 }}>
          {(['month', 'week', 'day'] as const).map(mode => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`btn btn-sm ${viewMode === mode ? 'btn-primary' : 'btn-ghost'}`}
              style={{ textTransform: 'capitalize', padding: '6px 14px', fontSize: 12.5 }}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* ── Main Layout: Calendar Grid + Right Day Inspector ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 14, alignItems: 'start' }}>
        
        {/* ── Main Column ── */}
        <div className="card" style={{ padding: '12px 14px' }}>
          
          {/* MONTH VIEW */}
          {viewMode === 'month' && (
            <div>
              {/* Weekday Headers */}
              <div className="month-weekdays-header">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((dayName, idx) => (
                  <div key={dayName} className={`month-weekday-cell ${idx >= 5 ? 'weekend' : ''}`}>
                    {dayName}
                  </div>
                ))}
              </div>

              {/* Month Days Grid */}
              <div className="month-days-grid">
                {allGridDays.map((cell, idx) => {
                  const isToday = cell.dateStr === '2026-08-30';
                  const isSelected = cell.dateStr === selectedDateStr;

                  // Match events for this date
                  const dayEvents = filteredEvents.filter(e => e.start.startsWith(cell.dateStr));
                  const displayEvents = dayEvents.slice(0, 2);
                  const overflowCount = dayEvents.length - 2;

                  return (
                    <div
                      key={idx}
                      className={`month-day-cell ${cell.isCurrentMonth ? '' : 'other-month'} ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}`}
                      onClick={() => setSelectedDateStr(cell.dateStr)}
                    >
                      {/* Day Header */}
                      <div className="month-day-header">
                        <span className="month-day-num">{cell.day}</span>
                        <button
                          type="button"
                          className="month-day-quick-add"
                          title="Schedule event on this day"
                          onClick={e => {
                            e.stopPropagation();
                            openQuickAdd('event');
                          }}
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      {/* Event Chips List */}
                      <div className="month-day-events">
                        {displayEvents.map(evt => (
                          <div
                            key={evt.id}
                            className={`cal-event-pill type-${evt.type}`}
                            title={`${evt.title} (${formatEventTime(evt.start)})`}
                            onClick={e => {
                              e.stopPropagation();
                              setActiveEvent(evt);
                            }}
                          >
                            {getEventIcon(evt.type)}
                            <span className="cal-event-time">{formatEventTime(evt.start)}</span>
                            <span className="cal-event-title">{evt.title}</span>
                          </div>
                        ))}

                        {overflowCount > 0 && (
                          <div
                            className="cal-more-pill"
                            onClick={e => {
                              e.stopPropagation();
                              setSelectedDateStr(cell.dateStr);
                            }}
                          >
                            +{overflowCount} more
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* WEEK VIEW */}
          {viewMode === 'week' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {/* Sticky Day Headers Row */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6, marginBottom: 6 }}>
                {[
                  { dayName: 'Mon', dateNum: 24, dateStr: '2026-08-24' },
                  { dayName: 'Tue', dateNum: 25, dateStr: '2026-08-25' },
                  { dayName: 'Wed', dateNum: 26, dateStr: '2026-08-26' },
                  { dayName: 'Thu', dateNum: 27, dateStr: '2026-08-27' },
                  { dayName: 'Fri', dateNum: 28, dateStr: '2026-08-28' },
                  { dayName: 'Sat', dateNum: 29, dateStr: '2026-08-29' },
                  { dayName: 'Sun', dateNum: 30, dateStr: '2026-08-30' },
                ].map(d => {
                  const isToday = d.dateStr === '2026-08-30';
                  return (
                    <div
                      key={d.dateStr}
                      style={{
                        textAlign: 'center',
                        padding: '6px 4px',
                        borderRadius: 8,
                        background: isToday ? 'var(--primary)' : 'var(--surface-soft)',
                        border: isToday ? '1px solid var(--primary)' : '1px solid var(--outline-subtle)',
                      }}
                    >
                      <div style={{ fontSize: 10, fontWeight: 700, color: isToday ? 'rgba(255,255,255,0.75)' : 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{d.dayName}</div>
                      <div style={{ fontSize: 15, fontWeight: 800, color: isToday ? '#fff' : 'var(--text-primary)', lineHeight: 1.3 }}>{d.dateNum}</div>
                    </div>
                  );
                })}
              </div>

              {/* Events Body Row — fixed height, internal scroll per column */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(7, 1fr)',
                  gap: 6,
                  height: 'calc(100vh - 310px)',
                  minHeight: 380,
                }}
              >
                {[
                  { dayName: 'Mon', dateNum: 24, dateStr: '2026-08-24' },
                  { dayName: 'Tue', dateNum: 25, dateStr: '2026-08-25' },
                  { dayName: 'Wed', dateNum: 26, dateStr: '2026-08-26' },
                  { dayName: 'Thu', dateNum: 27, dateStr: '2026-08-27' },
                  { dayName: 'Fri', dateNum: 28, dateStr: '2026-08-28' },
                  { dayName: 'Sat', dateNum: 29, dateStr: '2026-08-29' },
                  { dayName: 'Sun', dateNum: 30, dateStr: '2026-08-30' },
                ].map(d => {
                  const dayEvents = filteredEvents.filter(e => e.start.startsWith(d.dateStr));
                  const isToday = d.dateStr === '2026-08-30';
                  return (
                    <div
                      key={d.dateStr}
                      style={{
                        background: isToday ? '#FAF8FF' : 'var(--surface-soft)',
                        border: isToday ? '1px solid var(--primary-soft)' : '1px solid var(--outline-subtle)',
                        borderRadius: 8,
                        padding: '8px 6px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 5,
                        overflowY: 'auto',
                        height: '100%',
                      }}
                    >
                      {dayEvents.length === 0 ? (
                        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <span style={{ fontSize: 10, color: 'var(--text-tertiary)', opacity: 0.5 }}>—</span>
                        </div>
                      ) : (
                        dayEvents.map(evt => (
                          <div
                            key={evt.id}
                            className={`cal-event-pill type-${evt.type}`}
                            style={{ padding: '4px 6px', fontSize: 10.5, flexShrink: 0, display: 'block', cursor: 'pointer' }}
                            onClick={() => setActiveEvent(evt)}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: 3, fontWeight: 700 }}>
                              {getEventIcon(evt.type)}
                              <span>{formatEventTime(evt.start)}</span>
                            </div>
                            <div style={{ marginTop: 1, fontSize: 10, opacity: 0.9, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{evt.title}</div>
                          </div>
                        ))
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* DAY VIEW */}
          {viewMode === 'day' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              
              {/* Free Window Notification Banner */}
              <div className="ai-card" style={{ padding: '14px 18px', border: '1px solid var(--primary-soft)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <div className="ai-pill"><AiCreativeIcon size={12} /> Free Window Detected</div>
                </div>
                <p style={{ fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.5, marginBottom: 10 }}>
                  You have an open 2-hour window between <strong>2:00 PM and 4:00 PM</strong>. Would you like LifeSync to schedule your high-priority portfolio task?
                </p>
                <Button variant="primary" size="sm" onClick={handleScheduleFreeWindow}>
                  Schedule Task into Free Window
                </Button>
              </div>

              {/* Time Slots */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {hours.map((hr, idx) => {
                  const slotHour = idx + 8;
                  const matchingEvents = events.filter(e => {
                    if (!e.start.startsWith('2026-08-30')) return false;
                    const evtHour = parseInt(e.start.split('T')[1]?.slice(0, 2) || '0', 10);
                    return evtHour === slotHour;
                  });

                  return (
                    <div
                      key={hr}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '80px 1fr',
                        gap: 14,
                        minHeight: 48,
                        borderBottom: '1px solid var(--surface-soft)',
                        alignItems: 'start',
                        padding: '4px 0'
                      }}
                    >
                      <span style={{ fontSize: 12, color: 'var(--text-tertiary)', fontWeight: 600 }}>{hr}</span>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        {matchingEvents.map(evt => (
                          <div
                            key={evt.id}
                            onClick={() => setActiveEvent(evt)}
                            style={{
                              background: 'var(--surface-soft)',
                              borderLeft: `4px solid ${evt.color || 'var(--primary)'}`,
                              padding: '8px 12px',
                              borderRadius: 'var(--radius-sm)',
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              cursor: 'pointer'
                            }}
                          >
                            <div>
                              <span style={{ fontSize: 13, fontWeight: 700 }}>{evt.title}</span>
                              {evt.description && (
                                <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{evt.description}</div>
                              )}
                            </div>
                            <Badge variant="primary">{evt.type}</Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>

        {/* ── Right Side Inspector Panel ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          
          {/* Day Schedule Inspector */}
          <div className="card" style={{ padding: 12 }}>
            <div className="day-inspector-header">
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Selected Date
                </div>
                <h3 style={{ fontSize: 14, fontWeight: 700, margin: '2px 0 0 0' }}>
                  {new Date(selectedDateStr + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                </h3>
              </div>
              <Button variant="ghost" size="sm" icon={<Plus size={14} />} onClick={() => openQuickAdd('event')}>
                Add
              </Button>
            </div>

            {selectedDayEvents.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '16px 8px', color: 'var(--text-tertiary)' }}>
                <CalIcon size={20} style={{ opacity: 0.4, marginBottom: 4 }} />
                <div style={{ fontSize: 12, fontWeight: 600 }}>No events scheduled</div>
                <div style={{ fontSize: 11, marginTop: 2 }}>Click "Add" to schedule an event.</div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 'calc(100vh - 460px)', minHeight: 120, overflowY: 'auto', paddingRight: 4 }}>
                {selectedDayEvents.map(evt => (
                  <div
                    key={evt.id}
                    className="day-timeline-card"
                    style={{ padding: '6px 8px' }}
                    onClick={() => setActiveEvent(evt)}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: 10.5, fontWeight: 700, color: evt.color || 'var(--primary)' }}>
                        {formatEventTime(evt.start)} {evt.end ? `– ${formatEventTime(evt.end)}` : ''}
                      </span>
                      <span className={`cal-event-pill type-${evt.type}`} style={{ fontSize: 9.5, padding: '1px 5px' }}>
                        {evt.type}
                      </span>
                    </div>
                    <div style={{ fontSize: 12, fontWeight: 700, marginTop: 2, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {evt.title}
                    </div>
                    {evt.description && (
                      <div style={{ fontSize: 10.5, color: 'var(--text-secondary)', marginTop: 2, lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {evt.description}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* AI Schedule Pulse */}
          <div className="ai-card" style={{ padding: 10, background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.06) 0%, rgba(168, 85, 247, 0.06) 100%)', border: '1px solid rgba(99, 102, 241, 0.2)', borderRadius: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <div className="ai-pill" style={{ fontSize: 11, padding: '2px 8px' }}><AiCreativeIcon size={11} /> AI Schedule Pulse</div>
            </div>
            <p style={{ fontSize: 11.5, color: 'var(--text-primary)', lineHeight: 1.4, margin: '0 0 4px 0' }}>
              You have <strong>14.5 hours</strong> of Deep Focus across August with <strong>0 conflicts</strong>.
            </p>
            <div style={{ fontSize: 10.5, color: 'var(--text-secondary)', borderTop: '1px solid var(--outline-subtle)', paddingTop: 4 }}>
              💡 <em>Peak productivity: 8:30 AM – 11:30 AM</em>
            </div>
          </div>

          {/* Pending Milestones — compact */}
          <div className="card" style={{ padding: '10px 12px' }}>
            <div style={{ fontWeight: 700, fontSize: 11.5, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
              <CheckSquare size={12} color="var(--primary)" /> Pending Milestones
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              {tasks.slice(0, 2).map(t => (
                <div key={t.id} style={{ fontSize: 11, padding: '5px 7px', background: 'var(--surface-soft)', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.title}</div>
                  <div style={{ color: 'var(--text-tertiary)', marginTop: 1, fontSize: 10 }}>Due {t.dueDate}</div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* ── Event Detail Modal Popup ── */}
      {activeEvent && (
        <Modal
          isOpen={!!activeEvent}
          onClose={() => setActiveEvent(null)}
          title={activeEvent.title}
          subtitle={`Type: ${activeEvent.type.toUpperCase()}`}
          maxWidth="480px"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            
            {/* Time & Date Banner */}
            <div className="event-modal-time-banner">
              <Clock size={16} color="var(--primary)" />
              <span>
                {new Date(activeEvent.start).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} · {formatEventTime(activeEvent.start)} {activeEvent.end ? `– ${formatEventTime(activeEvent.end)}` : ''}
              </span>
            </div>

            {/* Location / Video */}
            {activeEvent.location && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-secondary)' }}>
                <Video size={15} color="#3B82F6" />
                <span>{activeEvent.location}</span>
              </div>
            )}

            {/* Description */}
            {activeEvent.description && (
              <div style={{ fontSize: 13.5, color: 'var(--text-primary)', lineHeight: 1.5, background: 'var(--surface-soft)', padding: 12, borderRadius: 8 }}>
                {activeEvent.description}
              </div>
            )}

            {/* Action Buttons */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
              <button
                type="button"
                className="btn btn-ghost"
                style={{ color: '#EF4444' }}
                onClick={() => handleDeleteEvent(activeEvent.id)}
              >
                <Trash2 size={14} style={{ marginRight: 6 }} />
                Delete Event
              </button>

              <div style={{ display: 'flex', gap: 8 }}>
                <Button variant="primary" onClick={() => setActiveEvent(null)}>
                  Close
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}

    </div>
  );
};
