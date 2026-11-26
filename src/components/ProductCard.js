'use client';
import Link from 'next/link';
import { useState } from 'react';
import Garment from './Garment';
import { money } from '@/lib/fmt';

const TINTS = ['#faf7f2', '#d6d8dd', '#f5f7f6', '#f8f5f3'];

export default function ProductCard({ p, index = 0 }) {
  const imgs = [p.baseImage, ...(p.images || [])].filter(Boolean);
  const slides = imgs.length || 2;
  const [i, setI] = useState(0);
  const step = (e, n) => { e.preventDefault(); e.stopPropagation(); setI((i + n + slides) % slides); };
  return (
    <Link href={`/product/${p.slug}`} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden" style={{ background: TINTS[index % 4] }}>
        {imgs.length ? <img src={imgs[i]} alt={p.title} loading="lazy" className="h-full w-full object-cover" />
          : <div className="grid h-full place-items-center"><Garment kind={p.ageGroup === 'newborn' ? 'romper' : p.style === 'boy' ? 'kurta' : 'dress'} color={i ? 'sand' : 'blush'} className="h-[88%]" id={`c${p.id}${i}`} /></div>}
        {p.soldOut && <span className="absolute left-2 top-2 bg-bg px-2.5 py-1.5 text-[10px] uppercase tracking-wider2 text-fg">Sold out</span>}
        {p.onSale && !p.soldOut && <span className="absolute left-2 top-2 bg-accent px-2.5 py-1.5 text-[10px] uppercase tracking-wider2 text-bg">Sale</span>}
        {slides > 1 && (
          <div className="absolute bottom-2 right-2 flex items-center gap-2 bg-white/90 px-2 py-1 text-xs text-neutral-700">
            <button aria-label="Previous image" onClick={(e) => step(e, -1)} className="px-1">‹</button>{i + 1}/{slides}<button aria-label="Next image" onClick={(e) => step(e, 1)} className="px-1">›</button>
          </div>)}
      </div>
      <h3 className="mt-3 text-[15px] group-hover:text-accent">{p.title}</h3>
      <p className="mt-2 text-sm text-muted">{p.onSale && <s className="mr-2 opacity-60">{money(p.basePrice)}</s>}{money(p.price)}</p>
    </Link>
  );
}
