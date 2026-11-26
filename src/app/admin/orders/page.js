'use client';
import { Fragment, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useAdminGetQuery, useAdminSaveMutation } from '@/lib/api';
import { PageTitle, Table } from '@/components/admin/ui';
import { toast } from '@/lib/slices';
import { dateTime, errMsg, money } from '@/lib/fmt';

const STATUS = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'RETURNED'];
const PAY = ['UNPAID', 'PAID', 'FAILED', 'REFUNDED'];

export default function Orders() {
  const [status, setStatus] = useState('');
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(null);
  const { data = [] } = useAdminGetQuery(`orders?status=${status}&q=${encodeURIComponent(q)}`);
  const [save] = useAdminSaveMutation();
  const d = useDispatch();
  const update = async (id, body) => { try { await save({ path: `orders/${id}`, method: 'PUT', body }).unwrap(); d(toast('Order updated.')); } catch (x) { d(toast(errMsg(x))); } };
  return (
    <>
      <PageTitle>Orders</PageTitle>
      <div className="mb-4 flex flex-wrap gap-3"><input className="input !w-64" placeholder="Search number, name or phone" aria-label="Search orders" value={q} onChange={(e) => setQ(e.target.value)} /><select className="input !w-auto" aria-label="Status" value={status} onChange={(e) => setStatus(e.target.value)}><option value="">All statuses</option>{STATUS.map((s) => <option key={s}>{s}</option>)}</select></div>
      <Table head={['Order', 'Customer', 'Payment', 'Total', 'Status', 'Placed']}>
        {data.map((o) => (
          <Fragment key={o.id}>
            <tr><td className="td"><button className="underline" onClick={() => setOpen(open === o.id ? null : o.id)}>{o.number}</button></td>
              <td className="td">{o.customerName}<span className="block text-xs text-muted">{o.phone}</span></td>
              <td className="td"><span className="block text-xs">{o.payMethod === 'COD' ? 'COD' : 'Online'}</span><select aria-label="Payment status" className="input !w-auto !py-1 text-xs" value={o.payStatus} onChange={(e) => update(o.id, { payStatus: e.target.value })}>{PAY.map((s) => <option key={s}>{s}</option>)}</select></td>
              <td className="td">{money(o.total)}</td>
              <td className="td"><select aria-label="Order status" className="input !w-auto !py-1 text-xs" value={o.status} onChange={(e) => update(o.id, { status: e.target.value })}>{STATUS.map((s) => <option key={s}>{s}</option>)}</select></td>
              <td className="td text-muted">{dateTime(o.createdAt)}</td></tr>
            {open === o.id && <tr><td colSpan={6} className="bg-surface px-4 py-4 text-sm">
              <p>{o.address}, {o.city} ({o.zone}){o.email ? ` · ${o.email}` : ''}{o.note ? ` · Note: ${o.note}` : ''}</p>
              <ul className="mt-2 text-muted">{o.items.map((i) => <li key={i.id}>{i.qty} × {i.title} {i.size ? `(${i.size})` : ''} — {money(i.price)}</li>)}</ul>
              <p className="mt-2 text-muted">Subtotal {money(o.subtotal)} · Discount {money(o.discount)}{o.couponCode ? ` (${o.couponCode})` : ''} · Shipping {money(o.shipping)}</p></td></tr>}
          </Fragment>))}
      </Table>
    </>
  );
}
