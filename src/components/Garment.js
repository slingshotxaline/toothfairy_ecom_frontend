// Illustrated garments (used as hero art and as fallback when a product has no photo).
const PALETTE = { blush: '#d9c0c0', sand: '#e3d3bb', navy: '#263055', sage: '#cdd5d3', rose: '#e8d3d1', cream: '#f7f2ef' };
const STROKE = '#9a959c';

export default function Garment({ kind = 'dress', color = 'blush', trim = '#f5eeea', dots = true, long = false, className = '', id = 'g' }) {
  const c = PALETTE[color] || color;
  const pid = `${id}-${kind}-${String(c).replace('#', '')}`;
  const fill = dots ? `url(#${pid})` : c;
  return (
    <svg viewBox="0 0 200 260" className={className} role="img" aria-hidden="true">
      <defs>
        <pattern id={pid} width="12" height="12" patternUnits="userSpaceOnUse">
          <rect width="12" height="12" fill={c} /><circle cx="3" cy="3" r="1.4" fill="#fff" fillOpacity=".55" /><circle cx="9" cy="9" r="1.4" fill="#fff" fillOpacity=".55" />
        </pattern>
      </defs>
      <g fill="none" stroke={STROKE} strokeWidth="2"><path d="M100 46c0-6 0-8 6-12 6-5 6-14-2-15-8-1-10 8-10 10" /><path d="M100 46 L16 78 H184 Z" /></g>
      <g stroke={STROKE} strokeWidth="1.2" strokeLinejoin="round">
        {kind === 'dress' && (<>
          <ellipse cx="62" cy="92" rx="17" ry="14" fill={c} /><ellipse cx="138" cy="92" rx="17" ry="14" fill={c} />
          <path d="M70 80 Q100 104 130 80 L132 132 H68 Z" fill={fill} />
          <path d={long ? 'M68 142 H132 L176 246 Q100 256 24 246 Z' : 'M68 142 H132 L172 224 Q100 236 28 224 Z'} fill={fill} />
          <path d={long ? 'M24 246 Q100 256 176 246 L178 252 Q100 262 22 252Z' : 'M28 224 Q100 236 172 224 L174 232 Q100 244 26 232Z'} fill={trim} />
          <rect x="66" y="130" width="68" height="14" fill="#d3d9e0" /><path d="M86 137 L72 130 V144Z M114 137 L128 130 V144Z" fill="#e6eaef" /><circle cx="100" cy="137" r="6" fill="#aab1ba" />
        </>)}
        {kind === 'kurta' && (<>
          <path d="M66 82 Q100 100 134 82 L144 96 L170 150 L172 196 L150 196 L146 150 L142 214 H58 L54 150 L50 196 L28 196 L30 150 L56 96Z" fill={c} />
          <path d="M82 83 Q100 106 118 83" fill="none" stroke="#e8cdb5" strokeWidth="5" />
          <path d="M100 100 V176" /><circle cx="100" cy="116" r="3.2" fill="#e8cdb5" /><circle cx="100" cy="138" r="3.2" fill="#e8cdb5" /><circle cx="100" cy="160" r="3.2" fill="#e8cdb5" />
          <rect x="58" y="212" width="84" height="10" fill={trim} /><path d="M72 222 V256 H96 V222 M104 222 V256 H128 V222" fill={trim} />
        </>)}
        {kind === 'romper' && (<>
          <path d="M72 82 Q100 100 128 82 L160 108 L146 132 L130 120 V180 Q100 200 70 180 V120 L54 132 L40 108Z" fill={fill} />
          <path d="M40 108 L54 132 L66 124 L52 100Z M160 108 L146 132 L134 124 L148 100Z" fill={trim} />
          <path d="M70 180 Q100 200 130 180 L130 188 Q100 208 70 188Z" fill={trim} />
        </>)}
      </g>
    </svg>
  );
}

export function CategoryArt({ art = 'dress', className = '' }) {
  if (art === 'romper') return <Garment kind="romper" color="rose" dots={false} className={className} id="a1" />;
  if (art === 'kids') return (
    <div className={`flex items-end justify-center gap-1 ${className}`}>
      <Garment kind="dress" color="rose" className="w-[48%]" id="a2" /><Garment kind="kurta" color="rose" dots={false} className="w-[48%]" id="a3" />
    </div>);
  if (art === 'teen') return <Garment kind="dress" color="rose" dots={false} long className={className} id="a4" />;
  return <Garment kind="dress" color="sand" className={className} id="a5" />;
}
