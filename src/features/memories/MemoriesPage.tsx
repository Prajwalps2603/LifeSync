import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { store, memoryService } from '../../services';
import { Memory } from '../../types';
import {
  Plus, Pin, Trash2, Search, Star, Shield, Brain
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';

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

/* ── Category metadata ────────────────────────────────────────────── */
const CAT_META: Record<string, { icon: string; gradient: string; border: string; text: string }> = {
  Preferences:      { icon: '⭐', gradient: 'linear-gradient(135deg,#FFFBEB,#FEF3C7)', border: '#FDE68A', text: '#92400E' },
  Work:             { icon: '💼', gradient: 'linear-gradient(135deg,#EFF6FF,#DBEAFE)', border: '#BFDBFE', text: '#1E40AF' },
  'Important Dates':{ icon: '📅', gradient: 'linear-gradient(135deg,#FFF1F2,#FFE4E6)', border: '#FECDD3', text: '#9F1239' },
  Personal:         { icon: '🫀', gradient: 'linear-gradient(135deg,#F5F3FF,#EDE9FE)', border: '#DDD6FE', text: '#5B21B6' },
  Learning:         { icon: '📖', gradient: 'linear-gradient(135deg,#ECFDF5,#D1FAE5)', border: '#A7F3D0', text: '#065F46' },
  Decisions:        { icon: '⚡', gradient: 'linear-gradient(135deg,#FFF7ED,#FFEDD5)', border: '#FED7AA', text: '#9A3412' },
};

const importanceDot = (imp: string) => {
  if (imp === 'high')   return { bg: '#FEF3C7', text: '#D97706', label: 'High' };
  if (imp === 'medium') return { bg: '#DBEAFE', text: '#2563EB', label: 'Med' };
  return                       { bg: '#F3F4F6', text: '#6B7280', label: 'Low' };
};

/* ─────────────────────────────────────────────────────────────────── */
export const MemoriesPage: React.FC = () => {
  const { openQuickAdd, showToast } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [editingMemory, setEditingMemory] = useState<Memory | null>(null);

  const memories = store.memories;

  const categories = ['all', 'Preferences', 'Work', 'Important Dates', 'Personal', 'Learning', 'Decisions'];

  const filteredMemories = memories.filter(m => {
    const matchesSearch = m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'all' || m.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const pinned  = filteredMemories.filter(m => m.isPinned);
  const regular = filteredMemories.filter(m => !m.isPinned);

  const handleTogglePin = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const mem = store.memories.find(m => m.id === id);
    if (mem) {
      await memoryService.updateMemory(id, { isPinned: !mem.isPinned });
      showToast(mem.isPinned ? 'Memory unpinned' : 'Memory pinned to top', 'info');
    }
  };

  const handleForgetMemory = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await memoryService.deleteMemory(id);
    showToast('Memory forgotten and removed from AI knowledge base', 'info');
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMemory) return;
    await memoryService.updateMemory(editingMemory.id, editingMemory);
    setEditingMemory(null);
    showToast('Memory updated', 'success');
  };

  const MemoryCard: React.FC<{ mem: Memory }> = ({ mem }) => {
    const meta = CAT_META[mem.category] ?? { icon: '🧠', gradient: 'linear-gradient(135deg,#F9FAFB,#F3F4F6)', border: '#E5E7EB', text: '#374151' };
    const imp  = importanceDot(mem.importance ?? 'low');
    return (
      <div
        onClick={() => setEditingMemory(mem)}
        style={{
          borderRadius: 16, overflow: 'hidden', cursor: 'pointer',
          background: '#fff', border: '1px solid var(--outline-subtle)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          display: 'flex', flexDirection: 'column',
          transition: 'box-shadow 0.18s ease, transform 0.18s ease',
        }}
        onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 28px rgba(0,0,0,0.09)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
        onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)'; e.currentTarget.style.transform = 'translateY(0)'; }}
      >
        {/* Category banner */}
        <div style={{ padding: '14px 16px 10px', background: meta.gradient, borderBottom: `1px solid ${meta.border}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 18, lineHeight: 1 }}>{meta.icon}</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: meta.text, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                {mem.category}
              </span>
            </div>
            <div style={{ display: 'flex', gap: 4 }}>
              <span style={{ padding: '2px 8px', borderRadius: 99, fontSize: 10.5, fontWeight: 700, background: imp.bg, color: imp.text }}>
                {imp.label}
              </span>
              {mem.isPinned && <Pin size={13} color="#4343D5" />}
            </div>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: '14px 16px', flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, lineHeight: 1.3, letterSpacing: '-0.01em' }}>{mem.title}</h3>
          <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', lineHeight: 1.55, flex: 1 }}>{mem.content}</p>

          {/* footer */}
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            paddingTop: 10, borderTop: '1px solid var(--outline-subtle)', marginTop: 2
          }}>
            <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>
              from <strong style={{ color: 'var(--text-secondary)' }}>{mem.source}</strong>
            </span>
            <div style={{ display: 'flex', gap: 4 }} onClick={e => e.stopPropagation()}>
              <button
                onClick={e => handleTogglePin(mem.id, e)}
                title={mem.isPinned ? 'Unpin' : 'Pin'}
                style={{
                  width: 26, height: 26, borderRadius: 7, border: 'none', cursor: 'pointer',
                  background: mem.isPinned ? '#E1E0FF' : 'var(--surface-soft)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <Pin size={12} color={mem.isPinned ? '#4343D5' : 'var(--text-tertiary)'} />
              </button>
              <button
                onClick={e => handleForgetMemory(mem.id, e)}
                title="Forget"
                style={{
                  width: 26, height: 26, borderRadius: 7, border: 'none', cursor: 'pointer',
                  background: 'var(--surface-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <Trash2 size={12} color="var(--text-tertiary)" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>

      {/* ── Hero Header ──────────────────────────────────── */}
      <div style={{
        borderRadius: 20, padding: '28px 28px 24px',
        background: 'linear-gradient(135deg, #0A0A1F 0%, #130E35 50%, #1A0A2E 100%)',
        position: 'relative', overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', top: -50, right: -50, width: 220, height: 220, borderRadius: '50%', background: 'rgba(217,70,239,0.15)', filter: 'blur(50px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -20, left: 60, width: 150, height: 150, borderRadius: '50%', background: 'rgba(139,92,246,0.2)', filter: 'blur(35px)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: 'linear-gradient(135deg, #8B5CF6, #D946EF)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 14px rgba(139,92,246,0.4)'
              }}>
                <Brain size={18} color="#fff" />
              </div>
              <h1 style={{ fontSize: 24, fontWeight: 800, color: '#fff', letterSpacing: '-0.03em' }}>Memory Bank</h1>
            </div>
            <p style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.5)', maxWidth: 420 }}>
              Things LifeSync automatically remembers and learns about you over time.
            </p>
          </div>

          <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ padding: '8px 14px', borderRadius: 10, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
              <span style={{ fontSize: 20, fontWeight: 800, color: '#fff', lineHeight: 1 }}>{memories.length}</span>
              <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Memories</span>
            </div>
            <div style={{ padding: '8px 14px', borderRadius: 10, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
              <span style={{ fontSize: 20, fontWeight: 800, color: '#A78BFA', lineHeight: 1 }}>{pinned.length}</span>
              <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Pinned</span>
            </div>
            <Button variant="primary" size="sm" icon={<Plus size={14} />} onClick={() => openQuickAdd('memory')}
              style={{ background: 'rgba(255,255,255,0.14)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff' }}>
              Add Memory
            </Button>
          </div>
        </div>
      </div>

      {/* ── AI Observation ────────────────────────────────── */}
      <div style={{
        borderRadius: 16, padding: '16px 20px',
        background: 'linear-gradient(90deg, #FAF5FF, #F3E8FF)',
        border: '1px solid #E9D5FF',
        display: 'flex', alignItems: 'flex-start', gap: 14, flexWrap: 'wrap'
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10, flexShrink: 0,
          background: 'linear-gradient(135deg, #7C3AED, #A855F7)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(124,58,237,0.35)'
        }}>
          <AiIcon size={16} color="#fff" />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#7C3AED', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 4 }}>
            AI Long-term Observation
          </div>
          <p style={{ fontSize: 13, color: '#3B1F6B', lineHeight: 1.55, fontWeight: 500 }}>
            "I've noticed you tend to execute deep architectural coding tasks best between 8:00 AM and 11:30 AM with oat milk coffee. Would you like me to protect this block next week?"
          </p>
          <Button variant="soft" size="sm"
            style={{ marginTop: 10, background: '#EDE9FE', color: '#5B21B6', border: 'none' }}
            onClick={() => showToast('Protected 8:00 AM – 11:30 AM focus block next week!', 'success')}>
            Protect Time Block
          </Button>
        </div>
      </div>

      {/* ── Search + Filter ───────────────────────────────── */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 240, maxWidth: 400 }}>
          <Search size={14} color="var(--text-tertiary)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: 34, height: 38, borderRadius: 10 }}
            placeholder="Search memories…"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {categories.map(cat => {
            const meta = CAT_META[cat];
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '6px 13px', borderRadius: 99, border: '1.5px solid', fontSize: 12, fontWeight: 600, cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  background: selectedCategory === cat
                    ? (cat === 'all' ? '#4343D5' : meta?.border ?? '#4343D5')
                    : 'transparent',
                  color: selectedCategory === cat ? (cat === 'all' ? '#fff' : meta?.text ?? '#fff') : 'var(--text-tertiary)',
                  borderColor: selectedCategory === cat ? 'transparent' : 'var(--outline-subtle)',
                }}
              >
                {cat === 'all' ? 'All' : `${meta?.icon} ${cat}`}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Pinned Memories ───────────────────────────────── */}
      {pinned.length > 0 && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <Pin size={13} color="#4343D5" />
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Pinned
            </span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
            {pinned.map(mem => <MemoryCard key={mem.id} mem={mem} />)}
          </div>
        </div>
      )}

      {/* ── All Memories ──────────────────────────────────── */}
      <div>
        {pinned.length > 0 && (
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>
            All Memories
          </div>
        )}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
          {regular.map(mem => <MemoryCard key={mem.id} mem={mem} />)}
        </div>
        {filteredMemories.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-tertiary)' }}>
            <Brain size={36} style={{ opacity: 0.25, marginBottom: 10 }} />
            <p style={{ fontSize: 14 }}>No memories found. Try a different search.</p>
          </div>
        )}
      </div>

      {/* ── Edit Memory Modal ─────────────────────────────── */}
      {editingMemory && (
        <Modal
          isOpen={!!editingMemory}
          onClose={() => setEditingMemory(null)}
          title="Edit Memory"
          subtitle="Refine information remembered by LifeSync AI."
        >
          <form onSubmit={handleSaveEdit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>Title</label>
              <input
                type="text" required className="form-input"
                value={editingMemory.title}
                onChange={e => setEditingMemory({ ...editingMemory, title: e.target.value })}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>Content</label>
              <textarea
                rows={4} required className="form-input"
                value={editingMemory.content}
                onChange={e => setEditingMemory({ ...editingMemory, content: e.target.value })}
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>Category</label>
                <select
                  className="form-input"
                  value={editingMemory.category}
                  onChange={e => setEditingMemory({ ...editingMemory, category: e.target.value as any })}
                >
                  {categories.filter(c => c !== 'all').map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>Source</label>
                <input
                  type="text" className="form-input"
                  value={editingMemory.source}
                  onChange={e => setEditingMemory({ ...editingMemory, source: e.target.value })}
                />
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 8 }}>
              <Button type="button" variant="ghost" onClick={() => setEditingMemory(null)}>Cancel</Button>
              <Button type="submit" variant="primary">Save Changes</Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
