import React from 'react';
import { useApp } from '../../context/AppContext';
import { User, Target, Layers, Bookmark, Award, Shield } from 'lucide-react';
import { AiCreativeIcon } from '../../components/icons/AiCreativeIcon';
import { Button } from '../../components/ui/Button';

export const ProfilePage: React.FC = () => {
  const { showToast } = useApp();

  return (
    <div className="animate-fade-in" style={{ maxWidth: 740, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div className="page-header" style={{ marginBottom: 0 }}>
        <div className="page-title-group">
          <h1>Profile Space</h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Personal profile, identity, and life system parameters.
          </p>
        </div>
      </div>

      <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        <div style={{
          width: 72,
          height: 72,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-bright) 100%)',
          color: '#fff',
          fontSize: 24,
          fontWeight: 800,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: 'var(--shadow-primary)'
        }}>
          PN
        </div>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 800 }}>Prajwal Nair</h2>
          <p style={{ fontSize: 13, color: 'var(--text-tertiary)', marginTop: 2 }}>Software Engineer & Builder</p>
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            <span className="badge badge-primary">Full Stack Track</span>
            <span className="badge badge-neutral">Berlin Marathon 2026</span>
          </div>
        </div>
      </div>

      <div className="grid-3">
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--primary)' }}>14</div>
          <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 4 }}>Day Study Streak</div>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--primary)' }}>9</div>
          <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 4 }}>Completed Projects Tasks</div>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--primary)' }}>5</div>
          <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 4 }}>Memories Learned</div>
        </div>
      </div>
    </div>
  );
};
