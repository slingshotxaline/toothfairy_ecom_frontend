'use client';
import { usePathname } from 'next/navigation';
import Header from './Header';
import Footer from './Footer';
import Tracker from './Tracker';

// Storefront chrome (header, footer, traffic tracking) is hidden on /admin pages.
export default function Shell({ children }) {
  const isAdmin = usePathname().startsWith('/admin');
  return (
    <>
      {!isAdmin && <Header />}
      <main>{children}</main>
      {!isAdmin && <Footer />}
      <Tracker />
    </>
  );
}