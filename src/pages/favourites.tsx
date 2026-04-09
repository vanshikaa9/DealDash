import { motion } from 'motion/react';
import { Bookmark, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useFavourites } from '@/context/FavouritesContext';
import { useCoupons } from '@/context/CouponContext';
import CouponCard from '@/components/CouponCard';

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0 },
};

export default function FavouritesPage() {
  const { favourites } = useFavourites();
  const { coupons } = useCoupons();

  const saved = coupons.filter((c) => favourites.has(c.id));

  return (
    <>
      <title>Saved Deals — DealDash</title>
      <meta name="description" content="Your bookmarked coupons and saved deals on DealDash." />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-700">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-violet-500/20 blur-3xl" />
        </div>
        <div className="relative container mx-auto px-4 pt-14 pb-14 text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            transition={{ duration: 0.45, ease: 'easeOut' as const }}
          >
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/25 text-white/90 text-xs font-semibold px-4 py-1.5 rounded-full mb-5">
              <Bookmark size={12} className="text-amber-300" />
              Your saved deals
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-3 tracking-tight">
              Favourites
            </h1>
            <p className="text-white/70 text-base max-w-md mx-auto">
              {saved.length > 0
                ? `You have ${saved.length} saved deal${saved.length !== 1 ? 's' : ''}.`
                : 'Bookmark deals to find them here instantly.'}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="container mx-auto px-4 py-10 max-w-5xl">
        {saved.length === 0 ? (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            transition={{ duration: 0.4, ease: 'easeOut' as const }}
            className="text-center py-20"
          >
            <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-5">
              <Bookmark size={28} className="text-slate-400 dark:text-slate-500" />
            </div>
            <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-100 mb-2">No saved deals yet</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 max-w-xs mx-auto">
              Hover over any coupon card and click the bookmark icon to save it here.
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm px-5 py-2.5 rounded-full transition-all shadow-sm"
            >
              <ArrowLeft size={14} />
              Browse Deals
            </Link>
          </motion.div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                {saved.length} Saved Deal{saved.length !== 1 ? 's' : ''}
              </h2>
              <Link
                to="/"
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 flex items-center gap-1 transition-colors"
              >
                <ArrowLeft size={13} /> Browse more
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {saved.map((coupon) => (
                <CouponCard key={coupon.id} coupon={coupon} />
              ))}
            </div>
          </>
        )}
      </section>
    </>
  );
}
