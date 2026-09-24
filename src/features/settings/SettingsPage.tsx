import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Settings, Moon, Sun, Bell, Shield, Database, Sliders } from 'lucide-react';
import { AiCreativeIcon } from '../../components/icons/AiCreativeIcon';
import { Button } from '../../components/ui/Button';

export const SettingsPage: React.FC = () => {
  const { showToast } = useApp();
  const [aiSuggestions, setAiSuggestions] = useState(true);
  const [morningClarity, setMorningClarity] = useState(true);
  const [autoSchedule, setAutoSchedule] = useState(true);

  return (
    <div className="animate-fade-in" style={{ maxWidth: 740, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div className="page-header" style={{ marginBottom: 0 }}>
        <div className="page-title-group">
          <h1>Settings & Preferences</h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Configure your LifeSync AI operating system behavior and workspace preferences.
          </p>
        </div>
      </div>

      {/* AI Preferences */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <AiCreativeIcon size={18} color="var(--primary)" />
          <h3 style={{ fontSize: 16, fontWeight: 700 }}>LifeSync AI Intelligence</h3>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--outline-subtle)' }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: 14 }}>Morning Clarity Digest</div>
            <div style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>Generate daily contextual schedule & energy recommendations at 8:00 AM</div>
          </div>
          <input
            type="checkbox"
            checked={morningClarity}
            onChange={e => {
              setMorningClarity(e.target.checked);
              showToast('Preference updated', 'info');
            }}
            style={{ width: 18, height: 18 }}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--outline-subtle)' }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: 14 }}>Proactive Task Breakdown</div>
            <div style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>Detect postponed tasks and suggest 15-minute micro-tasks</div>
          </div>
          <input
            type="checkbox"
            checked={aiSuggestions}
            onChange={e => {
              setAiSuggestions(e.target.checked);
              showToast('Preference updated', 'info');
            }}
            style={{ width: 18, height: 18 }}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0' }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: 14 }}>Calendar Free Window Suggestions</div>
            <div style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>Prompt to schedule priority tasks into 2+ hour gaps</div>
          </div>
          <input
            type="checkbox"
            checked={autoSchedule}
            onChange={e => {
              setAutoSchedule(e.target.checked);
              showToast('Preference updated', 'info');
            }}
            style={{ width: 18, height: 18 }}
          />
        </div>
      </div>

      {/* Data & Export */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Database size={18} color="var(--primary)" />
          <h3 style={{ fontSize: 16, fontWeight: 700 }}>Data & Local Backup</h3>
        </div>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
          Export all workspace pages, databases, habits, memories, and finance records in structured JSON or Markdown formats.
        </p>
        <div style={{ display: 'flex', gap: 10 }}>
          <Button variant="secondary" size="sm" onClick={() => showToast('Exported LifeSync JSON archive!', 'success')}>
            Export Full Archive
          </Button>
          <Button variant="ghost" size="sm" onClick={() => showToast('Reset to demo state', 'info')}>
            Reset Demo Data
          </Button>
        </div>
      </div>
    </div>
  );
};
