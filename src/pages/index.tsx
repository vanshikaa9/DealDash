import { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { Search, SlidersHorizontal, Clock, ChevronRight, Sparkles, X, Wifi } from 'lucide-react';
import { useCoupons } from '@/context/CouponContext';
import CouponCard from '@/components/CouponCard';
import WorthItBadge from '@/components/WorthItBadge';
import { Skeleton } from '@/components/ui/skeleton';
import type { WorthItStatus } from '@/context/CouponContext';
import { useTypewriter } from '@/hooks/useTypewriter';

const WORTH_IT_OPTIONS = [
  { value: 'All', label: 'All Ratings' },
  { value: 'worth-it', label: 'Worth It' },
  { value: 'conditional', label: 'Conditional' },
  { value: 'not-worth-it', label: 'Not Worth It' },
];

const STATS = [
  { value: '50+', label: 'Active Deals' },
  { value: '10+', label: 'Platforms' },
  { value: '100%', label: 'Curated' },
];

export default function HomePage() {
  const { categories, platforms, filterCoupons, getExpiringSoon, isLoading, isLive } = useCoupons();
  const [searchParams, setSearchParams] = useSearchParams();

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [platform, setPlatform] = useState('All');
  const [worthIt, setWorthIt] = useState('All');

  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) {
      setCategory(cat);
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const filtered = useMemo(
    () => filterCoupons({ search, category, platform, worthIt }),
    [search, category, platform, worthIt, filterCoupons]
  );

  const expiringSoon = getExpiringSoon();
  const isFiltered = search || category !== 'All' || platform !== 'All' || worthIt !== 'All';
  const { displayText, showCursor } = useTypewriter();

  const clearFilters = () => {
    setSearch('');
    setCategory('All');
    setPlatform('All');
    setWorthIt('All');
  };

  return (
    <>
      <title>DealDash — Smart Deals for Students</title>
      <meta name="description" content="Curated coupons for students and smart shoppers. Find the best deals on Amazon, Swiggy, Myntra, Zomato and more." />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-700">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-16 -left-16 w-64 h-64 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-violet-500/20 blur-3xl" />
          <div className="absolute bottom-0 left-1/3 w-72 h-72 rounded-full bg-indigo-400/15 blur-3xl" />
        </div>

        <div className="relative container mx-auto px-4 pt-14 pb-16 md:pt-20 md:pb-20">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' as const }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/25 text-white/90 text-xs font-semibold px-4 py-1.5 rounded-full mb-6">
              <Sparkles size={12} className="text-amber-300" />
              Curated for students &amp; smart shoppers
            </div>

            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4 tracking-tight leading-[1.1]">
              Smart Deals.
              <br />
              <span className="text-indigo-200">Zero Clutter.</span>
            </h1>
            <p className="text-white/70 text-base md:text-lg mb-8 max-w-lg mx-auto leading-relaxed">
              Only the coupons that are actually worth using — rated and curated so you never waste a click.
            </p>

            {/* Search */}
            <div className="relative max-w-xl mx-auto mb-10">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none z-10" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-11 pr-10 py-4 rounded-2xl bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 placeholder:text-transparent text-sm font-medium shadow-2xl shadow-indigo-900/30 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-all"
              />
              {/* Typewriter placeholder — only shown when input is empty */}
              {!search && (
                <span
                  className="pointer-events-none absolute left-11 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-400 select-none"
                  aria-hidden="true"
                >
                  {displayText}
                  <span
                    className="inline-block w-[2px] h-[14px] bg-indigo-400 ml-[1px] align-middle"
                    style={{ opacity: showCursor ? 1 : 0, transition: 'opacity 0.1s' }}
                  />
                </span>
              )}
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <X size={14} className="text-slate-400" />
                </button>
              )}
            </div>

            {/* Stats */}
            <div className="flex items-center justify-center gap-8">
              {STATS.map(({ value, label }) => (
                <div key={label} className="text-center">
                  <div className="text-2xl font-extrabold text-white">{value}</div>
                  <div className="text-xs text-white/60 font-medium">{label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Expiring Soon Strip ── */}
      {expiringSoon.length > 0 && (
        <section className="bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-950/40 dark:to-rose-950/40 border-b border-red-100 dark:border-red-900/50">
          <div className="container mx-auto px-4 py-4">
            {/* Single-line header row — never wraps */}
            <div className="flex items-center gap-3 mb-3 min-w-0">
              <div className="flex items-center gap-1.5 bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 text-xs font-bold px-3 py-1 rounded-full flex-shrink-0 whitespace-nowrap">
                <Clock size={12} />
                Expiring Soon
              </div>
              <Link
                to="/expiring"
                className="ml-auto flex-shrink-0 whitespace-nowrap text-xs text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-semibold flex items-center gap-0.5 transition-colors"
              >
                View all <ChevronRight size={13} />
              </Link>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
              {expiringSoon.map((coupon) => {
                const daysLeft = Math.ceil(
                  (new Date(coupon.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
                );
                return (
                  <Link
                    key={coupon.id}
                    to={`/coupon/${coupon.id}`}
                    className="flex-shrink-0 bg-white dark:bg-slate-900 border border-red-200 dark:border-red-800 rounded-2xl px-4 py-3 hover:border-red-400 dark:hover:border-red-600 hover:shadow-md hover:shadow-red-100 dark:hover:shadow-red-900/30 transition-all duration-200 min-w-[210px] group"
                  >
                    <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wide mb-1">
                      {coupon.platform}
                    </div>
                    <div className="font-bold text-sm text-slate-800 dark:text-slate-100 line-clamp-1 mb-2 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                      {coupon.title}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-indigo-600 dark:text-indigo-400 font-extrabold text-sm">{coupon.discount}</span>
                      <span className="bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 text-xs font-bold px-2 py-0.5 rounded-full">
                        {daysLeft <= 0 ? 'Today!' : `${daysLeft}d left`}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── Filters ── */}
      <section className="sticky top-16 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800 shadow-[0_2px_8px_rgba(0,0,0,0.04)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.2)]">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-3 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
            <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 flex-shrink-0">
              <SlidersHorizontal size={14} />
              <span className="text-xs font-semibold hidden sm:block">Filter</span>
            </div>

            <div className="w-px h-4 bg-slate-200 dark:bg-slate-700 flex-shrink-0" />

            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-150 flex-shrink-0 ${
                  category === cat
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200 dark:shadow-indigo-900'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-700 dark:hover:text-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}

            <div className="w-px h-4 bg-slate-200 dark:bg-slate-700 flex-shrink-0" />

            {platforms.map((p) => (
              <button
                key={p}
                onClick={() => setPlatform(p)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-150 flex-shrink-0 ${
                  platform === p
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200 dark:shadow-indigo-900'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-700 dark:hover:text-slate-200'
                }`}
              >
                {p}
              </button>
            ))}

            <div className="w-px h-4 bg-slate-200 dark:bg-slate-700 flex-shrink-0" />

            {WORTH_IT_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setWorthIt(opt.value)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-150 flex-shrink-0 ${
                  worthIt === opt.value
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200 dark:shadow-indigo-900'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-700 dark:hover:text-slate-200'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Coupons Grid ── */}
      <section className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                {isFiltered ? `${filtered.length} result${filtered.length !== 1 ? 's' : ''} found` : 'All Deals'}
              </h2>
              {isLive && !isLoading && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, ease: 'easeOut' as const }}
                  className="flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 text-xs font-bold px-2.5 py-1 rounded-full"
                >
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                  </span>
                  <Wifi size={11} />
                  Live
                </motion.div>
              )}
            </div>
            {isFiltered && <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Filtered from your selections</p>}
          </div>
          {isFiltered && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1.5 text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:text-indigo-800 dark:hover:text-indigo-300 bg-indigo-50 dark:bg-indigo-900/30 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 px-3 py-1.5 rounded-full transition-all"
            >
              <X size={12} />
              Clear filters
            </button>
          )}
        </div>

        {filtered.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-24">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl">
              🔍
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2">No coupons found</h3>
            <p className="text-slate-400 dark:text-slate-500 text-sm mb-4">Try adjusting your filters or search terms.</p>
            <button
              onClick={clearFilters}
              className="bg-indigo-600 text-white text-sm font-semibold px-5 py-2 rounded-full hover:bg-indigo-700 transition-colors"
            >
              Clear all filters
            </button>
          </motion.div>
        ) : isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden p-5 space-y-3">
                <Skeleton className="h-1 w-full rounded-full" />
                <div className="flex items-center gap-2">
                  <Skeleton className="w-9 h-9 rounded-xl" />
                  <div className="space-y-1.5 flex-1">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-2.5 w-12" />
                  </div>
                  <Skeleton className="h-5 w-16 rounded-full" />
                </div>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-7 w-16" />
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-20 rounded-lg" />
                  <Skeleton className="h-6 w-16 rounded-lg" />
                </div>
                <Skeleton className="h-10 w-full rounded-xl" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((coupon) => (
              <CouponCard key={coupon.id} coupon={coupon} />
            ))}
          </div>
        )}
      </section>

      {/* ── Worth It Legend ── */}
      <section className="container mx-auto px-4 pb-14">
        <div className="bg-gradient-to-br from-slate-50 to-indigo-50/40 dark:from-slate-900 dark:to-indigo-950/30 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8">
          <div className="flex items-center gap-2 mb-5">
            <Sparkles size={16} className="text-indigo-500" />
            <h3 className="font-bold text-slate-700 dark:text-slate-300 text-sm uppercase tracking-wider">
              How our rating system works
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { status: 'worth-it' as WorthItStatus, desc: 'High discount, low minimum order. A clear win — use it without hesitation.' },
              { status: 'conditional' as WorthItStatus, desc: 'Good deal only if you meet specific conditions or were already planning to buy.' },
              { status: 'not-worth-it' as WorthItStatus, desc: 'Minimal savings or high minimum. Better deals are usually available.' },
            ].map(({ status, desc }) => (
              <div key={status} className="flex flex-col gap-2.5 bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-100 dark:border-slate-800 shadow-sm">
                <WorthItBadge status={status} size="md" />
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
