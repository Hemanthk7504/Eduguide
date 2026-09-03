import type { Tier } from "../types/api";

const TIER_STYLES: Record<Tier, { bg: string; ring: string; text: string }> = {
  Dream: { bg: "rgba(139,92,246,0.14)", ring: "rgba(139,92,246,0.45)", text: "var(--tier-dream)" },
  Reach: { bg: "rgba(245,158,11,0.14)", ring: "rgba(245,158,11,0.45)", text: "var(--tier-reach)" },
  Match: { bg: "rgba(79,70,229,0.14)", ring: "rgba(79,70,229,0.45)", text: "var(--tier-match)" },
  Safe: { bg: "rgba(34,197,94,0.14)", ring: "rgba(34,197,94,0.45)", text: "var(--tier-safe)" },
};

export function TierBadge({ tier }: { tier: Tier }) {
  const s = TIER_STYLES[tier];
  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset"
      style={{ backgroundColor: s.bg, color: s.text, borderColor: s.ring }}
    >
      {tier}
    </span>
  );
}
