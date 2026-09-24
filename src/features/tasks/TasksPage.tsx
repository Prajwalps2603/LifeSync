import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { store, taskService } from '../../services';
import { Task, TaskStatus, Priority } from '../../types';
import {
  CheckSquare, List, LayoutGrid, Calendar as CalIcon, Plus,
  Search, Filter, CheckCircle2, Circle, Clock, Tag, ChevronDown,
  ArrowUpDown, MoreHorizontal, Trash2
} from 'lucide-react';
import { AiCreativeIcon } from '../../components/icons/AiCreativeIcon';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';

export const TasksPage: React.FC = () => {
  const { openQuickAdd, showToast, triggerConfetti, refreshKey } = useApp();
  const [viewMode, setViewMode] = useState<'list' | 'board' | 'calendar'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProject, setSelectedProject] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Task detail modal state
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const tasks = store.tasks;
  const projects = store.projects;

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesProject = selectedProject === 'all' || task.projectId === selectedProject;
      const matchesPriority = selectedPriority === 'all' || task.priority === selectedPriority;
      const matchesStatus = selectedStatus === 'all' || task.status === selectedStatus;
      return matchesSearch && matchesProject && matchesPriority && matchesStatus;
    });
  }, [tasks, searchQuery, selectedProject, selectedPriority, selectedStatus, refreshKey]);

  const handleToggleTask = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const updated = await taskService.toggleTask(id);
    if (updated.status === 'completed') {
      triggerConfetti();
      showToast('Task completed!', 'success');
    }
  };

  const handleStatusChange = async (taskId: string, newStatus: TaskStatus) => {
    await taskService.updateTask(taskId, { status: newStatus });
    showToast(`Task moved to ${newStatus.replace('_', ' ')}`, 'info');
  };

  const handleDeleteTask = async (taskId: string) => {
    await taskService.deleteTask(taskId);
    setActiveTask(null);
    showToast('Task removed', 'info');
  };

  const boardColumns: { id: TaskStatus; label: string; color: string }[] = [
    { id: 'todo', label: 'To Do', color: '#767586' },
    { id: 'in_progress', label: 'In Progress', color: '#4343D5' },
    { id: 'waiting', label: 'Waiting / Blocked', color: '#D97706' },
    { id: 'completed', label: 'Completed', color: '#059669' }
  ];

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div className="page-header" style={{ marginBottom: 0 }}>
        <div className="page-title-group">
          <h1>Tasks & Action Items</h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Organize, prioritize, and execute across all active life projects.
          </p>
        </div>
        <div className="page-actions">
          <Button variant="primary" size="sm" icon={<Plus size={15} />} onClick={() => openQuickAdd('task')}>
            Add Task
          </Button>
        </div>
      </div>

      {/* AI Task Suggestions Banner */}
      <div className="ai-card" style={{ padding: '16px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div className="ai-pill"><AiCreativeIcon size={12} /> AI Task Intelligence</div>
            <span style={{ fontSize: 13, color: 'var(--text-primary)', fontWeight: 500 }}>
              You have 3 tasks related to Career Development due this week. Want me to draft an interview prep checklist?
            </span>
          </div>
          <Button
            variant="soft"
            size="sm"
            onClick={() => {
              triggerConfetti();
              showToast('Created 3 AI interview checklist subtasks!', 'success');
            }}
          >
            Draft Checklist
          </Button>
        </div>
      </div>

      {/* Filter and View Controls Bar */}
      <div className="card" style={{ padding: '14px 18px', display: 'flex', flexWrap: 'wrap', gap: 14, alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 240, maxWidth: 360 }}>
          <div style={{ position: 'relative', width: '100%' }}>
            <Search size={15} color="var(--text-tertiary)" style={{ position: 'absolute', left: 12, top: 12 }} />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: 34, paddingRight: 12, height: 38 }}
              placeholder="Filter tasks or tags..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          {/* Project Filter */}
          <select
            className="form-input"
            style={{ width: 'auto', height: 38, padding: '0 12px' }}
            value={selectedProject}
            onChange={e => setSelectedProject(e.target.value)}
          >
            <option value="all">All Projects</option>
            {projects.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>

          {/* Priority Filter */}
          <select
            className="form-input"
            style={{ width: 'auto', height: 38, padding: '0 12px' }}
            value={selectedPriority}
            onChange={e => setSelectedPriority(e.target.value)}
          >
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          {/* View Mode Switcher */}
          <div style={{ display: 'flex', background: 'var(--surface-soft)', padding: 3, borderRadius: 'var(--radius-sm)', gap: 2 }}>
            <button
              onClick={() => setViewMode('list')}
              className={`btn btn-sm ${viewMode === 'list' ? 'btn-primary' : 'btn-ghost'}`}
              style={{ padding: '6px 10px' }}
            >
              <List size={14} /> List
            </button>
            <button
              onClick={() => setViewMode('board')}
              className={`btn btn-sm ${viewMode === 'board' ? 'btn-primary' : 'btn-ghost'}`}
              style={{ padding: '6px 10px' }}
            >
              <LayoutGrid size={14} /> Board
            </button>
          </div>
        </div>
      </div>

      {/* View Content */}
      {viewMode === 'list' ? (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          {filteredTasks.length === 0 ? (
            <div style={{ padding: 48, textAlign: 'center', color: 'var(--text-tertiary)' }}>
              No tasks found matching your filters.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {filteredTasks.map((task, idx) => (
                <div
                  key={task.id}
                  onClick={() => setActiveTask(task)}
                  className="card-interactive"
                  style={{
                    padding: '14px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                    borderBottom: idx !== filteredTasks.length - 1 ? '1px solid var(--outline-subtle)' : 'none',
                    background: task.status === 'completed' ? 'var(--surface-soft)' : 'transparent'
                  }}
                >
                  <button
                    onClick={e => handleToggleTask(task.id, e)}
                    style={{ color: task.status === 'completed' ? 'var(--success)' : 'var(--text-tertiary)', padding: 2 }}
                  >
                    {task.status === 'completed' ? <CheckCircle2 size={19} /> : <Circle size={19} />}
                  </button>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: 14,
                        fontWeight: 600,
                        textDecoration: task.status === 'completed' ? 'line-through' : 'none',
                        color: task.status === 'completed' ? 'var(--text-tertiary)' : 'var(--text-primary)'
                      }}
                      className="truncate"
                    >
                      {task.title}
                    </div>
                    {task.description && (
                      <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }} className="truncate">
                        {task.description}
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    {task.projectName && (
                      <span className="badge" style={{ background: 'var(--primary-soft)', color: 'var(--primary)', fontSize: 11 }}>
                        {task.projectName}
                      </span>
                    )}

                    <span style={{ fontSize: 12, color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Clock size={13} /> {task.dueDate}
                    </span>

                    <Badge variant={task.priority === 'urgent' ? 'error' : task.priority === 'high' ? 'warning' : 'primary'}>
                      {task.priority}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Board / Kanban View */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(260px, 1fr))', gap: 16, overflowX: 'auto', paddingBottom: 16 }}>
          {boardColumns.map(col => {
            const colTasks = filteredTasks.filter(t => t.status === col.id);
            return (
              <div
                key={col.id}
                style={{
                  background: 'var(--surface-soft)',
                  borderRadius: 'var(--radius-card)',
                  padding: 14,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                  minHeight: 480
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 4px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: col.color }} />
                    <span style={{ fontSize: 13, fontWeight: 700 }}>{col.label}</span>
                    <span className="badge badge-neutral" style={{ fontSize: 10 }}>{colTasks.length}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {colTasks.map(task => (
                    <div
                      key={task.id}
                      onClick={() => setActiveTask(task)}
                      className="card card-interactive"
                      style={{ padding: '14px', background: 'var(--surface-white)', border: '1px solid var(--outline-subtle)' }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                        <Badge variant={task.priority === 'urgent' ? 'error' : task.priority === 'high' ? 'warning' : 'primary'}>
                          {task.priority}
                        </Badge>
                        {task.projectName && (
                          <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{task.projectName}</span>
                        )}
                      </div>

                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8, lineHeight: 1.4 }}>
                        {task.title}
                      </div>

                      {task.subtasks && (
                        <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginBottom: 8 }}>
                          {task.subtasks.filter(s => s.completed).length} of {task.subtasks.length} subtasks
                        </div>
                      )}

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 8, borderTop: '1px solid var(--outline-subtle)', fontSize: 11, color: 'var(--text-tertiary)' }}>
                        <span>{task.dueDate}</span>
                        <button
                          onClick={e => handleToggleTask(task.id, e)}
                          style={{ color: task.status === 'completed' ? 'var(--success)' : 'var(--text-tertiary)' }}
                        >
                          {task.status === 'completed' ? <CheckCircle2 size={15} /> : <Circle size={15} />}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Task Detail Modal */}
      {activeTask && (
        <Modal
          isOpen={!!activeTask}
          onClose={() => setActiveTask(null)}
          title={activeTask.title}
          subtitle={`Project: ${activeTask.projectName || 'General'} · Due: ${activeTask.dueDate}`}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-tertiary)', display: 'block', marginBottom: 6 }}>
                Status
              </label>
              <div style={{ display: 'flex', gap: 8 }}>
                {(['todo', 'in_progress', 'waiting', 'completed'] as TaskStatus[]).map(st => (
                  <button
                    key={st}
                    onClick={() => handleStatusChange(activeTask.id, st)}
                    className={`btn btn-sm ${activeTask.status === st ? 'btn-primary' : 'btn-secondary'}`}
                  >
                    {st.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            {activeTask.description && (
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-tertiary)', display: 'block', marginBottom: 6 }}>
                  Description
                </label>
                <div style={{ background: 'var(--surface-soft)', padding: 12, borderRadius: 'var(--radius-sm)', fontSize: 13, lineHeight: 1.5 }}>
                  {activeTask.description}
                </div>
              </div>
            )}

            {activeTask.subtasks && activeTask.subtasks.length > 0 && (
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-tertiary)', display: 'block', marginBottom: 6 }}>
                  Subtasks
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {activeTask.subtasks.map(sub => (
                    <div key={sub.id} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
                      <CheckCircle2 size={15} color={sub.completed ? 'var(--success)' : 'var(--text-tertiary)'} />
                      <span style={{ textDecoration: sub.completed ? 'line-through' : 'none' }}>{sub.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 16, borderTop: '1px solid var(--outline-subtle)' }}>
              <Button
                variant="ghost"
                size="sm"
                icon={<Trash2 size={15} color="var(--error)" />}
                onClick={() => handleDeleteTask(activeTask.id)}
              >
                Delete Task
              </Button>
              <Button variant="primary" size="sm" onClick={() => setActiveTask(null)}>
                Done
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
