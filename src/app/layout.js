import { Italiana, Jost } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Tracker from "@/components/Tracker";
import Shell from "@/components/Shell";

const display = Italiana({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
});
const body = Jost({ subsets: ["latin"], variable: "--font-body" });
const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
const MAP = {
  bg: "bg",
  surface: "surface",
  card: "card",
  fg: "fg",
  muted: "muted",
  accent: "accent",
  btn: "btn",
  btnFg: "btn-fg",
  line: "line",
  heroBg: "hero-bg",
  heroFg: "hero-fg",
  primary: "primary",
};

export const metadata = {
  title: "Tooth Fairy — Children’s boutique",
  description:
    "Little dresses, made to be remembered. Custom orders ready in 3 days.",
};

async function getTheme() {
  try {
    const r = await fetch(`${API}/settings/public`, {
      next: { revalidate: 20 },
    });
    return r.ok ? (await r.json()).theme || {} : {};
  } catch {
    return {};
  }
}

export default async function RootLayout({ children }) {
  const t = await getTheme();
  const css = Object.entries(MAP)
    .filter(([k]) => /^#[0-9a-f]{3,8}$/i.test(t[k] || ""))
    .map(([k, v]) => `--${v}:${t[k]};`)
    .join("");
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <head>
        {css && <style dangerouslySetInnerHTML={{ __html: `:root{${css}}` }} />}
      </head>
      <body>
        <Providers>
          <Shell>{children}</Shell>
        </Providers>
      </body>
    </html>
  );
}
