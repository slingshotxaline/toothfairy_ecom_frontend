'use client';
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import { useAdminDeleteMutation, useAdminGetQuery } from '@/lib/api';
import { PageTitle, Table } from '@/components/admin/ui';
import { toast } from '@/lib/slices';
import { money } from '@/lib/fmt';

export default function Products() {
  const { data = [] } = useAdminGetQuery('products');
  const [del] = useAdminDeleteMutation();
  const d = useDispatch();
  return (
    <>
      <PageTitle action={<Link href="/admin/products/new" className="btn">New product</Link>}>Products</PageTitle>
      <Table head={['', 'Title', 'Category', 'Price', 'Stock', 'Status', '']}>
        {data.map((p) => (
          <tr key={p.id}>
            <td className="td w-14">{p.baseImage && <img src={p.baseImage} alt="" className="h-12 w-10 object-cover" />}</td>
            <td className="td">{p.title}<span className="block text-xs text-muted">/{p.slug}</span></td>
            <td className="td">{p.category?.name}</td>
            <td className="td">{money(p.price)}</td>
            <td className="td">{p.variants.length ? p.variants.reduce((s, v) => s + v.stock, 0) : p.trackStock ? p.stock : '∞'}</td>
            <td className="td">{p.status}</td>
            <td className="td whitespace-nowrap text-right"><Link href={`/admin/products/${p.id}`} className="mr-3 text-xs underline">Edit</Link><button className="text-xs text-muted underline" onClick={async () => { if (confirm('Delete this product? Products with past orders are archived instead.')) { await del(`products/${p.id}`); d(toast('Done.')); } }}>Delete</button></td>
          </tr>))}
      </Table>
    </>
  );
}
