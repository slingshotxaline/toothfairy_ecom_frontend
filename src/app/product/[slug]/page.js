'use client';
import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { useProductQuery } from '@/lib/api';
import { addItem, toast } from '@/lib/slices';
import { money } from '@/lib/fmt';
import Garment from '@/components/Garment';

export default function ProductPage() {
  const { slug } = useParams();
  const { data: p, isLoading, error } = useProductQuery(slug);
  const d = useDispatch();
  const router = useRouter();
  const [vid, setVid] = useState('');
  const [qty, setQty] = useState(1);
  const [img, setImg] = useState(0);
  if (isLoading) return <div className="mx-auto h-96 max-w-[1200px] animate-pulse px-5" />;
  if (error || !p) return <p className="py-32 text-center text-muted">We couldn’t find this piece.</p>;

  const imgs = [p.baseImage, ...(p.images || [])].filter(Boolean);
  const v = p.variants.find((x) => x.id === vid);
  const price = v?.price ?? p.price;
  const stock = p.variants.length ? v?.stock : p.trackStock ? p.stock : 99;
  const add = (go) => {
    if (p.variants.length && !v) return d(toast('Please choose a size first.'));
    d(addItem({ productId: p.id, variantId: v?.id || null, slug: p.slug, title: p.title, image: p.baseImage, price, qty, size: v?.size, color: v?.color, max: Math.min(stock || 1, 20) }));
    d(toast('Added to your bag.')); if (go) router.push('/cart');
  };
  return (
    <div className="mx-auto grid max-w-[1200px] gap-10 px-5 py-10 md:grid-cols-2">
      <div>
        <div className="aspect-[4/5] overflow-hidden bg-card">{imgs.length ? <img src={imgs[img]} alt={p.title} className="h-full w-full object-cover" /> : <div className="grid h-full place-items-center"><Garment kind={p.style === 'boy' ? 'kurta' : 'dress'} className="h-[85%]" id="pp" /></div>}</div>
        {imgs.length > 1 && <div className="mt-3 flex gap-2 overflow-x-auto">{imgs.map((u, i) => <button key={u} onClick={() => setImg(i)} aria-label={`Image ${i + 1}`} className={`h-20 w-16 shrink-0 border ${i === img ? 'border-fg' : 'border-line'}`}><img src={u} alt="" className="h-full w-full object-cover" /></button>)}</div>}
      </div>
      <div>
        <p className="eyebrow">{[p.brand?.name, p.category?.name].filter(Boolean).join(' · ')}</p>
        <h1 className="h-display mt-3 text-4xl text-accent md:text-5xl">{p.title}</h1>
        <p className="mt-4 text-xl">{p.onSale && !v?.price && <s className="mr-3 text-base text-muted">{money(p.basePrice)}</s>}{money(price)}</p>
        {p.description && <p className="mt-5 max-w-prose whitespace-pre-line text-sm leading-relaxed text-muted">{p.description}</p>}
        {p.variants.length > 0 && (
          <fieldset className="mt-6"><legend className="label">Size</legend>
            <div className="flex flex-wrap gap-2">{p.variants.map((x) => <button key={x.id} disabled={x.stock < 1} aria-pressed={vid === x.id} onClick={() => { setVid(x.id); setQty(1); }} className={`chip disabled:line-through disabled:opacity-40 ${vid === x.id ? 'chip-on' : ''}`}>{[x.size, x.color].filter(Boolean).join(' / ') || 'Standard'}</button>)}</div>
          </fieldset>)}
        <div className="mt-6 flex items-center gap-4">
          <div className="flex items-center border border-line"><button aria-label="Less" className="px-4 py-2" onClick={() => setQty(Math.max(1, qty - 1))}>−</button><span className="w-8 text-center text-sm">{qty}</span><button aria-label="More" className="px-4 py-2" onClick={() => setQty(Math.min(qty + 1, stock || 1))}>+</button></div>
          {p.soldOut ? <span className="eyebrow">Sold out</span> : <button className="btn flex-1" onClick={() => add(false)}>Add to bag</button>}
        </div>
        {!p.soldOut && <button className="btn-ghost mt-3 w-full" onClick={() => add(true)}>Buy now</button>}
        {p.customFields?.length > 0 && (
          <dl className="mt-8 border-t border-line">{p.customFields.map((f) => <div key={f.key} className="grid grid-cols-[130px_1fr] border-b border-line py-3 text-sm"><dt className="text-muted">{f.key}</dt><dd>{f.value}</dd></div>)}</dl>)}
      </div>
    </div>
  );
}
