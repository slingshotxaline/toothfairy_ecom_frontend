'use client';
import Link from 'next/link';
import { CategoryArt } from './Garment';
import { useCategoriesQuery, useSettingsQuery } from '@/lib/api';

const ART = { 'new-born': 'romper', toddlers: 'dress', kids: 'kids', teenagers: 'teen' };
const TINT = ['#faf7f5', '#faf7f2', '#f5f2f0', '#f6f2f1'];
const DEFAULTS = [
  { title: 'New Born', sub: '0–12 months', href: '/shop?category=new-born', art: 'romper' },
  { title: 'Toddlers', sub: '1–4 years', href: '/shop?category=toddlers', art: 'dress' },
  { title: 'Kids', sub: '5–10 years', href: '/shop?category=kids', art: 'kids' },
  { title: 'Teenagers', sub: '11–16 years', href: '/shop?category=teenagers', art: 'teen' },
];

// Layout is controlled from Admin → Home layout: "dynamic" (from Categories) or "static" (hand-made cards).
export default function CategorySection() {
  const { data: s } = useSettingsQuery();
  const { data: cats } = useCategoriesQuery();
  const cfg = s?.['home.categories'] || { mode: 'dynamic', title: 'Shop by age', items: [] };
  let items = DEFAULTS;
  if (cfg.mode === 'static' && cfg.items?.length) items = cfg.items;
  else if (cats?.length) items = cats.map((c) => ({ title: c.name, sub: c.ageLabel, href: `/shop?category=${c.slug}`, image: c.image, art: ART[c.slug] || 'dress' }));
  return (
    <section className="bg-bg py-16" aria-labelledby="by-age">
      <div className="mx-auto max-w-[1200px] px-5">
        <h2 id="by-age" className="h-display text-4xl text-accent md:text-5xl">{cfg.title || 'Shop by age'}</h2>
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          {items.map((c, i) => (
            <Link key={c.title + i} href={c.href || '/shop'} className="group block">
              <div className="relative aspect-[4/5] overflow-hidden" style={{ background: TINT[i % 4] }}>
                {c.image ? <img src={c.image} alt={c.title} loading="lazy" className="h-full w-full object-cover transition group-hover:scale-[1.02]" />
                  : <div className="absolute inset-4 flex items-center justify-center"><div className="absolute aspect-square w-[72%] rounded-full bg-white/70" /><CategoryArt art={c.art || ART[c.slug] || 'dress'} className="relative h-full" /></div>}
              </div>
              <h3 className="h-display mt-3 text-2xl text-accent">{c.title}</h3>
              <p className="text-xs tracking-wide text-muted">{c.sub}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
