interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  align?: 'flex-start' | 'flex-end' | 'center';
  direction?: 'row' | 'column';
}

export const Toggle = ({ checked, onChange, label, align = 'flex-start', direction = 'row' }: ToggleProps) => {
  if (direction === 'column') {
    return (
      <label className="toggle-wrap" style={{ display:'flex', flexDirection:'column', alignItems: align, gap: 4 }}>
        <div style={{ display:'flex', alignItems:'center', gap: 8 }}>
          {label && <span style={{ fontSize: 12, color: 'var(--text-primary)', fontWeight: 500 }}>{label}</span>}
          <div className="toggle">
            <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} />
            <div className="toggle-slider" />
          </div>
        </div>
      </label>
    );
  }

  return (
    <label className="toggle-wrap" style={{ display:'flex', alignItems: 'center', gap: 8, margin: 0 }}>
      <div className="toggle">
        <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} />
        <div className="toggle-slider" />
      </div>
      {label && <span style={{ fontSize:12, color:'var(--text-primary)', fontWeight:500 }}>{label}</span>}
    </label>
  );
};
