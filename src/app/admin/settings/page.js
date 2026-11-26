'use client';
import { useSetting } from '@/components/admin/useSetting';
import { ImageInput, PageTitle } from '@/components/admin/ui';

export default function Settings() {
  const [site, setSite, saveSite] = useSetting('site', { name: 'Tooth Fairy', tagline: '', facebook: '', whatsapp: '' });
  const [chart, setChart, saveChart] = useSetting('sizeChart', { image: '', note: '' });
  return (
    <>
      <PageTitle>Settings</PageTitle>
      <section className="panel mb-6 grid max-w-2xl gap-4">
        <h2 className="eyebrow">Size chart (supplied by the client)</h2>
        <p className="text-sm text-muted">Upload the chart image. Customers see a “View size chart” link in the custom order form.</p>
        <ImageInput label="Size chart image" value={chart.image} onChange={(image) => setChart({ ...chart, image })} />
        <div><button className="btn" onClick={() => saveChart()}>Save size chart</button></div>
      </section>
      <section className="panel grid max-w-2xl gap-4">
        <h2 className="eyebrow">Site</h2>
        {[['tagline', 'Footer tagline'], ['facebook', 'Facebook page URL'], ['whatsapp', 'WhatsApp number']].map(([k, l]) => <div key={k}><label className="label" htmlFor={k}>{l}</label><input id={k} className="input" value={site[k] || ''} onChange={(e) => setSite({ ...site, [k]: e.target.value })} /></div>)}
        <div><button className="btn" onClick={() => saveSite()}>Save site details</button></div>
      </section>
    </>
  );
}
