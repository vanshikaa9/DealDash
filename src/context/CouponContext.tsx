import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { fetchAmazonCoupons } from '@/services/couponAPI';

export type WorthItStatus = 'worth-it' | 'conditional' | 'not-worth-it';

export type Coupon = {
  id: string;
  title: string;
  platform: string;
  category: string;
  discount: string;
  minOrder: number;
  expiryDate: string;
  couponCode: string;
  worthIt: WorthItStatus;
  description: string;
  featured: boolean;
};

const today = new Date();
const addDays = (d: number) => {
  const dt = new Date(today);
  dt.setDate(dt.getDate() + d);
  return dt.toISOString().split('T')[0];
};

const MOCK_COUPONS: Coupon[] = [
  // ── Amazon ──────────────────────────────────────────────────────────────
  {
    id: '1',
    title: 'Flat 30% Off on boAt & Sony Headphones',
    platform: 'Amazon',
    category: 'Electronics',
    discount: '30% off',
    minOrder: 999,
    expiryDate: addDays(2),
    couponCode: 'AMZAUDIO30',
    worthIt: 'worth-it',
    description:
      'Get 30% off on boAt Rockerz, Sony WH-1000XM4, and JBL Tune series. Low minimum order and a genuinely high discount — one of the better electronics deals this month.',
    featured: true,
  },
  {
    id: '2',
    title: '₹500 Off on Laptops Above ₹30,000',
    platform: 'Amazon',
    category: 'Electronics',
    discount: '₹500 off',
    minOrder: 30000,
    expiryDate: addDays(9),
    couponCode: 'AMZLAP500',
    worthIt: 'not-worth-it',
    description:
      'Only ₹500 off on a ₹30,000+ laptop purchase — that\'s less than 2% savings. The minimum is extremely high and the absolute saving is negligible. Skip this and look for bank card offers instead.',
    featured: false,
  },
  {
    id: '3',
    title: '15% Off on Kindle & eReaders',
    platform: 'Amazon',
    category: 'Electronics',
    discount: '15% off',
    minOrder: 4999,
    expiryDate: addDays(14),
    couponCode: 'KINDLEREAD15',
    worthIt: 'conditional',
    description:
      'Save 15% on Kindle Paperwhite and Kindle Basic. Worth it if you read regularly — the savings are decent on a ₹5,000–₹15,000 device. Not worth it if you\'re just curious.',
    featured: false,
  },

  // ── Flipkart ─────────────────────────────────────────────────────────────
  {
    id: '4',
    title: '₹1,000 Off on Smartphones Above ₹12,000',
    platform: 'Flipkart',
    category: 'Electronics',
    discount: '₹1,000 off',
    minOrder: 12000,
    expiryDate: addDays(3),
    couponCode: 'FKPHONE1K',
    worthIt: 'worth-it',
    description:
      'Flat ₹1,000 off on phones like Redmi Note 13, Realme 12 Pro, and iQOO Z9. Works on most mid-range phones. Solid deal if you\'re already in the market for a new phone.',
    featured: true,
  },
  {
    id: '5',
    title: '40% Off on Fastrack & Titan Watches',
    platform: 'Flipkart',
    category: 'Fashion',
    discount: '40% off',
    minOrder: 1299,
    expiryDate: addDays(1),
    couponCode: 'FKWATCH40',
    worthIt: 'worth-it',
    description:
      'Massive 40% discount on Fastrack, Titan, and Sonata watches. Expiring tomorrow — if you\'ve been eyeing a watch, this is the time. Low minimum and high discount make it a clear win.',
    featured: true,
  },
  {
    id: '6',
    title: '5% Extra Off via HDFC Credit Card',
    platform: 'Flipkart',
    category: 'Electronics',
    discount: '5% extra',
    minOrder: 5000,
    expiryDate: addDays(20),
    couponCode: 'FKHDFC5',
    worthIt: 'not-worth-it',
    description:
      'Only 5% extra off and only for HDFC credit card holders. The savings are minimal and the card restriction makes it inaccessible for most students. Better deals are almost always available.',
    featured: false,
  },

  // ── Swiggy ───────────────────────────────────────────────────────────────
  {
    id: '7',
    title: '₹120 Off on Orders Above ₹249',
    platform: 'Swiggy',
    category: 'Food',
    discount: '₹120 off',
    minOrder: 249,
    expiryDate: addDays(1),
    couponCode: 'SWGY120',
    worthIt: 'worth-it',
    description:
      'Save ₹120 on any Swiggy order above ₹249. That\'s nearly 50% off on a typical meal — one of the best food deals available right now. Expires tomorrow so use it today.',
    featured: true,
  },
  {
    id: '8',
    title: 'Free Delivery on 3 Orders This Week',
    platform: 'Swiggy',
    category: 'Food',
    discount: 'Free delivery',
    minOrder: 149,
    expiryDate: addDays(5),
    couponCode: 'SWGYFREE3',
    worthIt: 'conditional',
    description:
      'Get free delivery on your next 3 Swiggy orders. Worth it if you order frequently — saves ₹30–₹60 per order. Not useful if you only order occasionally or already have Swiggy One.',
    featured: false,
  },
  {
    id: '9',
    title: '60% Off Up to ₹100 on Late Night Orders',
    platform: 'Swiggy',
    category: 'Food',
    discount: '60% off (up to ₹100)',
    minOrder: 199,
    expiryDate: addDays(4),
    couponCode: 'SWGYLATE60',
    worthIt: 'worth-it',
    description:
      'Valid between 11 PM and 2 AM on select restaurants. The 60% headline is capped at ₹100 but on a ₹200 order that\'s still a 50% saving. Great for late-night study sessions.',
    featured: true,
  },

  // ── Zomato ───────────────────────────────────────────────────────────────
  {
    id: '10',
    title: '₹150 Off on Your Next 2 Orders',
    platform: 'Zomato',
    category: 'Food',
    discount: '₹150 off',
    minOrder: 299,
    expiryDate: addDays(3),
    couponCode: 'ZOM150X2',
    worthIt: 'worth-it',
    description:
      'Get ₹150 off on each of your next 2 orders — that\'s ₹300 total savings. Works on most restaurants with a reasonable ₹299 minimum. One of the best Zomato deals in a while.',
    featured: true,
  },
  {
    id: '11',
    title: '20% Off on Biryani Orders (Max ₹60)',
    platform: 'Zomato',
    category: 'Food',
    discount: '20% off (up to ₹60)',
    minOrder: 350,
    expiryDate: addDays(7),
    couponCode: 'ZOMBIRYAN20',
    worthIt: 'conditional',
    description:
      'Specifically for biryani orders from partner restaurants. The 20% is capped at ₹60, so on a ₹350 order you save only ₹60. Decent if you were ordering biryani anyway, otherwise skip.',
    featured: false,
  },
  {
    id: '12',
    title: 'Flat ₹30 Off on Dessert Orders',
    platform: 'Zomato',
    category: 'Food',
    discount: '₹30 off',
    minOrder: 250,
    expiryDate: addDays(6),
    couponCode: 'ZOMDESSERT',
    worthIt: 'not-worth-it',
    description:
      'Only ₹30 off on dessert orders above ₹250. The saving is too small to be meaningful — you\'re better off using a general Zomato coupon that gives more value.',
    featured: false,
  },

  // ── Myntra ───────────────────────────────────────────────────────────────
  {
    id: '13',
    title: '50% Off on H&M, Zara & Mango Styles',
    platform: 'Myntra',
    category: 'Fashion',
    discount: '50% off',
    minOrder: 2499,
    expiryDate: addDays(2),
    couponCode: 'MFASHION50',
    worthIt: 'worth-it',
    description:
      'Half price on premium international brands including H&M, Zara, and Mango. The ₹2,499 minimum is easy to hit with 2 items. Expiring in 2 days — don\'t sleep on this one.',
    featured: true,
  },
  {
    id: '14',
    title: '₹300 Off on Sportswear Above ₹1,999',
    platform: 'Myntra',
    category: 'Fashion',
    discount: '₹300 off',
    minOrder: 1999,
    expiryDate: addDays(11),
    couponCode: 'MYSPORT300',
    worthIt: 'conditional',
    description:
      'Save ₹300 on Nike, Adidas, and Puma sportswear. Worth it if you need gym clothes or running shoes — the minimum is achievable with a single pair of shoes. Not worth buying just to use the coupon.',
    featured: false,
  },
  {
    id: '15',
    title: 'Extra 10% Off on Already Discounted Items',
    platform: 'Myntra',
    category: 'Fashion',
    discount: '10% extra',
    minOrder: 799,
    expiryDate: addDays(16),
    couponCode: 'MYNEXTRA10',
    worthIt: 'conditional',
    description:
      'Stack an extra 10% on top of sale prices. Works best during End of Reason Sale when items are already 40–70% off. On regular days the base discount is lower, making this less impactful.',
    featured: false,
  },

  // ── BigBasket ────────────────────────────────────────────────────────────
  {
    id: '16',
    title: '₹250 Off on First BigBasket Order',
    platform: 'BigBasket',
    category: 'Grocery',
    discount: '₹250 off',
    minOrder: 1000,
    expiryDate: addDays(10),
    couponCode: 'BBNEW250',
    worthIt: 'worth-it',
    description:
      'New to BigBasket? Get ₹250 off your first order. The ₹1,000 minimum is easy to hit on a weekly grocery run. Excellent deal — essentially a 25% discount on your first shop.',
    featured: true,
  },
  {
    id: '17',
    title: '10% Off on Organic & Health Foods',
    platform: 'BigBasket',
    category: 'Grocery',
    discount: '10% off',
    minOrder: 600,
    expiryDate: addDays(8),
    couponCode: 'BBORGANIC10',
    worthIt: 'conditional',
    description:
      'Save 10% on organic produce, health snacks, and superfoods. Worth it if you regularly buy organic — the savings add up. Not worth switching your grocery habits just for this.',
    featured: false,
  },

  // ── MakeMyTrip ───────────────────────────────────────────────────────────
  {
    id: '18',
    title: '₹1,500 Off on Hotel Bookings Above ₹5,000',
    platform: 'MakeMyTrip',
    category: 'Travel',
    discount: '₹1,500 off',
    minOrder: 5000,
    expiryDate: addDays(12),
    couponCode: 'MMTHOTEL1500',
    worthIt: 'worth-it',
    description:
      'Save ₹1,500 on hotel bookings — that\'s a 30% saving on a ₹5,000 stay. Works on most 3-star and 4-star hotels across India. Great for weekend getaways or family trips.',
    featured: true,
  },
  {
    id: '19',
    title: 'Flat ₹200 Off on Bus Tickets',
    platform: 'MakeMyTrip',
    category: 'Travel',
    discount: '₹200 off',
    minOrder: 800,
    expiryDate: addDays(18),
    couponCode: 'MMTBUS200',
    worthIt: 'conditional',
    description:
      'Get ₹200 off on intercity bus bookings. Worth it for longer routes where the ticket costs ₹800+. Not useful for short local routes where tickets are cheaper.',
    featured: false,
  },

  // ── Paytm ────────────────────────────────────────────────────────────────
  {
    id: '20',
    title: '₹100 Cashback on Electricity Bill Payment',
    platform: 'Paytm',
    category: 'Utility',
    discount: '₹100 cashback',
    minOrder: 500,
    expiryDate: addDays(5),
    couponCode: 'PAYELEC100',
    worthIt: 'worth-it',
    description:
      'Pay your electricity bill via Paytm and get ₹100 cashback. Most households pay ₹500+ monthly — this is essentially free money for something you were going to pay anyway.',
    featured: true,
  },
];

type Filters = {
  search: string;
  category: string;
  platform: string;
  worthIt: string;
};

type CouponContextType = {
  coupons: Coupon[];
  isLoading: boolean;
  isLive: boolean;
  addCoupon: (coupon: Omit<Coupon, 'id'>) => void;
  getById: (id: string) => Coupon | undefined;
  filterCoupons: (filters: Filters) => Coupon[];
  getExpiringSoon: () => Coupon[];
  categories: string[];
  platforms: string[];
};

const CouponContext = createContext<CouponContextType | null>(null);

export function CouponProvider({ children }: { children: ReactNode }) {
  const [coupons, setCoupons] = useState<Coupon[]>(MOCK_COUPONS);
  const [isLoading, setIsLoading] = useState(true);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    fetchAmazonCoupons()
      .then((liveCoupons) => {
        if (cancelled) return;
        if (liveCoupons.length > 0) {
          // Prepend live Amazon coupons, keep non-Amazon mock coupons
          const nonAmazonMocks = MOCK_COUPONS.filter((c) => c.platform !== 'Amazon');
          setCoupons([...liveCoupons, ...nonAmazonMocks]);
          setIsLive(true);
        }
      })
      .catch(() => {
        // Silently fall back to mock data — no action needed
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  const addCoupon = (coupon: Omit<Coupon, 'id'>) => {
    const newCoupon: Coupon = { ...coupon, id: Date.now().toString() };
    setCoupons((prev) => [newCoupon, ...prev]);
  };

  const getById = (id: string) => coupons.find((c) => c.id === id);

  const filterCoupons = ({ search, category, platform, worthIt }: Filters) => {
    return coupons.filter((c) => {
      const matchSearch =
        !search ||
        c.title.toLowerCase().includes(search.toLowerCase()) ||
        c.platform.toLowerCase().includes(search.toLowerCase()) ||
        c.couponCode.toLowerCase().includes(search.toLowerCase());
      const matchCategory = !category || category === 'All' || c.category === category;
      const matchPlatform = !platform || platform === 'All' || c.platform === platform;
      const matchWorthIt = !worthIt || worthIt === 'All' || c.worthIt === worthIt;
      return matchSearch && matchCategory && matchPlatform && matchWorthIt;
    });
  };

  const getExpiringSoon = () => {
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);
    return coupons
      .filter((c) => new Date(c.expiryDate) <= threeDaysFromNow)
      .sort((a, b) => new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime());
  };

  const categories = ['All', ...Array.from(new Set(coupons.map((c) => c.category)))];
  const platforms = ['All', ...Array.from(new Set(coupons.map((c) => c.platform)))];

  return (
    <CouponContext.Provider
      value={{ coupons, isLoading, isLive, addCoupon, getById, filterCoupons, getExpiringSoon, categories, platforms }}
    >
      {children}
    </CouponContext.Provider>
  );
}

export function useCoupons() {
  const ctx = useContext(CouponContext);
  if (!ctx) throw new Error('useCoupons must be used within CouponProvider');
  return ctx;
}
