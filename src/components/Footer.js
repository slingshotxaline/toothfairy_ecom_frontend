'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Logo } from './Header';
import { useSettingsQuery, useSubscribeMutation } from '@/lib/api';
import { toast } from '@/lib/slices';
import { errMsg } from '@/lib/fmt';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [sub, { isLoading }] = useSubscribeMutation();
  const d = useDispatch();
  const { data } = useSettingsQuery();
  const site = data?.site || {};
  const go = async (e) => {
    e.preventDefault();
    try { await sub(email).unwrap(); setEmail(''); d(toast('You’re on the list.')); } catch (x) { d(toast(errMsg(x))); }
  };
  return (
    <footer className="mt-24 border-t border-line">
      <section className="mx-auto max-w-xl px-5 py-16 text-center">
        <h2 className="h-display text-4xl text-accent">Join the list</h2>
        <p className="mt-3 text-sm text-muted">New dresses and custom order updates, sent rarely.</p>
        <form onSubmit={go} className="mt-6 flex">
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address" aria-label="Email address" className="input flex-1" />
          <button className="btn" disabled={isLoading}>Subscribe</button>
        </form>
      </section>
      <div className="mx-auto flex max-w-[1200px] flex-col gap-8 px-5 pb-10 md:flex-row md:justify-between">
        <div><Logo /><p className="mt-3 text-sm text-muted">{site.tagline || 'Children’s boutique · Est. 2013'}</p></div>
        <nav className="flex flex-col gap-2 text-sm text-muted" aria-label="Footer">
          {site.facebook && <a href={site.facebook} target="_blank" rel="noreferrer" className="hover:text-fg">Facebook</a>}
          <Link href="/shop" className="hover:text-fg">Shop</Link>
          <Link href="/#custom" className="hover:text-fg">Custom orders</Link>
        </nav>
      </div>
      <p className="mx-auto max-w-[1200px] border-t border-line px-5 py-5 text-xs text-muted">© {new Date().getFullYear()} Tooth Fairy. All rights reserved.</p>
    </footer>
  );
}
