import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Copy, Check, Clock, ShoppingCart, ArrowRight, Bookmark } from 'lucide-react';
import { toast } from 'sonner';
import type { Coupon } from '@/context/CouponContext';
import WorthItBadge from './WorthItBadge';
import CopySparkle from './CopySparkle';
import { useFavourites } from '@/context/FavouritesContext';

const PLATFORM_COLORS: Record<string, string> = {
  Amazon: '#FF9900',
  Swiggy: '#FC8019',
  Myntra: '#FF3F6C',
  Zomato: '#E23744',
  Flipkart: '#2874F0',
  BigBasket: '#84C225',
  MakeMyTrip: '#E8402A',
  Paytm: '#00BAF2',
};

const PLATFORM_EMOJI: Record<string, string> = {
  Amazon: '📦',
  Swiggy: '🛵',
  Myntra: '👗',
  Zomato: '🍕',
  Flipkart: '🛒',
  BigBasket: '🥦',
  MakeMyTrip: '✈️',
  Paytm: '💳',
};

function getDaysLeft(expiryDate: string) {
  return Math.ceil((new Date(expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
}

export default function CouponCard({ coupon }: { coupon: Coupon }) {
  const [copied, setCopied] = useState(false);
  const [sparkle, setSparkle] = useState(false);
  const [codeVisible, setCodeVisible] = useState(false);
  const { isFavourite, toggleFavourite } = useFavourites();

  const daysLeft = getDaysLeft(coupon.expiryDate);
  const isExpiringSoon = daysLeft <= 3;
  const platformColor = PLATFORM_COLORS[coupon.platform] || '#6366F1';
  const platformEmoji = PLATFORM_EMOJI[coupon.platform] || '🏷️';
  const faved = isFavourite(coupon.id);

  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(coupon.couponCode);
    setCopied(true);
    setSparkle(true);
    toast.success(`Copied "${coupon.couponCode}"! 🎉`, { duration: 2000 });
    setTimeout(() => setCopied(false), 2200);
    setTimeout(() => setSparkle(false), 800);
  };

  const handleFavourite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavourite(coupon.id);
    if (!faved) {
      toast.success('Saved to favourites', { duration: 1500 });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35, ease: 'easeOut' as const }}
      whileHover={{ y: -5, transition: { duration: 0.18, ease: 'easeOut' as const } }}
      className="group relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800
        shadow-[0_1px_4px_rgba(0,0,0,0.06),0_4px_16px_rgba(0,0,0,0.04)]
        dark:shadow-[0_1px_4px_rgba(0,0,0,0.3),0_4px_16px_rgba(0,0,0,0.2)]
        hover:shadow-[0_8px_32px_rgba(99,102,241,0.13),0_2px_8px_rgba(0,0,0,0.06)]
        dark:hover:shadow-[0_8px_32px_rgba(99,102,241,0.18),0_2px_8px_rgba(0,0,0,0.3)]
        hover:border-indigo-200 dark:hover:border-indigo-800
        transition-all duration-200 overflow-hidden flex flex-col"
    >
      {/* Platform color top bar */}
      <div className="h-[3px] w-full flex-shrink-0" style={{ background: platformColor }} />

      {/* Bookmark button */}
      <motion.button
        whileTap={{ scale: 0.82 }}
        onClick={handleFavourite}
        aria-label={faved ? 'Remove from favourites' : 'Save to favourites'}
        className={`absolute top-4 right-4 z-10 w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-200
          ${faved
            ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400'
            : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 opacity-0 group-hover:opacity-100'
          }`}
      >
        <Bookmark size={13} fill={faved ? 'currentColor' : 'none'} />
      </motion.button>

      <Link to={`/coupon/${coupon.id}`} className="flex flex-col flex-1 p-5">
        {/* Header row */}
        <div className="flex items-start justify-between gap-2 mb-3 pr-6">
          <div className="flex items-center gap-2 min-w-0">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
              style={{ background: `${platformColor}15` }}
            >
              {platformEmoji}
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider leading-none mb-0.5">
                {coupon.platform}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-500 font-medium">{coupon.category}</div>
            </div>
          </div>
          <WorthItBadge status={coupon.worthIt} />
        </div>

        {/* Title */}
        <h3 className="font-bold text-slate-800 dark:text-slate-100 text-[15px] leading-snug mb-3 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-200 line-clamp-2 flex-1">
          {coupon.title}
        </h3>

        {/* Discount */}
        <div className="mb-4">
          <span className="inline-block text-2xl font-extrabold tracking-tight" style={{ color: platformColor }}>
            {coupon.discount}
          </span>
        </div>

        {/* Meta chips */}
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <span className="inline-flex items-center gap-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-xs font-medium px-2.5 py-1 rounded-lg">
            <ShoppingCart size={11} />
            Min ₹{coupon.minOrder.toLocaleString('en-IN')}
          </span>
          <span
            className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-lg border ${
              isExpiringSoon
                ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400'
                : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
            }`}
          >
            <Clock size={11} />
            {daysLeft <= 0 ? 'Expires today!' : `${daysLeft}d left`}
          </span>
        </div>

        {/* Coupon code */}
        <div
          className="relative flex items-center justify-between bg-slate-50 dark:bg-slate-800/80 border border-dashed border-slate-300 dark:border-slate-600 rounded-xl px-3 py-2.5 mt-auto group/code hover:border-indigo-300 dark:hover:border-indigo-600 hover:bg-indigo-50/40 dark:hover:bg-indigo-900/20 transition-all duration-200"
          onClick={(e) => {
            e.preventDefault();
            setCodeVisible(true);
          }}
        >
          <span
            className={`font-mono font-bold text-sm tracking-widest transition-all duration-300 select-none ${
              codeVisible
                ? 'text-indigo-600 dark:text-indigo-400 blur-none'
                : 'blur-[5px] text-slate-400 dark:text-slate-500'
            }`}
          >
            {coupon.couponCode}
          </span>

          {codeVisible ? (
            <div className="relative ml-2 flex-shrink-0">
              <CopySparkle active={sparkle} />
              <motion.button
                whileTap={{ scale: 0.88 }}
                onClick={handleCopy}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all duration-200 ${
                  copied
                    ? 'bg-emerald-500 text-white shadow-[0_0_12px_rgba(16,185,129,0.4)]'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm'
                }`}
                aria-label="Copy code"
              >
                {copied ? <><Check size={12} /> Copied</> : <><Copy size={12} /> Copy</>}
              </motion.button>
            </div>
          ) : (
            <span className="text-xs text-indigo-500 dark:text-indigo-400 font-semibold group-hover/code:text-indigo-700 dark:group-hover/code:text-indigo-300 transition-colors flex items-center gap-0.5 flex-shrink-0">
              Reveal <ArrowRight size={11} />
            </span>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
