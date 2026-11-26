'use client';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useAdminGetQuery, useAdminSaveMutation } from '@/lib/api';
import { PageTitle, Table } from '@/components/admin/ui';
import { toast } from '@/lib/slices';
import { dateTime, errMsg } from '@/lib/fmt';

export default function Inventory() {
  const { data = [] } = useAdminGetQuery('inventory');
  const { data: logs = [] } = useAdminGetQuery('inventory/logs');
  const [save] = useAdminSaveMutation();
  const [adj, setAdj] = useState({});
  const [lowOnly, setLowOnly] = useState(false);
  const d = useDispatch();
  const rows = lowOnly ? data.filter((r) => r.stock <= 5) : data;
  const apply = async (r) => {
    const key = r.variantId || r.productId; const a = adj[key] || {};
    try { await save({ path: 'inventory/adjust', body: { productId: r.productId, variantId: r.variantId, change: a.change, reason: a.reason } }).unwrap(); setAdj({ ...adj, [key]: {} }); d(toast('Stock updated.')); } catch (x) { d(toast(errMsg(x))); }
  };
  return (
    <>
      <PageTitle action={<label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={lowOnly} onChange={(e) => setLowOnly(e.target.checked)} />Low stock only (5 or fewer)</label>}>Inventory</PageTitle>
      <Table head={['Product', 'Variant', 'SKU', 'In stock', 'Adjust (+ / −)', 'Reason', '']}>
        {rows.map((r) => { const key = r.variantId || r.productId; return (
          <tr key={key}><td className="td">{r.title}</td><td className="td">{r.label}</td><td className="td text-muted">{r.sku || '—'}</td>
            <td className={`td ${r.stock <= 0 ? 'text-red-400' : r.stock <= 5 ? 'text-accent' : ''}`}>{r.stock}</td>
            <td className="td"><input type="number" aria-label="Change" className="input !w-24 !py-1" value={adj[key]?.change || ''} onChange={(e) => setAdj({ ...adj, [key]: { ...adj[key], change: e.target.value } })} /></td>
            <td className="td"><input aria-label="Reason" placeholder="Restock, damaged…" className="input !py-1" value={adj[key]?.reason || ''} onChange={(e) => setAdj({ ...adj, [key]: { ...adj[key], reason: e.target.value } })} /></td>
            <td className="td"><button className="btn-ghost !py-1" onClick={() => apply(r)}>Apply</button></td></tr>); })}
      </Table>
      <h2 className="eyebrow mb-3 mt-10">Recent stock movements</h2>
      <Table head={['When', 'Change', 'Reason']}>{logs.slice(0, 30).map((l) => <tr key={l.id}><td className="td text-muted">{dateTime(l.createdAt)}</td><td className="td">{l.change > 0 ? `+${l.change}` : l.change}</td><td className="td">{l.reason}</td></tr>)}</Table>
    </>
  );
}
