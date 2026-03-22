import React from 'react';
import { VISUAL_STYLES } from '../../constants';

interface PreviewPanelProps {
  videoUrl?: string;
  config: {
    resolution: string;
    aspectRatio: string;
    duration: string;
    voiceGender: string;
    activeStyle: string;
    activeTone: string;
  };
}

export const PreviewPanel = ({ videoUrl, config }: PreviewPanelProps) => {
  // Find the label for the active style
  const styleLabel = VISUAL_STYLES.find(s => s.id === config.activeStyle)?.label || config.activeStyle;

  return (
    <aside className="preview-sidebar">
      <div className="preview-panel" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
        <h3 className="form-label" style={{ marginBottom: 0 }}>Xem trước video</h3>
        
        <div className="preview-screen">
          <div className="preview-badge-top">{config.resolution === '1080p' ? '1080p' : '720p'}</div>
          
          {videoUrl ? (
            <video 
              src={videoUrl} 
              controls 
              autoPlay 
              style={{ width: '100%', height: '100%', borderRadius: 'var(--radius-lg)', objectFit: 'cover' }}
            />
          ) : (
            <div className="preview-placeholder">
              <div className="preview-play-btn">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>
              <p className="preview-empty-text">Chưa có preview</p>
            </div>
          )}
          
          <div className="preview-badge-bottom">
            {config.aspectRatio} · {config.duration}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
          <button className="btn-secondary" style={{ flex: 1, padding: '12px 0', fontSize: 14, fontWeight: 500 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 8, verticalAlign: 'middle' }}>
              <path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
            </svg>
            Làm lại
          </button>
          <button className="btn-generate" style={{ flex: 1, padding: '12px 0', fontSize: 14, fontWeight: 500, boxShadow: 'none' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 8, verticalAlign: 'middle' }}>
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"></path>
            </svg>
            Tải xuống
          </button>
        </div>

        <div className="config-summary glass-card" style={{ padding: 'var(--space-5)', border: '1px solid var(--amber-100)', background: 'white' }}>
          <h3 className="form-label" style={{ color: '#8b6d4d', marginBottom: 'var(--space-4)', fontSize: 13 }}>CẤU HÌNH HIỆN TẠI</h3>
          <div className="summary-list" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div className="summary-item" style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
              <span style={{ color: '#9c7f6a' }}>Model</span>
              <span style={{ fontWeight: 600, color: '#d97706' }}>Veo 3.1 Fast</span>
            </div>
            <div className="summary-item" style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
              <span style={{ color: '#9c7f6a' }}>Resolution</span>
              <span style={{ fontWeight: 600, color: '#d97706' }}>{config.resolution}</span>
            </div>
            <div className="summary-item" style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
              <span style={{ color: '#9c7f6a' }}>Ratio</span>
              <span style={{ fontWeight: 600, color: '#d97706' }}>{config.aspectRatio}</span>
            </div>
            <div className="summary-item" style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
              <span style={{ color: '#9c7f6a' }}>Duration</span>
              <span style={{ fontWeight: 600, color: '#d97706' }}>{config.duration}</span>
            </div>
            <div className="summary-item" style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
              <span style={{ color: '#9c7f6a' }}>Voice</span>
              <span style={{ fontWeight: 600, color: '#d97706' }}>{config.voiceGender}</span>
            </div>
            <div className="summary-item" style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
              <span style={{ color: '#9c7f6a' }}>Style</span>
              <span style={{ fontWeight: 600, color: '#d97706' }}>{styleLabel}</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
