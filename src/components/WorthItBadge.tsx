import type { WorthItStatus } from '@/context/CouponContext';

const config: Record<WorthItStatus, { label: string; className: string; dot: string }> = {
  'worth-it': {
    label: 'Worth It',
    dot: 'bg-emerald-500',
    className:
      'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800',
  },
  conditional: {
    label: 'Conditional',
    dot: 'bg-amber-400',
    className:
      'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800',
  },
  'not-worth-it': {
    label: 'Not Worth It',
    dot: 'bg-red-500',
    className:
      'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800',
  },
};

export default function WorthItBadge({
  status,
  size = 'sm',
}: {
  status: WorthItStatus;
  size?: 'sm' | 'md';
}) {
  const { label, dot, className } = config[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold transition-colors ${className} ${
        size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3.5 py-1 text-sm'
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dot}`} />
      {label}
    </span>
  );
}
