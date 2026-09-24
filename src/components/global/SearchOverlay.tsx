import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { store } from '../../services';
import {
  Search, CheckSquare, Layers, Target, FileText,
  Bookmark, Calendar as CalIcon, DollarSign, X, ArrowRight
} from 'lucide-react';
import { AiCreativeIcon } from '../icons/AiCreativeIcon';

export const SearchOverlay: React.FC = () => {
  const { isSearchOpen, closeSearch } = useApp();
  const [query, setQuery] = useState('');
  const [askAiResult, setAskAiResult] = useState<string | null>(null);
  const [isAsking, setIsAsking] = useState(false);
  const navigate = useNavigate();

  const results = useMemo(() => {
    if (!query.trim()) return null;
    const q = query.toLowerCase();

    const tasks = store.tasks.filter(t => t.title.toLowerCase().includes(q) || t.tags.some(tag => tag.toLowerCase().includes(q)));
    const projects = store.projects.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    const goals = store.goals.filter(g => g.name.toLowerCase().includes(q));
    const notes = store.notes.filter(n => n.title.toLowerCase().includes(q) || n.preview.toLowerCase().includes(q));
    const memories = store.memories.filter(m => m.title.toLowerCase().includes(q) || m.content.toLowerCase().includes(q));
    const events = store.calendarEvents.filter(e => e.title.toLowerCase().includes(q));
    const pages = store.pages.filter(p => p.title.toLowerCase().includes(q));

    const totalCount = tasks.length + projects.length + goals.length + notes.length + memories.length + events.length + pages.length;

    return { tasks, projects, goals, notes, memories, events, pages, totalCount };
  }, [query]);

  if (!isSearchOpen) return null;

  const handleItemClick = (path: string) => {
    navigate(path);
    closeSearch();
  };

  const handleAskLifeSync = () => {
    if (!query.trim()) return;
    setIsAsking(true);
    setTimeout(() => {
      setAskAiResult(`Based on your recent activity: You have been focusing heavily on "Career Development" (9 tasks completed, studying Spring Boot architecture), maintained a 14-day streak on morning deep learning, and have an interview with TechCorp today at 11:00 AM.`);
      setIsAsking(false);
    }, 700);
  };

  return (
    <div
      className="modal-backdrop"
      onClick={closeSearch}
      style={{ alignItems: 'flex-start', paddingTop: '80px' }}
    >
      <div
        className="modal-content animate-fade-in"
        style={{ maxWidth: '680px', borderRadius: 'var(--radius-panel)' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '16px 20px',
          borderBottom: '1px solid var(--outline-subtle)'
        }}>
          <Search size={20} color="var(--primary)" />
          <input
            type="text"
            className="form-input"
            value={query}
            onChange={e => {
              setQuery(e.target.value);
              setAskAiResult(null);
            }}
            placeholder="Search pages, tasks, projects, memories, or ask LifeSync..."
            style={{
              border: 'none',
              boxShadow: 'none',
              padding: 0,
              fontSize: 16,
              fontWeight: 500
            }}
            autoFocus
          />
          {query && (
            <button className="btn-icon" onClick={() => setQuery('')}>
              <X size={16} />
            </button>
          )}
          <span style={{
            fontSize: 11,
            color: 'var(--text-tertiary)',
            background: 'var(--surface-soft)',
            padding: '3px 7px',
            borderRadius: 4,
            fontWeight: 600
          }}>ESC</span>
        </div>

        {/* Query Body */}
        <div style={{ maxHeight: '60vh', overflowY: 'auto', padding: '16px 20px' }}>
          {/* Ask AI Prompt Bar */}
          {query.trim() && !askAiResult && (
            <div
              onClick={handleAskLifeSync}
              className="card-interactive"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                background: 'var(--primary-subtle)',
                borderRadius: 'var(--radius-card)',
                marginBottom: 16,
                border: '1px solid var(--primary-soft)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <AiCreativeIcon size={18} color="var(--primary)" />
                <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--primary)' }}>
                  Ask LifeSync AI: "{query}"
                </span>
              </div>
              {isAsking ? (
                <span style={{ fontSize: 12, color: 'var(--primary)' }}>Connecting the dots...</span>
              ) : (
                <ArrowRight size={16} color="var(--primary)" />
              )}
            </div>
          )}

          {/* Ask AI Result */}
          {askAiResult && (
            <div className="ai-card animate-fade-in" style={{ marginBottom: 16, padding: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                <div className="ai-pill"><AiCreativeIcon size={12} /> LifeSync Intelligence</div>
              </div>
              <p style={{ fontSize: 14, color: 'var(--text-primary)', lineHeight: 1.6 }}>{askAiResult}</p>
            </div>
          )}

          {/* Results List */}
          {results && results.totalCount > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Pages */}
              {results.pages.length > 0 && (
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: 8, letterSpacing: '0.05em' }}>
                    Pages
                  </div>
                  {results.pages.map(page => (
                    <div
                      key={page.id}
                      onClick={() => handleItemClick(`/workspace/pages/${page.id}`)}
                      className="card-interactive"
                      style={{ padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 10, borderRadius: 'var(--radius-sm)', marginBottom: 4 }}
                    >
                      <span style={{ fontSize: 16 }}>{page.icon || '📄'}</span>
                      <span style={{ fontWeight: 600, fontSize: 14 }}>{page.title}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Tasks */}
              {results.tasks.length > 0 && (
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: 8, letterSpacing: '0.05em' }}>
                    Tasks
                  </div>
                  {results.tasks.map(task => (
                    <div
                      key={task.id}
                      onClick={() => handleItemClick('/tasks')}
                      className="card-interactive"
                      style={{ padding: '10px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderRadius: 'var(--radius-sm)', marginBottom: 4 }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <CheckSquare size={16} color="var(--primary)" />
                        <span style={{ fontSize: 14, fontWeight: 500 }}>{task.title}</span>
                      </div>
                      <span className="badge badge-primary" style={{ fontSize: 11 }}>{task.projectName || 'Task'}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Projects */}
              {results.projects.length > 0 && (
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: 8, letterSpacing: '0.05em' }}>
                    Projects
                  </div>
                  {results.projects.map(proj => (
                    <div
                      key={proj.id}
                      onClick={() => handleItemClick(`/projects/${proj.id}`)}
                      className="card-interactive"
                      style={{ padding: '10px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderRadius: 'var(--radius-sm)', marginBottom: 4 }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <Layers size={16} color={proj.color} />
                        <span style={{ fontSize: 14, fontWeight: 600 }}>{proj.name}</span>
                      </div>
                      <span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>{proj.progress}% done</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Memories */}
              {results.memories.length > 0 && (
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: 8, letterSpacing: '0.05em' }}>
                    Memories
                  </div>
                  {results.memories.map(mem => (
                    <div
                      key={mem.id}
                      onClick={() => handleItemClick('/memories')}
                      className="card-interactive"
                      style={{ padding: '10px 12px', display: 'flex', alignItems: 'flex-start', gap: 10, borderRadius: 'var(--radius-sm)', marginBottom: 4 }}
                    >
                      <Bookmark size={16} color="#8B5CF6" style={{ marginTop: 2 }} />
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 600 }}>{mem.title}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{mem.content}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : query.trim() && results?.totalCount === 0 && !askAiResult ? (
            <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--text-tertiary)' }}>
              No matches found for "{query}". Try asking LifeSync AI above.
            </div>
          ) : !query.trim() ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-tertiary)' }}>Quick Suggestions:</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {['Spring Boot', 'Marathon', 'Career', 'Coffee Preference', 'Job Applications', 'Monthly Budget'].map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => setQuery(s)}
                    className="btn btn-sm btn-ghost"
                    style={{ background: 'var(--surface-soft)', borderRadius: 'var(--radius-full)' }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
