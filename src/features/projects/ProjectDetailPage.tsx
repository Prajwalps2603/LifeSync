import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { store, taskService } from '../../services';
import {
  Layers, ArrowLeft, Plus, CheckCircle2, Circle, Clock, Target,
  Globe, Users, Link, MoreHorizontal, Edit3, Trash2, Calendar as CalIcon, Tag
} from 'lucide-react';
import { AiCreativeIcon } from '../../components/icons/AiCreativeIcon';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

export const ProjectDetailPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { openQuickAdd, showToast, triggerConfetti } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'tasks' | 'notes' | 'relations'>('overview');

  const project = store.projects.find(p => p.id === projectId) || store.projects[0];
  const relatedTasks = store.tasks.filter(t => t.projectId === project.id);
  const relatedNotes = store.notes.filter(n => n.relatedProjectIds?.includes(project.id));
  const relatedGoal = store.goals.find(g => g.id === project.goalId);
  const relatedMemories = store.memories.filter(m => m.category === 'Work' || m.category === 'Preferences');

  const handleToggleTask = async (id: string) => {
    const updated = await taskService.toggleTask(id);
    if (updated.status === 'completed') {
      triggerConfetti();
      showToast('Task completed!', 'success');
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Top navigation */}
      <div>
        <button
          onClick={() => navigate('/projects')}
          className="btn btn-ghost btn-sm"
          style={{ paddingLeft: 0, color: 'var(--text-tertiary)' }}
        >
          <ArrowLeft size={15} /> Back to Projects
        </button>
      </div>

      {/* Project Header Card */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: 'var(--primary-soft)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Layers size={22} color={project.color} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <h1 style={{ fontSize: 24 }}>{project.name}</h1>
                <Badge variant={project.priority === 'urgent' ? 'error' : project.priority === 'high' ? 'warning' : 'primary'}>
                  {project.priority}
                </Badge>
              </div>
              <p style={{ fontSize: 13, color: 'var(--text-tertiary)' }}>{project.category} · Due {project.deadline}</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <Button
              variant="soft"
              size="sm"
              icon={<AiCreativeIcon size={14} />}
              onClick={() => navigate('/ai')}
            >
              Ask LifeSync about this project
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={<Plus size={14} />}
              onClick={() => openQuickAdd('task')}
            >
              Add Task
            </Button>
          </div>
        </div>

        <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          {project.description}
        </p>

        {/* Progress */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}>
            <span style={{ fontWeight: 600 }}>Project Progress</span>
            <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{project.progress}%</span>
          </div>
          <div className="progress-bar-bg" style={{ height: 10 }}>
            <div className="progress-bar-fill" style={{ width: `${project.progress}%` }} />
          </div>
        </div>

        {/* AI Recommendation Banner */}
        {project.aiRecommendation && (
          <div className="ai-card" style={{ padding: '14px 18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <div className="ai-pill"><AiCreativeIcon size={12} /> AI Strategy Recommendation</div>
            </div>
            <p style={{ fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.5 }}>
              {project.aiRecommendation}
            </p>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, borderBottom: '1px solid var(--outline-subtle)', paddingBottom: 8 }}>
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'tasks', label: `Tasks (${relatedTasks.length})` },
          { id: 'notes', label: `Notes (${relatedNotes.length})` },
          { id: 'relations', label: 'Connected Relations' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`btn btn-sm ${activeTab === tab.id ? 'btn-primary' : 'btn-ghost'}`}
            style={{ borderRadius: 'var(--radius-full)' }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid-2">
          {/* Tasks summary */}
          <div className="card">
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 14 }}>Project Tasks</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {relatedTasks.map(t => (
                <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: 'var(--surface-soft)', borderRadius: 'var(--radius-sm)' }}>
                  <button onClick={() => handleToggleTask(t.id)} style={{ color: t.status === 'completed' ? 'var(--success)' : 'var(--text-tertiary)' }}>
                    {t.status === 'completed' ? <CheckCircle2 size={16} /> : <Circle size={16} />}
                  </button>
                  <span style={{ fontSize: 13, fontWeight: 500, textDecoration: t.status === 'completed' ? 'line-through' : 'none' }}>{t.title}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="card">
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 14 }}>Recent Activity Log</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {project.recentActivity?.map(act => (
                <div key={act.id} style={{ padding: '10px 12px', background: 'var(--surface-soft)', borderRadius: 'var(--radius-sm)', fontSize: 13 }}>
                  <div style={{ fontWeight: 600 }}>{act.action}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 2 }}>{act.user} · {act.timestamp}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'tasks' && (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700 }}>All Project Tasks</h3>
            <Button variant="primary" size="sm" icon={<Plus size={14} />} onClick={() => openQuickAdd('task')}>Add Task</Button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {relatedTasks.map(t => (
              <div key={t.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', background: 'var(--surface-soft)', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <button onClick={() => handleToggleTask(t.id)} style={{ color: t.status === 'completed' ? 'var(--success)' : 'var(--text-tertiary)' }}>
                    {t.status === 'completed' ? <CheckCircle2 size={18} /> : <Circle size={18} />}
                  </button>
                  <span style={{ fontSize: 14, fontWeight: 500 }}>{t.title}</span>
                </div>
                <Badge variant={t.priority === 'urgent' ? 'error' : t.priority === 'high' ? 'warning' : 'primary'}>{t.priority}</Badge>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'notes' && (
        <div className="card">
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 14 }}>Project Notes & Architecture</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {relatedNotes.map(n => (
              <div key={n.id} onClick={() => navigate('/notes')} className="card-interactive" style={{ padding: '12px 14px', background: 'var(--surface-soft)', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{n.title}</div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>{n.preview}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'relations' && (
        <div className="grid-2">
          {/* Related Goal */}
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <Target size={16} color="var(--primary)" />
              <h3 style={{ fontSize: 15, fontWeight: 700 }}>Parent Goal</h3>
            </div>
            {relatedGoal ? (
              <div style={{ padding: '12px 14px', background: 'var(--surface-soft)', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{relatedGoal.name}</div>
                <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 4 }}>
                  {relatedGoal.progress}% completed · {relatedGoal.category}
                </div>
              </div>
            ) : (
              <div style={{ fontSize: 13, color: 'var(--text-tertiary)' }}>No parent goal linked.</div>
            )}
          </div>

          {/* Related Memories */}
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <AiCreativeIcon size={16} color="#8B5CF6" />
              <h3 style={{ fontSize: 15, fontWeight: 700 }}>Informed by Memories</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {relatedMemories.slice(0, 2).map(m => (
                <div key={m.id} style={{ padding: '10px 12px', background: 'var(--surface-soft)', borderRadius: 'var(--radius-sm)', fontSize: 13 }}>
                  <div style={{ fontWeight: 600 }}>{m.title}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{m.content}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
