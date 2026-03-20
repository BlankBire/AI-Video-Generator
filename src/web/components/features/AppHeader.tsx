import React from 'react';

export const AppHeader = () => (
  <header className="header-responsive" style={{
    textAlign: 'center',
    padding: 'var(--space-8) 0 var(--space-6)',
    borderBottom: '1px solid var(--border-default)',
    marginBottom: 'var(--space-6)',
  }}>
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
          src="/logo.png" 
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
