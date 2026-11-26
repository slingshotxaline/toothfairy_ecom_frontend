'use client';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Collection from '@/components/Collection';

function Inner() {
  const sp = useSearchParams();
  const q = sp.get('q') || '';
  return (
    <>
      {q && <p className="mx-auto max-w-[1200px] px-5 pt-10 text-sm text-muted">Results for “{q}”</p>}
      <Collection key={sp.toString()} initialCategory={sp.get('category') || ''} initialQ={q} />
    </>
  );
}
export default function Shop() { return <Suspense><Inner /></Suspense>; }
