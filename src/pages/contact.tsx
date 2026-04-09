import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Phone, MapPin, ChevronDown, MessageCircle, ShieldCheck, RefreshCw, PlusCircle } from 'lucide-react';

const CONTACT_INFO = [
  {
    icon: Mail,
    label: 'Email',
    value: 'trydealdash.in',
    href: 'mailto:trydealdash.in',
    color: 'text-indigo-600 dark:text-indigo-400',
    bg: 'bg-indigo-50 dark:bg-indigo-900/30',
  },
  {
    icon: Phone,
    label: 'Phone',
    value: '+91 95655 11336',
    href: 'tel:+919565511336',
    color: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-50 dark:bg-emerald-900/30',
  },
  {
    icon: MapPin,
    label: 'Location',
    value: 'Noida, Uttar Pradesh, India',
    href: null,
    color: 'text-rose-600 dark:text-rose-400',
    bg: 'bg-rose-50 dark:bg-rose-900/30',
  },
];

const FAQS = [
  {
    icon: ShieldCheck,
    q: 'How are coupons verified?',
    a: 'Every coupon is manually tested by our team before it goes live. We check that the code works, confirm the discount amount, and verify the minimum order requirement. Expired or broken codes are removed within 24 hours.',
  },
  {
    icon: MessageCircle,
    q: 'Why are some deals marked "Not Worth It"?',
    a: "Transparency is core to DealDash. If a coupon has a very high minimum order, a tiny discount, or restrictive conditions (like bank-specific offers), we mark it honestly. We'd rather you skip a bad deal than waste your time.",
  },
  {
    icon: PlusCircle,
    q: 'How can I add my own coupon?',
    a: 'Head to the "Add Coupon" page from the top navigation. Fill in the deal details — platform, discount, code, and expiry — and it will appear on the homepage instantly. Our team reviews community submissions periodically.',
  },
  {
    icon: RefreshCw,
    q: 'Are the deals updated regularly?',
    a: 'Yes. Our team refreshes the coupon list daily. We also pull live data from select platforms so you always see the most current deals. The "Expiring Soon" section is updated in real time.',
  },
  {
    icon: Mail,
    q: 'Can I suggest a platform to add?',
    a: 'Absolutely. Drop us an email at trydealdash.in with the platform name and any deals you know about. We\'re always looking to expand our coverage based on what students actually use.',
  },
  {
    icon: ShieldCheck,
    q: 'Is DealDash free to use?',
    a: 'Yes, completely free. We don\'t charge users, require sign-ups, or hide deals behind paywalls. DealDash is built for students and will stay free.',
  },
];

function FAQItem({ icon: Icon, q, a }: { icon: React.ElementType; q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-900">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
      >
        <div className="flex items-center gap-3 min-w-0">
          <Icon size={16} className="text-indigo-500 flex-shrink-0" />
          <span className="font-semibold text-sm text-slate-800 dark:text-slate-100">{q}</span>
        </div>
        <ChevronDown
          size={16}
          className={`text-slate-400 flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeOut' as const }}
            className="overflow-hidden"
          >
            <p className="px-5 pb-4 text-sm text-slate-500 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-3">
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function ContactPage() {
  return (
    <>
      <title>Contact — DealDash</title>
      <meta name="description" content="Get in touch with the DealDash team or find answers to common questions in our FAQ." />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-700">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-violet-500/20 blur-3xl" />
        </div>
        <div className="relative container mx-auto px-4 pt-16 pb-16 text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            transition={{ duration: 0.5, ease: 'easeOut' as const }}
          >
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/25 text-white/90 text-xs font-semibold px-4 py-1.5 rounded-full mb-5">
              <MessageCircle size={12} className="text-amber-300" />
              We're here to help
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
              Get in Touch
            </h1>
            <p className="text-white/70 text-base md:text-lg max-w-md mx-auto leading-relaxed">
              Questions, suggestions, or just want to say hi — we read every message.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Contact Info ── */}
      <section className="container mx-auto px-4 py-14 max-w-3xl">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          transition={{ duration: 0.4, ease: 'easeOut' as const }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4"
        >
          {CONTACT_INFO.map(({ icon: Icon, label, value, href, color, bg }) => (
            <div
              key={label}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 text-center shadow-sm"
            >
              <div className={`w-11 h-11 rounded-xl ${bg} flex items-center justify-center mx-auto mb-3`}>
                <Icon size={20} className={color} />
              </div>
              <div className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">{label}</div>
              {href ? (
                <a href={href} className={`text-sm font-semibold ${color} hover:underline`}>{value}</a>
              ) : (
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{value}</span>
              )}
            </div>
          ))}
        </motion.div>
      </section>

      {/* ── FAQ ── */}
      <section className="bg-slate-50 dark:bg-slate-900/50 border-y border-slate-100 dark:border-slate-800">
        <div className="container mx-auto px-4 py-14 max-w-3xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            transition={{ duration: 0.4, ease: 'easeOut' as const }}
            className="mb-8"
          >
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 dark:text-slate-100 mb-2">
              Frequently Asked Questions
            </h2>
            <p className="text-slate-400 dark:text-slate-500 text-sm">
              Quick answers to the questions we hear most often.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            transition={{ duration: 0.4, delay: 0.1, ease: 'easeOut' as const }}
            className="space-y-3"
          >
            {FAQS.map((faq) => (
              <FAQItem key={faq.q} icon={faq.icon} q={faq.q} a={faq.a} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="container mx-auto px-4 py-14 max-w-xl text-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          transition={{ duration: 0.4, ease: 'easeOut' as const }}
        >
          <h3 className="text-xl font-extrabold text-slate-800 dark:text-slate-100 mb-2">Still have questions?</h3>
          <p className="text-slate-400 dark:text-slate-500 text-sm mb-5">
            Our team usually responds within a few hours on weekdays.
          </p>
          <a
            href="mailto:trydealdash.in"
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm px-6 py-3 rounded-full shadow-sm shadow-indigo-200 dark:shadow-indigo-900 transition-all"
          >
            <Mail size={15} />
            Email Us
          </a>
        </motion.div>
      </section>
    </>
  );
}
