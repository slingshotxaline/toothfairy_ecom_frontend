'use client';
import { ResourcePage } from '@/components/admin/ui';
export default function P() {
  return <ResourcePage title="Categories" path="categories" fields={[{ name: 'name', label: 'Name', required: true }, { name: 'slug', label: 'Slug (auto if empty)' }, { name: 'ageLabel', label: 'Age label (e.g. 1–4 years)' }, { name: 'sortOrder', label: 'Sort order', type: 'number' }, { name: 'image', label: 'Card image (optional)', type: 'image' }, { name: 'active', label: 'Active', type: 'checkbox' }]}
    columns={[{ label: 'Name', key: 'name' }, { label: 'Slug', key: 'slug' }, { label: 'Age', key: 'ageLabel' }, { label: 'Order', key: 'sortOrder' }, { label: 'Active', render: (r) => (r.active ? 'Yes' : 'No') }]} />;
}
