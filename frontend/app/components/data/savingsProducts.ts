export interface SavingsProduct {
  id: string;
  title: string;
  tagline: string;
  benefits: string[];
  rate: string;
  bgClass: string;
  accentHex: string;
  textClass: string;
}

export const savingsProducts: SavingsProduct[] = [
  { id: "regular", title: "Regular Savings", tagline: "Your daily savings, growing steadily", benefits: ["Earn up to 4% p.a.", "Zero minimum balance", "Instant withdrawals"], rate: "4%", bgClass: "bg-white", accentHex: "#22348A", textClass: "text-[#22348A]" },
  { id: "fixed", title: "Fixed Savings", tagline: "Lock in guaranteed returns", benefits: ["Industry-leading 7.5% p.a.", "Flexible tenures 6M–5Y", "Premature withdrawal option"], rate: "7.5%", bgClass: "bg-[#22348A]", accentHex: "#FFFFFF", textClass: "text-white" },
  { id: "children", title: "Children's Savings", tagline: "Secure their tomorrow, today", benefits: ["Bonus 0.5% interest rate", "Educational expense benefits", "Financial literacy modules"], rate: "4.5%", bgClass: "bg-[#f0f2fa]", accentHex: "#22348A", textClass: "text-[#22348A]" },
  { id: "women", title: "Women's Savings", tagline: "Designed for her financial independence", benefits: ["Exclusive loan discounts", "Free healthcare consultations", "Zero processing fees"], rate: "5%", bgClass: "bg-white", accentHex: "#22348A", textClass: "text-[#22348A]" },
  { id: "retirement", title: "Retirement Savings", tagline: "Retire with dignity and comfort", benefits: ["Highest interest tier at 8.2%", "Monthly payout options", "Tax-free maturity amounts"], rate: "8.2%", bgClass: "bg-[#22348A]", accentHex: "#FFFFFF", textClass: "text-white" },
];