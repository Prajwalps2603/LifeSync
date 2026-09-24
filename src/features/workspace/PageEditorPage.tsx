import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { store, pageService } from '../../services';
import { EditorBlock, BlockType } from '../../types';
import {
  ArrowLeft, Plus, CheckSquare, List, Hash, Quote,
  AlertCircle, Code, Minus, ChevronRight, ChevronDown, Trash2,
  Share2, Star, MoreVertical, Copy, Wand2
} from 'lucide-react';
import { AiCreativeIcon } from '../../components/icons/AiCreativeIcon';
import { Button } from '../../components/ui/Button';

export const PageEditorPage: React.FC = () => {
  const { pageId } = useParams<{ pageId: string }>();
  const navigate = useNavigate();
  const { showToast, triggerConfetti } = useApp();

  const page = store.pages.find(p => p.id === pageId) || store.pages[0];

  const [title, setTitle] = useState(page?.title || 'Career Strategy & Job Search');
  const [blocks, setBlocks] = useState<EditorBlock[]>(page?.blocks || []);
  const [slashMenuIndex, setSlashMenuIndex] = useState<number | null>(null);
  const [slashQuery, setSlashQuery] = useState('');

  useEffect(() => {
    if (page) {
      setTitle(page.title);
      setBlocks(page.blocks);
    }
  }, [pageId]);

  const savePage = async (newBlocks: EditorBlock[], newTitle = title) => {
    setBlocks(newBlocks);
    if (page) {
      await pageService.updatePage(page.id, {
        title: newTitle,
        blocks: newBlocks
      });
    }
  };

  const handleBlockChange = (index: number, content: string) => {
    const updated = [...blocks];
    updated[index].content = content;

    // Detect slash command
    if (content.startsWith('/')) {
      setSlashMenuIndex(index);
      setSlashQuery(content.slice(1).toLowerCase());
    } else {
      setSlashMenuIndex(null);
    }

    savePage(updated);
  };

  const handleToggleCheck = (index: number) => {
    const updated = [...blocks];
    updated[index].checked = !updated[index].checked;
    savePage(updated);
    if (updated[index].checked) {
      triggerConfetti();
    }
  };

  const handleToggleBlockOpen = (index: number) => {
    const updated = [...blocks];
    updated[index].isOpen = !updated[index].isOpen;
    savePage(updated);
  };

  const addBlock = (type: BlockType = 'text', atIndex?: number) => {
    const newBlock: EditorBlock = {
      id: `b-${Date.now()}`,
      type,
      content: type === 'callout' ? 'AI Insight: You have 2 follow-ups pending.' : '',
      checked: false,
      isOpen: true
    };
    const updated = [...blocks];
    if (atIndex !== undefined) {
      updated.splice(atIndex + 1, 0, newBlock);
    } else {
      updated.push(newBlock);
    }
    savePage(updated);
    setSlashMenuIndex(null);
  };

  const handleSelectSlashCommand = (type: BlockType) => {
    if (slashMenuIndex === null) return;
    const updated = [...blocks];
    updated[slashMenuIndex] = {
      ...updated[slashMenuIndex],
      type,
      content: ''
    };
    savePage(updated);
    setSlashMenuIndex(null);
  };

  const deleteBlock = (index: number) => {
    const updated = blocks.filter((_, idx) => idx !== index);
    savePage(updated);
  };

  const slashOptions: { type: BlockType; label: string; icon: React.ReactNode; desc: string }[] = [
    { type: 'text', label: 'Text', icon: <span style={{ fontWeight: 700 }}>T</span>, desc: 'Plain editorial text' },
    { type: 'heading_1', label: 'Heading 1', icon: <Hash size={16} />, desc: 'Large section heading' },
    { type: 'heading_2', label: 'Heading 2', icon: <Hash size={14} />, desc: 'Medium section heading' },
    { type: 'todo', label: 'To-do List', icon: <CheckSquare size={16} />, desc: 'Track tasks with checkbox' },
    { type: 'bullet_list', label: 'Bulleted List', icon: <List size={16} />, desc: 'Simple bulleted points' },
    { type: 'callout', label: 'Callout Box', icon: <AiCreativeIcon size={16} />, desc: 'Highlight important AI context' },
    { type: 'quote', label: 'Quote', icon: <Quote size={16} />, desc: 'Capture inspirational quotes' },
    { type: 'divider', label: 'Divider', icon: <Minus size={16} />, desc: 'Visual horizontal line' },
    { type: 'code', label: 'Code Block', icon: <Code size={16} />, desc: 'Syntax highlighted code' },
    { type: 'ai', label: 'AI Block', icon: <Wand2 size={16} />, desc: 'Ask LifeSync to generate block content' }
  ];

  const filteredSlashOptions = slashOptions.filter(opt =>
    opt.label.toLowerCase().includes(slashQuery) || opt.type.includes(slashQuery)
  );

  return (
    <div className="animate-fade-in" style={{ maxWidth: 860, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Top action bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button
          onClick={() => navigate('/workspace/pages')}
          className="btn btn-ghost btn-sm"
          style={{ paddingLeft: 0, color: 'var(--text-tertiary)' }}
        >
          <ArrowLeft size={15} /> All Pages
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button className="btn-icon" onClick={() => showToast('Page pinned to favorites', 'success')}>
            <Star size={16} />
          </button>
          <Button
            variant="ghost"
            size="sm"
            icon={<AiCreativeIcon size={14} />}
            onClick={() => {
              addBlock('callout');
              showToast('Added AI context block', 'primary');
            }}
          >
            Insert AI Block
          </Button>
        </div>
      </div>

      {/* Editor Surface */}
      <div className="card" style={{ padding: '40px 48px', minHeight: 600, background: 'var(--surface-white)' }}>
        {/* Page Icon & Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
          <span style={{ fontSize: 36 }}>{page?.icon || '📄'}</span>
          <input
            type="text"
            value={title}
            onChange={e => {
              setTitle(e.target.value);
              savePage(blocks, e.target.value);
            }}
            placeholder="Untitled Page"
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 32,
              fontWeight: 800,
              border: 'none',
              outline: 'none',
              width: '100%',
              color: 'var(--text-primary)',
              background: 'transparent'
            }}
          />
        </div>

        {/* Blocks Render List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {blocks.map((block, idx) => (
            <div key={block.id} style={{ position: 'relative' }} className="editor-block-row">
              {/* Heading 1 */}
              {block.type === 'heading_1' && (
                <input
                  type="text"
                  value={block.content}
                  onChange={e => handleBlockChange(idx, e.target.value)}
                  placeholder="Heading 1..."
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: 24,
                    fontWeight: 700,
                    border: 'none',
                    outline: 'none',
                    width: '100%',
                    background: 'transparent'
                  }}
                />
              )}

              {/* Heading 2 */}
              {block.type === 'heading_2' && (
                <input
                  type="text"
                  value={block.content}
                  onChange={e => handleBlockChange(idx, e.target.value)}
                  placeholder="Heading 2..."
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: 19,
                    fontWeight: 700,
                    border: 'none',
                    outline: 'none',
                    width: '100%',
                    background: 'transparent',
                    marginTop: 8
                  }}
                />
              )}

              {/* Text */}
              {block.type === 'text' && (
                <textarea
                  rows={1}
                  value={block.content}
                  onChange={e => handleBlockChange(idx, e.target.value)}
                  placeholder="Type '/' for commands..."
                  style={{
                    fontSize: 15,
                    lineHeight: 1.6,
                    border: 'none',
                    outline: 'none',
                    width: '100%',
                    background: 'transparent',
                    resize: 'none',
                    color: 'var(--text-primary)'
                  }}
                />
              )}

              {/* Todo checkbox */}
              {block.type === 'todo' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <button
                    onClick={() => handleToggleCheck(idx)}
                    style={{ color: block.checked ? 'var(--success)' : 'var(--text-tertiary)', padding: 0 }}
                  >
                    <CheckSquare size={18} />
                  </button>
                  <input
                    type="text"
                    value={block.content}
                    onChange={e => handleBlockChange(idx, e.target.value)}
                    placeholder="To-do item..."
                    style={{
                      fontSize: 15,
                      border: 'none',
                      outline: 'none',
                      width: '100%',
                      background: 'transparent',
                      textDecoration: block.checked ? 'line-through' : 'none',
                      color: block.checked ? 'var(--text-tertiary)' : 'var(--text-primary)'
                    }}
                  />
                </div>
              )}

              {/* Bullet list */}
              {block.type === 'bullet_list' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingLeft: 8 }}>
                  <span style={{ fontSize: 18, color: 'var(--primary)' }}>•</span>
                  <input
                    type="text"
                    value={block.content}
                    onChange={e => handleBlockChange(idx, e.target.value)}
                    placeholder="List item..."
                    style={{
                      fontSize: 15,
                      border: 'none',
                      outline: 'none',
                      width: '100%',
                      background: 'transparent'
                    }}
                  />
                </div>
              )}

              {/* Callout */}
              {block.type === 'callout' && (
                <div style={{
                  background: 'var(--primary-subtle)',
                  padding: '14px 18px',
                  borderRadius: 'var(--radius-sm)',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 12,
                  borderLeft: '3px solid var(--primary)'
                }}>
                  <AiCreativeIcon size={18} color="var(--primary)" style={{ marginTop: 2, flexShrink: 0 }} />
                  <input
                    type="text"
                    value={block.content}
                    onChange={e => handleBlockChange(idx, e.target.value)}
                    placeholder="Callout text or AI insight..."
                    style={{
                      fontSize: 14,
                      fontWeight: 500,
                      color: 'var(--text-primary)',
                      border: 'none',
                      outline: 'none',
                      width: '100%',
                      background: 'transparent'
                    }}
                  />
                </div>
              )}

              {/* Quote */}
              {block.type === 'quote' && (
                <div style={{
                  borderLeft: '3px solid var(--text-tertiary)',
                  paddingLeft: 14,
                  fontStyle: 'italic',
                  color: 'var(--text-secondary)'
                }}>
                  <input
                    type="text"
                    value={block.content}
                    onChange={e => handleBlockChange(idx, e.target.value)}
                    placeholder="Empty quote..."
                    style={{
                      fontSize: 15,
                      fontStyle: 'italic',
                      border: 'none',
                      outline: 'none',
                      width: '100%',
                      background: 'transparent'
                    }}
                  />
                </div>
              )}

              {/* Divider */}
              {block.type === 'divider' && (
                <hr style={{ border: 'none', height: 1, background: 'var(--outline-subtle)', margin: '12px 0' }} />
              )}

              {/* Slash Command Dropdown Popover */}
              {slashMenuIndex === idx && (
                <div
                  className="card-glass animate-fade-in"
                  style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    zIndex: 1000,
                    width: 280,
                    maxHeight: 280,
                    overflowY: 'auto',
                    padding: 6,
                    borderRadius: 'var(--radius-sm)',
                    boxShadow: 'var(--shadow-xl)'
                  }}
                >
                  <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-tertiary)', padding: '6px 10px' }}>
                    Basic Blocks
                  </div>
                  {filteredSlashOptions.map(opt => (
                    <button
                      key={opt.type}
                      onClick={() => handleSelectSlashCommand(opt.type)}
                      className="btn btn-ghost"
                      style={{
                        width: '100%',
                        justifyContent: 'flex-start',
                        padding: '8px 10px',
                        fontSize: 13,
                        textAlign: 'left'
                      }}
                    >
                      <span style={{ marginRight: 10, color: 'var(--primary)' }}>{opt.icon}</span>
                      <div>
                        <div style={{ fontWeight: 600 }}>{opt.label}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{opt.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Add Block Bottom Action */}
        <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px dashed var(--outline-subtle)' }}>
          <Button
            variant="ghost"
            size="sm"
            icon={<Plus size={14} />}
            onClick={() => addBlock('text')}
            style={{ color: 'var(--text-tertiary)' }}
          >
            Add block (or type "/" above)
          </Button>
        </div>
      </div>
    </div>
  );
};
