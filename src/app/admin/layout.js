"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/lib/slices";
import { Logo } from "@/components/Header";

const NAV = [
  ["Dashboard", "/admin"],
  ["Orders", "/admin/orders"],
  ["Custom orders", "/admin/custom-orders"],
  ["Products", "/admin/products"],
  ["Categories", "/admin/categories"],
  ["Brands", "/admin/brands"],
  ["Inventory", "/admin/inventory"],
  ["Coupons", "/admin/coupons"],
  ["Shipping", "/admin/shipping"],
  ["Customers & staff", "/admin/users"],
  ["Home layout", "/admin/home-layout"],
  ["Theme", "/admin/theme"],
  ["Settings", "/admin/settings"],
  ["Traffic", "/admin/traffic"],
  ["Activity log", "/admin/logs"],
];

export default function AdminLayout({ children }) {
  const { user, ready } = useSelector((s) => s.auth);
  const router = useRouter();
  const path = usePathname();
  const d = useDispatch();
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (ready && !["ADMIN", "STAFF"].includes(user?.role))
      router.replace("/login");
  }, [ready, user, router]);
  if (!["ADMIN", "STAFF"].includes(user?.role))
    return <p className="py-32 text-center text-muted">Checking access…</p>;

  const nav = (
    <nav aria-label="Admin" className="flex flex-col pb-6">
      {NAV.map(([t, h]) => (
        <Link
          key={h}
          href={h}
          onClick={() => setOpen(false)}
          className={`px-5 py-2.5 text-sm ${path === h ? "bg-bg text-accent" : "text-muted hover:text-fg"}`}
        >
          {t}
        </Link>
      ))}
      <Link
        href="/"
        className="mt-4 border-t border-line px-5 py-2.5 text-sm text-muted hover:text-fg"
      >
        View store ↗
      </Link>
      <button
        onClick={() => {
          d(logout());
          router.push("/");
        }}
        className="px-5 py-2.5 text-left text-sm text-muted hover:text-fg"
      >
        Log out
      </button>
    </nav>
  );

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <div className="flex items-center justify-between border-b border-line bg-surface px-5 py-4 lg:hidden">
        <Link href="/admin">
          <Logo />
        </Link>
        <button
          className="btn-ghost"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>
      <aside
        className={`${open ? "block" : "hidden"} border-line bg-surface lg:sticky lg:top-0 lg:block lg:h-screen lg:w-60 lg:shrink-0 lg:overflow-y-auto lg:border-r`}
      >
        <Link href="/admin" className="hidden px-5 py-6 lg:block">
          <Logo />
        </Link>
        {nav}
      </aside>
      <div className="min-w-0 flex-1 p-5 lg:p-10">{children}</div>
    </div>
  );
}
