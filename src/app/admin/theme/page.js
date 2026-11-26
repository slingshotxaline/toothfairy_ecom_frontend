'use client';
import { useEffect } from 'react';
import { useSetting } from '@/components/admin/useSetting';
import { PageTitle } from '@/components/admin/ui';

const DEFAULT = { bg: '#17171c', surface: '#1f1e24', card: '#f7f2ef', fg: '#f0e9e2', muted: '#9a96a0', accent: '#e3b9a0', btn: '#f0e9e2', btnFg: '#17171c', line: '#2c2b33', heroBg: '#f0e7e2', heroFg: '#5b3a2e', primary: '#263055' };
const FIELDS = [['bg', 'Page background'], ['surface', 'Panels and sections'], ['fg', 'Main text'], ['muted', 'Secondary text'], ['accent', 'Headings accent'], ['line', 'Borders'], ['btn', 'Button'], ['btnFg', 'Button text'], ['card', 'Light card'], ['heroBg', 'Hero background'], ['heroFg', 'Hero text'], ['primary', 'Hero button']];
const VAR = { bg: 'bg', surface: 'surface', card: 'card', fg: 'fg', muted: 'muted', accent: 'accent', btn: 'btn', btnFg: 'btn-fg', line: 'line', heroBg: 'hero-bg', heroFg: 'hero-fg', primary: 'primary' };

export default function Theme() {
  const [t, setT, save, busy] = useSetting('theme', DEFAULT);
  // live preview across the whole admin while editing
  useEffect(() => { Object.entries(VAR).forEach(([k, v]) => document.documentElement.style.setProperty(`--${v}`, t[k])); }, [t]);
  return (
    <>
      <PageTitle action={<div className="flex gap-2"><button className="btn-ghost" onClick={() => setT(DEFAULT)}>Reset to default</button><button className="btn" disabled={busy} onClick={() => save(t)}>Save theme</button></div>}>Theme colours</PageTitle>
      <p className="mb-5 max-w-xl text-sm text-muted">Changes preview instantly here. Press Save to publish them to the storefront (visitors see them within about 20 seconds).</p>
      <div className="grid max-w-4xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {FIELDS.map(([k, l]) => (
          <div key={k} className="panel flex items-center gap-3">
            <input type="color" aria-label={l} value={t[k] || '#000000'} onChange={(e) => setT({ ...t, [k]: e.target.value })} className="h-10 w-12 cursor-pointer border border-line bg-transparent" />
            <div><p className="text-sm">{l}</p><input aria-label={`${l} hex`} className="mt-1 w-24 border-b border-line bg-transparent text-xs text-muted outline-none" value={t[k] || ''} onChange={(e) => setT({ ...t, [k]: e.target.value })} /></div>
          </div>))}
      </div>
    </>
  );
}
