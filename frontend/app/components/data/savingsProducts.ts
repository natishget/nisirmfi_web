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
  { id: "regular", title: "Regular Savings", tagline: "Your daily savings, growing steadily", benefits: ["Interest rate of 10%", "500 Minimum Balance", "Instant withdrawals"], rate: "10%", bgClass: "bg-white", accentHex: "#22348A", textClass: "text-[#22348A]" },
  { id: "fixed", title: "Fixed Time Deposit", tagline: "Lock in guaranteed returns", benefits: ["Rate Starting From 12%", "Flexible tenures 6 Months-1 Year", "Premature withdrawal option"], rate: "12 - 20%", bgClass: "bg-[#22348A]", accentHex: "#FFFFFF", textClass: "text-white" },
  { id: "children", title: "Child Savings 'Maleda'", tagline: "Secure their tomorrow, today", benefits: ["11% interest rate"], rate: "11%", bgClass: "bg-[#f0f2fa]", accentHex: "#22348A", textClass: "text-[#22348A]" },
  { id: "women", title: "Women's Savings 'Alem'", tagline: "Designed for her financial independence", benefits: ["11% interest rate"], rate: "11%", bgClass: "bg-white", accentHex: "#22348A", textClass: "text-[#22348A]" },
  { id: "retirement", title: "Elderly Savings 'Efoy'", tagline: "Retire with dignity and comfort", benefits: ["11% interest rate"], rate: "11%", bgClass: "bg-[#22348A]", accentHex: "#FFFFFF", textClass: "text-white" },
  { id: "disablity", title: "Disablity Savings 'Yichalal'", tagline: "Retire with dignity and comfort", benefits: ["11% interest rate"], rate: "11%", bgClass: "bg-[#f0f2fa]", accentHex: "#22348A", textClass: "text-[#22348A]" },
];