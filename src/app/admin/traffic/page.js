'use client';
import { useState } from 'react';
import { useAdminGetQuery } from '@/lib/api';
import { Bars, PageTitle } from '@/components/admin/ui';

const List = ({ title, rows }) => (
  <div className="panel"><p className="eyebrow mb-3">{title}</p>{rows?.length ? rows.map((r) => <div key={r.name} className="flex justify-between border-b border-line py-2 text-sm last:border-0"><span className="truncate pr-3">{r.name}</span><span className="text-muted">{r.count}</span></div>) : <p className="text-sm text-muted">No data yet.</p>}</div>
);

export default function Traffic() {
  const [days, setDays] = useState(30);
  const { data: t } = useAdminGetQuery(`analytics/traffic?days=${days}`);
  return (
    <>
      <PageTitle action={<select aria-label="Range" className="input !w-auto" value={days} onChange={(e) => setDays(Number(e.target.value))}>{[7, 30, 90].map((n) => <option key={n} value={n}>Last {n} days</option>)}</select>}>Site traffic</PageTitle>
      {!t ? <p className="text-muted">Loading…</p> : (
        <>
          <div className="grid gap-3 sm:grid-cols-2"><div className="panel"><p className="eyebrow">Page views</p><p className="mt-2 text-3xl">{t.totalViews}</p></div><div className="panel"><p className="eyebrow">Unique visitors</p><p className="mt-2 text-3xl">{t.uniqueVisitors}</p></div></div>
          <div className="panel mt-4"><p className="eyebrow mb-4">Page views per day</p><Bars data={t.daily} x="date" y="views" /></div>
          <div className="mt-4 grid gap-4 md:grid-cols-3"><List title="Top pages" rows={t.topPages} /><List title="Devices" rows={t.devices} /><List title="Referrers" rows={t.referrers} /></div>
        </>)}
    </>
  );
}
