import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { PlusCircle, CheckCircle, Download, Link as LinkIcon, ChevronDown, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { useCoupons } from '@/context/CouponContext';
import type { WorthItStatus } from '@/context/CouponContext';
import WorthItBadge from '@/components/WorthItBadge';

const PLATFORMS = ['Amazon', 'Swiggy', 'Myntra', 'Zomato', 'Flipkart', 'BigBasket', 'MakeMyTrip', 'Paytm', 'Other'];
const CATEGORIES = ['Food', 'Fashion', 'Electronics', 'Travel', 'Grocery', 'Utility', 'Other'];

type FormData = {
  title: string; platform: string; category: string; discount: string;
  minOrder: string; expiryDate: string; couponCode: string;
  worthIt: WorthItStatus; description: string; featured: boolean;
};

const INITIAL: FormData = {
  title: '', platform: 'Amazon', category: 'Electronics', discount: '',
  minOrder: '', expiryDate: '', couponCode: '', worthIt: 'worth-it', description: '', featured: false,
};

const inputCls = "w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 dark:focus:ring-indigo-700 focus:border-indigo-400 dark:focus:border-indigo-600 transition-all";

// ── Simulated autofill data per platform ─────────────────────────────────────
const PLATFORM_AUTOFILL: Record<string, Partial<FormData>> = {
  Amazon: {
    platform: 'Amazon', category: 'Electronics',
    title: 'Amazon Deal — Electronics & More',
    discount: '20% off', minOrder: '499',
    description: 'Imported from Amazon. Verify the discount and minimum order before publishing.',
  },
  Swiggy: {
    platform: 'Swiggy', category: 'Food',
    title: 'Swiggy Offer — Food Delivery',
    discount: '₹100 off', minOrder: '199',
    description: 'Imported from Swiggy. Check if the offer is valid in your city.',
  },
  Myntra: {
    platform: 'Myntra', category: 'Fashion',
    title: 'Myntra Fashion Sale',
    discount: '30% off', minOrder: '799',
    description: 'Imported from Myntra. Valid on select brands during sale events.',
  },
  Zomato: {
    platform: 'Zomato', category: 'Food',
    title: 'Zomato Discount — Food Orders',
    discount: '₹80 off', minOrder: '249',
    description: 'Imported from Zomato. May be restricted to select restaurants.',
  },
  Flipkart: {
    platform: 'Flipkart', category: 'Electronics',
    title: 'Flipkart Big Saving Days Deal',
    discount: '15% off', minOrder: '999',
    description: 'Imported from Flipkart. Valid during Big Saving Days and select sales.',
  },
  BigBasket: {
    platform: 'BigBasket', category: 'Grocery',
    title: 'BigBasket Grocery Offer',
    discount: '10% off', minOrder: '600',
    description: 'Imported from BigBasket. Valid on fresh produce and staples.',
  },
  MakeMyTrip: {
    platform: 'MakeMyTrip', category: 'Travel',
    title: 'MakeMyTrip Travel Deal',
    discount: '₹500 off', minOrder: '3000',
    description: 'Imported from MakeMyTrip. Valid on hotel and flight bookings.',
  },
  Paytm: {
    platform: 'Paytm', category: 'Utility',
    title: 'Paytm Cashback Offer',
    discount: '₹50 cashback', minOrder: '200',
    description: 'Imported from Paytm. Cashback credited within 24 hours of transaction.',
  },
};

// Detect platform from a pasted URL or code
function detectFromInput(input: string): Partial<FormData> | null {
  const lower = input.toLowerCase();
  for (const platform of PLATFORMS) {
    if (lower.includes(platform.toLowerCase())) {
      return PLATFORM_AUTOFILL[platform] ?? null;
    }
  }
  // Try to detect coupon code pattern (all caps, 4-16 chars)
  const codeMatch = input.match(/\b([A-Z0-9]{4,16})\b/);
  if (codeMatch) {
    return { couponCode: codeMatch[1] };
  }
  return null;
}

export default function AdminPage() {
  const { addCoupon } = useCoupons();
  const navigate = useNavigate();
  const [form, setForm] = useState<FormData>(INITIAL);
  const [submitted, setSubmitted] = useState(false);
  const [importMode, setImportMode] = useState(false);
  const [importPlatform, setImportPlatform] = useState('Amazon');
  const [importInput, setImportInput] = useState('');
  const [importFilled, setImportFilled] = useState(false);

  const set = (field: keyof FormData, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.discount || !form.couponCode || !form.expiryDate) {
      toast.error('Please fill in all required fields.');
      return;
    }
    addCoupon({ ...form, minOrder: parseInt(form.minOrder) || 0 });
    setSubmitted(true);
    toast.success('Coupon added successfully!');
    setTimeout(() => navigate('/'), 2000);
  };

  const handleImport = () => {
    // Autofill from platform selection
    const platformData = PLATFORM_AUTOFILL[importPlatform];
    // Also try to detect from pasted input
    const detected = importInput ? detectFromInput(importInput) : null;

    const merged: Partial<FormData> = { ...platformData, ...detected };

    // If pasted input looks like a coupon code, use it directly
    const codeMatch = importInput.match(/^[A-Z0-9]{4,16}$/i);
    if (codeMatch) merged.couponCode = importInput.toUpperCase();

    setForm((prev) => ({ ...prev, ...merged }));
    setImportFilled(true);
    toast.success('Fields auto-filled! Review and complete any missing details.');
  };

  const handleImportPlatformChange = (platform: string) => {
    setImportPlatform(platform);
    setImportFilled(false);
  };

  if (submitted) {
    return (
      <div className="container mx-auto px-4 py-20 text-center max-w-md">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, ease: 'easeOut' as const }}
        >
          <CheckCircle size={64} className="text-emerald-500 mx-auto mb-4" />
          <h2 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 mb-2">Coupon Added!</h2>
          <p className="text-slate-400 dark:text-slate-500">Redirecting you to the deals page...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <title>Add Coupon — DealDash</title>
      <meta name="description" content="Add a new coupon to DealDash." />

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' as const }}
        >
          {/* Page header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/40 rounded-xl flex items-center justify-center">
              <PlusCircle size={20} className="text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">Add New Coupon</h1>
              <p className="text-slate-400 dark:text-slate-500 text-sm">Fill in the details to add a deal</p>
            </div>
          </div>

          {/* Mode toggle */}
          <div className="flex items-center gap-2 mb-5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl w-fit">
            <button
              onClick={() => setImportMode(false)}
              className={`flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-lg transition-all ${
                !importMode
                  ? 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
            >
              <PlusCircle size={13} />
              Manual
            </button>
            <button
              onClick={() => setImportMode(true)}
              className={`flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-lg transition-all ${
                importMode
                  ? 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
            >
              <Download size={13} />
              Import
            </button>
          </div>

          {/* Import panel */}
          <AnimatePresence>
            {importMode && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.22, ease: 'easeOut' as const }}
                className="overflow-hidden mb-5"
              >
                <div className="bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900 rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles size={15} className="text-indigo-500" />
                    <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">Import Coupon</h3>
                    <span className="text-xs text-indigo-500 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/50 px-2 py-0.5 rounded-full font-semibold">Auto-fill</span>
                  </div>

                  <div className="space-y-3">
                    {/* Platform selector */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
                        Select Platform
                      </label>
                      <div className="relative">
                        <select
                          value={importPlatform}
                          onChange={(e) => handleImportPlatformChange(e.target.value)}
                          className={`${inputCls} appearance-none pr-9`}
                        >
                          {PLATFORMS.filter((p) => p !== 'Other').map((p) => (
                            <option key={p} value={p}>{p}</option>
                          ))}
                        </select>
                        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      </div>
                    </div>

                    {/* Paste input */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
                        Paste Coupon Code or Link <span className="font-normal text-slate-400">(optional)</span>
                      </label>
                      <div className="relative">
                        <LinkIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        <input
                          type="text"
                          value={importInput}
                          onChange={(e) => { setImportInput(e.target.value); setImportFilled(false); }}
                          placeholder="e.g. SAVE20 or https://amazon.in/deal/..."
                          className={`${inputCls} pl-9`}
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleImport}
                      className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold py-2.5 rounded-xl transition-all"
                    >
                      <Sparkles size={14} />
                      {importFilled ? 'Re-fill Fields' : 'Auto-fill Fields'}
                    </button>

                    {importFilled && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-xs text-emerald-600 dark:text-emerald-400 text-center font-medium"
                      >
                        ✓ Fields filled below — review and complete any missing info
                      </motion.p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main form */}
          <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 space-y-5 shadow-sm dark:shadow-black/20">

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Title <span className="text-red-500">*</span>
              </label>
              <input type="text" value={form.title} onChange={(e) => set('title', e.target.value)}
                placeholder="e.g. Flat 20% Off on Electronics" className={inputCls} required />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Platform <span className="text-red-500">*</span>
                </label>
                <select value={form.platform} onChange={(e) => set('platform', e.target.value)} className={inputCls}>
                  {PLATFORMS.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Category <span className="text-red-500">*</span>
                </label>
                <select value={form.category} onChange={(e) => set('category', e.target.value)} className={inputCls}>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Discount <span className="text-red-500">*</span>
                </label>
                <input type="text" value={form.discount} onChange={(e) => set('discount', e.target.value)}
                  placeholder="e.g. 20% or ₹150 off" className={inputCls} required />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Min Order (₹)</label>
                <input type="number" value={form.minOrder} onChange={(e) => set('minOrder', e.target.value)}
                  placeholder="e.g. 499" min={0} className={inputCls} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Expiry Date <span className="text-red-500">*</span>
                </label>
                <input type="date" value={form.expiryDate} onChange={(e) => set('expiryDate', e.target.value)}
                  className={inputCls} required />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Coupon Code <span className="text-red-500">*</span>
                </label>
                <input type="text" value={form.couponCode}
                  onChange={(e) => set('couponCode', e.target.value.toUpperCase())}
                  placeholder="e.g. SAVE20" className={`${inputCls} font-mono`} required />
              </div>
            </div>

            {/* Worth It */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Worth It Status <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-3 flex-wrap">
                {(['worth-it', 'conditional', 'not-worth-it'] as WorthItStatus[]).map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => set('worthIt', status)}
                    className={`transition-all rounded-xl p-0.5 ${
                      form.worthIt === status
                        ? 'ring-2 ring-indigo-500 ring-offset-2 dark:ring-offset-slate-900'
                        : 'opacity-60 hover:opacity-90'
                    }`}
                  >
                    <WorthItBadge status={status} size="md" />
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => set('description', e.target.value)}
                placeholder="Explain the deal, any conditions, and why it's worth it (or not)..."
                rows={3}
                className={`${inputCls} resize-none`}
              />
            </div>

            {/* Featured */}
            <div className="flex items-center gap-3">
              <input type="checkbox" id="featured" checked={form.featured}
                onChange={(e) => set('featured', e.target.checked)}
                className="w-4 h-4 accent-indigo-600 rounded" />
              <label htmlFor="featured" className="text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
                Feature this coupon on the homepage
              </label>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white py-3 rounded-xl font-bold text-sm transition-all shadow-sm shadow-indigo-200 dark:shadow-indigo-900 hover:shadow-md active:scale-[0.98]"
              >
                Add Coupon to DealDash
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </>
  );
}
