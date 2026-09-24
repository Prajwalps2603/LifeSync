import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { store, databaseService } from '../../services';
import {
  Database, Table, LayoutGrid, Calendar as CalIcon, List, Plus,
  ArrowLeft, Search, Filter, ArrowUpDown, MoreHorizontal
} from 'lucide-react';
import { AiCreativeIcon } from '../../components/icons/AiCreativeIcon';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';

export const DatabaseViewPage: React.FC = () => {
  const { databaseId } = useParams<{ databaseId: string }>();
  const navigate = useNavigate();
  const { showToast, refreshKey } = useApp();

  const db = store.databases.find(d => d.id === databaseId) || store.databases[0];
  const [selectedView, setSelectedView] = useState<'table' | 'board' | 'calendar' | 'list'>('table');
  const [isAddRowOpen, setIsAddRowOpen] = useState(false);
  const [newRowData, setNewRowData] = useState<Record<string, string>>({});

  const handleAddRow = async (e: React.FormEvent) => {
    e.preventDefault();
    await databaseService.addRow(db.id, newRowData);
    setIsAddRowOpen(false);
    setNewRowData({});
    showToast('Record added to database!', 'success');
  };

  const getStatusColor = (status: string) => {
    if (status === 'offer' || status === 'completed') return 'success';
    if (status === 'interview' || status === 'reading') return 'primary';
    if (status === 'applied' || status === 'to_read') return 'warning';
    return 'neutral';
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Top Nav */}
      <div>
        <button
          onClick={() => navigate('/workspace/databases')}
          className="btn btn-ghost btn-sm"
          style={{ paddingLeft: 0, color: 'var(--text-tertiary)' }}
        >
          <ArrowLeft size={15} /> All Databases
        </button>
      </div>

      {/* Database Title Bar */}
      <div className="card" style={{ padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 32 }}>{db.icon}</span>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700 }}>{db.name}</h1>
            <p style={{ fontSize: 13, color: 'var(--text-tertiary)' }}>{db.description}</p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Button variant="primary" size="sm" icon={<Plus size={14} />} onClick={() => setIsAddRowOpen(true)}>
            New Record
          </Button>
        </div>
      </div>

      {/* Multi-View Switcher Bar */}
      <div className="card" style={{ padding: '10px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
        <div style={{ display: 'flex', gap: 6 }}>
          {[
            { id: 'table', label: 'Table View', icon: <Table size={14} /> },
            { id: 'board', label: 'Board View', icon: <LayoutGrid size={14} /> },
            { id: 'list', label: 'List View', icon: <List size={14} /> },
            { id: 'calendar', label: 'Calendar View', icon: <CalIcon size={14} /> }
          ].map(view => (
            <button
              key={view.id}
              onClick={() => setSelectedView(view.id as any)}
              className={`btn btn-sm ${selectedView === view.id ? 'btn-primary' : 'btn-ghost'}`}
              style={{ borderRadius: 'var(--radius-sm)' }}
            >
              {view.icon} {view.label}
            </button>
          ))}
        </div>

        <span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>
          {db.rows.length} total entries
        </span>
      </div>

      {/* View Content */}
      {selectedView === 'table' && (
        <div className="card" style={{ padding: 0, overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 14 }}>
            <thead>
              <tr style={{ background: 'var(--surface-soft)', borderBottom: '1px solid var(--outline-subtle)' }}>
                {db.properties.map(prop => (
                  <th key={prop.id} style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--text-secondary)', fontSize: 12, textTransform: 'uppercase' }}>
                    {prop.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {db.rows.map((row, rIdx) => (
                <tr
                  key={row.id || rIdx}
                  style={{
                    borderBottom: '1px solid var(--outline-subtle)',
                    transition: 'background var(--transition-fast)'
                  }}
                  className="table-row-hover"
                >
                  {db.properties.map(prop => {
                    const val = row[prop.id];
                    return (
                      <td key={prop.id} style={{ padding: '14px 16px' }}>
                        {prop.type === 'status' ? (
                          <Badge variant={getStatusColor(val) as any}>{val || 'None'}</Badge>
                        ) : prop.type === 'date' ? (
                          <span style={{ fontSize: 13, color: 'var(--text-tertiary)' }}>{val || '—'}</span>
                        ) : prop.id === 'company' || prop.id === 'title' ? (
                          <strong style={{ color: 'var(--text-primary)' }}>{val}</strong>
                        ) : (
                          <span>{val || '—'}</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedView === 'board' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
          {['applied', 'interview', 'offer'].map(stage => {
            const stageRows = db.rows.filter(r => r.status === stage || (!r.status && stage === 'applied'));
            return (
              <div key={stage} style={{ background: 'var(--surface-soft)', borderRadius: 'var(--radius-card)', padding: 14, minHeight: 380, display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <span style={{ fontWeight: 700, fontSize: 13, textTransform: 'capitalize' }}>{stage}</span>
                  <span className="badge badge-neutral">{stageRows.length}</span>
                </div>
                {stageRows.map(r => (
                  <div key={r.id} className="card" style={{ padding: 12 }}>
                    <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{r.company || r.title}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{r.role || r.author}</div>
                    {r.notes && <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 6 }}>{r.notes}</div>}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      )}

      {selectedView === 'list' && (
        <div className="card" style={{ padding: 0 }}>
          {db.rows.map((row, idx) => (
            <div
              key={row.id || idx}
              style={{
                padding: '14px 20px',
                borderBottom: idx !== db.rows.length - 1 ? '1px solid var(--outline-subtle)' : 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <span style={{ fontWeight: 600, fontSize: 14 }}>{row.company || row.title}</span>
                <span style={{ fontSize: 13, color: 'var(--text-secondary)', marginLeft: 8 }}>{row.role || row.author}</span>
              </div>
              <Badge variant={getStatusColor(row.status) as any}>{row.status || 'Active'}</Badge>
            </div>
          ))}
        </div>
      )}

      {selectedView === 'calendar' && (
        <div className="card" style={{ padding: 24, textAlign: 'center' }}>
          <CalIcon size={32} color="var(--primary)" style={{ margin: '0 auto 12px' }} />
          <h3 style={{ fontSize: 16, fontWeight: 700 }}>Follow-up Calendar View</h3>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>
            Upcoming follow-ups: Stripe (Aug 30), Google (Aug 30), Linear (Sep 1), Vercel (Sep 2).
          </p>
        </div>
      )}

      {/* New Record Modal */}
      {isAddRowOpen && (
        <Modal
          isOpen={isAddRowOpen}
          onClose={() => setIsAddRowOpen(false)}
          title={`Add to ${db.name}`}
          subtitle="Add a new entry with dynamic schema properties."
        >
          <form onSubmit={handleAddRow} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {db.properties.map(prop => (
              <div key={prop.id}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>
                  {prop.name}
                </label>
                {prop.type === 'status' ? (
                  <select
                    className="form-input"
                    value={newRowData[prop.id] || 'applied'}
                    onChange={e => setNewRowData({ ...newRowData, [prop.id]: e.target.value })}
                  >
                    <option value="applied">Applied</option>
                    <option value="interview">Interviewing</option>
                    <option value="offer">Offer Received</option>
                  </select>
                ) : prop.type === 'date' ? (
                  <input
                    type="date"
                    className="form-input"
                    value={newRowData[prop.id] || ''}
                    onChange={e => setNewRowData({ ...newRowData, [prop.id]: e.target.value })}
                  />
                ) : (
                  <input
                    type="text"
                    required={prop.id === 'company' || prop.id === 'title'}
                    className="form-input"
                    value={newRowData[prop.id] || ''}
                    onChange={e => setNewRowData({ ...newRowData, [prop.id]: e.target.value })}
                    placeholder={`Enter ${prop.name.toLowerCase()}...`}
                  />
                )}
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 12 }}>
              <Button type="button" variant="ghost" onClick={() => setIsAddRowOpen(false)}>Cancel</Button>
              <Button type="submit" variant="primary">Add Entry</Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
