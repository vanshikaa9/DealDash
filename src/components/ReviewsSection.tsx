import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, ThumbsUp, MessageSquarePlus, ChevronDown, ChevronUp, User } from 'lucide-react';
import { toast } from 'sonner';
import { useReviews } from '@/hooks/useReviews';

// ── Star display ──────────────────────────────────────────────────────────────
function Stars({ rating, size = 16, interactive = false, onRate }: {
  rating: number;
  size?: number;
  interactive?: boolean;
  onRate?: (r: number) => void;
}) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = interactive ? (hovered || rating) >= star : rating >= star;
        return (
          <button
            key={star}
            type={interactive ? 'button' : undefined}
            onClick={interactive ? () => onRate?.(star) : undefined}
            onMouseEnter={interactive ? () => setHovered(star) : undefined}
            onMouseLeave={interactive ? () => setHovered(0) : undefined}
            className={interactive ? 'transition-transform hover:scale-110' : 'cursor-default'}
            aria-label={interactive ? `Rate ${star} stars` : undefined}
          >
            <Star
              size={size}
              className={filled ? 'text-amber-400' : 'text-slate-200 dark:text-slate-700'}
              fill={filled ? 'currentColor' : 'none'}
            />
          </button>
        );
      })}
    </div>
  );
}

// ── Rating summary bar ────────────────────────────────────────────────────────
function RatingSummary({ avg, breakdown, total }: {
  avg: number;
  breakdown: { star: number; count: number; pct: number }[];
  total: number;
}) {
  return (
    <div className="flex flex-col sm:flex-row items-center gap-6 p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
      {/* Big number */}
      <div className="text-center flex-shrink-0">
        <div className="text-5xl font-extrabold text-slate-800 dark:text-slate-100 leading-none mb-1">
          {avg.toFixed(1)}
        </div>
        <Stars rating={Math.round(avg)} size={18} />
        <div className="text-xs text-slate-400 dark:text-slate-500 mt-1.5">
          {total} review{total !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Bars */}
      <div className="flex-1 w-full space-y-1.5">
        {breakdown.map(({ star, count, pct }) => (
          <div key={star} className="flex items-center gap-2">
            <span className="text-xs text-slate-500 dark:text-slate-400 w-4 text-right font-medium">{star}</span>
            <Star size={11} className="text-amber-400 flex-shrink-0" fill="currentColor" />
            <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.6, ease: 'easeOut' as const, delay: (5 - star) * 0.05 }}
                className="h-full bg-amber-400 rounded-full"
              />
            </div>
            <span className="text-xs text-slate-400 dark:text-slate-500 w-4">{count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Review card ───────────────────────────────────────────────────────────────
function ReviewCard({ review, onHelpful, voted }: {
  review: { id: string; author: string; rating: number; comment: string; helpful: number; createdAt: string };
  onHelpful: () => void;
  voted: boolean;
}) {
  const date = new Date(review.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' as const }}
      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center flex-shrink-0">
            <User size={14} className="text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <div className="text-sm font-bold text-slate-800 dark:text-slate-100">{review.author}</div>
            <div className="text-xs text-slate-400 dark:text-slate-500">{date}</div>
          </div>
        </div>
        <Stars rating={review.rating} size={14} />
      </div>

      <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-3">{review.comment}</p>

      <button
        onClick={onHelpful}
        className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border transition-all ${
          voted
            ? 'bg-indigo-50 dark:bg-indigo-900/30 border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400'
            : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-indigo-200 dark:hover:border-indigo-800 hover:text-indigo-600 dark:hover:text-indigo-400'
        }`}
      >
        <ThumbsUp size={12} />
        Helpful{review.helpful > 0 ? ` (${review.helpful})` : ''}
      </button>
    </motion.div>
  );
}

// ── Write review form ─────────────────────────────────────────────────────────
function WriteReviewForm({ onSubmit }: { onSubmit: (author: string, rating: number, comment: string) => void }) {
  const [author, setAuthor] = useState('');
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating) { toast.error('Please select a star rating.'); return; }
    if (!comment.trim()) { toast.error('Please write a short review.'); return; }
    onSubmit(author, rating, comment);
    setSubmitted(true);
    toast.success('Review posted! Thanks for sharing.');
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-6"
      >
        <div className="text-3xl mb-2">🎉</div>
        <div className="font-bold text-slate-800 dark:text-slate-100 mb-1">Thanks for your review!</div>
        <div className="text-sm text-slate-400 dark:text-slate-500">Your feedback helps other students decide.</div>
      </motion.div>
    );
  }

  const RATING_LABELS: Record<number, string> = {
    1: 'Poor', 2: 'Fair', 3: 'Okay', 4: 'Good', 5: 'Excellent',
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Star picker */}
      <div>
        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">
          Your Rating <span className="text-red-500">*</span>
        </label>
        <div className="flex items-center gap-3">
          <Stars rating={rating} size={28} interactive onRate={setRating} />
          {rating > 0 && (
            <motion.span
              key={rating}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-sm font-semibold text-amber-500"
            >
              {RATING_LABELS[rating]}
            </motion.span>
          )}
        </div>
      </div>

      {/* Name */}
      <div>
        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1.5">
          Your Name <span className="text-slate-300 dark:text-slate-600 font-normal">(optional)</span>
        </label>
        <input
          type="text"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="e.g. Priya S."
          maxLength={40}
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 dark:focus:ring-indigo-700 transition-all"
        />
      </div>

      {/* Comment */}
      <div>
        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1.5">
          Review <span className="text-red-500">*</span>
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Did the coupon work? Was the discount worth it? Any tips for other students?"
          rows={3}
          maxLength={400}
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 dark:focus:ring-indigo-700 transition-all resize-none"
        />
        <div className="text-right text-xs text-slate-400 dark:text-slate-600 mt-1">{comment.length}/400</div>
      </div>

      <button
        type="submit"
        className="w-full bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white font-bold text-sm py-2.5 rounded-xl transition-all shadow-sm shadow-indigo-200 dark:shadow-indigo-900"
      >
        Post Review
      </button>
    </form>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────
const SHOW_STEP = 3;

export default function ReviewsSection({ couponId }: { couponId: string }) {
  const { reviews, avgRating, ratingBreakdown, addReview, voteHelpful, hasVoted } = useReviews(couponId);
  const [showForm, setShowForm] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const visibleReviews = showAll ? reviews : reviews.slice(0, SHOW_STEP);

  return (
    <div className="mt-6">
      {/* Section header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-extrabold text-slate-800 dark:text-slate-100">User Reviews</h2>
          {reviews.length > 0 && (
            <span className="text-xs font-bold bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded-full">
              {reviews.length}
            </span>
          )}
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800 px-3 py-1.5 rounded-full transition-colors"
        >
          <MessageSquarePlus size={13} />
          {showForm ? 'Cancel' : 'Write a Review'}
        </button>
      </div>

      {/* Write review form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' as const }}
            className="overflow-hidden mb-5"
          >
            <div className="bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-800 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <MessageSquarePlus size={15} className="text-indigo-500" />
                <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Share your experience</span>
              </div>
              <WriteReviewForm onSubmit={(author, rating, comment) => {
                addReview(author, rating, comment);
                setTimeout(() => setShowForm(false), 2000);
              }} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Rating summary */}
      {reviews.length > 0 ? (
        <>
          <RatingSummary avg={avgRating} breakdown={ratingBreakdown} total={reviews.length} />

          <div className="mt-5 space-y-3">
            {visibleReviews.map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
                onHelpful={() => voteHelpful(review.id)}
                voted={hasVoted(review.id)}
              />
            ))}
          </div>

          {reviews.length > SHOW_STEP && (
            <button
              onClick={() => setShowAll((v) => !v)}
              className="mt-4 w-full flex items-center justify-center gap-2 text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl hover:border-indigo-200 dark:hover:border-indigo-800 transition-all"
            >
              {showAll ? (
                <><ChevronUp size={15} /> Show less</>
              ) : (
                <><ChevronDown size={15} /> Show all {reviews.length} reviews</>
              )}
            </button>
          )}
        </>
      ) : (
        <div className="text-center py-10 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800">
          <div className="text-3xl mb-2">⭐</div>
          <div className="font-bold text-slate-700 dark:text-slate-300 mb-1">No reviews yet</div>
          <p className="text-sm text-slate-400 dark:text-slate-500">Be the first to share whether this deal is worth it!</p>
        </div>
      )}
    </div>
  );
}
