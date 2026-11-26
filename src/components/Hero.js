import Link from 'next/link';
import Garment from './Garment';

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-hero-bg">
      <div className="pointer-events-none absolute -right-24 top-0 hidden h-full w-[70%] rounded-l-full bg-white/50 lg:block" />
      <div className="relative mx-auto grid max-w-[1200px] items-center gap-6 px-5 py-14 lg:grid-cols-[1fr_1.3fr] lg:py-10">
        <div>
          <p className="text-[11px] uppercase tracking-wider2 text-hero-fg opacity-60">New born to teenagers</p>
          <h1 className="h-display mt-5 text-[clamp(2.8rem,7vw,5rem)] text-hero-fg">Little dresses, made to be remembered.</h1>
          <p className="mt-6 text-hero-fg opacity-80">Everyday and festive pieces, quietly considered.</p>
          <Link href="/shop" className="mt-8 inline-block bg-primary px-8 py-4 text-[11px] uppercase tracking-wider2 text-white">Shop the collection</Link>
          <div><Link href="/#custom" className="mt-4 inline-block text-sm text-primary underline">or order a custom piece, ready in 3 days</Link></div>
        </div>
        <div className="flex items-end justify-center gap-1 sm:gap-3" aria-hidden="true">
          <Garment kind="dress" color="blush" className="w-[22%]" id="h1" />
          <Garment kind="kurta" color="blush" dots={false} className="w-[22%]" id="h2" />
          <Garment kind="dress" color="sand" className="w-[30%]" id="h3" />
          <Garment kind="kurta" color="navy" dots={false} trim="#e3d3bb" className="w-[26%]" id="h4" />
        </div>
      </div>
    </section>
  );
}
