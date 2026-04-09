import { Link } from 'react-router-dom';

const NAV_LINKS = [
  { to: '/', label: 'Deals' },
  { to: '/favourites', label: 'Saved' },
  { to: '/expiring', label: 'Expiring Soon' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
  { to: '/admin', label: 'Add Coupon' },
];

const MARQUEE_SEGMENT =
  "You deserve better than 47 expired codes and one good deal buried at the bottom" +
  "   ✦   " +
  "Don't scroll 12 apps, just DealDash it" +
  "   ✦   ";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">

      {/* ── Marquee strip ── */}
      <div className="overflow-hidden border-b border-slate-100 dark:border-slate-800 bg-indigo-50 dark:bg-indigo-950/30 py-2.5">
        <div className="flex whitespace-nowrap animate-marquee-fast">
          {[0, 1, 2, 3].map((i) => (
            <span
              key={i}
              className="inline-block text-xs font-semibold text-indigo-500 dark:text-indigo-400 tracking-wide px-8"
              aria-hidden={i > 0}
            >
              {MARQUEE_SEGMENT}
            </span>
          ))}
        </div>
      </div>

      {/* ── Main footer row ── */}
      <div className="container mx-auto px-4 py-5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">

          {/* Brand */}
          <Link to="/" className="flex items-center gap-2 group flex-shrink-0">
            <img
              src="/assets/dealdash-logo.png"
              alt="DealDash"
              className="h-8 w-auto object-contain dark:brightness-0 dark:invert"
            />
            <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 tracking-wide">
              Designed for Smart Shoppers
            </span>
          </Link>

          {/* Nav */}
          <nav className="flex items-center gap-5 flex-wrap justify-center">
            {NAV_LINKS.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className="text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Copyright */}
          <p className="text-xs text-slate-400 dark:text-slate-500 flex-shrink-0">
            © {year} DealDash
          </p>
        </div>
      </div>
    </footer>
  );
}
