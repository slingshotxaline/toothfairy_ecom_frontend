'use client';
import { useSetting } from '@/components/admin/useSetting';
import { ImageInput, PageTitle } from '@/components/admin/ui';

const ARTS = [['romper', 'Romper illustration'], ['dress', 'Dress illustration'], ['kids', 'Kids pair illustration'], ['teen', 'Long dress illustration']];

export default function HomeLayout() {
  const [v, setV, save, busy] = useSetting('home.categories', { mode: 'dynamic', title: 'Shop by age', items: [] });
  const items = v.items || [];
  const patch = (i, p) => setV({ ...v, items: items.map((x, j) => (j === i ? { ...x, ...p } : x)) });
  return (
    <>
      <PageTitle action={<button className="btn" disabled={busy} onClick={() => save()}>Save layout</button>}>Home category section</PageTitle>
      <div className="panel grid max-w-4xl gap-5">
        <div><label className="label" htmlFor="ht">Section title</label><input id="ht" className="input" value={v.title} onChange={(e) => setV({ ...v, title: e.target.value })} /></div>
        <fieldset><legend className="label">How should the cards be built?</legend>
          {[['dynamic', 'Dynamic — from Categories', 'Cards follow your Categories list (name, age label, image, order, active).'], ['static', 'Static — design the cards here', 'Hand-made cards with their own title, subtitle, link and image.']].map(([m, t, s]) => (
            <label key={m} className={`mb-2 flex cursor-pointer gap-3 border p-4 ${v.mode === m ? 'border-fg' : 'border-line'}`}><input type="radio" name="mode" checked={v.mode === m} onChange={() => setV({ ...v, mode: m })} className="mt-1" /><span><b className="block text-sm font-medium">{t}</b><span className="text-xs text-muted">{s}</span></span></label>))}
        </fieldset>
        {v.mode === 'static' && (
          <div className="grid gap-4">
            {items.map((it, i) => (
              <div key={i} className="grid gap-3 border border-line p-4 sm:grid-cols-2">
                <div><label className="label">Title</label><input className="input" value={it.title || ''} onChange={(e) => patch(i, { title: e.target.value })} /></div>
                <div><label className="label">Subtitle</label><input className="input" value={it.sub || ''} onChange={(e) => patch(i, { sub: e.target.value })} /></div>
                <div><label className="label">Link</label><input className="input" placeholder="/shop?category=kids" value={it.href || ''} onChange={(e) => patch(i, { href: e.target.value })} /></div>
                <div><label className="label">Fallback illustration</label><select className="input" value={it.art || 'dress'} onChange={(e) => patch(i, { art: e.target.value })}>{ARTS.map(([a, l]) => <option key={a} value={a}>{l}</option>)}</select></div>
                <ImageInput label="Image (overrides illustration)" value={it.image} onChange={(url) => patch(i, { image: url })} />
                <div className="flex items-end justify-end gap-3 text-xs underline">
                  <button type="button" disabled={i === 0} onClick={() => { const a = [...items]; [a[i - 1], a[i]] = [a[i], a[i - 1]]; setV({ ...v, items: a }); }}>Move up</button>
                  <button type="button" onClick={() => setV({ ...v, items: items.filter((_, j) => j !== i) })}>Remove</button></div>
              </div>))}
            <button type="button" className="btn-ghost w-fit" onClick={() => setV({ ...v, items: [...items, { title: '', sub: '', href: '/shop', art: 'dress' }] })}>Add card</button>
          </div>)}
      </div>
    </>
  );
}
