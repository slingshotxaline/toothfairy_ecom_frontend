/** Colours come from CSS variables so the admin Theme page can change them live. */
module.exports = {
  content: ['./src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)', surface: 'var(--surface)', card: 'var(--card)', fg: 'var(--fg)', muted: 'var(--muted)',
        accent: 'var(--accent)', btn: 'var(--btn)', 'btn-fg': 'var(--btn-fg)', line: 'var(--line)',
        'hero-bg': 'var(--hero-bg)', 'hero-fg': 'var(--hero-fg)', primary: 'var(--primary)',
      },
      fontFamily: { display: ['var(--font-display)', 'serif'], sans: ['var(--font-body)', 'system-ui', 'sans-serif'] },
      letterSpacing: { wider2: '0.18em' },
    },
  },
  plugins: [],
};
