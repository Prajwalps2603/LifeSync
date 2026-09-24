import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { store, projectService } from '../../services';
import {
  Layers, Plus, ArrowRight, CheckCircle2, Clock,
  MoreHorizontal, Play, Pause, CheckSquare
} from 'lucide-react';
import { AiCreativeIcon } from '../../components/icons/AiCreativeIcon';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

export const ProjectsPage: React.FC = () => {
  const { openQuickAdd } = useApp();
  const navigate = useNavigate();
  const projects = store.projects;

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div className="page-header" style={{ marginBottom: 0 }}>
        <div className="page-title-group">
          <h1>Active Projects</h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            High-level initiatives connecting daily tasks to your long-term life goals.
          </p>
        </div>
        <div className="page-actions">
          <Button variant="primary" size="sm" icon={<Plus size={15} />} onClick={() => openQuickAdd('task')}>
            New Project
          </Button>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid-2">
        {projects.map(proj => (
          <div
            key={proj.id}
            onClick={() => navigate(`/projects/${proj.id}`)}
            className="card card-interactive"
            style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 38,
                  height: 38,
                  borderRadius: 10,
                  background: 'var(--primary-soft)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Layers size={18} color={proj.color} />
                </div>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 700 }}>{proj.name}</h3>
                  <span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>{proj.category}</span>
                </div>
              </div>
              <Badge variant={proj.priority === 'urgent' ? 'error' : proj.priority === 'high' ? 'warning' : 'primary'}>
                {proj.priority}
              </Badge>
            </div>

            <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              {proj.description}
            </p>

            {/* Progress */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 6 }}>
                <span style={{ color: 'var(--text-tertiary)' }}>Overall Progress</span>
                <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{proj.progress}%</span>
              </div>
              <div className="progress-bar-bg">
                <div className="progress-bar-fill" style={{ width: `${proj.progress}%` }} />
              </div>
            </div>

            {/* AI Recommendation snippet */}
            {proj.aiRecommendation && (
              <div style={{
                background: 'var(--surface-soft)',
                padding: '10px 12px',
                borderRadius: 'var(--radius-sm)',
                fontSize: 12,
                color: 'var(--text-primary)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: 8,
                borderLeft: '3px solid var(--primary)'
              }}>
                <AiCreativeIcon size={14} color="var(--primary)" style={{ marginTop: 2, flexShrink: 0 }} />
                <span>{proj.aiRecommendation}</span>
              </div>
            )}

            {/* Footer metrics */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTop: '1px solid var(--outline-subtle)', fontSize: 12, color: 'var(--text-tertiary)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <CheckCircle2 size={13} color="var(--success)" /> {proj.completedTasksCount} / {proj.tasksCount} tasks
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Clock size={13} /> Due {proj.deadline}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
