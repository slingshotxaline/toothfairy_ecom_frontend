'use client';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useCustomOrderMutation, useSettingsQuery } from '@/lib/api';
import { toast } from '@/lib/slices';
import { errMsg, inDays } from '@/lib/fmt';

const AGES = [['newborn', 'New Born (0–12 months)', ['0–3 m', '3–6 m', '6–12 m']], ['toddlers', 'Toddlers (1–4 years)', ['1–2 y', '2–3 y', '3–4 y']], ['kids', 'Kids (5–10 years)', ['5–6 y', '7–8 y', '9–10 y']], ['teenagers', 'Teenagers (11–16 years)', ['11–12 y', '13–14 y', '15–16 y']]];
const STYLES = ['Girl', 'Boy', 'Twinning Set'];
const OCCASIONS = ['Eid', 'Wedding', 'Birthday', 'Party', 'Everyday', 'Other'];
// Communication option replaces the old colour picker.
const CONTACT = { WHATSAPP: ['WhatsApp', 'WhatsApp number'], PHONE: ['Phone call', 'Phone number'], MESSENGER: ['Messenger', 'Messenger name or link'], EMAIL: ['Email', 'Email address'] };
const STEPS = [['Day 1', 'Confirm', 'Design and measurements agreed.'], ['Day 2', 'Stitch', 'Your piece is cut and sewn.'], ['Day 3', 'Finish and dispatch', 'Final check, packed and sent.']];

export default function CustomOrderForm() {
  const d = useDispatch();
  const { data: s } = useSettingsQuery();
  const [send, { isLoading }] = useCustomOrderMutation();
  const [f, setF] = useState({ ageGroup: 'toddlers', style: 'Girl', size: '2–3 y', occasion: 'Eid', neededBy: inDays(3), notes: '', name: '', phone: '', contactMethod: 'WHATSAPP', contactValue: '' });
  const [file, setFile] = useState(null);
  const [chart, setChart] = useState(false);
  const [done, setDone] = useState(false);
  const set = (k) => (e) => setF((p) => ({ ...p, [k]: e.target.value }));
  const sizes = AGES.find((a) => a[0] === f.ageGroup)[2];
  const sizeChart = s?.sizeChart;

  const submit = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    Object.entries({ ...f, contactValue: f.contactValue || (['WHATSAPP', 'PHONE'].includes(f.contactMethod) ? f.phone : '') }).forEach(([k, v]) => fd.append(k, v));
    if (file) fd.append('referenceImage', file);
    try { await send(fd).unwrap(); setDone(true); d(toast('Request sent. We’ll contact you shortly.')); } catch (x) { d(toast(errMsg(x))); }
  };

  return (
    <section id="custom" className="scroll-mt-20 bg-surface py-16">
      <div className="mx-auto grid max-w-[1200px] gap-12 px-5 lg:grid-cols-[1fr_1.1fr]">
        <div>
          <p className="eyebrow">Custom orders</p>
          <h2 className="h-display mt-4 text-4xl text-accent md:text-6xl">Made for your child, ready in 3 days.</h2>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-muted">Choose the age group, style and occasion. Add a reference photo if you have one, and tell us how you’d like to be contacted. We confirm the design and measurements, then stitch it.</p>
          <ol className="mt-8 border-t border-line">
            {STEPS.map(([day, t, desc]) => (
              <li key={day} className="grid grid-cols-[70px_1fr] gap-3 border-b border-line py-4"><span className="h-display text-lg text-muted">{day}</span><span><b className="block text-sm font-medium">{t}</b><span className="text-sm text-muted">{desc}</span></span></li>
            ))}
          </ol>
        </div>
        {done ? (
          <div className="panel grid place-items-center text-center"><div><h3 className="h-display text-3xl text-accent">Thank you</h3><p className="mt-3 text-sm text-muted">We’ll reach you on {CONTACT[f.contactMethod][0]} to confirm the design and measurements.</p></div></div>
        ) : (
          <form onSubmit={submit} className="panel grid gap-5 sm:grid-cols-2">
            <div><label className="label" htmlFor="co-age">Age group</label><select id="co-age" className="input" value={f.ageGroup} onChange={(e) => setF((p) => ({ ...p, ageGroup: e.target.value, size: AGES.find((a) => a[0] === e.target.value)[2][0] }))}>{AGES.map((a) => <option key={a[0]} value={a[0]}>{a[1]}</option>)}</select></div>
            <div><label className="label" htmlFor="co-style">Style</label><select id="co-style" className="input" value={f.style} onChange={set('style')}>{STYLES.map((x) => <option key={x}>{x}</option>)}</select></div>
            <div>
              <label className="label" htmlFor="co-size">Size {sizeChart?.image && <button type="button" onClick={() => setChart(true)} className="ml-2 normal-case tracking-normal text-accent underline">View size chart</button>}</label>
              <select id="co-size" className="input" value={f.size} onChange={set('size')}>{sizes.map((x) => <option key={x}>{x}</option>)}</select>
            </div>
            <div><label className="label" htmlFor="co-occ">Occasion</label><select id="co-occ" className="input" value={f.occasion} onChange={set('occasion')}>{OCCASIONS.map((x) => <option key={x}>{x}</option>)}</select></div>
            <div><label className="label" htmlFor="co-date">Needed by</label><input id="co-date" type="date" required min={inDays(3)} className="input" value={f.neededBy} onChange={set('neededBy')} /><p className="mt-1.5 text-xs text-muted">Earliest is 3 days from today.</p></div>
            <div><label className="label" htmlFor="co-file">Reference photo</label><input id="co-file" type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} className="text-xs text-muted file:mr-3 file:border-0 file:bg-line file:px-3 file:py-2 file:text-fg" /></div>
            <div className="sm:col-span-2"><label className="label" htmlFor="co-notes">Notes</label><textarea id="co-notes" rows={3} className="input" placeholder="Fabric, sleeve length, embroidery, measurements" value={f.notes} onChange={set('notes')} /></div>
            <div><label className="label" htmlFor="co-name">Your name</label><input id="co-name" required className="input" value={f.name} onChange={set('name')} /></div>
            <div><label className="label" htmlFor="co-phone">Phone</label><input id="co-phone" required type="tel" className="input" value={f.phone} onChange={set('phone')} /></div>
            <fieldset className="sm:col-span-2">
              <legend className="label">How should we contact you?</legend>
              <div className="flex flex-wrap gap-2">{Object.entries(CONTACT).map(([k, [l]]) => <button type="button" key={k} aria-pressed={f.contactMethod === k} onClick={() => setF((p) => ({ ...p, contactMethod: k }))} className={`chip ${f.contactMethod === k ? 'chip-on' : ''}`}>{l}</button>)}</div>
              <input className="input mt-3" aria-label={CONTACT[f.contactMethod][1]} placeholder={`${CONTACT[f.contactMethod][1]}${['WHATSAPP', 'PHONE'].includes(f.contactMethod) ? ' (leave empty to use the phone above)' : ''}`} required={!['WHATSAPP', 'PHONE'].includes(f.contactMethod)} value={f.contactValue} onChange={set('contactValue')} />
            </fieldset>
            <button className="btn sm:col-span-2" disabled={isLoading}>{isLoading ? 'Sending…' : 'Request custom order'}</button>
          </form>
        )}
      </div>
      {chart && (
        <div role="dialog" aria-modal="true" aria-label="Size chart" className="fixed inset-0 z-[90] grid place-items-center bg-black/70 p-4" onClick={() => setChart(false)}>
          <div className="max-h-full max-w-2xl overflow-auto bg-surface p-4" onClick={(e) => e.stopPropagation()}>
            <img src={sizeChart.image} alt="Size chart" className="w-full" /><button className="btn-ghost mt-3" onClick={() => setChart(false)}>Close</button>
          </div>
        </div>)}
    </section>
  );
}
