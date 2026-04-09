import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Copy, Check, ArrowLeft, Clock, ShoppingCart, Tag, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { useCoupons } from '@/context/CouponContext';
import WorthItBadge from '@/components/WorthItBadge';
import ReviewsSection from '@/components/ReviewsSection';

const PLATFORM_COLORS: Record<string, string> = {
  Amazon: '#FF9900', Swiggy: '#FC8019', Myntra: '#FF3F6C', Zomato: '#E23744',
  Flipkart: '#2874F0', BigBasket: '#84C225', MakeMyTrip: '#E8402A', Paytm: '#00BAF2',
};
const PLATFORM_EMOJI: Record<string, string> = {
  Amazon: '📦', Swiggy: '🛵', Myntra: '👗', Zomato: '🍕',
  Flipkart: '🛒', BigBasket: '🥦', MakeMyTrip: '✈️', Paytm: '💳',
};
const WORTH_IT_EXPLANATION: Record<string, { title: string; detail: string }> = {
  'worth-it': { title: 'This deal is genuinely worth it', detail: 'High discount relative to the minimum order. Most shoppers will save meaningfully with this coupon.' },
  conditional: { title: 'Worth it — with conditions', detail: 'This deal is good only if you meet specific conditions. Check the details before using.' },
  'not-worth-it': { title: 'Probably not worth your time', detail: 'The savings are minimal compared to the minimum order required. Better deals are usually available.' },
};

function getDaysLeft(expiryDate: string) {
  return Math.ceil((new Date(expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
}

export default function CouponDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { getById, coupons } = useCoupons();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const coupon = getById(id!);
  if (!coupon) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="text-5xl mb-4">🤔</div>
        <h1 className="text-2xl font-bold mb-2 text-slate-800 dark:text-slate-100">Coupon not found</h1>
        <p className="text-slate-500 dark:text-slate-400 mb-6">This deal may have expired or been removed.</p>
        <Link to="/" className="bg-indigo-600 text-white px-6 py-2.5 rounded-full font-semibold text-sm hover:bg-indigo-700 transition-colors">
          Browse all deals
        </Link>
      </div>
    );
  }

  const platformColor = PLATFORM_COLORS[coupon.platform] || '#6366F1';
  const platformEmoji = PLATFORM_EMOJI[coupon.platform] || '🏷️';
  const daysLeft = getDaysLeft(coupon.expiryDate);
  const isExpiringSoon = daysLeft <= 3;
  const worthItInfo = WORTH_IT_EXPLANATION[coupon.worthIt];

  const handleCopy = () => {
    navigator.clipboard.writeText(coupon.couponCode);
    setCopied(true);
    toast.success(`Copied "${coupon.couponCode}"! Go use it now.`, { duration: 3000 });
    setTimeout(() => setCopied(false), 3000);
  };

  const related = coupons
    .filter((c) => c.id !== coupon.id && (c.platform === coupon.platform || c.category === coupon.category))
    .slice(0, 3);

  return (
    <>
      <title>{coupon.title} — DealDash</title>
      <meta name="description" content={coupon.description} />

      <div className="container mx-auto px-4 py-6 max-w-3xl">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 mb-6 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to deals
        </button>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' as const }}
        >
          {/* Main card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm dark:shadow-black/20 mb-6">
            <div className="h-1.5 w-full" style={{ background: platformColor }} />

            <div className="p-6 md:p-8">
              {/* Platform + badge */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ background: `${platformColor}18` }}>
                    {platformEmoji}
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wide">{coupon.platform}</div>
                    <div className="text-xs text-slate-400 dark:text-slate-500">{coupon.category}</div>
                  </div>
                </div>
                <WorthItBadge status={coupon.worthIt} size="md" />
              </div>

              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 dark:text-slate-100 mb-2 leading-tight">
                {coupon.title}
              </h1>
              <div className="text-5xl font-extrabold mb-6 tracking-tight" style={{ color: platformColor }}>
                {coupon.discount}
              </div>

              {/* Meta grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                {[
                  { icon: ShoppingCart, label: 'Min Order', value: `₹${coupon.minOrder.toLocaleString('en-IN')}` },
                  {
                    icon: Clock, label: 'Expires',
                    value: daysLeft <= 0 ? 'Today!' : `${daysLeft} days`,
                    urgent: isExpiringSoon,
                  },
                  {
                    icon: Calendar, label: 'Expiry Date',
                    value: new Date(coupon.expiryDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
                  },
                  { icon: Tag, label: 'Category', value: coupon.category },
                ].map(({ icon: Icon, label, value, urgent }) => (
                  <div
                    key={label}
                    className={`rounded-xl p-3 ${urgent ? 'bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800' : 'bg-slate-50 dark:bg-slate-800'}`}
                  >
                    <div className={`flex items-center gap-1.5 text-xs mb-1 ${urgent ? 'text-red-500' : 'text-slate-400 dark:text-slate-500'}`}>
                      <Icon size={12} />
                      {label}
                    </div>
                    <div className={`font-bold text-sm ${urgent ? 'text-red-600 dark:text-red-400' : 'text-slate-800 dark:text-slate-100'}`}>
                      {value}
                    </div>
                  </div>
                ))}
              </div>

              {/* Coupon code */}
              <div className="bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 rounded-2xl p-4 mb-6">
                <div className="text-xs text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wide mb-2">Coupon Code</div>
                <div className="flex items-center justify-between gap-3">
                  <span className="font-mono font-extrabold text-2xl text-indigo-600 dark:text-indigo-400 tracking-widest">
                    {coupon.couponCode}
                  </span>
                  <motion.button
                    whileTap={{ scale: 0.92 }}
                    onClick={handleCopy}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                      copied ? 'bg-emerald-500 text-white' : 'bg-indigo-600 text-white hover:bg-indigo-700'
                    }`}
                  >
                    {copied ? <><Check size={16} /> Copied!</> : <><Copy size={16} /> Copy Code</>}
                  </motion.button>
                </div>
              </div>

              {/* Description */}
              {coupon.description && (
                <div className="mb-6">
                  <h2 className="font-bold text-xs uppercase tracking-wide text-slate-400 dark:text-slate-500 mb-2">About this deal</h2>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{coupon.description}</p>
                </div>
              )}

              {/* Worth It explanation */}
              <div className={`rounded-xl p-4 border ${
                coupon.worthIt === 'worth-it'
                  ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800'
                  : coupon.worthIt === 'conditional'
                  ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800'
                  : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
              }`}>
                <div className="flex items-start gap-3">
                  <WorthItBadge status={coupon.worthIt} size="md" />
                  <div>
                    <div className="font-bold text-slate-800 dark:text-slate-100 text-sm mb-1">{worthItInfo.title}</div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{worthItInfo.detail}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Reviews */}
          <ReviewsSection couponId={coupon.id} />

          {/* Related deals */}
          {related.length > 0 && (
            <div>
              <h2 className="font-bold text-slate-800 dark:text-slate-100 text-lg mb-4">Related Deals</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {related.map((c) => (
                  <Link
                    key={c.id}
                    to={`/coupon/${c.id}`}
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-sm transition-all"
                  >
                    <div className="text-xs text-slate-400 dark:text-slate-500 font-semibold mb-1">{c.platform}</div>
                    <div className="font-bold text-sm text-slate-800 dark:text-slate-100 line-clamp-2 mb-2">{c.title}</div>
                    <div className="flex items-center justify-between">
                      <span className="text-indigo-600 dark:text-indigo-400 font-extrabold">{c.discount}</span>
                      <WorthItBadge status={c.worthIt} />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </>
  );
}
