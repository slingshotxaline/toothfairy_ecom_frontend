'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { API } from '@/lib/api';

export default function Tracker() {
  const path = usePathname();
  useEffect(() => {
    if (path.startsWith('/admin')) return;
    let sid = sessionStorage.getItem('tf_sid');
    if (!sid) { sid = Math.random().toString(36).slice(2) + Date.now().toString(36); sessionStorage.setItem('tf_sid', sid); }
    fetch(`${API}/track`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ path, sessionId: sid, referrer: document.referrer }), keepalive: true }).catch(() => {});
  }, [path]);
  return null;
}
