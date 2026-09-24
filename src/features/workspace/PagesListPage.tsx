import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { store, pageService } from '../../services';
import {
  FileText, Plus, Star, MoreHorizontal, Clock, ArrowRight,
  Folder, Trash2, Edit3
} from 'lucide-react';
import { AiCreativeIcon } from '../../components/icons/AiCreativeIcon';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

export const PagesListPage: React.FC = () => {
  const { openQuickAdd, showToast, refreshKey } = useApp();
  const navigate = useNavigate();
  const pages = store.pages;

  const handleCreateNewPage = async () => {
    const newPage = await pageService.createPage({
      title: 'Untitled Page',
      icon: '📄',
      parentId: null,
      category: 'General',
      blocks: [
        { id: `b-${Date.now()}`, type: 'heading_1', content: 'Untitled Page' },
        { id: `b-${Date.now() + 1}`, type: 'text', content: 'Type "/" for commands or click "+ Add block" below.' }
      ]
    });
    showToast('New workspace page created!', 'success');
    navigate(`/workspace/pages/${newPage.id}`);
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div className="page-header" style={{ marginBottom: 0 }}>
        <div className="page-title-group">
          <h1>Workspace Pages</h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Flexible, block-based documents and personal knowledge bases.
          </p>
        </div>
        <div className="page-actions">
          <Button variant="primary" size="sm" icon={<Plus size={15} />} onClick={handleCreateNewPage}>
            New Page
          </Button>
        </div>
      </div>

      {/* Pages Grid */}
      <div className="grid-3">
        {pages.map(page => (
          <div
            key={page.id}
            onClick={() => navigate(`/workspace/pages/${page.id}`)}
            className="card card-interactive"
            style={{ display: 'flex', flexDirection: 'column', gap: 12, minHeight: 180 }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 28 }}>{page.icon || '📄'}</span>
              {page.isFavorite && (
                <Star size={16} fill="#F59E0B" color="#F59E0B" />
              )}
            </div>

            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>{page.title}</h3>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                {page.blocks.find(b => b.type === 'text')?.content || 'No preview text'}
              </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 10, borderTop: '1px solid var(--outline-subtle)', fontSize: 11, color: 'var(--text-tertiary)' }}>
              <span>{page.category}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Clock size={12} /> {page.updatedAt.split('T')[0]}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
