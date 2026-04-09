/**
 * DealDash Piggy Bank Logo
 * Filled, gradient, fintech-style side-profile piggy bank.
 * Blue gradient body, gold coin, subtle sparkle.
 */

interface PiggyLogoProps {
  size?: number;
  variant?: string;
  color?: string; // unused — kept for API compat
}

export default function PiggyLogo({ size = 40, variant = 'default' }: PiggyLogoProps) {
  const id = `dd-${variant}`;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="DealDash"
    >
      <defs>
        {/* Body — deep indigo to blue */}
        <linearGradient id={`${id}-body`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"  stopColor="#4338CA" />
          <stop offset="100%" stopColor="#6366F1" />
        </linearGradient>

        {/* Head */}
        <linearGradient id={`${id}-head`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"  stopColor="#4F46E5" />
          <stop offset="100%" stopColor="#818CF8" />
        </linearGradient>

        {/* Ear */}
        <linearGradient id={`${id}-ear`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"  stopColor="#6366F1" />
          <stop offset="100%" stopColor="#3730A3" />
        </linearGradient>

        {/* Snout */}
        <linearGradient id={`${id}-snout`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"  stopColor="#818CF8" />
          <stop offset="100%" stopColor="#4F46E5" />
        </linearGradient>

        {/* Coin — gold */}
        <linearGradient id={`${id}-coin`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"  stopColor="#FDE68A" />
          <stop offset="50%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#D97706" />
        </linearGradient>

        {/* Coin edge */}
        <linearGradient id={`${id}-coin-edge`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"  stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#92400E" />
        </linearGradient>

        {/* Body highlight */}
        <radialGradient id={`${id}-shine`} cx="30%" cy="25%" r="55%">
          <stop offset="0%"  stopColor="white" stopOpacity="0.18" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>

        {/* Leg */}
        <linearGradient id={`${id}-leg`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"  stopColor="#4338CA" />
          <stop offset="100%" stopColor="#312E81" />
        </linearGradient>

        {/* Drop shadow */}
        <filter id={`${id}-shadow`} x="-15%" y="-15%" width="130%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodColor="#1E1B4B" floodOpacity="0.35" />
        </filter>

        {/* Soft shadow for head */}
        <filter id={`${id}-hshadow`} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="1.5" stdDeviation="2" floodColor="#1E1B4B" floodOpacity="0.3" />
        </filter>
      </defs>

      {/* ── Body ── */}
      <ellipse
        cx="34" cy="50" rx="24" ry="17"
        fill={`url(#${id}-body)`}
        filter={`url(#${id}-shadow)`}
      />
      {/* Body shine */}
      <ellipse cx="34" cy="50" rx="24" ry="17" fill={`url(#${id}-shine)`} />

      {/* ── Head — right side, no overlap with body ── */}
      {/* We clip the left side of the head circle so it meets body cleanly */}
      <path
        d="M 56 38 A 13 13 0 1 1 56 62 L 54 62 C 50 62 47 58 47 54 L 47 46 C 47 42 50 38 54 38 Z"
        fill={`url(#${id}-head)`}
        filter={`url(#${id}-hshadow)`}
      />
      {/* Head shine */}
      <path
        d="M 56 38 A 13 13 0 1 1 56 62 L 54 62 C 50 62 47 58 47 54 L 47 46 C 47 42 50 38 54 38 Z"
        fill={`url(#${id}-shine)`}
      />

      {/* ── Ear — upright pill above head ── */}
      <rect x="54" y="24" width="8" height="14" rx="4"
        fill={`url(#${id}-ear)`}
      />

      {/* ── Eye — single calm dot ── */}
      <circle cx="65" cy="44" r="2.2" fill="white" opacity="0.9" />
      <circle cx="65" cy="44" r="1.1" fill="#1E1B4B" />

      {/* ── Snout — small filled oval, separated from head ── */}
      <ellipse cx="71" cy="53" rx="4.5" ry="3.5"
        fill={`url(#${id}-snout)`}
      />
      {/* Nostril */}
      <circle cx="71" cy="53" r="1.3" fill="#312E81" opacity="0.6" />

      {/* ── Coin slot on top of body ── */}
      <rect x="27" y="32.5" width="11" height="2.5" rx="1.25" fill="#312E81" opacity="0.7" />

      {/* ── Coin — gold pill dropping into slot ── */}
      {/* Coin edge (depth) */}
      <ellipse cx="32.5" cy="30" rx="5.5" ry="2.5" fill={`url(#${id}-coin-edge)`} />
      {/* Coin face */}
      <ellipse cx="32.5" cy="28" rx="5.5" ry="2.5" fill={`url(#${id}-coin)`} />
      {/* ₹ on coin */}
      <text
        x="29.8" y="29.5"
        fontSize="4"
        fill="#92400E"
        fontWeight="800"
        fontFamily="system-ui, sans-serif"
        opacity="0.9"
      >₹</text>

      {/* ── Sparkle near coin — 4 tiny lines ── */}
      <g opacity="0.75">
        <line x1="41" y1="24" x2="43" y2="22" stroke="#FDE68A" strokeWidth="1.4" strokeLinecap="round" />
        <line x1="43" y1="27" x2="46" y2="27" stroke="#FDE68A" strokeWidth="1.4" strokeLinecap="round" />
        <line x1="41" y1="30" x2="43" y2="32" stroke="#FDE68A" strokeWidth="1.4" strokeLinecap="round" />
        <line x1="39" y1="22" x2="39" y2="19" stroke="#FDE68A" strokeWidth="1.4" strokeLinecap="round" />
      </g>

      {/* ── Legs — two visible from side ── */}
      <rect x="16" y="63" width="10" height="11" rx="5"
        fill={`url(#${id}-leg)`}
      />
      <rect x="30" y="63" width="10" height="11" rx="5"
        fill={`url(#${id}-leg)`}
      />
    </svg>
  );
}
