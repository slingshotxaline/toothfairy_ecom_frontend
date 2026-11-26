'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useSelector } from 'react-redux';

export const Logo = () => (
  <span className="flex items-center gap-3">
    <svg width="30" height="26" viewBox="0 0 30 26" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M2 3 L13 12 L2 5Z M28 3 L17 12 L28 5Z M2 23 L13 14 L2 21Z M28 23 L17 14 L28 21Z" fill="currentColor" />
    </svg>
    <span className="font-sans text-[17px] tracking-[0.35em] text-accent">TOOTH FAIRY</span>
  </span>
);

const LINKS = [['Shop', '/shop'], ['New Born', '/shop?category=new-born'], ['Toddlers', '/shop?category=toddlers'], ['Kids', '/shop?category=kids'], ['Teenagers', '/shop?category=teenagers'], ['Custom Order', '/#custom']];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [searching, setSearching] = useState(false);
  const [q, setQ] = useState('');
  const router = useRouter();
  const count = useSelector((s) => s.cart.items.reduce((n, i) => n + i.qty, 0));
  const user = useSelector((s) => s.auth.user);
  const submit = (e) => { e.preventDefault(); setSearching(false); setOpen(false); router.push(`/shop?q=${encodeURIComponent(q)}`); };

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-bg">
      <div className="mx-auto flex h-[66px] max-w-[1200px] items-center justify-between gap-6 px-5">
        <Link href="/" aria-label="Tooth Fairy home"><Logo /></Link>
        <nav className="hidden flex-1 items-center gap-7 lg:flex" aria-label="Main">
          {LINKS.map(([t, h]) => <Link key={t} href={h} className="text-[11px] uppercase tracking-wider2 hover:text-accent">{t}</Link>)}
        </nav>
        <div className="flex items-center gap-5 text-[11px] uppercase tracking-wider2">
          {searching ? (
            <form onSubmit={submit}><input autoFocus value={q} onChange={(e) => setQ(e.target.value)} onBlur={() => !q && setSearching(false)} placeholder="Search" className="w-28 border-b border-line bg-transparent py-1 text-xs normal-case tracking-normal outline-none sm:w-40" aria-label="Search products" /></form>
          ) : <button onClick={() => setSearching(true)} className="hover:text-accent">Search</button>}
          <Link href="/cart" className="flex items-center gap-2 hover:text-accent">Bag <span className="grid h-[18px] min-w-[18px] place-items-center rounded-full bg-fg px-1 text-[10px] text-bg">{count}</span></Link>
          <Link href={user ? (user.role === 'CUSTOMER' ? '/account' : '/admin') : '/login'} className="hidden hover:text-accent sm:block">{user ? (user.role === 'CUSTOMER' ? 'Account' : 'Admin') : 'Login'}</Link>
          <button className="lg:hidden" aria-label="Menu" aria-expanded={open} onClick={() => setOpen(!open)}>{open ? 'Close' : 'Menu'}</button>
        </div>
      </div>
      {open && (
        <nav className="border-t border-line bg-bg px-5 py-4 lg:hidden" aria-label="Mobile">
          {[...LINKS, [user ? 'Account' : 'Login', user ? (user.role === 'CUSTOMER' ? '/account' : '/admin') : '/login']].map(([t, h]) => (
            <Link key={t} href={h} onClick={() => setOpen(false)} className="block border-b border-line py-3 text-xs uppercase tracking-wider2">{t}</Link>
          ))}
        </nav>
      )}
    </header>
  );
}
