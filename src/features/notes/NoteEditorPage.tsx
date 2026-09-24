import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEditor, EditorContent } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react/menus';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import Highlight from '@tiptap/extension-highlight';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import { Table } from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import HorizontalRule from '@tiptap/extension-horizontal-rule';
import CodeBlock from '@tiptap/extension-code-block';
import { useApp } from '../../context/AppContext';
import { store, noteService, taskService } from '../../services';
import { Note } from '../../types';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';

import {
  ArrowLeft, Star, Share2, MoreHorizontal, Save,
  Bold, Italic, Underline as UnderlineIcon, Strikethrough, Highlighter,
  List, ListOrdered, CheckSquare, Quote, Code, Link as LinkIcon,
  Table as TableIcon, Minus, Undo2, Redo2, Type, Image as ImageIcon,
  X, Plus, Wand2, FileText, Clock, AlignLeft, ChevronDown,
  PanelRight, Maximize2, Minimize2, Trash2, Copy, Archive,
  Tag, FolderPlus, Check
} from 'lucide-react';
import './NoteEditor.css';
import { AiCreativeIcon } from '../../components/icons/AiCreativeIcon';


const SLASH_COMMANDS = [
  { label: 'Heading 1', description: 'Large heading', icon: 'H1', action: (editor: any) => editor.chain().focus().toggleHeading({ level: 1 }).run() },
  { label: 'Heading 2', description: 'Medium heading', icon: 'H2', action: (editor: any) => editor.chain().focus().toggleHeading({ level: 2 }).run() },
  { label: 'Heading 3', description: 'Small heading', icon: 'H3', action: (editor: any) => editor.chain().focus().toggleHeading({ level: 3 }).run() },
  { label: 'Bullet List', description: 'Unordered list', icon: '•', action: (editor: any) => editor.chain().focus().toggleBulletList().run() },
  { label: 'Numbered List', description: 'Ordered list', icon: '1.', action: (editor: any) => editor.chain().focus().toggleOrderedList().run() },
  { label: 'Checklist', description: 'Task / to-do list', icon: '☐', action: (editor: any) => editor.chain().focus().toggleTaskList().run() },
  { label: 'Quote', description: 'Blockquote', icon: '"', action: (editor: any) => editor.chain().focus().toggleBlockquote().run() },
  { label: 'Code Block', description: 'Code snippet', icon: '<>', action: (editor: any) => editor.chain().focus().toggleCodeBlock().run() },
  { label: 'Divider', description: 'Horizontal rule', icon: '—', action: (editor: any) => editor.chain().focus().setHorizontalRule().run() },
  { label: 'Table', description: '3×3 table', icon: '⊞', action: (editor: any) => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run() },
];

export const NoteEditorPage: React.FC = () => {
  const { noteId } = useParams<{ noteId: string }>();
  const navigate = useNavigate();
  const { showToast, triggerConfetti } = useApp();
  const isNew = noteId === 'new';

  const [note, setNote] = useState<Note | null>(null);
  const [title, setTitle] = useState('Untitled Note');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [saveState, setSaveState] = useState<'saved' | 'saving' | 'unsaved'>('saved');
  const [showAiPanel, setShowAiPanel] = useState(false);
  const [showSlash, setShowSlash] = useState(false);
  const [slashQuery, setSlashQuery] = useState('');
  const [slashPos, setSlashPos] = useState({ top: 0, left: 0 });
  const [slashIdx, setSlashIdx] = useState(0);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<string | null>(null);
  const [extractedTasks, setExtractedTasks] = useState<{ title: string; due: string }[] | null>(null);
  const [createdAt] = useState(() => new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }));

  // Save As modal state
  const [saveAsModalMode, setSaveAsModalMode] = useState<'saveAs' | 'backSaveAs' | null>(null);
  const [saveAsInput, setSaveAsInput] = useState('');

  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const noteIdRef = useRef<string | null>(isNew ? null : noteId ?? null);
  const titleRef = useRef(title);
  const tagsRef = useRef(tags);
  const isFavoriteRef = useRef(isFavorite);
  titleRef.current = title;
  tagsRef.current = tags;
  isFavoriteRef.current = isFavorite;

  /* ── TipTap editor ── */
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ codeBlock: false }),
      Placeholder.configure({ placeholder: "Start writing, or type '/' for commands…" }),
      Underline,
      Highlight.configure({ multicolor: true }),
      TextStyle,
      Color,
      Link.configure({ openOnClick: false }),
      Image,
      TaskList,
      TaskItem.configure({ nested: true }),
      Table.configure({ resizable: true }),
      TableRow,
      TableCell,
      TableHeader,
      HorizontalRule,
      CodeBlock,
    ],
    content: '',
    onUpdate: () => {
      setSaveState('unsaved');
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      saveTimerRef.current = setTimeout(() => persistNote(false), 1500);
    },
    editorProps: {
      handleKeyDown: (view, event) => {
        if (event.key === '/') {
          const { top, left } = view.coordsAtPos(view.state.selection.from);
          setSlashPos({ top: top + 24, left });
          setShowSlash(true);
          setSlashQuery('');
          setSlashIdx(0);
          return false;
        }
        if (showSlash) {
          if (event.key === 'Escape') { setShowSlash(false); return true; }
          if (event.key === 'ArrowDown') { setSlashIdx(i => Math.min(i + 1, filteredCommands().length - 1)); return true; }
          if (event.key === 'ArrowUp') { setSlashIdx(i => Math.max(i - 1, 0)); return true; }
          if (event.key === 'Enter') {
            const cmds = filteredCommands();
            if (cmds[slashIdx]) runSlashCommand(cmds[slashIdx]);
            return true;
          }
          if (event.key === 'Backspace' && slashQuery === '') { setShowSlash(false); return false; }
          if (event.key !== 'Backspace') {
            setSlashQuery(q => q + event.key);
            setSlashIdx(0);
          } else {
            setSlashQuery(q => q.slice(0, -1));
          }
        }
        return false;
      }
    }
  });

  const filteredCommands = useCallback(() =>
    SLASH_COMMANDS.filter(c => c.label.toLowerCase().includes(slashQuery.toLowerCase())),
    [slashQuery]);

  const runSlashCommand = (cmd: typeof SLASH_COMMANDS[0]) => {
    if (!editor) return;
    setShowSlash(false);
    // delete the slash + query
    const { from } = editor.state.selection;
    editor.chain().focus().deleteRange({ from: from - slashQuery.length - 1, to: from }).run();
    cmd.action(editor);
  };

  /* ── Load existing note ── */
  useEffect(() => {
    if (isNew) return;
    const found = store.notes.find(n => n.id === noteId);
    if (found) {
      setNote(found);
      setTitle(found.title);
      setTags(found.tags ?? []);
      setIsFavorite(!!(found as any).isFavorite);
      if (editor && found.content) {
        editor.commands.setContent(found.content);
      }
    }
  }, [noteId, isNew, editor]);

  /* ── Persist note ── */
  const persistNote = useCallback(async (showFeedback = false) => {
    if (!editor) return;
    setSaveState('saving');
    const content = editor.getHTML();
    const textContent = editor.getText();
    const preview = textContent.slice(0, 120);

    const payload = {
      title: titleRef.current || 'Untitled Note',
      content,
      preview,
      tags: tagsRef.current,
      category: 'General',
      isPinned: false,
      isArchived: false,
      isFavorite: isFavoriteRef.current,
    } as any;

    if (noteIdRef.current) {
      await noteService.updateNote(noteIdRef.current, payload);
    } else {
      const created = await noteService.createNote(payload);
      noteIdRef.current = created.id;
      window.history.replaceState(null, '', `/notes/${created.id}/edit`);
    }
    setSaveState('saved');
    if (showFeedback) {
      showToast('Note saved successfully! (Ctrl+S)', 'success');
    }
  }, [editor, showToast]);

  /* ── Global Ctrl+S / Cmd+S Listener ── */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        persistNote(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [persistNote]);

  /* ── Open Save As Modal ── */
  const handleOpenSaveAs = () => {
    setShowMoreMenu(false);
    setSaveAsInput(title === 'Untitled Note' ? '' : `${title} (Copy)`);
    setSaveAsModalMode('saveAs');
  };

  /* ── Submit Save As Modal ── */
  const handleSaveAsSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!editor) return;

    const finalTitle = saveAsInput.trim() || 'Untitled Note';
    setTitle(finalTitle);
    titleRef.current = finalTitle;

    if (saveAsModalMode === 'saveAs') {
      setSaveState('saving');
      const content = editor.getHTML();
      const textContent = editor.getText();
      const preview = textContent.slice(0, 120);

      const created = await noteService.createNote({
        title: finalTitle,
        content,
        preview,
        tags: tagsRef.current,
        category: 'General',
        isPinned: false,
        isArchived: false,
        isFavorite: isFavoriteRef.current,
      } as any);

      noteIdRef.current = created.id;
      window.history.replaceState(null, '', `/notes/${created.id}/edit`);
      setSaveState('saved');
      showToast(`Note saved as "${finalTitle}"!`, 'success');
      setSaveAsModalMode(null);
    } else if (saveAsModalMode === 'backSaveAs') {
      await persistNote(false);
      showToast(`Saved "${finalTitle}"`, 'success');
      setSaveAsModalMode(null);
      navigate('/notes');
    }
  };

  /* ── Back Navigation with Save As check ── */
  const handleBack = async () => {
    if (!editor) {
      navigate('/notes');
      return;
    }

    const textContent = editor.getText().trim();
    // If it's a new note or untitled and has content, open Save As modal popup
    if ((!noteIdRef.current || title === 'Untitled Note') && textContent.length > 0) {
      setSaveAsInput(title === 'Untitled Note' ? '' : title);
      setSaveAsModalMode('backSaveAs');
    } else {
      // Already saved or empty note, simply save and navigate
      await persistNote(false);
      navigate('/notes');
    }
  };

  /* ── Tag management ── */
  const addTag = (e: React.KeyboardEvent) => {
    if ((e.key === 'Enter' || e.key === ',') && tagInput.trim()) {
      e.preventDefault();
      const newTag = tagInput.trim().replace(/^#/, '');
      if (!tags.includes(newTag)) setTags(prev => [...prev, newTag]);
      setTagInput('');
      setSaveState('unsaved');
    }
  };

  const removeTag = (tag: string) => {
    setTags(prev => prev.filter(t => t !== tag));
    setSaveState('unsaved');
  };

  /* ── AI actions ── */
  const runAiAction = async (action: string) => {
    if (!editor) return;
    setAiLoading(true);
    setAiResult(null);
    setExtractedTasks(null);
    const content = editor.getText();
    await new Promise(r => setTimeout(r, 1200));

    if (action === 'extract') {
      setExtractedTasks([
        { title: `Review key concepts from "${title}"`, due: 'Tomorrow' },
        { title: `Schedule follow-up session for ${title}`, due: 'This week' },
      ]);
    } else {
      const results: Record<string, string> = {
        summarize: `**Summary of "${title}"**\n\nThis note covers the core concepts captured in your knowledge vault. The main themes include your written content with key takeaways identified by AI.`,
        improve: `✨ **Writing improved.** Your content has been restructured for clarity, with smoother transitions and more active voice throughout.`,
        grammar: `✅ **Grammar check complete.** No significant issues found. Your writing is clear and well-structured.`,
        shorter: `**Condensed version:**\nKey points from this note, distilled to the essential insights only.`,
        longer: `**Expanded version:**\nBuilding on your existing content, here's a more detailed exploration of the concepts you've written about...`,
        tasks: `**Action items detected:**\n- Complete the review process\n- Schedule a follow-up\n- Document the outcomes`,
        questions: `**Study questions:**\n1. What are the core principles here?\n2. How does this connect to your existing goals?\n3. What action will you take this week?`,
      };
      setAiResult(results[action] || 'AI analysis complete.');
    }
    setAiLoading(false);
  };

  /* ── Delete note ── */
  const handleDelete = async () => {
    if (!noteIdRef.current) { navigate('/notes'); return; }
    if (window.confirm('Delete this note permanently?')) {
      await noteService.deleteNote(noteIdRef.current);
      navigate('/notes');
    }
  };

  /* ── Focus mode: hide sidebar ── */
  useEffect(() => {
    const sidebar = document.querySelector('.sidebar-container') as HTMLElement | null;
    const shell = document.querySelector('.app-shell') as HTMLElement | null;
    if (isFocusMode) {
      sidebar?.classList.add('force-hidden');
      shell?.classList.add('focus-mode-shell');
    } else {
      sidebar?.classList.remove('force-hidden');
      shell?.classList.remove('focus-mode-shell');
    }
    return () => {
      sidebar?.classList.remove('force-hidden');
      shell?.classList.remove('focus-mode-shell');
    };
  }, [isFocusMode]);

  // Close more menu on outside click
  useEffect(() => {
    const handleClickOutside = () => setShowMoreMenu(false);
    if (showMoreMenu) {
      window.addEventListener('click', handleClickOutside);
    }
    return () => window.removeEventListener('click', handleClickOutside);
  }, [showMoreMenu]);

  if (!editor) return null;

  const saveLabel = saveState === 'saving' ? 'Saving…' : saveState === 'unsaved' ? 'Unsaved' : 'Saved';
  const saveDot = saveState === 'saved' ? '#10B981' : saveState === 'saving' ? '#F59E0B' : '#9CA3AF';

  return (
    <div className={`note-editor-root ${isFocusMode ? 'focus-mode' : ''}`}>

      {/* ── Toolbar ── */}
      <div className="note-toolbar">
        <div className="note-toolbar-group">
          <button className="note-tool-btn" title="Undo" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()}><Undo2 size={15} /></button>
          <button className="note-tool-btn" title="Redo" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()}><Redo2 size={15} /></button>
        </div>
        <div className="note-toolbar-sep" />

        {/* Heading selector */}
        <div style={{ position: 'relative' }}>
          <select
            className="note-tool-select"
            value={
              editor.isActive('heading', { level: 1 }) ? 'h1'
              : editor.isActive('heading', { level: 2 }) ? 'h2'
              : editor.isActive('heading', { level: 3 }) ? 'h3'
              : 'p'
            }
            onChange={e => {
              const v = e.target.value;
              if (v === 'p') editor.chain().focus().setParagraph().run();
              else editor.chain().focus().toggleHeading({ level: parseInt(v.replace('h', '')) as 1|2|3 }).run();
            }}
          >
            <option value="p">Normal</option>
            <option value="h1">Heading 1</option>
            <option value="h2">Heading 2</option>
            <option value="h3">Heading 3</option>
          </select>
        </div>
        <div className="note-toolbar-sep" />

        <div className="note-toolbar-group">
          <button className={`note-tool-btn ${editor.isActive('bold') ? 'active' : ''}`} title="Bold (Ctrl+B)" onClick={() => editor.chain().focus().toggleBold().run()}><Bold size={14} /></button>
          <button className={`note-tool-btn ${editor.isActive('italic') ? 'active' : ''}`} title="Italic (Ctrl+I)" onClick={() => editor.chain().focus().toggleItalic().run()}><Italic size={14} /></button>
          <button className={`note-tool-btn ${editor.isActive('underline') ? 'active' : ''}`} title="Underline (Ctrl+U)" onClick={() => editor.chain().focus().toggleUnderline().run()}><UnderlineIcon size={14} /></button>
          <button className={`note-tool-btn ${editor.isActive('strike') ? 'active' : ''}`} title="Strikethrough" onClick={() => editor.chain().focus().toggleStrike().run()}><Strikethrough size={14} /></button>
          <button className={`note-tool-btn ${editor.isActive('highlight') ? 'active' : ''}`} title="Highlight" onClick={() => editor.chain().focus().toggleHighlight().run()}><Highlighter size={14} /></button>
        </div>
        <div className="note-toolbar-sep" />

        <div className="note-toolbar-group">
          <button className={`note-tool-btn ${editor.isActive('bulletList') ? 'active' : ''}`} title="Bullet List" onClick={() => editor.chain().focus().toggleBulletList().run()}><List size={14} /></button>
          <button className={`note-tool-btn ${editor.isActive('orderedList') ? 'active' : ''}`} title="Numbered List" onClick={() => editor.chain().focus().toggleOrderedList().run()}><ListOrdered size={14} /></button>
          <button className={`note-tool-btn ${editor.isActive('taskList') ? 'active' : ''}`} title="Checklist" onClick={() => editor.chain().focus().toggleTaskList().run()}><CheckSquare size={14} /></button>
        </div>
        <div className="note-toolbar-sep" />

        <div className="note-toolbar-group">
          <button className={`note-tool-btn ${editor.isActive('blockquote') ? 'active' : ''}`} title="Quote" onClick={() => editor.chain().focus().toggleBlockquote().run()}><Quote size={14} /></button>
          <button className={`note-tool-btn ${editor.isActive('codeBlock') ? 'active' : ''}`} title="Code Block" onClick={() => editor.chain().focus().toggleCodeBlock().run()}><Code size={14} /></button>
          <button className="note-tool-btn" title="Divider" onClick={() => editor.chain().focus().setHorizontalRule().run()}><Minus size={14} /></button>
          <button className="note-tool-btn" title="Insert Table" onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}><TableIcon size={14} /></button>
          <button className="note-tool-btn" title="Add Link" onClick={() => {
            const url = window.prompt('URL:');
            if (url) editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
          }}><LinkIcon size={14} /></button>
        </div>
      </div>

      {/* ── Header ── */}
      <div className="note-header">
        <div className="note-header-left">
          <button className="note-back-btn" onClick={handleBack} title="Return to Notes">
            <ArrowLeft size={16} />
            <span>Notes</span>
          </button>
        </div>

        {/* Save indicator with animated tick mark */}
        <div className="note-save-indicator">
          {saveState === 'saved' ? (
            <Check size={14} color="#10B981" className="note-saved-tick" />
          ) : saveState === 'saving' ? (
            <span className="save-spinner" />
          ) : (
            <span className="save-dot" style={{ background: saveDot }} />
          )}
          <span className="save-label" style={{ color: saveState === 'saved' ? '#10B981' : undefined, fontWeight: saveState === 'saved' ? 600 : undefined }}>
            {saveLabel}
          </span>
        </div>

        <div className="note-header-right">
          <button
            className={`note-icon-btn ${isFavorite ? 'active-star' : ''}`}
            title="Favorite / Bookmark"
            onClick={() => { setIsFavorite(f => !f); setSaveState('unsaved'); }}
          >
            <Star size={16} fill={isFavorite ? 'currentColor' : 'none'} />
          </button>
          <button className="note-icon-btn" title="Focus mode" onClick={() => setIsFocusMode(f => !f)}>
            {isFocusMode ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
          <button
            className={`note-ai-btn ${showAiPanel ? 'active' : ''}`}
            onClick={() => { setShowAiPanel(p => !p); setAiResult(null); setExtractedTasks(null); }}
          >
            <AiCreativeIcon size={14} />
            AI
          </button>

          {/* 3-dots More Menu */}
          <div style={{ position: 'relative' }}>
            <button
              className="note-icon-btn"
              title="More options"
              onClick={e => {
                e.stopPropagation();
                setShowMoreMenu(m => !m);
              }}
            >
              <MoreHorizontal size={16} />
            </button>
            {showMoreMenu && (
              <div className="note-more-menu" onClick={e => e.stopPropagation()}>
                <button onClick={() => { setShowMoreMenu(false); persistNote(true); }}>
                  <Save size={13} color="var(--primary)" />
                  <span style={{ flex: 1 }}>Save</span>
                  <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>Ctrl+S</span>
                </button>
                <button onClick={handleOpenSaveAs}>
                  <FolderPlus size={13} color="#3B82F6" />
                  <span>Save As…</span>
                </button>
                <div style={{ height: 1, background: 'var(--outline-subtle)', margin: '4px 0' }} />
                <button onClick={() => { navigator.clipboard.writeText(title + '\n\n' + editor.getText()); setShowMoreMenu(false); showToast('Note copied to clipboard', 'info'); }}>
                  <Copy size={13} /> Duplicate content
                </button>
                <button onClick={() => { setShowMoreMenu(false); showToast('Note archived', 'info'); }}>
                  <Archive size={13} /> Archive note
                </button>
                <div style={{ height: 1, background: 'var(--outline-subtle)', margin: '4px 0' }} />
                <button className="danger" onClick={() => { setShowMoreMenu(false); handleDelete(); }}>
                  <Trash2 size={13} /> Delete note
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Main Layout ── */}
      <div className="note-layout">
        {/* ── Writing Canvas ── */}
        <div className="note-canvas">
          {/* Title */}
          <div className="note-title-area">
            <input
              className="note-title-input"
              value={title}
              onChange={e => { setTitle(e.target.value); setSaveState('unsaved'); }}
              placeholder="Untitled Note"
              onBlur={() => { if (saveState === 'unsaved') persistNote(); }}
            />

            {/* Meta row */}
            <div className="note-meta-row">
              <span className="note-meta-item">
                <Clock size={12} />
                Created {createdAt}
              </span>
              <span className="note-meta-dot" />
              <span className="note-meta-item">
                <FileText size={12} />
                {editor.storage?.characterCount?.words?.() ?? 0} words
              </span>
            </div>

            {/* Tags */}
            <div className="note-tags-row">
              <Tag size={12} color="var(--text-tertiary)" />
              {tags.map(tag => (
                <span key={tag} className="note-tag">
                  #{tag}
                  <button onClick={() => removeTag(tag)}><X size={10} /></button>
                </span>
              ))}
              <input
                className="note-tag-input"
                placeholder="Add tag…"
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={addTag}
              />
            </div>
          </div>

          {/* Bubble Menu (selection toolbar) */}
          {editor && (
            <BubbleMenu editor={editor} className="note-bubble-menu">
              <button className={editor.isActive('bold') ? 'active' : ''} onClick={() => editor.chain().focus().toggleBold().run()}><Bold size={13} /></button>
              <button className={editor.isActive('italic') ? 'active' : ''} onClick={() => editor.chain().focus().toggleItalic().run()}><Italic size={13} /></button>
              <button className={editor.isActive('underline') ? 'active' : ''} onClick={() => editor.chain().focus().toggleUnderline().run()}><UnderlineIcon size={13} /></button>
              <button className={editor.isActive('strike') ? 'active' : ''} onClick={() => editor.chain().focus().toggleStrike().run()}><Strikethrough size={13} /></button>
              <button className={editor.isActive('highlight') ? 'active' : ''} onClick={() => editor.chain().focus().toggleHighlight().run()}><Highlighter size={13} /></button>
              <span className="bubble-sep" />
              <button onClick={() => {
                const url = window.prompt('URL:');
                if (url) editor.chain().focus().setLink({ href: url }).run();
              }}><LinkIcon size={13} /></button>
            </BubbleMenu>
          )}

          {/* Editor Body */}
          <div className="note-editor-body" onClick={() => editor?.commands.focus()}>
            <EditorContent editor={editor} className="note-prosemirror" />
          </div>

          {/* Slash Command Menu */}
          {showSlash && (
            <div
              className="note-slash-menu"
              style={{ top: slashPos.top, left: Math.min(slashPos.left, window.innerWidth - 260) }}
            >
              <div className="slash-menu-header">Commands</div>
              {filteredCommands().map((cmd, i) => (
                <button
                  key={cmd.label}
                  className={`slash-item ${i === slashIdx ? 'selected' : ''}`}
                  onMouseDown={(e) => { e.preventDefault(); runSlashCommand(cmd); }}
                >
                  <span className="slash-icon">{cmd.icon}</span>
                  <span className="slash-label">{cmd.label}</span>
                  <span className="slash-desc">{cmd.description}</span>
                </button>
              ))}
              {filteredCommands().length === 0 && (
                <div className="slash-empty">No commands match "{slashQuery}"</div>
              )}
            </div>
          )}
        </div>

        {/* ── AI Panel ── */}
        {showAiPanel && (
          <div className="note-ai-panel">
            <div className="ai-panel-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div className="ai-panel-badge"><AiCreativeIcon size={12} /></div>
                <span style={{ fontWeight: 600, fontSize: 14 }}>AI Assistant</span>
              </div>
              <button onClick={() => setShowAiPanel(false)}><X size={14} /></button>
            </div>

            <div className="ai-panel-context">
              <p style={{ fontSize: 12, color: 'var(--text-tertiary)', margin: 0 }}>
                Working on: <strong style={{ color: 'var(--text-primary)' }}>{title}</strong>
              </p>
            </div>

            <div className="ai-panel-actions">
              {[
                { key: 'summarize', label: 'Summarize note', icon: <AlignLeft size={13} /> },
                { key: 'improve', label: 'Improve writing', icon: <Wand2 size={13} /> },
                { key: 'grammar', label: 'Fix grammar', icon: <Type size={13} /> },
                { key: 'shorter', label: 'Make shorter', icon: <Minus size={13} /> },
                { key: 'tasks', label: 'Generate action items', icon: <CheckSquare size={13} /> },
                { key: 'extract', label: 'Extract tasks', icon: <ListOrdered size={13} /> },
                { key: 'questions', label: 'Generate questions', icon: <AiCreativeIcon size={13} /> },
              ].map(({ key, label, icon }) => (
                <button key={key} className="ai-action-btn" onClick={() => runAiAction(key)} disabled={aiLoading}>
                  {icon}
                  {label}
                </button>
              ))}
            </div>

            {aiLoading && (
              <div className="ai-panel-loading">
                <span className="ai-spinner" />
                <span>Thinking…</span>
              </div>
            )}

            {aiResult && (
              <div className="ai-panel-result">
                <div className="ai-result-label">AI Result</div>
                <p style={{ fontSize: 13, lineHeight: 1.6, margin: 0, whiteSpace: 'pre-wrap' }}>{aiResult}</p>
              </div>
            )}

            {extractedTasks && (
              <div className="ai-panel-extracted">
                <div className="ai-result-label">AI detected tasks</div>
                {extractedTasks.map((t, i) => (
                  <div key={i} className="ai-task-item">
                    <CheckSquare size={13} color="var(--primary)" />
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 500 }}>{t.title}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>Due: {t.due}</div>
                    </div>
                  </div>
                ))}
                <button
                  className="ai-add-tasks-btn"
                  onClick={async () => {
                    for (const t of extractedTasks) {
                      await taskService.createTask({
                        title: t.title, status: 'todo', priority: 'medium',
                        dueDate: new Date().toISOString().split('T')[0], tags: ['AI-Extracted']
                      });
                    }
                    setExtractedTasks(null);
                    setAiResult('✅ Tasks added to your Task Manager!');
                  }}
                >
                  <Plus size={13} /> Add to Tasks
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Save As Modal Popup ── */}
      {saveAsModalMode && (
        <Modal
          isOpen={!!saveAsModalMode}
          onClose={() => setSaveAsModalMode(null)}
          title={saveAsModalMode === 'saveAs' ? 'Save Note As' : 'Save Note'}
          subtitle={
            saveAsModalMode === 'saveAs'
              ? 'Enter a title to save a new copy of this note'
              : 'Enter a title before returning to your notes'
          }
          maxWidth="460px"
        >
          <form onSubmit={handleSaveAsSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: 'var(--text-secondary)' }}>
                Note Title
              </label>
              <input
                type="text"
                className="form-input"
                value={saveAsInput}
                onChange={e => setSaveAsInput(e.target.value)}
                placeholder="e.g. Sprint Retrospective Notes"
                autoFocus
                style={{ width: '100%', height: 42, fontSize: 14 }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 8 }}>
              <Button type="button" variant="ghost" onClick={() => setSaveAsModalMode(null)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                {saveAsModalMode === 'saveAs' ? 'Save As Copy' : 'Save & Exit'}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

