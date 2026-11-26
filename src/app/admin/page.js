'use client';
import { useAdminGetQuery } from '@/lib/api';
import { Bars, PageTitle, Table } from '@/components/admin/ui';
import { dateTime, money } from '@/lib/fmt';

export default function Dashboard() {
  const { data: s } = useAdminGetQuery('analytics/summary');
  if (!s) return <p className="text-muted">Loading…</p>;
  const cards = [['Revenue', money(s.revenue)], ['Orders', s.orders], ['Pending', s.pending], ['Customers', s.customers], ['Products', s.products], ['Low stock variants', s.lowStock]];
  return (
    <>
      <PageTitle>Dashboard</PageTitle>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">{cards.map(([l, v]) => <div key={l} className="panel"><p className="eyebrow">{l}</p><p className="mt-2 text-2xl">{v}</p></div>)}</div>
      <div className="panel mt-6"><p className="eyebrow mb-4">Sales, last 30 days</p><Bars data={s.sales} x="date" y="total" fmt={money} /></div>
      <h2 className="eyebrow mb-3 mt-8">Latest orders</h2>
      <Table head={['Order', 'Customer', 'Status', 'Total', 'Placed']}>{s.recent.map((o) => <tr key={o.id}><td className="td">{o.number}</td><td className="td">{o.customerName}</td><td className="td">{o.status}</td><td className="td">{money(o.total)}</td><td className="td text-muted">{dateTime(o.createdAt)}</td></tr>)}</Table>
    </>
  );
}
