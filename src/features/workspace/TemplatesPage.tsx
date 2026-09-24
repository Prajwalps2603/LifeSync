import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { pageService } from '../../services';
import {
  LayoutTemplate, Check, ArrowRight, Eye,
  Briefcase, Compass, DollarSign, Target, BookOpen, Clock, HeartHandshake
} from 'lucide-react';
import { AiCreativeIcon } from '../../components/icons/AiCreativeIcon';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';

export const TemplatesPage: React.FC = () => {
  const { showToast, triggerConfetti } = useApp();
  const navigate = useNavigate();
  const [selectedTemplate, setSelectedTemplate] = useState<any | null>(null);

  const templates = [
    {
      id: 'tmpl-job-search',
      title: 'Job Search & Pipeline OS',
      icon: '💼',
      category: 'Career',
      description: 'Comprehensive pipeline for applications, recruiter follow-ups, interview notes, and compensation negotiation.',
      blocksPreview: ['# Job Applications Pipeline', 'Database Table (Company, Role, Status, Follow-up)', 'Interview Cheat Sheet & Behavioral Answers']
    },
    {
      id: 'tmpl-learning-system',
      title: 'Engineering Learning Roadmap',
      icon: '📚',
      category: 'Learning',
      description: 'Structured skill tree with spaced repetition prompts, course trackers, and code snippet references.',
      blocksPreview: ['# 2026 Skill Tree Milestones', 'To-do Architecture Mastery', 'Resource Vault & Documentation Links']
    },
    {
      id: 'tmpl-personal-hq',
      title: 'Personal HQ & Life Operating System',
      icon: '🌿',
      category: 'Personal',
      description: 'Central life hub combining fitness goals, weekly meal planning, habit logs, and home projects.',
      blocksPreview: ['# Life Pillars & Weekly Focus', 'Habit Alignment Checklists', 'Active Projects Quick Links']
    },
    {
      id: 'tmpl-travel-planner',
      title: 'Travel & Expedition Planner',
      icon: '✈️',
      category: 'Personal',
      description: 'Itinerary builder with flight confirmation blocks, packing checklists, and local recommendations.',
      blocksPreview: ['# Day-by-Day Expedition Itinerary', 'Packing Checklist & Essentials', 'Reservations & Flight Details']
    },
    {
      id: 'tmpl-finance-tracker',
      title: 'Personal Wealth & Budget Tracker',
      icon: '💰',
      category: 'Finance',
      description: 'Monthly savings rate dashboard, recurring subscription audits, and investment allocation goals.',
      blocksPreview: ['# Wealth & Runway Dashboard', 'Monthly Expense Allocation Chart', 'Emergency Reserve Tracker']
    },
    {
      id: 'tmpl-weekly-review',
      title: 'Weekly Life Sync & Retrospective',
      icon: '🔄',
      category: 'Productivity',
      description: 'Structured Sunday review to celebrate wins, clear postponed tasks, and align next week’s focus.',
      blocksPreview: ['# Sunday Sync & Reflection', 'What worked well this week?', 'Top 3 Priorities for Next Week']
    },
    {
      id: 'tmpl-daily-journal',
      title: 'Mindful Daily Journal',
      icon: '✍️',
      category: 'Mindset',
      description: 'Morning gratitude prompts, midday energy checks, and evening reflection notes.',
      blocksPreview: ['# Morning Gratitude (3 Items)', 'Today’s One Essential Task', 'Evening Wins & Lessons Learned']
    },
    {
      id: 'tmpl-meeting-notes',
      title: 'Executive Meeting Notes & Action Items',
      icon: '📝',
      category: 'Work',
      description: 'Fast meeting capture with automated AI action-item extraction placeholders.',
      blocksPreview: ['# Meeting Objectives & Attendees', 'Discussion Highlights & Decisions', 'Action Items with Owners & Deadlines']
    },
    {
      id: 'tmpl-project-management',
      title: 'Agile Project Execution Hub',
      icon: '⚡',
      category: 'Development',
      description: 'Sprint milestones, architecture decision records (ADR), and release timelines.',
      blocksPreview: ['# Sprint Objectives', 'Kanban Board & Milestone Links', 'Architecture Decision Records']
    },
    {
      id: 'tmpl-goal-tracker',
      title: 'OKRs & Annual Goal Compass',
      icon: '🎯',
      category: 'Productivity',
      description: 'Hierarchical Goal tracker connecting quarterly milestones to daily routines.',
      blocksPreview: ['# Quarterly Key Results', 'Milestone Progress Bars', 'Weekly Habit Consistency Check']
    }
  ];

  const handleApplyTemplate = async (tmpl: any) => {
    const newPage = await pageService.createPage({
      title: tmpl.title,
      icon: tmpl.icon,
      parentId: null,
      category: tmpl.category,
      blocks: [
        { id: `b-1`, type: 'heading_1', content: tmpl.title },
        { id: `b-2`, type: 'callout', content: `Created from LifeSync Template: ${tmpl.title}`, calloutType: 'info' },
        { id: `b-3`, type: 'heading_2', content: 'Framework & Action Items' },
        { id: `b-4`, type: 'todo', content: 'Define primary objectives & initial milestone', checked: false },
        { id: `b-5`, type: 'todo', content: 'Set recurring weekly review in Calendar', checked: false },
        { id: `b-6`, type: 'divider', content: '' },
        { id: `b-7`, type: 'heading_2', content: 'Reference Notes & Resources' },
        { id: `b-8`, type: 'bullet_list', content: 'Key documentation and research links' }
      ]
    });
    setSelectedTemplate(null);
    triggerConfetti();
    showToast(`Template "${tmpl.title}" instantiated in your workspace!`, 'success');
    navigate(`/workspace/pages/${newPage.id}`);
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div className="page-header" style={{ marginBottom: 0 }}>
        <div className="page-title-group">
          <h1>Template Gallery</h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Curated, ready-to-use systems for career, learning, wellness, finance, and productivity.
          </p>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid-3">
        {templates.map(tmpl => (
          <div
            key={tmpl.id}
            className="card card-interactive"
            onClick={() => setSelectedTemplate(tmpl)}
            style={{ display: 'flex', flexDirection: 'column', gap: 14, justifyContent: 'space-between' }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: 30 }}>{tmpl.icon}</span>
                <span className="badge badge-neutral">{tmpl.category}</span>
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>{tmpl.title}</h3>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                {tmpl.description}
              </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTop: '1px solid var(--outline-subtle)' }}>
              <span style={{ fontSize: 12, color: 'var(--primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                <Eye size={13} /> Preview
              </span>
              <Button
                variant="primary"
                size="sm"
                onClick={e => {
                  e.stopPropagation();
                  handleApplyTemplate(tmpl);
                }}
              >
                Use Template
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Template Preview Modal */}
      {selectedTemplate && (
        <Modal
          isOpen={!!selectedTemplate}
          onClose={() => setSelectedTemplate(null)}
          title={`${selectedTemplate.icon} ${selectedTemplate.title}`}
          subtitle={`Category: ${selectedTemplate.category}`}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              {selectedTemplate.description}
            </p>

            <div style={{ background: 'var(--surface-soft)', padding: 16, borderRadius: 'var(--radius-card)', border: '1px solid var(--outline-soft)' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: 10 }}>
                Included Block Structure
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {selectedTemplate.blocksPreview.map((bp: string, idx: number) => (
                  <div key={idx} style={{ fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ color: 'var(--primary)' }}>✦</span>
                    <span>{bp}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 10 }}>
              <Button variant="ghost" onClick={() => setSelectedTemplate(null)}>Cancel</Button>
              <Button variant="primary" icon={<AiCreativeIcon size={14} />} onClick={() => handleApplyTemplate(selectedTemplate)}>
                Use This Template
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
