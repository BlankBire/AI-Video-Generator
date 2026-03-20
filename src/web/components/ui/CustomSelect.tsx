interface CustomSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
}

export const CustomSelect = ({ children, style, label, ...props }: CustomSelectProps) => (
  <div style={{ position: 'relative', width: '100%' }}>
    <select 
      className="form-select" 
      style={{ 
        ...style, 
        appearance: 'none', 
        paddingRight: '32px',
        height: 42,
        fontSize: 13,
        background: 'var(--bg-card)'
      }} 
      {...props}
    >
      {children}
    </select>
    <div style={{ 
      position: 'absolute', 
      right: 12, 
      top: '50%', 
      transform: 'translateY(-50%)', 
      pointerEvents: 'none',
      color: 'var(--text-muted)',
      display: 'flex',
      alignItems: 'center'
    }}>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="6 9 12 15 18 9"></polyline>
      </svg>
    </div>
  </div>
);
