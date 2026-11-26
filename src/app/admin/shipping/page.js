'use client';
import { ResourcePage } from '@/components/admin/ui';
export default function P() {
  return <ResourcePage title="Shipping rules" path="shipping" fields={[{ name: 'name', label: 'Name', required: true }, { name: 'zone', label: 'Zone (customers pick this at checkout)', required: true }, { name: 'baseCost', label: 'Base cost ৳', type: 'number', required: true }, { name: 'perItemExtra', label: 'Extra per additional item ৳', type: 'number' }, { name: 'freeAbove', label: 'Free shipping above ৳', type: 'number' }, { name: 'etaDays', label: 'Delivery time (e.g. 1–2 days)' }, { name: 'active', label: 'Active', type: 'checkbox' }]}
    columns={[{ label: 'Name', key: 'name' }, { label: 'Zone', key: 'zone' }, { label: 'Base', render: (r) => `${Number(r.baseCost)}৳` }, { label: 'Per extra item', render: (r) => `${Number(r.perItemExtra)}৳` }, { label: 'Free above', render: (r) => (r.freeAbove ? `${Number(r.freeAbove)}৳` : '—') }, { label: 'ETA', key: 'etaDays' }]} />;
}
