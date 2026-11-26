'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { useMyOrdersQuery } from '@/lib/api';
import { logout } from '@/lib/slices';
import { dateTime, money } from '@/lib/fmt';

export default function Account() {
  const { user, ready } = useSelector((s) => s.auth);
  const d = useDispatch();
  const router = useRouter();
  const { data: orders } = useMyOrdersQuery(undefined, { skip: !user });
  useEffect(() => { if (ready && !user) router.replace('/login'); }, [ready, user, router]);
  if (!user) return null;
  return (
    <div className="mx-auto max-w-[900px] px-5 py-12">
      <div className="flex items-end justify-between"><h1 className="h-display text-4xl text-accent md:text-5xl">Hello, {user.name}</h1><button className="btn-ghost" onClick={() => { d(logout()); router.push('/'); }}>Log out</button></div>
      <h2 className="eyebrow mt-10">Your orders</h2>
      <div className="mt-4 divide-y divide-line border-y border-line">
        {orders?.length ? orders.map((o) => (
          <div key={o.id} className="py-4 text-sm"><div className="flex flex-wrap justify-between gap-2"><b className="font-medium">{o.number}</b><span>{money(o.total)}</span></div><p className="mt-1 text-muted">{dateTime(o.createdAt)} · {o.status} · {o.payMethod === 'COD' ? 'Cash on delivery' : `Online (${o.payStatus})`}</p><p className="mt-1 text-muted">{o.items.map((i) => `${i.qty}× ${i.title}`).join(', ')}</p></div>
        )) : <p className="py-6 text-muted">No orders yet.</p>}
      </div>
    </div>
  );
}
