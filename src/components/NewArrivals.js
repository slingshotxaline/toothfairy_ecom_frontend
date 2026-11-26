'use client';
import Link from 'next/link';
import ProductCard from './ProductCard';
import { useProductsQuery } from '@/lib/api';

export default function NewArrivals() {
  const { data, isLoading } = useProductsQuery({ limit: 4, sort: 'newest' });
  if (!isLoading && !data?.items?.length) return null;
  return (
    <section className="mx-auto max-w-[1200px] px-5 py-12">
      <div className="flex items-end justify-between"><h2 className="h-display text-4xl text-accent md:text-5xl">New arrivals</h2><Link href="/shop" className="border-b border-fg pb-0.5 text-[11px] uppercase tracking-wider2">View all</Link></div>
      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        {isLoading ? [0, 1, 2, 3].map((i) => <div key={i} className="aspect-[4/5] animate-pulse bg-surface" />) : data.items.map((p, i) => <ProductCard key={p.id} p={p} index={i} />)}
      </div>
    </section>
  );
}
