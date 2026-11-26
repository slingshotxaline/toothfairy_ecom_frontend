'use client';
import { ResourcePage } from '@/components/admin/ui';
export default function P() {
  return <ResourcePage title="Brands" path="brands" fields={[{ name: 'name', label: 'Name', required: true }, { name: 'slug', label: 'Slug (auto if empty)' }]} columns={[{ label: 'Name', key: 'name' }, { label: 'Slug', key: 'slug' }]} />;
}
