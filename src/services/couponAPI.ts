import type { Coupon, WorthItStatus } from '@/context/CouponContext';

// ── Types from RapidAPI response ──────────────────────────────────────────────
interface RawCoupon {
  coupon_title?: string;
  title?: string;
  category?: string;
  discount_value?: number | string;
  discount_percent?: number | string;
  minimum_order_value?: number | string;
  min_order?: number | string;
  expiry_date?: string;
  end_date?: string;
  coupon_code?: string;
  code?: string;
  description?: string;
  id?: string | number;
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function parseDiscountPercent(raw: RawCoupon): number {
  const pct = raw.discount_percent ?? raw.discount_value;
  if (pct === undefined || pct === null) return 0;
  const n = parseFloat(String(pct).replace(/[^0-9.]/g, ''));
  return isNaN(n) ? 0 : n;
}

function formatDiscount(raw: RawCoupon): string {
  const pct = parseDiscountPercent(raw);
  if (pct > 0) return `${pct}% off`;
  const val = raw.discount_value;
  if (val) return `₹${val} off`;
  return 'Special offer';
}

function parseMinOrder(raw: RawCoupon): number {
  const mo = raw.minimum_order_value ?? raw.min_order ?? 0;
  const n = parseFloat(String(mo).replace(/[^0-9.]/g, ''));
  return isNaN(n) ? 0 : n;
}

function parseExpiry(raw: RawCoupon): string {
  const raw_date = raw.expiry_date ?? raw.end_date;
  if (!raw_date) {
    // Default: 30 days from now
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.toISOString().split('T')[0];
  }
  try {
    return new Date(raw_date).toISOString().split('T')[0];
  } catch {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.toISOString().split('T')[0];
  }
}

function assignWorthIt(pct: number): WorthItStatus {
  if (pct >= 25) return 'worth-it';
  if (pct >= 10) return 'conditional';
  return 'not-worth-it';
}

function mapCategory(raw: string | undefined): string {
  if (!raw) return 'Electronics';
  const lower = raw.toLowerCase();
  if (lower.includes('food') || lower.includes('grocery') || lower.includes('kitchen')) return 'Grocery';
  if (lower.includes('fashion') || lower.includes('cloth') || lower.includes('apparel') || lower.includes('shoe')) return 'Fashion';
  if (lower.includes('travel') || lower.includes('hotel') || lower.includes('flight')) return 'Travel';
  if (lower.includes('utility') || lower.includes('bill') || lower.includes('recharge')) return 'Utility';
  return 'Electronics';
}

function mapRawTocoupon(raw: RawCoupon, index: number): Coupon {
  const pct = parseDiscountPercent(raw);
  const title = raw.coupon_title ?? raw.title ?? `Amazon Deal #${index + 1}`;
  const code = raw.coupon_code ?? raw.code ?? 'AMAZON';
  const description = raw.description ?? `Save with this Amazon coupon. Use code ${code} at checkout.`;

  return {
    id: `api-${raw.id ?? index}-${Date.now()}`,
    title,
    platform: 'Amazon',
    category: mapCategory(raw.category),
    discount: formatDiscount(raw),
    minOrder: parseMinOrder(raw),
    expiryDate: parseExpiry(raw),
    couponCode: String(code).toUpperCase(),
    worthIt: assignWorthIt(pct),
    description,
    featured: pct >= 30,
  };
}

// ── Main fetch function ───────────────────────────────────────────────────────
export async function fetchAmazonCoupons(): Promise<Coupon[]> {
  const response = await fetch(
    'https://get-amazon-coupon.p.rapidapi.com/amazon/coupon/?start_date=2023-10-01&page=1&sort=addtime_desc',
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-rapidapi-host': 'get-amazon-coupon.p.rapidapi.com',
        'x-rapidapi-key': '0bccc41bb3mshdaf5070a283ff6dp15adf9jsnd624403e1252',
      },
    }
  );

  if (!response.ok) {
    throw new Error(`API responded with status ${response.status}`);
  }

  const data = await response.json();

  // Handle various response shapes: array, { data: [] }, { coupons: [] }, { results: [] }
  let rawList: RawCoupon[] = [];
  if (Array.isArray(data)) {
    rawList = data;
  } else if (Array.isArray(data?.data)) {
    rawList = data.data;
  } else if (Array.isArray(data?.coupons)) {
    rawList = data.coupons;
  } else if (Array.isArray(data?.results)) {
    rawList = data.results;
  } else {
    throw new Error('Unexpected API response shape');
  }

  if (rawList.length === 0) throw new Error('Empty coupon list from API');

  return rawList
    .slice(0, 20) // cap at 20 to avoid flooding
    .map((raw, i) => mapRawToCopon(raw, i))
    .filter((c) => c.couponCode && c.title);
}

// typo fix alias (internal)
function mapRawToCopon(raw: RawCoupon, index: number): Coupon {
  return mapRawTocoupon(raw, index);
}
