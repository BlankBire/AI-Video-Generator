import React from 'react';
import { TONES } from '../../constants';

interface ContentSectionProps {
  foodTopic: string;
  setFoodTopic: (v: string) => void;
  mainCharacter: string;
  setMainCharacter: (v: string) => void;
  script: string;
  setScript: (v: string) => void;
  activeTone: string;
  setActiveTone: (v: string) => void;
  onSuggest: () => void;
}

export const ContentSection = ({
  foodTopic, setFoodTopic,
  mainCharacter, setMainCharacter,
  script, setScript,
  activeTone, setActiveTone,
  onSuggest
}: ContentSectionProps) => (
  <div style={{ display:'flex', flexDirection:'column', gap:'var(--space-4)' }}>
    <div className="section-title">
      <span className="section-title-dot" />
      Nội dung
    </div>
    
    <div className="section-card" style={{ margin: 0 }}>
      {/* Chủ đề món ăn */}
      <div className="form-group">
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: 'var(--space-2)' }}>
          <label className="form-label" style={{ marginBottom:0 }}>Chủ đề món ăn</label>
          <button className="btn-secondary" style={{ padding:'4px 10px', fontSize:11, fontWeight:600 }} onClick={onSuggest}>
            Gợi ý ý tưởng
          </button>
        </div>
        <input className="form-input" placeholder="VD: Tô phở bò nóng hổi..." value={foodTopic} onChange={e => setFoodTopic(e.target.value)} />
      </div>

      {/* Nhân vật */}
      <div className="form-group">
        <label className="form-label">Mô tả nhân vật chính</label>
        <input className="form-input" placeholder="VD: Chú chó Shiba mặc áo đầu bếp..." value={mainCharacter} onChange={e => setMainCharacter(e.target.value)} />
      </div>

      {/* Kịch bản & Tone */}
      <div style={{ background: 'rgba(245, 158, 11, 0.03)', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)', marginBottom: 'var(--space-5)' }}>
        <div className="form-group" style={{ marginBottom: 'var(--space-3)' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: 'var(--space-2)' }}>
            <label className="form-label" style={{ marginBottom:0 }}>Kịch bản chi tiết</label>
            <button className="btn-primary" style={{ padding:'6px 14px', fontSize:12 }}>AI tạo kịch bản</button>
          </div>
          <textarea className="form-textarea" placeholder="Mô tả từng cảnh quay..." style={{ minHeight: 90 }} value={script} onChange={e => setScript(e.target.value)} />
        </div>

        <div className="form-group" style={{ marginBottom:0 }}>
          <label className="form-label" style={{ marginBottom:10, fontSize:11 }}>Tone nội dung</label>
          <div className="tones-container-responsive">
            {TONES.map(t => (
              <button key={t} className={`tone-button-responsive ${activeTone===t?'active':''}`} onClick={()=>setActiveTone(t)}>{t}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Metadata */}
      <div className="form-row">
        <div className="form-group" style={{ marginBottom:0 }}>
          <label className="form-label">Thể loại</label>
          <select className="form-select">
            <option>Giới thiệu món ăn</option>
            <option>Review nhà hàng</option>
            <option>Công thức nấu ăn</option>
            <option>Khuyến mãi</option>
            <option>Storytelling</option>
          </select>
        </div>
        <div className="form-group" style={{ marginBottom:0 }}>
          <label className="form-label">Số cảnh</label>
          <select className="form-select">
            <option>3 cảnh</option>
            <option>5 cảnh</option>
            <option>7 cảnh</option>
            <option>10 cảnh</option>
          </select>
        </div>
      </div>
    </div>
  </div>
);
