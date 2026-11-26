'use client';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { removeItem, setQty } from '@/lib/slices';
import { money } from '@/lib/fmt';

export default function Cart() {
  const items = useSelector((s) => s.cart.items);
  const d = useDispatch();
  const subtotal = items.reduce((n, i) => n + i.price * i.qty, 0);
  return (
    <div className="mx-auto max-w-[900px] px-5 py-12">
      <h1 className="h-display text-4xl text-accent md:text-5xl">Your bag</h1>
      {!items.length ? (
        <p className="mt-10 text-muted">Your bag is empty. <Link href="/shop" className="text-fg underline">Browse the collection</Link></p>
      ) : (
        <>
          <ul className="mt-8 divide-y divide-line border-y border-line">
            {items.map((i) => (
              <li key={i.key} className="flex gap-4 py-5">
                <div className="h-24 w-20 shrink-0 bg-card">{i.image && <img src={i.image} alt="" className="h-full w-full object-cover" />}</div>
                <div className="flex-1">
                  <Link href={`/product/${i.slug}`} className="hover:text-accent">{i.title}</Link>
                  <p className="text-xs text-muted">{[i.size, i.color].filter(Boolean).join(' / ')}</p>
                  <div className="mt-3 flex items-center gap-3 text-sm">
                    <button aria-label="Less" className="btn-ghost !px-3 !py-1" onClick={() => d(setQty({ key: i.key, qty: i.qty - 1 }))}>−</button>{i.qty}
                    <button aria-label="More" className="btn-ghost !px-3 !py-1" onClick={() => d(setQty({ key: i.key, qty: i.qty + 1 }))}>+</button>
                    <button onClick={() => d(removeItem(i.key))} className="ml-3 text-xs text-muted underline">Remove</button>
                  </div>
                </div>
                <p className="text-sm">{money(i.price * i.qty)}</p>
              </li>
            ))}
          </ul>
          <div className="mt-6 flex items-center justify-between"><span className="text-muted">Subtotal (shipping calculated at checkout)</span><span className="text-xl">{money(subtotal)}</span></div>
          <Link href="/checkout" className="btn mt-6 w-full">Checkout</Link>
        </>
      )}
    </div>
  );
}
