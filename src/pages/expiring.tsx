import { motion } from 'motion/react';
import { Clock } from 'lucide-react';
import { useCoupons } from '@/context/CouponContext';
import CouponCard from '@/components/CouponCard';

export default function ExpiringPage() {
  const { getExpiringSoon } = useCoupons();
  const expiring = getExpiringSoon();

  return (
    <>
      <title>Expiring Soon — DealDash</title>
      <meta name="description" content="Coupons expiring in the next 3 days. Grab them before they're gone!" />

      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' as const }}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center">
              <Clock size={20} className="text-red-500" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">Expiring Soon</h1>
              <p className="text-slate-400 dark:text-slate-500 text-sm">Deals ending in the next 3 days</p>
            </div>
          </div>

          <div className="h-px bg-slate-200 dark:bg-slate-800 my-6" />

          {expiring.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">🎉</div>
              <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2">No deals expiring soon</h2>
              <p className="text-slate-400 dark:text-slate-500 text-sm">All current deals have plenty of time left.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {expiring.map((coupon) => (
                <CouponCard key={coupon.id} coupon={coupon} />
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </>
  );
}
