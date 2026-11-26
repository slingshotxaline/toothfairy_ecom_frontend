'use client';
import { useDispatch } from 'react-redux';
import { useAdminGetQuery, useAdminSaveMutation } from '@/lib/api';
import { PageTitle } from '@/components/admin/ui';
import { toast } from '@/lib/slices';
import { dateTime, shortDate } from '@/lib/fmt';

const link = (m, v) => (m === 'WHATSAPP' ? `https://wa.me/${v.replace(/\D/g, '')}` : m === 'PHONE' ? `tel:${v}` : m === 'EMAIL' ? `mailto:${v}` : v.startsWith('http') ? v : null);

export default function CustomOrders() {
  const { data = [] } = useAdminGetQuery('custom-orders');
  const [save] = useAdminSaveMutation();
  const d = useDispatch();
  return (
    <>
      <PageTitle>Custom orders</PageTitle>
      <div className="container mx-auto">
        {data.map((o) => {
          const href = link(o.contactMethod, o.contactValue);
          return (
            <article key={o.id} className="panel flex gap-4">
              {o.referenceImage && <a href={o.referenceImage} target="_blank" rel="noreferrer"><img src={o.referenceImage} alt="Reference" className="h-28 w-24 object-cover" /></a>}
              <div className="min-w-0 flex-1 text-sm">
                <p className="text-base">{o.name} <span className="text-muted">· {o.phone}</span></p>
                <p className="mt-1 text-muted">{o.style}, {o.ageGroup}, size {o.size} · {o.occasion}</p>
                <p className="text-muted">Needed by {shortDate(o.neededBy)} · received {dateTime(o.createdAt)}</p>
                {o.notes && <p className="mt-2">{o.notes}</p>}
                <p className="mt-2">Contact via <b className="font-medium">{o.contactMethod}</b>: {href ? <a href={href} target="_blank" rel="noreferrer" className="underline">{o.contactValue}</a> : o.contactValue}</p>
                <select aria-label="Status" className="input mt-3 !w-auto !py-1 text-xs" value={o.status} onChange={async (e) => { await save({ path: `custom-orders/${o.id}`, method: 'PUT', body: { status: e.target.value } }); d(toast('Status updated.')); }}>{['NEW', 'CONTACTED', 'CONFIRMED', 'STITCHING', 'DISPATCHED', 'DONE', 'CANCELLED'].map((s) => <option key={s}>{s}</option>)}</select>
              </div>
            </article>);
        })}
        {!data.length && <p className="text-muted">No custom orders yet.</p>}
      </div>
    </>
  );
}
