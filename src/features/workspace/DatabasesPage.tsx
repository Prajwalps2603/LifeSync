import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { store } from '../../services';
import { Database, Plus, Table, LayoutGrid, Calendar, List, ArrowRight } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export const DatabasesPage: React.FC = () => {
  const navigate = useNavigate();
  const databases = store.databases;

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div className="page-header" style={{ marginBottom: 0 }}>
        <div className="page-title-group">
          <h1>Databases</h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Flexible structured data collections with Table, Board, Calendar, and List views.
          </p>
        </div>
      </div>

      <div className="grid-2">
        {databases.map(db => (
          <div
            key={db.id}
            onClick={() => navigate(`/workspace/databases/${db.id}`)}
            className="card card-interactive"
            style={{ display: 'flex', flexDirection: 'column', gap: 14 }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 28 }}>{db.icon}</span>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 700 }}>{db.name}</h3>
                  <span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>{db.rows.length} records</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                <Table size={16} color="var(--text-tertiary)" />
                <LayoutGrid size={16} color="var(--text-tertiary)" />
                <Calendar size={16} color="var(--text-tertiary)" />
              </div>
            </div>

            <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
              {db.description}
            </p>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 10, borderTop: '1px solid var(--outline-subtle)' }}>
              <span style={{ fontSize: 12, color: 'var(--primary)', fontWeight: 600 }}>Open Database</span>
              <ArrowRight size={14} color="var(--primary)" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
