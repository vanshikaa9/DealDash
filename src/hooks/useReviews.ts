import { useState, useEffect, useCallback } from 'react';

export type Review = {
  id: string;
  couponId: string;
  author: string;
  rating: number; // 1–5
  comment: string;
  helpful: number;
  helpfulVotedBy: string[]; // session IDs that voted
  createdAt: string; // ISO date string
};

const STORAGE_KEY = 'dealdash_reviews';
const SESSION_KEY = 'dealdash_session_id';

function getSessionId(): string {
  let id = sessionStorage.getItem(SESSION_KEY);
  if (!id) {
    id = Math.random().toString(36).slice(2);
    sessionStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

function loadAll(): Review[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveAll(reviews: Review[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
}

// Seed realistic reviews for existing coupon IDs so the page isn't empty on first load
const SEED_REVIEWS: Review[] = [
  {
    id: 'seed-1', couponId: '1', author: 'Priya S.', rating: 5,
    comment: 'Worked perfectly on my laptop purchase! Saved ₹1,200. Highly recommend.',
    helpful: 8, helpfulVotedBy: [], createdAt: '2026-03-28T10:00:00Z',
  },
  {
    id: 'seed-2', couponId: '1', author: 'Rahul M.', rating: 4,
    comment: 'Good deal but only works on select items. Read the fine print before ordering.',
    helpful: 5, helpfulVotedBy: [], createdAt: '2026-03-30T14:30:00Z',
  },
  {
    id: 'seed-3', couponId: '2', author: 'Ananya K.', rating: 5,
    comment: 'Used this for my Swiggy order last night. Applied instantly, no issues!',
    helpful: 3, helpfulVotedBy: [], createdAt: '2026-04-01T19:00:00Z',
  },
  {
    id: 'seed-4', couponId: '2', author: 'Karan T.', rating: 3,
    comment: 'Works but the minimum order is a bit high for a single person. Better for group orders.',
    helpful: 6, helpfulVotedBy: [], createdAt: '2026-04-02T12:00:00Z',
  },
  {
    id: 'seed-5', couponId: '3', author: 'Sneha R.', rating: 5,
    comment: 'Amazing deal on Myntra! Got a great kurta at 30% off. Totally worth it.',
    helpful: 11, helpfulVotedBy: [], createdAt: '2026-03-25T09:00:00Z',
  },
  {
    id: 'seed-6', couponId: '4', author: 'Vikram P.', rating: 2,
    comment: 'Tried this on Zomato but it only worked on one restaurant near me. Very limited.',
    helpful: 4, helpfulVotedBy: [], createdAt: '2026-04-03T20:00:00Z',
  },
  {
    id: 'seed-7', couponId: '5', author: 'Divya N.', rating: 4,
    comment: 'Flipkart deal was solid. Saved on headphones. Delivery was fast too.',
    helpful: 7, helpfulVotedBy: [], createdAt: '2026-03-29T11:00:00Z',
  },
];

function initializeStorage() {
  const existing = loadAll();
  if (existing.length === 0) {
    saveAll(SEED_REVIEWS);
    return SEED_REVIEWS;
  }
  return existing;
}

export function useReviews(couponId: string) {
  const [allReviews, setAllReviews] = useState<Review[]>(() => initializeStorage());
  const sessionId = getSessionId();

  // Sync across tabs
  useEffect(() => {
    const handler = () => setAllReviews(loadAll());
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  const reviews = allReviews
    .filter((r) => r.couponId === couponId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const avgRating = reviews.length
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  const addReview = useCallback(
    (author: string, rating: number, comment: string) => {
      const newReview: Review = {
        id: Date.now().toString(),
        couponId,
        author: author.trim() || 'Anonymous',
        rating,
        comment: comment.trim(),
        helpful: 0,
        helpfulVotedBy: [],
        createdAt: new Date().toISOString(),
      };
      setAllReviews((prev) => {
        const updated = [newReview, ...prev];
        saveAll(updated);
        return updated;
      });
    },
    [couponId]
  );

  const voteHelpful = useCallback((reviewId: string) => {
    setAllReviews((prev) => {
      const updated = prev.map((r) => {
        if (r.id !== reviewId) return r;
        const alreadyVoted = r.helpfulVotedBy.includes(sessionId);
        if (alreadyVoted) {
          return { ...r, helpful: r.helpful - 1, helpfulVotedBy: r.helpfulVotedBy.filter((id) => id !== sessionId) };
        }
        return { ...r, helpful: r.helpful + 1, helpfulVotedBy: [...r.helpfulVotedBy, sessionId] };
      });
      saveAll(updated);
      return updated;
    });
  }, [sessionId]);

  const hasVoted = (reviewId: string) => {
    const review = allReviews.find((r) => r.id === reviewId);
    return review?.helpfulVotedBy.includes(sessionId) ?? false;
  };

  const ratingBreakdown = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
    pct: reviews.length ? (reviews.filter((r) => r.rating === star).length / reviews.length) * 100 : 0,
  }));

  return { reviews, avgRating, ratingBreakdown, addReview, voteHelpful, hasVoted };
}
