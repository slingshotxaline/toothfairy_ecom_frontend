'use client';
import { useState } from 'react';
import ProductCard from './ProductCard';
import { useCategoriesQuery, useProductsQuery } from '@/lib/api';

const STYLES = [['', 'All'], ['girl', 'Girl'], ['boy', 'Boy'], ['twinning', 'Twinning Set']];

export default function Collection({ initialCategory = '', initialQ = '', showTitle = true }) {
  const [cat, setCat] = useState(initialCategory);
  const [style, setStyle] = useState('');
  const [sort, setSort] = useState('newest');
  const { data: cats } = useCategoriesQuery();
  const { data, isFetching } = useProductsQuery({ category: cat || undefined, style: style || undefined, q: initialQ || undefined, sort, limit: 48 });
  return (
    <section className="mx-auto max-w-[1200px] px-5 py-12" id="collection">
      <div className="flex items-end justify-between">
        {showTitle && <h2 className="h-display text-4xl text-accent md:text-5xl">The collection</h2>}
        <p className="text-sm text-muted">{data ? `${data.total} pieces` : ''}</p>
      </div>
      <div className="mt-8 flex gap-6 overflow-x-auto border-b border-line" role="tablist">
        {[{ slug: '', name: 'All ages' }, ...(cats || [])].map((c) => (
          <button key={c.slug} role="tab" aria-selected={cat === c.slug} onClick={() => setCat(c.slug)}
            className={`-mb-px whitespace-nowrap border-b pb-3 text-[11px] uppercase tracking-wider2 ${cat === c.slug ? 'border-fg text-fg' : 'border-transparent text-muted hover:text-fg'}`}>{c.name}</button>
        ))}
      </div>
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">{STYLES.map(([v, l]) => <button key={l} onClick={() => setStyle(v)} className={`chip ${style === v ? 'chip-on' : ''}`}>{l}</button>)}</div>
        <select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort" className="input !w-auto text-xs"><option value="newest">Newest</option><option value="price_asc">Price: low to high</option><option value="price_desc">Price: high to low</option></select>
      </div>
      <div className={`mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 ${isFetching ? 'opacity-60' : ''}`}>
        {data?.items?.map((p, i) => <ProductCard key={p.id} p={p} index={i} />)}
      </div>
      {data && !data.items.length && <p className="py-16 text-center text-muted">Nothing here yet. Try another age group or style.</p>}
    </section>
  );
}
