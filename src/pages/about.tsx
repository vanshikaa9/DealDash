import { motion } from 'motion/react';
import { Lightbulb, ShieldCheck, TrendingUp, Users, Tag, Heart, BrainCircuit, Frown, Zap } from 'lucide-react';

const STATS = [
  { value: '10,000+', label: 'Deals Redeemed', icon: Tag, color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-50 dark:bg-indigo-900/30' },
  { value: '90,000+', label: 'Happy Users', icon: Users, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/30' },
  { value: '₹8,00,000+', label: 'Total Saved', icon: TrendingUp, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/30' },
];

const WHAT_WE_DO = [
  {
    icon: ShieldCheck,
    title: 'Verified Coupons Only',
    desc: 'Every deal is manually checked before it goes live. We test codes, confirm discounts, and flag anything that looks misleading.',
    color: 'text-indigo-600 dark:text-indigo-400',
    bg: 'bg-indigo-50 dark:bg-indigo-900/30',
  },
  {
    icon: TrendingUp,
    title: 'Honest Worth It Ratings',
    desc: 'We rate every coupon — Worth It, Conditional, or Not Worth It — so you can decide in seconds without reading the fine print.',
    color: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-50 dark:bg-emerald-900/30',
  },
  {
    icon: Heart,
    title: 'Built for Students',
    desc: 'We focus on platforms students actually use — food delivery, fashion, electronics, and travel — with deals that fit tight budgets.',
    color: 'text-rose-600 dark:text-rose-400',
    bg: 'bg-rose-50 dark:bg-rose-900/30',
  },
];

const PROBLEMS = [
  {
    icon: Frown,
    title: 'Coupon Fatigue',
    desc: 'Dozens of deal sites, hundreds of codes, most of them expired or useless. Searching for a discount became more exhausting than just paying full price.',
    color: 'text-rose-600 dark:text-rose-400',
    bg: 'bg-rose-50 dark:bg-rose-900/30',
  },
  {
    icon: BrainCircuit,
    title: 'Decision Overwhelm',
    desc: 'Even when you found a coupon, you had no way to know if it was actually a good deal. High minimum orders, tiny discounts, and hidden conditions buried in fine print.',
    color: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-50 dark:bg-amber-900/30',
  },
  {
    icon: Zap,
    title: 'Our Solution',
    desc: 'DealDash cuts through the noise. We curate fewer deals, rate every single one honestly, and surface only what\'s genuinely worth your time and money.',
    color: 'text-indigo-600 dark:text-indigo-400',
    bg: 'bg-indigo-50 dark:bg-indigo-900/30',
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function AboutPage() {
  return (
    <>
      <title>About — DealDash</title>
      <meta name="description" content="Learn how DealDash curates the best coupons for students and smart shoppers across India." />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-700">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-16 -left-16 w-64 h-64 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-violet-500/20 blur-3xl" />
        </div>
        <div className="relative container mx-auto px-4 pt-16 pb-16 text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            transition={{ duration: 0.5, ease: 'easeOut' as const }}
          >
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/25 text-white/90 text-xs font-semibold px-4 py-1.5 rounded-full mb-5">
              <Lightbulb size={12} className="text-amber-300" />
              Our story
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight leading-tight">
              Why We Built DealDash
            </h1>
            <p className="text-white/70 text-base md:text-lg max-w-xl mx-auto leading-relaxed">
              Because finding a good coupon shouldn't feel like a part-time job.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── The Problem We Solve ── */}
      <section className="container mx-auto px-4 py-14 max-w-4xl">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          transition={{ duration: 0.4, ease: 'easeOut' as const }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 text-xs font-bold px-4 py-1.5 rounded-full mb-4">
            <Frown size={12} />
            The problem we set out to fix
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-slate-100 mb-3">
            Coupon hunting was broken.
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-base max-w-2xl mx-auto leading-relaxed">
            We spent hours every week chasing discounts across WhatsApp groups, Telegram channels, and deal aggregators — only to find expired codes, misleading offers, and zero clarity on whether a deal was actually good. We were exhausted. And we knew we weren't alone.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {PROBLEMS.map(({ icon: Icon, title, desc, color, bg }, i) => (
            <motion.div
              key={title}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              transition={{ duration: 0.4, delay: i * 0.1, ease: 'easeOut' as const }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm"
            >
              <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center mb-4`}>
                <Icon size={20} className={color} />
              </div>
              <h4 className="font-bold text-slate-800 dark:text-slate-100 mb-2">{title}</h4>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── What Motivated Us ── */}
      <section className="bg-gradient-to-br from-indigo-50 to-violet-50/40 dark:from-indigo-950/30 dark:to-violet-950/20 border-y border-indigo-100 dark:border-indigo-900/40">
        <div className="container mx-auto px-4 py-14 max-w-3xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            transition={{ duration: 0.45, ease: 'easeOut' as const }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb size={18} className="text-indigo-500" />
              <h2 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">What Motivated Us</h2>
            </div>
            <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-slate-100 mb-6 leading-snug">
              A shared doc that became a movement
            </h3>
            <div className="space-y-5 text-slate-600 dark:text-slate-400 text-base leading-relaxed">
              <p>
                DealDash started as a private Google Sheet. A few of us — students on tight budgets — were manually tracking coupons that actually worked and sharing them in a group chat. No fluff, no expired codes, just the deals we'd personally tested.
              </p>
              <p>
                Friends started asking for access. Then their friends. We realised the problem wasn't a lack of coupons — it was a lack of <span className="font-semibold text-slate-800 dark:text-slate-200">signal in the noise</span>. Every deal aggregator was optimised for volume, not value. Nobody was telling you whether a coupon was actually worth using.
              </p>
              <p>
                So we built DealDash. The core idea: <span className="font-semibold text-indigo-600 dark:text-indigo-400">fewer deals, better rated, zero clutter</span>. Every coupon gets a Worth It score. Every expired code gets removed. And we never show you a deal just to inflate our numbers.
              </p>
              <p>
                We built this for students who don't have time to waste — and for anyone who's ever felt overwhelmed by the sheer volume of "deals" that aren't really deals at all.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── What We Do ── */}
      <section className="bg-slate-50 dark:bg-slate-900/50 border-y border-slate-100 dark:border-slate-800">
        <div className="container mx-auto px-4 py-14 max-w-4xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            transition={{ duration: 0.4, ease: 'easeOut' as const }}
            className="text-center mb-10"
          >
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 dark:text-slate-100">What We Do</h2>
            <p className="text-slate-400 dark:text-slate-500 mt-2 text-sm max-w-md mx-auto">
              Three principles that guide every coupon we publish.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {WHAT_WE_DO.map(({ icon: Icon, title, desc, color, bg }, i) => (
              <motion.div
                key={title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                transition={{ duration: 0.4, delay: i * 0.1, ease: 'easeOut' as const }}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm"
              >
                <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center mb-4`}>
                  <Icon size={20} className={color} />
                </div>
                <h4 className="font-bold text-slate-800 dark:text-slate-100 mb-2">{title}</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Impact Stats ── */}
      <section className="container mx-auto px-4 py-14 max-w-4xl">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          transition={{ duration: 0.4, ease: 'easeOut' as const }}
          className="text-center mb-10"
        >
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 dark:text-slate-100">Our Impact</h2>
          <p className="text-slate-400 dark:text-slate-500 mt-2 text-sm">Real numbers from real users saving real money.</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {STATS.map(({ value, label, icon: Icon, color, bg }, i) => (
            <motion.div
              key={label}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              transition={{ duration: 0.4, delay: i * 0.1, ease: 'easeOut' as const }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-7 text-center shadow-sm"
            >
              <div className={`w-12 h-12 rounded-2xl ${bg} flex items-center justify-center mx-auto mb-4`}>
                <Icon size={22} className={color} />
              </div>
              <div className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 mb-1">{value}</div>
              <div className="text-sm text-slate-400 dark:text-slate-500 font-medium">{label}</div>
            </motion.div>
          ))}
        </div>
      </section>
    </>
  );
}
