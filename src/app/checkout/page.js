'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { usePlaceOrderMutation, useQuoteMutation, useValidateCouponMutation, useZonesQuery } from '@/lib/api';
import { clearCart, toast } from '@/lib/slices';
import { errMsg, money } from '@/lib/fmt';

export default function Checkout() {
  const items = useSelector((s) => s.cart.items);
  const user = useSelector((s) => s.auth.user);
  const d = useDispatch();
  const router = useRouter();
  const { data: zones } = useZonesQuery();
  const [quote] = useQuoteMutation();
  const [check] = useValidateCouponMutation();
  const [place, { isLoading }] = usePlaceOrderMutation();
  const [f, setF] = useState({ name: user?.name || '', phone: user?.phone || '', email: user?.email || '', address: '', city: '', zone: '' });
  const [pay, setPay] = useState('COD');
  const [code, setCode] = useState('');
  const [coupon, setCoupon] = useState(null);
  const [ship, setShip] = useState({ cost: 0, eta: null });
  const [note, setNote] = useState('');

  const subtotal = items.reduce((n, i) => n + i.price * i.qty, 0);
  const qty = items.reduce((n, i) => n + i.qty, 0);
  const discount = coupon?.discount || 0;
  const total = subtotal - discount + ship.cost;
  const zoneNames = [...new Set((zones || []).map((z) => z.zone))];
  const set = (k) => (e) => setF((p) => ({ ...p, [k]: e.target.value }));

  useEffect(() => { if (zoneNames.length && !f.zone) setF((p) => ({ ...p, zone: zoneNames[0] })); }, [zones]); // eslint-disable-line
  useEffect(() => { if (f.zone) quote({ zone: f.zone, subtotal: subtotal - discount, qty }).unwrap().then(setShip).catch(() => {}); }, [f.zone, subtotal, discount, qty, quote]);

  const apply = async () => {
    try { setCoupon(await check({ code, subtotal }).unwrap()); d(toast('Coupon applied.')); } catch (e) { setCoupon(null); d(toast(errMsg(e))); }
  };
  const submit = async (e) => {
    e.preventDefault();
    try {
      const r = await place({ items: items.map((i) => ({ productId: i.productId, variantId: i.variantId, qty: i.qty })), customer: f, couponCode: coupon?.code, payMethod: pay, note }).unwrap();
      d(clearCart());
      if (r.paymentUrl) window.location.href = r.paymentUrl; else router.push(`/order/success?n=${r.number}`);
    } catch (x) { d(toast(errMsg(x))); }
  };
  if (!items.length) return <p className="py-32 text-center text-muted">Your bag is empty. <Link href="/shop" className="text-fg underline">Shop now</Link></p>;

  return (
    <form onSubmit={submit} className="mx-auto grid max-w-[1100px] gap-10 px-5 py-12 lg:grid-cols-[1.2fr_1fr]">
      <div>
        <h1 className="h-display text-4xl text-accent md:text-5xl">Checkout</h1>
        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          <div><label className="label" htmlFor="n">Full name</label><input id="n" required className="input" value={f.name} onChange={set('name')} /></div>
          <div><label className="label" htmlFor="p">Phone</label><input id="p" required type="tel" className="input" value={f.phone} onChange={set('phone')} /></div>
          <div className="sm:col-span-2"><label className="label" htmlFor="e">Email (optional)</label><input id="e" type="email" className="input" value={f.email} onChange={set('email')} /></div>
          <div className="sm:col-span-2"><label className="label" htmlFor="a">Delivery address</label><textarea id="a" required rows={2} className="input" value={f.address} onChange={set('address')} /></div>
          <div><label className="label" htmlFor="c">City / area</label><input id="c" required className="input" value={f.city} onChange={set('city')} /></div>
          <div><label className="label" htmlFor="z">Shipping zone</label><select id="z" className="input" value={f.zone} onChange={set('zone')}>{zoneNames.map((z) => <option key={z}>{z}</option>)}</select></div>
          <div className="sm:col-span-2"><label className="label" htmlFor="no">Order note (optional)</label><input id="no" className="input" value={note} onChange={(e) => setNote(e.target.value)} /></div>
        </div>
        <fieldset className="mt-8"><legend className="label">Payment</legend>
          {[['COD', 'Cash on delivery', 'Pay when your order arrives.'], ['SSLCOMMERZ', 'Pay online', 'Cards, bKash, Nagad and more via SSLCommerz.']].map(([v, t, s]) => (
            <label key={v} className={`mb-2 flex cursor-pointer gap-3 border p-4 ${pay === v ? 'border-fg' : 'border-line'}`}><input type="radio" name="pay" checked={pay === v} onChange={() => setPay(v)} className="mt-1" /><span><b className="block text-sm font-medium">{t}</b><span className="text-xs text-muted">{s}</span></span></label>))}
        </fieldset>
      </div>
      <aside className="panel h-fit lg:sticky lg:top-24">
        <h2 className="h-display text-2xl text-accent">Summary</h2>
        <ul className="mt-4 space-y-2 text-sm">{items.map((i) => <li key={i.key} className="flex justify-between gap-3"><span className="text-muted">{i.qty} × {i.title}{i.size ? ` (${i.size})` : ''}</span><span>{money(i.price * i.qty)}</span></li>)}</ul>
        <div className="mt-5 flex gap-2"><input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Coupon code" aria-label="Coupon code" className="input" /><button type="button" onClick={apply} className="btn-ghost">Apply</button></div>
        <dl className="mt-5 space-y-2 border-t border-line pt-4 text-sm">
          <div className="flex justify-between"><dt className="text-muted">Subtotal</dt><dd>{money(subtotal)}</dd></div>
          {discount > 0 && <div className="flex justify-between"><dt className="text-muted">Discount ({coupon.code})</dt><dd>−{money(discount)}</dd></div>}
          <div className="flex justify-between"><dt className="text-muted">Shipping{ship.eta ? ` · ${ship.eta}` : ''}</dt><dd>{ship.cost ? money(ship.cost) : 'Free'}</dd></div>
          <div className="flex justify-between border-t border-line pt-3 text-lg"><dt>Total</dt><dd>{money(total)}</dd></div>
        </dl>
        <button className="btn mt-6 w-full" disabled={isLoading}>{isLoading ? 'Placing order…' : pay === 'COD' ? 'Place order' : 'Pay now'}</button>
      </aside>
    </form>
  );
}
