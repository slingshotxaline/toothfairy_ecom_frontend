'use client';
import { useEffect, useRef } from 'react';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { makeStore } from '@/lib/store';
import { hydrate, hydrateCart, clearToast } from '@/lib/slices';

function Boot({ children }) {
  const d = useDispatch();
  const items = useSelector((s) => s.cart.items);
  const toast = useSelector((s) => s.ui.toast);
  const loaded = useRef(false);
  useEffect(() => {
    try { d(hydrate(JSON.parse(localStorage.getItem('tf_auth')) || {})); } catch { d(hydrate({})); }
    try { d(hydrateCart(JSON.parse(localStorage.getItem('tf_cart')))); } catch {}
    loaded.current = true;
  }, [d]);
  useEffect(() => { if (loaded.current) localStorage.setItem('tf_cart', JSON.stringify(items)); }, [items]);
  useEffect(() => { if (toast) { const t = setTimeout(() => d(clearToast()), 3200); return () => clearTimeout(t); } }, [toast, d]);
  return (
    <>
      {children}
      {toast && (
        <div role="status" className="fixed bottom-5 left-1/2 z-[100] max-w-[90vw] -translate-x-1/2 border border-line bg-fg px-5 py-3 text-sm text-bg shadow-lg">
          {toast.text}
        </div>
      )}
    </>
  );
}

export default function Providers({ children }) {
  const ref = useRef();
  if (!ref.current) ref.current = makeStore();
  return <Provider store={ref.current}><Boot>{children}</Boot></Provider>;
}
