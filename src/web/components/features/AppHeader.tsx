import React from 'react';
import { Settings } from 'lucide-react';

interface AppHeaderProps {
  onOpenSettings?: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({ onOpenSettings }) => (
  <header className="header-responsive" style={{
    textAlign: 'center',
    padding: 'var(--space-8) 0 var(--space-6)',
    borderBottom: '1px solid var(--border-default)',
    marginBottom: 'var(--space-6)',
    position: 'relative'
  }}>
    <button 
      onClick={onOpenSettings}
      style={{
        position: 'absolute',
        top: '24px',
        right: '0',
        background: 'rgba(255, 255, 255, 0.8)',
        border: '1px solid var(--border-default)',
        borderRadius: '12px',
        padding: '10px',
        color: '#64748b',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '0.85rem',
        fontWeight: 500,
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
        transition: 'all 0.2s'
      }}
      title="Cài đặt API"
      className="btn-settings-header"
    >
      <Settings size={18} />
      <span className="hide-mobile">Cài đặt</span>
    </button>

    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 'var(--space-3)',
      marginBottom: 'var(--space-2)',
    }}>
      <div style={{
        width: 44, height: 44,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <img 
          src="logo.png" 
          alt="FoodieGen Logo" 
          style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
        />
      </div>
      <h1 className="header-title" style={{
        fontFamily: "'Be Vietnam Pro', sans-serif",
        fontSize: 28, fontWeight: 500,
        letterSpacing: '-0.01em',
        background: 'var(--gradient-primary)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
      }}>FoodieGen</h1>
    </div>
    <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>
      Tạo video marketing đồ ăn tự động với AI
    </p>
  </header>
);
