import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { store, noteService } from '../../services';
import { Note } from '../../types';
import {
  Bookmark, Plus, Search, Tag, Pin, CheckSquare,
  Clock, ArrowRight, Trash2, Wand2, MoreVertical, Edit3,
  Share2, Star, Check
} from 'lucide-react';
import { AiCreativeIcon } from '../../components/icons/AiCreativeIcon';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import './NoteEditor.css';

// Curated aesthetic pastel themes for note cards
const NOTE_COLOR_THEMES = [
  {
    bg: '#FAF8FF',
    border: '#E5E1FB',
    accent: '#5D5FEF',
    badgeBg: '#EDE9FE',
    badgeColor: '#4343D5',
    topBar: '#5D5FEF',
    shadowHover: '0 12px 28px -6px rgba(93, 95, 239, 0.15)'
  },
  {
    bg: '#F4FDF7',
    border: '#D2F4DE',
    accent: '#10B981',
    badgeBg: '#D1FAE5',
    badgeColor: '#047857',
    topBar: '#10B981',
    shadowHover: '0 12px 28px -6px rgba(16, 185, 129, 0.15)'
  },
  {
    bg: '#FEFDF3',
    border: '#FDECB8',
    accent: '#D97706',
    badgeBg: '#FEF3C7',
    badgeColor: '#B45309',
    topBar: '#F59E0B',
    shadowHover: '0 12px 28px -6px rgba(217, 119, 6, 0.15)'
  },
  {
    bg: '#F3FAFF',
    border: '#CFECFE',
    accent: '#0284C7',
    badgeBg: '#E0F2FE',
    badgeColor: '#0369A1',
    topBar: '#0EA5E9',
    shadowHover: '0 12px 28px -6px rgba(2, 132, 199, 0.15)'
  },
  {
    bg: '#FEF5F6',
    border: '#FCD2D8',
    accent: '#E11D48',
    badgeBg: '#FFE4E6',
    badgeColor: '#BE123C',
    topBar: '#F43F5E',
    shadowHover: '0 12px 28px -6px rgba(225, 29, 72, 0.15)'
  },
  {
    bg: '#FAF5FF',
    border: '#F2DCFC',
    accent: '#9333EA',
    badgeBg: '#F3E8FF',
    badgeColor: '#7E22CE',
    topBar: '#A855F7',
    shadowHover: '0 12px 28px -6px rgba(147, 51, 234, 0.15)'
  },
  {
    bg: '#F2FCFB',
    border: '#C5F4EE',
    accent: '#0D9488',
    badgeBg: '#CCFBF1',
    badgeColor: '#0F766E',
    topBar: '#14B8A6',
    shadowHover: '0 12px 28px -6px rgba(13, 148, 136, 0.15)'
  }
];

const getNoteTheme = (noteId: string, index: number) => {
  let hash = 0;
  for (let i = 0; i < noteId.length; i++) {
    hash = (hash << 5) - hash + noteId.charCodeAt(i);
    hash |= 0;
  }
  const themeIndex = Math.abs(hash + index) % NOTE_COLOR_THEMES.length;
  return NOTE_COLOR_THEMES[themeIndex];
};

export const NotesPage: React.FC = () => {
  const { showToast, refreshKey } = useApp();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  // Modal states
  const [renamingNote, setRenamingNote] = useState<Note | null>(null);
  const [renameInput, setRenameInput] = useState('');
  const [deletingNote, setDeletingNote] = useState<Note | null>(null);

  // Close card menu on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest('.note-card-header-actions')) {
        setOpenMenuId(null);
      }
    };
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  const notes = store.notes;

  const allTags = ['all', 'Interview', 'Spring', 'Architecture', 'Habits', 'Marathon', 'Books'];

  // Filter notes and always prioritize pinned notes at the top
  const filteredNotes = notes
    .filter(n => {
      const matchesSearch = n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.content.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTag = selectedTag === 'all' || n.tags.includes(selectedTag);
      return matchesSearch && matchesTag;
    })
    .sort((a, b) => {
      // Pinned notes come first
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      // Then sort by most recently updated
      return new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime();
    });

  // Card 3-dot action handlers
  const handleTogglePin = async (note: Note, e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenMenuId(null);
    const newPinned = !note.isPinned;
    await noteService.updateNote(note.id, { isPinned: newPinned });
    showToast(newPinned ? 'Note pinned to top 📌' : 'Note unpinned', 'info');
  };

  const handleOpenRename = (note: Note, e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenMenuId(null);
    setRenamingNote(note);
    setRenameInput(note.title);
  };

  const handleSaveRename = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!renamingNote) return;
    const trimmed = renameInput.trim();
    if (!trimmed) {
      showToast('Title cannot be empty', 'warning');
      return;
    }
    await noteService.updateNote(renamingNote.id, { title: trimmed });
    showToast(`Renamed to "${trimmed}"`, 'success');
    setRenamingNote(null);
  };

  const handleToggleBookmark = async (note: Note, e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenMenuId(null);
    const newFav = !note.isFavorite;
    await noteService.updateNote(note.id, { isFavorite: newFav });
    showToast(newFav ? 'Added to Bookmarks ⭐' : 'Removed from Bookmarks', 'info');
  };

  const handleShare = async (note: Note, e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenMenuId(null);
    const shareUrl = `${window.location.origin}/notes/${note.id}/edit`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      showToast('Share link copied to clipboard!', 'success');
    } catch {
      showToast(`Share link: ${shareUrl}`, 'info');
    }
  };

  const handleOpenDelete = (note: Note, e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenMenuId(null);
    setDeletingNote(note);
  };

  const handleConfirmDelete = async () => {
    if (!deletingNote) return;
    const deletedTitle = deletingNote.title;
    await noteService.deleteNote(deletingNote.id);
    showToast(`Note "${deletedTitle}" deleted`, 'info');
    setDeletingNote(null);
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div className="page-header" style={{ marginBottom: 0 }}>
        <div className="page-title-group">
          <h1>Notes & Knowledge Vault</h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Capture ideas, study materials, and let AI extract tasks and reminders.
          </p>
        </div>
        <div className="page-actions">
          <Button variant="primary" size="sm" icon={<Plus size={15} />} onClick={() => navigate('/notes/new')}>
            New Note
          </Button>
        </div>
      </div>

      {/* AI Extraction Highlight Banner */}
      <div className="ai-card" style={{ padding: '16px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <div className="ai-pill"><Wand2 size={12} /> AI Note Intelligence</div>
        </div>
        <p style={{ fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.5 }}>
          LifeSync can automatically read your notes, extract actionable tasks, and schedule follow-ups into your calendar.
        </p>
      </div>

      {/* Search & Tag Filter Bar */}
      <div className="card" style={{ padding: '14px 18px', display: 'flex', flexWrap: 'wrap', gap: 14, alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 240, maxWidth: 380 }}>
          <Search size={15} color="var(--text-tertiary)" style={{ position: 'absolute', left: 12, top: 12 }} />
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: 34, height: 38 }}
            placeholder="Search notes or concepts..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {allTags.map(tag => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`btn btn-sm ${selectedTag === tag ? 'btn-primary' : 'btn-ghost'}`}
              style={{ borderRadius: 'var(--radius-full)' }}
            >
              #{tag}
            </button>
          ))}
        </div>
      </div>

      {/* Notes Grid */}
      <div className="grid-2">
        {filteredNotes.map((note, idx) => {
          const theme = getNoteTheme(note.id, idx);
          return (
            <div
              key={note.id}
              onClick={() => navigate(`/notes/${note.id}/edit`)}
              className="card card-interactive"
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
                position: 'relative',
                zIndex: openMenuId === note.id ? 80 : 1,
                background: theme.bg,
                borderColor: theme.border,
                borderTopWidth: 3,
                borderTopColor: theme.topBar,
                transition: 'all var(--transition-normal)'
              }}
            >
              {/* Card Top Row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 0 }}>
                  <Bookmark size={18} color={theme.accent} style={{ flexShrink: 0 }} />
                  <h3 style={{
                    fontSize: 16,
                    fontWeight: 700,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {note.title}
                  </h3>
                </div>

                {/* Actions on top right */}
                <div className="note-card-header-actions" onClick={e => e.stopPropagation()}>
                  {note.isFavorite && (
                    <span title="Bookmarked" style={{ display: 'inline-flex', marginRight: 2 }}>
                      <Star size={14} color="#F59E0B" fill="#F59E0B" />
                    </span>
                  )}
                  {note.isPinned && (
                    <span title="Pinned" style={{ display: 'inline-flex', marginRight: 2 }}>
                      <Pin size={14} color={theme.accent} />
                    </span>
                  )}

                  {/* 3 Dots Trigger */}
                  <button
                    type="button"
                    className="note-card-dots-btn"
                    title="More actions"
                    onClick={e => {
                      e.stopPropagation();
                      setOpenMenuId(openMenuId === note.id ? null : note.id);
                    }}
                  >
                    <MoreVertical size={16} />
                  </button>

                  {/* 3 Dots Dropdown Menu */}
                  {openMenuId === note.id && (
                    <div className="note-card-dropdown" onClick={e => e.stopPropagation()}>
                      <button type="button" onClick={e => handleTogglePin(note, e)}>
                        <Pin size={13} color={theme.accent} />
                        {note.isPinned ? 'Unpin note' : 'Pin note'}
                      </button>

                      <button type="button" onClick={e => handleOpenRename(note, e)}>
                        <Edit3 size={13} color="#3B82F6" />
                        Rename title
                      </button>

                      <button type="button" onClick={e => handleToggleBookmark(note, e)}>
                        <Star size={13} color="#F59E0B" fill={note.isFavorite ? '#F59E0B' : 'none'} />
                        {note.isFavorite ? 'Remove bookmark' : 'Add to bookmark'}
                      </button>

                      <button type="button" onClick={e => handleShare(note, e)}>
                        <Share2 size={13} color="#10B981" />
                        Share
                      </button>

                      <div className="note-card-dropdown-sep" />

                      <button type="button" className="danger" onClick={e => handleOpenDelete(note, e)}>
                        <Trash2 size={13} />
                        Delete note
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5, maxHeight: 60, overflow: 'hidden' }}>
                {note.preview}
              </p>

              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {note.tags.map(tag => (
                  <span
                    key={tag}
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      padding: '2.5px 8px',
                      borderRadius: 'var(--radius-full)',
                      background: theme.badgeBg,
                      color: theme.badgeColor,
                      border: `1px solid ${theme.border}`
                    }}
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingTop: 10,
                borderTop: `1px solid ${theme.border}`,
                fontSize: 11,
                color: 'var(--text-tertiary)'
              }}>
                <span style={{ fontWeight: 600, color: theme.badgeColor }}>{note.category}</span>
                <span>Updated {note.updatedAt ? note.updatedAt.split('T')[0] : 'Today'}</span>
              </div>
            </div>
          );
        })}
      </div>


      {/* ── Rename Note Modal Popup ── */}
      {renamingNote && (
        <Modal
          isOpen={!!renamingNote}
          onClose={() => setRenamingNote(null)}
          title="Rename Note"
          subtitle="Enter a new title for your note"
          maxWidth="460px"
        >
          <form onSubmit={handleSaveRename} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: 'var(--text-secondary)' }}>
                Note Title
              </label>
              <input
                type="text"
                className="form-input"
                value={renameInput}
                onChange={e => setRenameInput(e.target.value)}
                placeholder="e.g. System Design Interview Notes"
                autoFocus
                style={{ width: '100%', height: 42, fontSize: 14 }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 8 }}>
              <Button type="button" variant="ghost" onClick={() => setRenamingNote(null)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Save Changes
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* ── Delete Note Confirmation Modal Popup ── */}
      {deletingNote && (
        <Modal
          isOpen={!!deletingNote}
          onClose={() => setDeletingNote(null)}
          title="Delete Note"
          subtitle="This action cannot be undone."
          maxWidth="440px"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
              Are you sure you want to permanently delete <strong style={{ color: 'var(--text-primary)' }}>"{deletingNote.title}"</strong> from your knowledge vault?
            </p>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 4 }}>
              <Button type="button" variant="ghost" onClick={() => setDeletingNote(null)}>
                Cancel
              </Button>
              <button
                type="button"
                className="btn btn-primary"
                style={{ background: '#EF4444', borderColor: '#EF4444', color: '#fff' }}
                onClick={handleConfirmDelete}
              >
                <Trash2 size={14} style={{ marginRight: 6 }} />
                Delete Note
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};




