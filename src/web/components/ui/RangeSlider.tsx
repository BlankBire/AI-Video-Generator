interface RangeSliderProps {
  label?: string;
  min: number;
  max: number;
  value: number;
  onChange: (value: number) => void;
  labels: { min: string; mid: string; max: string };
}

export const RangeSlider = ({ min, max, value, onChange, labels }: RangeSliderProps) => (
  <div style={{ padding: '4px 0' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--text-muted)', marginBottom: 4 }}>
      <span>{labels.min}</span>
      <span>{labels.mid}</span>
      <span>{labels.max}</span>
    </div>
    <input 
      type="range" 
      className="range-slider" 
      min={min} 
      max={max} 
      value={value} 
      onChange={e => onChange(Number(e.target.value))} 
    />
  </div>
);
