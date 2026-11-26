'use client';
import { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

function Inner() {
  const sp = useSearchParams();
  const failed = sp.get('failed'), n = sp.get('n');
  return (
    <div className="mx-auto max-w-lg px-5 py-28 text-center">
      <h1 className="h-display text-5xl text-accent">{failed ? 'Payment not completed' : 'Thank you'}</h1>
      <p className="mt-4 text-muted">{failed ? 'Your online payment did not go through, so the order was cancelled. You can try again or choose cash on delivery.' : `Your order ${n} has been placed. We’ll confirm it by phone shortly.`}</p>
      <Link href="/shop" className="btn mt-8">Continue shopping</Link>
    </div>
  );
}
export default function Success() { return <Suspense><Inner /></Suspense>; }
